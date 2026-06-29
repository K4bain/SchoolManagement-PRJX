"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

  useEffect(() => {
    fetch("/api/student/timetable")
      .then((res) => res.json())
      .then(setTimetable)
      .catch(console.error);
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
        <h1 className="text-2xl font-bold tracking-tight">Timetable</h1>
        <p className="text-muted-foreground">Your weekly class schedule.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {DAYS.map((day) => (
          <Card key={day}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Calendar className="h-5 w-5 text-primary" />
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
                      className="flex items-center justify-between rounded-lg border p-3"
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
  );
}
