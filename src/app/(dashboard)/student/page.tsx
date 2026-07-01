"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { StatCard } from "@/components/ui/stat-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, ClipboardCheck, Calendar, Bell, Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { PageTitle } from "@/components/PageTitle";

interface StudentStats {
  averageGrade: number | null;
  attendanceRate: number | null;
  totalSubjects: number;
  totalAnnouncements: number;
}

const DAY_MAP: Record<string, string> = {
  0: "SUNDAY",
  1: "MONDAY",
  2: "TUESDAY",
  3: "WEDNESDAY",
  4: "THURSDAY",
  5: "FRIDAY",
  6: "SATURDAY",
};

export default function StudentDashboard() {
  const { data: session } = useSession();
  const user = session?.user as any;
  const [stats, setStats] = useState<StudentStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [todaySchedule, setTodaySchedule] = useState<any[]>([]);
  const [recentGrades, setRecentGrades] = useState<any[]>([]);

  useEffect(() => {
    const today = DAY_MAP[new Date().getDay()];

    Promise.all([
      fetch("/api/student/grades").then((r) => (r.ok ? r.json() : [])),
      fetch("/api/student/attendance").then((r) => (r.ok ? r.json() : [])),
      fetch("/api/student/announcements").then((r) => (r.ok ? r.json() : [])),
      fetch("/api/student/timetable").then((r) => (r.ok ? r.json() : [])),
    ])
      .then(([grades, attendance, announcements, timetable]) => {
        const avg =
          grades.length > 0
            ? grades.reduce((s: number, g: any) => s + g.score, 0) / grades.length
            : null;
        const present = attendance.filter((a: any) => a.status === "PRESENT").length;
        const rate =
          attendance.length > 0 ? (present / attendance.length) * 100 : null;
        const subjects = new Set(grades.map((g: any) => g.subject.name));
        setStats({
          averageGrade: avg !== null ? Number(avg.toFixed(1)) : null,
          attendanceRate: rate !== null ? Number(rate.toFixed(1)) : null,
          totalSubjects: subjects.size,
          totalAnnouncements: announcements.length,
        });

        const todayEntries = timetable
          .filter((t: any) => t.day === today)
          .sort((a: any, b: any) => a.startTime.localeCompare(b.startTime));
        setTodaySchedule(todayEntries);

        setRecentGrades(grades.slice(0, 5));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8">
      <PageTitle title="Student Dashboard" />
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Student Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Welcome back, {user?.name}. Here&apos;s your overview.
        </p>
      </div>

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {loading ? (
          <>
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-[108px] rounded-lg" />
            ))}
          </>
        ) : (
          <>
            <StatCard
              title="Average Grade"
              value={stats?.averageGrade ?? "—"}
              icon={<BarChart3 className="h-4 w-4" />}
            />
            <StatCard
              title="Attendance"
              value={stats?.attendanceRate != null ? `${stats.attendanceRate}%` : "—"}
              icon={<ClipboardCheck className="h-4 w-4" />}
            />
            <StatCard
              title="Subjects"
              value={stats?.totalSubjects ?? "—"}
              icon={<Calendar className="h-4 w-4" />}
            />
            <StatCard
              title="Updates"
              value={stats?.totalAnnouncements ?? "—"}
              icon={<Bell className="h-4 w-4" />}
            />
          </>
        )}
      </div>

      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">Quick Links</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <Button render={<Link href="/student/grades" />} variant="outline" className="justify-start h-9 transition-colors duration-150">
            <BarChart3 className="mr-2 h-4 w-4 text-muted-foreground" />
            View Grades
          </Button>
          <Button render={<Link href="/student/attendance" />} variant="outline" className="justify-start h-9 transition-colors duration-150">
            <ClipboardCheck className="mr-2 h-4 w-4 text-muted-foreground" />
            View Attendance
          </Button>
          <Button render={<Link href="/student/timetable" />} variant="outline" className="justify-start h-9 transition-colors duration-150">
            <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
            View Timetable
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              Today&apos;s Schedule
            </CardTitle>
          </CardHeader>
          <CardContent>
            {todaySchedule.length === 0 ? (
              <p className="text-sm text-muted-foreground">No classes today. Enjoy your day!</p>
            ) : (
              <ul className="space-y-2">
                {todaySchedule.map((entry: any) => (
                  <li key={entry.id} className="flex items-center justify-between text-sm">
                    <span className="font-medium">{entry.subject.name}</span>
                    <span className="text-muted-foreground">
                      {entry.startTime} – {entry.endTime}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
              Recent Grades
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentGrades.length === 0 ? (
              <p className="text-sm text-muted-foreground">No grades yet.</p>
            ) : (
              <ul className="space-y-2">
                {recentGrades.map((grade: any) => (
                  <li key={grade.id} className="flex items-center justify-between text-sm">
                    <span className="font-medium">{grade.subject.name}</span>
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-block rounded px-2 py-0.5 text-xs font-semibold ${
                          grade.score >= 80
                            ? "bg-green-100 text-green-700"
                            : grade.score >= 60
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                        }`}
                      >
                        {grade.score}
                      </span>
                      <span className="text-muted-foreground text-xs">
                        {new Date(grade.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
