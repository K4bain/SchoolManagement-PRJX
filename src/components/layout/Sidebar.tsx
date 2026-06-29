"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  ClipboardCheck,
  BarChart3,
  Calendar,
  Bell,
  Settings,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const adminNav: NavItem[] = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Students", href: "/admin/students", icon: Users },
  { label: "Teachers", href: "/admin/teachers", icon: GraduationCap },
  { label: "Classes", href: "/admin/classes", icon: BookOpen },
  { label: "Announcements", href: "/admin/announcements", icon: Bell },
];

const teacherNav: NavItem[] = [
  { label: "Dashboard", href: "/teacher", icon: LayoutDashboard },
  { label: "Attendance", href: "/teacher/attendance", icon: ClipboardCheck },
  { label: "Grades", href: "/teacher/grades", icon: BarChart3 },
  { label: "Announcements", href: "/teacher/announcements", icon: Bell },
];

const studentNav: NavItem[] = [
  { label: "Dashboard", href: "/student", icon: LayoutDashboard },
  { label: "Grades", href: "/student/grades", icon: BarChart3 },
  { label: "Attendance", href: "/student/attendance", icon: ClipboardCheck },
  { label: "Timetable", href: "/student/timetable", icon: Calendar },
  { label: "Announcements", href: "/student/announcements", icon: Bell },
];

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const role = (session?.user as any)?.role;

  const navItems = role === "ADMIN" ? adminNav : role === "TEACHER" ? teacherNav : studentNav;

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:border-r bg-card border-border">
      <div className="flex h-14 items-center gap-2 border-b px-4 font-semibold text-lg">
        <GraduationCap className="h-5 w-5 text-primary" />
        <span>SchoolHub</span>
      </div>
      <nav className="flex-1 space-y-1 p-3">
        {navItems.map((item) => {
          const isActive =
            item.href === `/${role}`
              ? pathname === item.href
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
