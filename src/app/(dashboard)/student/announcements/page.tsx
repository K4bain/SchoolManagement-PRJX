"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Bell } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface Announcement {
  id: string;
  title: string;
  body: string;
  createdAt: string;
}

export default function StudentAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/student/announcements")
      .then((r) => r.ok ? r.json() : [])
      .then(setAnnouncements)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Announcements</h1>
        <p className="text-sm text-muted-foreground mt-1">Latest school announcements.</p>
      </div>
      <div className="space-y-3">
        {loading ? (
          <>
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-[100px] rounded-lg" />
            ))}
          </>
        ) : announcements.length === 0 ? (
          <Card className="shadow-sm">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-lg bg-muted/80 p-3 mb-3">
                <Bell className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-base font-medium">No announcements</p>
              <p className="text-sm text-muted-foreground mt-1">Check back later for updates.</p>
            </CardContent>
          </Card>
        ) : (
          announcements.map((a) => (
            <Card key={a.id} className="shadow-sm transition-colors duration-150 hover:bg-accent/50">
              <CardHeader className="flex flex-row items-start gap-3 pb-2">
                <div className="rounded-lg bg-muted/80 p-2 mt-0.5">
                  <Bell className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <CardTitle className="text-base font-medium">{a.title}</CardTitle>
                  <p className="text-xs text-muted-foreground mt-0.5">{formatDate(a.createdAt)}</p>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{a.body}</p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
