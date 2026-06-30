"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { StatCard } from "@/components/ui/stat-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, ClipboardCheck, Calendar, Bell } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

interface StudentStats {
  averageGrade: number | null;
  attendanceRate: number | null;
  totalSubjects: number;
  totalAnnouncements: number;
}

export default function StudentDashboard() {
  const { data: session } = useSession();
  const user = session?.user as any;
  const [stats, setStats] = useState<StudentStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/student/grades").then((r) => r.ok ? r.json() : []),
      fetch("/api/student/attendance").then((r) => r.ok ? r.json() : []),
      fetch("/api/student/announcements").then((r) => r.ok ? r.json() : []),
    ])
      .then(([grades, attendance, announcements]) => {
        const avg = grades.length > 0
          ? grades.reduce((s: number, g: any) => s + g.score, 0) / grades.length
          : null;
        const present = attendance.filter((a: any) => a.status === "PRESENT").length;
        const rate = attendance.length > 0 ? (present / attendance.length) * 100 : null;
        const subjects = new Set(grades.map((g: any) => g.subject.name));
        setStats({
          averageGrade: avg !== null ? Number(avg.toFixed(1)) : null,
          attendanceRate: rate !== null ? Number(rate.toFixed(1)) : null,
          totalSubjects: subjects.size,
          totalAnnouncements: announcements.length,
        });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8">
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
    </div>
  );
}
