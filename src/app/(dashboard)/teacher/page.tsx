"use client";

import { useSession } from "next-auth/react";
import { StatCard } from "@/components/ui/stat-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, ClipboardCheck, Users, BarChart3 } from "lucide-react";
import Link from "next/link";

export default function TeacherDashboard() {
  const { data: session } = useSession();
  const user = session?.user as any;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Teacher Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Welcome back, {user?.name}. Here&apos;s your overview.
        </p>
      </div>

      <div className="grid gap-4 grid-cols-3">
        <StatCard title="My Subjects" value="—" icon={<BookOpen className="h-4 w-4" />} />
        <StatCard title="Attendance Today" value="—" icon={<ClipboardCheck className="h-4 w-4" />} />
        <StatCard title="Total Students" value="—" icon={<Users className="h-4 w-4" />} />
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
