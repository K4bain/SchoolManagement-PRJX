"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, ClipboardCheck, Calendar, Bell } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

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
      fetch("/api/student/grades").then((r) => r.json()),
      fetch("/api/student/attendance").then((r) => r.json()),
      fetch("/api/student/announcements").then((r) => r.json()),
    ])
      .then(([grades, attendance, announcements]) => {
        const avg = grades.length > 0
          ? grades.reduce((s: number, g: any) => s + g.score, 0) / grades.length
          : null;
        const present = attendance.filter((a: any) => a.status === "PRESENT").length;
        const rate = attendance.length > 0 ? (present / attendance.length) * 100 : null;
        const subjects = new Set(grades.map((g: any) => g.subject.name));
        setStats({
          averageGrade: avg ? Number(avg.toFixed(1)) : null,
          attendanceRate: rate ? Number(rate.toFixed(1)) : null,
          totalSubjects: subjects.size,
          totalAnnouncements: announcements.length,
        });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const gradeColor = (score: number | null) => {
    if (!score) return "text-muted-foreground";
    if (score >= 90) return "text-green-600 dark:text-green-400";
    if (score >= 70) return "text-blue-600 dark:text-blue-400";
    if (score >= 50) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Student Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {user?.name}. Here&apos;s your overview.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {loading ? (
          [1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader className="pb-2"><div className="h-4 w-24 animate-pulse rounded bg-muted" /></CardHeader>
              <CardContent><div className="h-8 w-16 animate-pulse rounded bg-muted" /></CardContent>
            </Card>
          ))
        ) : (
          <>
            <Card className="transition-shadow hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Average Grade</CardTitle>
                <BarChart3 className="h-5 w-5 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className={`text-3xl font-bold ${gradeColor(stats?.averageGrade ?? null)}`}>
                  {stats?.averageGrade ?? "—"}
                </div>
                <p className="text-xs text-muted-foreground">across all subjects</p>
              </CardContent>
            </Card>
            <Card className="transition-shadow hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Attendance</CardTitle>
                <ClipboardCheck className="h-5 w-5 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  {stats?.attendanceRate ?? "—"}%
                </div>
                <p className="text-xs text-muted-foreground">attendance rate</p>
              </CardContent>
            </Card>
            <Card className="transition-shadow hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Subjects</CardTitle>
                <Calendar className="h-5 w-5 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats?.totalSubjects ?? "—"}</div>
                <p className="text-xs text-muted-foreground">enrolled</p>
              </CardContent>
            </Card>
            <Card className="transition-shadow hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Updates</CardTitle>
                <Bell className="h-5 w-5 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats?.totalAnnouncements ?? "—"}</div>
                <p className="text-xs text-muted-foreground">announcements</p>
              </CardContent>
            </Card>
          </>
        )}
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Quick Links</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          <a href="/student/grades" className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
            View Grades
          </a>
          <a href="/student/attendance" className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent transition-colors">
            View Attendance
          </a>
          <a href="/student/timetable" className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent transition-colors">
            View Timetable
          </a>
        </CardContent>
      </Card>
    </div>
  );
}
