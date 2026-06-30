"use client";

import { useSession } from "next-auth/react";
import { StatCard } from "@/components/ui/stat-card";
import { Button } from "@/components/ui/button";
import { BookOpen, ClipboardCheck, Users, BarChart3 } from "lucide-react";
import Link from "next/link";

export default function TeacherDashboard() {
  const { data: session } = useSession();
  const user = session?.user as any;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Teacher Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {user?.name}. Here&apos;s your overview.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard title="My Subjects" value="—" icon={<BookOpen className="h-4 w-4" />} />
        <StatCard title="Attendance Today" value="—" icon={<ClipboardCheck className="h-4 w-4" />} />
        <StatCard title="Total Students" value="—" icon={<Users className="h-4 w-4" />} />
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-3">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Button render={<Link href="/teacher/attendance" />} variant="outline">
            <ClipboardCheck className="mr-2 h-4 w-4" />
            Mark Attendance
          </Button>
          <Button render={<Link href="/teacher/grades" />} variant="outline">
            <BarChart3 className="mr-2 h-4 w-4" />
            Enter Grades
          </Button>
          <Button render={<Link href="/teacher/announcements" />} variant="outline">
            <BookOpen className="mr-2 h-4 w-4" />
            View Announcements
          </Button>
        </div>
      </div>
    </div>
  );
}
