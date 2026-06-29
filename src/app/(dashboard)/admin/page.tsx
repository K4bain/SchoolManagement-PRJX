"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BentoCard, BentoGrid } from "@/components/magic-bento/MagicBentoCard";
import { Users, GraduationCap, BookOpen, Bell } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface Stats {
  totalStudents: number;
  totalTeachers: number;
  totalClasses: number;
  totalAnnouncements: number;
}

const COLORS = ["#8b5cf6", "#3b82f6", "#10b981", "#f59e0b"];

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

  const total = stats
    ? stats.totalStudents + stats.totalTeachers + stats.totalClasses
    : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back. Here&apos;s an overview of your school.
        </p>
      </div>

      {/* Magic Bento Analytics Grid */}
      {loading ? (
        <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-40 animate-pulse rounded-2xl bg-muted border border-border"
            />
          ))}
        </div>
      ) : (
        <BentoGrid>
          <BentoCard
            label="Total Students"
            value={stats?.totalStudents ?? 0}
            description="Enrolled across all classes"
            icon={<Users className="h-5 w-5" />}
            iconBg="bg-blue-500/10 dark:bg-blue-400/10"
            iconColor="text-blue-600 dark:text-blue-400"
            particleColor="hsl(217, 91%, 60%)"
            progress={total > 0 ? Math.round(((stats?.totalStudents ?? 0) / total) * 100) : 0}
            progressColor="hsl(217, 91%, 60%)"
          />
          <BentoCard
            label="Total Teachers"
            value={stats?.totalTeachers ?? 0}
            description="Active teaching staff"
            icon={<GraduationCap className="h-5 w-5" />}
            iconBg="bg-emerald-500/10 dark:bg-emerald-400/10"
            iconColor="text-emerald-600 dark:text-emerald-400"
            particleColor="hsl(160, 84%, 39%)"
            progress={total > 0 ? Math.round(((stats?.totalTeachers ?? 0) / total) * 100) : 0}
            progressColor="hsl(160, 84%, 39%)"
          />
          <BentoCard
            label="Classes"
            value={stats?.totalClasses ?? 0}
            description="Active classes"
            icon={<BookOpen className="h-5 w-5" />}
            iconBg="bg-purple-500/10 dark:bg-purple-400/10"
            iconColor="text-purple-600 dark:text-purple-400"
            particleColor="hsl(262, 83%, 58%)"
          />
          <BentoCard
            label="Announcements"
            value={stats?.totalAnnouncements ?? 0}
            description="School-wide updates"
            icon={<Bell className="h-5 w-5" />}
            iconBg="bg-orange-500/10 dark:bg-orange-400/10"
            iconColor="text-orange-600 dark:text-orange-400"
            particleColor="hsl(32, 95%, 44%)"
          />
        </BentoGrid>
      )}

      {/* Charts + Actions row */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Distribution Overview</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-[250px] animate-pulse rounded bg-muted" />
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
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <a
              href="/admin/students"
              className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Manage Students
            </a>
            <a
              href="/admin/teachers"
              className="inline-flex items-center justify-center rounded-lg border border-input bg-background px-4 py-3 text-sm font-medium hover:bg-accent transition-colors"
            >
              Manage Teachers
            </a>
            <a
              href="/admin/classes"
              className="inline-flex items-center justify-center rounded-lg border border-input bg-background px-4 py-3 text-sm font-medium hover:bg-accent transition-colors"
            >
              Manage Classes
            </a>
            <a
              href="/admin/announcements"
              className="inline-flex items-center justify-center rounded-lg border border-input bg-background px-4 py-3 text-sm font-medium hover:bg-accent transition-colors"
            >
              Post Announcement
            </a>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
