"use client";

import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/Sidebar";
import { SiteHeader } from "@/components/layout/Topbar";
import { CommandPalette } from "@/components/layout/CommandPalette";
import { PageTransition } from "@/components/layout/PageTransition";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TooltipProvider>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "16rem",
            "--sidebar-width-icon": "3.25rem",
          } as React.CSSProperties
        }
      >
        <AppSidebar />
        <SidebarInset>
          <SiteHeader />
          <main className="flex-1 overflow-y-auto p-4 lg:p-6">
            <PageTransition>{children}</PageTransition>
          </main>
        </SidebarInset>
        <CommandPalette />
      </SidebarProvider>
    </TooltipProvider>
  );
}
