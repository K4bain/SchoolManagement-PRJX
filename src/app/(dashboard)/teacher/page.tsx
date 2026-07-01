"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { StatCard } from "@/components/ui/stat-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, ClipboardCheck, Users, BarChart3, Calendar, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { PageTitle } from "@/components/PageTitle";

interface TimetableEntry {
  id: string;
  startTime: string;
  endTime: string;
  subject: { name: string };
  class: { name: string };
}

interface RecentGrade {
  id: string;
  score: number;
  label: string | null;
  student: { user: { name: string } };
  subject: { name: string };
}

interface TeacherStats {
  totalSubjects: number;
  totalStudents: number;
  attendanceToday: number;
  todaySchedule: TimetableEntry[];
  recentGrades: RecentGrade[];
}

export default function TeacherDashboard() {
  const { data: session } = useSession();
  const user = session?.user as any;
  const [stats, setStats] = useState<TeacherStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/teacher/stats")
      .then((r) => r.ok ? r.json() : null)
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8">
      <PageTitle title="Teacher Dashboard" />
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Teacher Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Welcome back, {user?.name}. Here&apos;s your overview.
        </p>
      </div>

      <div className="grid gap-4 grid-cols-3">
        {loading ? (
          <>
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-[108px] rounded-lg" />
            ))}
          </>
        ) : (
          <>
            <StatCard title="My Subjects" value={stats?.totalSubjects ?? 0} icon={<BookOpen className="h-4 w-4" />} />
            <StatCard title="Total Students" value={stats?.totalStudents ?? 0} icon={<Users className="h-4 w-4" />} />
            <StatCard title="Attendance Today" value={stats?.attendanceToday ?? 0} icon={<ClipboardCheck className="h-4 w-4" />} />
          </>
        )}
      </div>

      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <Button render={<Link href="/teacher/attendance" />} variant="outline" className="justify-start h-9 transition-colors duration-150">
            <ClipboardCheck className="mr-2 h-4 w-4 text-muted-foreground" />
            Mark Attendance
          </Button>
          <Button render={<Link href="/teacher/grades" />} variant="outline" className="justify-start h-9 transition-colors duration-150">
            <BarChart3 className="mr-2 h-4 w-4 text-muted-foreground" />
            Enter Grades
          </Button>
          <Button render={<Link href="/teacher/announcements" />} variant="outline" className="justify-start h-9 transition-colors duration-150">
            <BookOpen className="mr-2 h-4 w-4 text-muted-foreground" />
            View Announcements
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              Today&apos;s Schedule
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => <Skeleton key={i} className="h-10 w-full" />)}
              </div>
            ) : !stats?.todaySchedule?.length ? (
              <p className="text-sm text-muted-foreground">No classes scheduled for today</p>
            ) : (
              <div className="space-y-2">
                {stats.todaySchedule.map((entry) => (
                  <div key={entry.id} className="flex items-center justify-between rounded-md border px-3 py-2">
                    <div className="flex items-center gap-2">
                      <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-sm font-medium">
                        {entry.startTime.slice(0, 5)} – {entry.endTime.slice(0, 5)}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {entry.subject.name} · {entry.class.name}
                    </div>
                  </div>
                ))}
              </div>
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
            {loading ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => <Skeleton key={i} className="h-10 w-full" />)}
              </div>
            ) : !stats?.recentGrades?.length ? (
              <p className="text-sm text-muted-foreground">No grades entered recently</p>
            ) : (
              <div className="space-y-2">
                {stats.recentGrades.map((grade) => (
                  <div key={grade.id} className="flex items-center justify-between rounded-md border px-3 py-2">
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{grade.student.user.name}</p>
                      <p className="text-xs text-muted-foreground">{grade.subject.name}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-sm font-semibold">{grade.score}</span>
                      <Badge variant={grade.score >= 50 ? "default" : "destructive"}>
                        {grade.label ?? (grade.score >= 50 ? "Pass" : "Fail")}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
