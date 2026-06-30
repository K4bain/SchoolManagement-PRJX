"use client";

import { useEffect, useState } from "react";
import { StatCard } from "@/components/ui/stat-card";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ClipboardCheck, Users, CheckCircle } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface Attendance {
  id: string;
  date: string;
  status: string;
  subject: { name: string };
}

export default function StudentAttendancePage() {
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/student/attendance")
      .then((res) => res.json())
      .then(setAttendance)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const statusColors: Record<string, string> = {
    PRESENT: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    ABSENT: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    LATE: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  };

  const presentCount = attendance.filter((a) => a.status === "PRESENT").length;
  const totalCount = attendance.length;
  const percentage = totalCount > 0 ? ((presentCount / totalCount) * 100).toFixed(1) : "0";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">My Attendance</h1>
        <p className="text-sm text-muted-foreground mt-1">Track your attendance record.</p>
      </div>

      {loading ? (
        <div className="grid gap-4 grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-[108px] rounded-lg" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-3">
          <StatCard title="Total Days" value={totalCount} icon={<Users className="h-4 w-4" />} />
          <StatCard title="Present" value={presentCount} icon={<CheckCircle className="h-4 w-4" />} />
          <StatCard title="Attendance Rate" value={`${percentage}%`} icon={<ClipboardCheck className="h-4 w-4" />} />
        </div>
      )}

      <Card className="shadow-sm">
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6 space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-9 w-full" />
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Date</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attendance.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                      No attendance records yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  attendance.map((a) => (
                    <TableRow key={a.id} className="transition-colors duration-150 hover:bg-muted/40">
                      <TableCell>{formatDate(a.date)}</TableCell>
                      <TableCell>{a.subject.name}</TableCell>
                      <TableCell className="text-right">
                        <Badge className={statusColors[a.status]}>{a.status}</Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
