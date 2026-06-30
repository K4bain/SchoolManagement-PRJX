"use client";

import { useEffect, useState } from "react";
import { StatCard } from "@/components/ui/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, GraduationCap, BookOpen, Bell } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

interface Stats {
  totalStudents: number;
  totalTeachers: number;
  totalClasses: number;
  totalAnnouncements: number;
}

const COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)"];

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((res) => res.json())
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const pieData = stats
    ? [
        { name: "Students", value: stats.totalStudents },
        { name: "Teachers", value: stats.totalTeachers },
        { name: "Classes", value: stats.totalClasses },
      ]
    : [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Admin Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Welcome back. Here&apos;s an overview of your school.
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
              title="Total Students"
              value={stats?.totalStudents ?? 0}
              icon={<Users className="h-4 w-4" />}
            />
            <StatCard
              title="Total Teachers"
              value={stats?.totalTeachers ?? 0}
              icon={<GraduationCap className="h-4 w-4" />}
            />
            <StatCard
              title="Classes"
              value={stats?.totalClasses ?? 0}
              icon={<BookOpen className="h-4 w-4" />}
            />
            <StatCard
              title="Announcements"
              value={stats?.totalAnnouncements ?? 0}
              icon={<Bell className="h-4 w-4" />}
            />
          </>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Distribution Overview</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-[250px] w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={pieData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="name" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                    {pieData.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <Button render={<Link href="/admin/students" />} variant="outline" className="justify-start h-9 transition-colors duration-150">
              <Users className="mr-2 h-4 w-4 text-muted-foreground" />
              Manage Students
            </Button>
            <Button render={<Link href="/admin/teachers" />} variant="outline" className="justify-start h-9 transition-colors duration-150">
              <GraduationCap className="mr-2 h-4 w-4 text-muted-foreground" />
              Manage Teachers
            </Button>
            <Button render={<Link href="/admin/classes" />} variant="outline" className="justify-start h-9 transition-colors duration-150">
              <BookOpen className="mr-2 h-4 w-4 text-muted-foreground" />
              Manage Classes
            </Button>
            <Button render={<Link href="/admin/announcements" />} variant="outline" className="justify-start h-9 transition-colors duration-150">
              <Bell className="mr-2 h-4 w-4 text-muted-foreground" />
              Post Announcement
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
