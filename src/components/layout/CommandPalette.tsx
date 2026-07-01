"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  ClipboardCheck,
  BarChart3,
  Calendar,
  Bell,
  Plus,
  Home,
  LogOut,
} from "lucide-react";

interface CommandItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  group: string;
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();
  const role = (session?.user as any)?.role;

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const adminItems: CommandItem[] = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard, group: "Navigation" },
    { label: "Students", href: "/admin/students", icon: Users, group: "Navigation" },
    { label: "Teachers", href: "/admin/teachers", icon: GraduationCap, group: "Navigation" },
    { label: "Classes", href: "/admin/classes", icon: BookOpen, group: "Navigation" },
    { label: "Announcements", href: "/admin/announcements", icon: Bell, group: "Navigation" },
  ];

  const teacherItems: CommandItem[] = [
    { label: "Dashboard", href: "/teacher", icon: LayoutDashboard, group: "Navigation" },
    { label: "Attendance", href: "/teacher/attendance", icon: ClipboardCheck, group: "Navigation" },
    { label: "Grades", href: "/teacher/grades", icon: BarChart3, group: "Navigation" },
    { label: "Announcements", href: "/teacher/announcements", icon: Bell, group: "Navigation" },
  ];

  const studentItems: CommandItem[] = [
    { label: "Dashboard", href: "/student", icon: LayoutDashboard, group: "Navigation" },
    { label: "Grades", href: "/student/grades", icon: BarChart3, group: "Navigation" },
    { label: "Attendance", href: "/student/attendance", icon: ClipboardCheck, group: "Navigation" },
    { label: "Timetable", href: "/student/timetable", icon: Calendar, group: "Navigation" },
    { label: "Announcements", href: "/student/announcements", icon: Bell, group: "Navigation" },
  ];

  const quickActions: { label: string; href: string; icon: React.ComponentType<{ className?: string }> }[] =
    role === "ADMIN"
      ? [
          { label: "Add Student", href: "/admin/students", icon: Plus },
          { label: "Add Teacher", href: "/admin/teachers", icon: Plus },
          { label: "Post Announcement", href: "/admin/announcements", icon: Plus },
        ]
      : role === "TEACHER"
        ? [
            { label: "Mark Attendance", href: "/teacher/attendance", icon: Plus },
            { label: "Enter Grades", href: "/teacher/grades", icon: Plus },
          ]
        : [];

  const navItems =
    role === "ADMIN"
      ? adminItems
      : role === "TEACHER"
        ? teacherItems
        : studentItems;

  const allNavItems = [
    { label: "Home", href: "/", icon: Home, group: "Navigation" },
    ...navItems,
  ];

  const runCommand = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Navigation">
          {allNavItems.map((item) => (
            <CommandItem
              key={item.href}
              value={item.label}
              onSelect={() => runCommand(item.href)}
            >
              <item.icon className="mr-2 size-4" />
              <span>{item.label}</span>
            </CommandItem>
          ))}
        </CommandGroup>
        {quickActions.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Quick Actions">
              {quickActions.map((item) => (
                <CommandItem
                  key={item.label}
                  value={item.label}
                  onSelect={() => runCommand(item.href)}
                >
                  <item.icon className="mr-2 size-4" />
                  <span>{item.label}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}
        <CommandSeparator />
        <CommandGroup heading="Account">
          <CommandItem
            value="Sign Out"
            onSelect={() => { setOpen(false); signOut({ callbackUrl: "/" }); }}
          >
            <LogOut className="mr-2 size-4" />
            <span>Sign Out</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
