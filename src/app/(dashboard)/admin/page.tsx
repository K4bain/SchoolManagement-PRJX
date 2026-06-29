"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, GraduationCap, BookOpen, Bell } from "lucide-react";

interface Stats {
  totalStudents: number;
  totalTeachers: number;
  totalClasses: number;
  totalAnnouncements: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((res) => res.json())
      .then(setStats)
      .catch(console.error);
  }, []);

  const cards = [
    { title: "Total Students", value: stats?.totalStudents ?? "—", icon: Users, color: "text-blue-600 dark:text-blue-400" },
    { title: "Total Teachers", value: stats?.totalTeachers ?? "—", icon: GraduationCap, color: "text-emerald-600 dark:text-emerald-400" },
    { title: "Total Classes", value: stats?.totalClasses ?? "—", icon: BookOpen, color: "text-purple-600 dark:text-purple-400" },
    { title: "Announcements", value: stats?.totalAnnouncements ?? "—", icon: Bell, color: "text-orange-600 dark:text-orange-400" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">Welcome back. Here&apos;s an overview of your school.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{card.title}</CardTitle>
              <card.icon className={`h-5 w-5 ${card.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{card.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
