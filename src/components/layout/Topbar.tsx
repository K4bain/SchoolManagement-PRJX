"use client";

import { usePathname } from "next/navigation";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

const routeLabels: Record<string, string> = {
  admin: "Dashboard",
  students: "Students",
  teachers: "Teachers",
  classes: "Classes",
  announcements: "Announcements",
  teacher: "Dashboard",
  attendance: "Attendance",
  grades: "Grades",
  student: "Dashboard",
  timetable: "Timetable",
};

export function SiteHeader() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  return (
    <header className="flex h-12 shrink-0 items-center gap-2 border-b px-4 transition-[height] duration-200 ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-10">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            {segments.map((segment, index) => {
              const href = `/${segments.slice(0, index + 1).join("/")}`;
              const label = routeLabels[segment] || segment;
              const isLast = index === segments.length - 1;

              return (
                <BreadcrumbItem key={href}>
                  {index > 0 && <BreadcrumbSeparator />}
                  {isLast ? (
                    <BreadcrumbPage>{label}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink href={href}>{label}</BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="flex-1" />

      <Button
        variant="ghost"
        size="sm"
        className="gap-2 text-muted-foreground"
        onClick={() => {
          document.dispatchEvent(
            new KeyboardEvent("keydown", { key: "k", metaKey: true })
          );
        }}
      >
        <Search className="size-4" />
        <span className="hidden md:inline">Search...</span>
        <kbd className="pointer-events-none hidden select-none items-center gap-0.5 rounded border bg-muted px-1.5 text-[10px] font-medium text-muted-foreground md:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
    </header>
  );
}
