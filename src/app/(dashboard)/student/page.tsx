"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { StatCard } from "@/components/ui/stat-card";
import { Button } from "@/components/ui/button";
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Student Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {user?.name}. Here&apos;s your overview.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {loading ? (
          <>
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-[100px] rounded-lg" />
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

      <div>
        <h2 className="text-lg font-semibold mb-3">Quick Links</h2>
        <div className="flex flex-wrap gap-3">
          <Button render={<Link href="/student/grades" />} variant="outline">
            <BarChart3 className="mr-2 h-4 w-4" />
            View Grades
          </Button>
          <Button render={<Link href="/student/attendance" />} variant="outline">
            <ClipboardCheck className="mr-2 h-4 w-4" />
            View Attendance
          </Button>
          <Button render={<Link href="/student/timetable" />} variant="outline">
            <Calendar className="mr-2 h-4 w-4" />
            View Timetable
          </Button>
        </div>
      </div>
    </div>
  );
}
