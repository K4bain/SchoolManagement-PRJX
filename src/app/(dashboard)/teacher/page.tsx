"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { StatCard } from "@/components/ui/stat-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, ClipboardCheck, Users, BarChart3 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

interface TeacherStats {
  totalSubjects: number;
  totalStudents: number;
  attendanceToday: number;
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
    </div>
  );
}
