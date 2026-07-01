"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar } from "lucide-react";

interface TimetableEntry {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
  subject: { name: string };
}

const DAYS = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"];

export default function StudentTimetablePage() {
  const [timetable, setTimetable] = useState<TimetableEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/student/timetable")
      .then((r) => r.ok ? r.json() : [])
      .then(setTimetable)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const grouped = DAYS.reduce<Record<string, TimetableEntry[]>>((acc, day) => {
    acc[day] = timetable
      .filter((t) => t.day === day)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Timetable</h1>
        <p className="text-sm text-muted-foreground mt-1">Your weekly class schedule.</p>
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-[180px] rounded-lg" />
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 min-w-0">
          {DAYS.map((day) => (
            <Card key={day} className="shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base font-medium">
                  <div className="rounded-lg bg-muted/80 p-1.5">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </div>
                  {day.charAt(0) + day.slice(1).toLowerCase()}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {grouped[day].length === 0 ? (
                  <p className="text-sm text-muted-foreground">No classes</p>
                ) : (
                  <div className="space-y-2">
                    {grouped[day].map((entry) => (
                      <div
                        key={entry.id}
                        className="flex items-center justify-between rounded-lg border p-3 transition-colors duration-150 hover:bg-accent/50"
                      >
                        <div>
                          <p className="text-sm font-medium">{entry.subject.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {entry.startTime} — {entry.endTime}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
        </div>
      )}
    </div>
  );
}
