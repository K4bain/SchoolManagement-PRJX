"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { ClipboardCheck, Loader2, Users } from "lucide-react";

interface Subject {
  id: string;
  name: string;
  class: { id: string; name: string };
}

interface Student {
  id: string;
  user: { name: string; email: string };
}

interface AttendanceRecord {
  studentId: string;
  status: "PRESENT" | "ABSENT" | "LATE";
}

export default function AttendancePage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loadingSubjects, setLoadingSubjects] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [students, setStudents] = useState<Student[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [attendance, setAttendance] = useState<Record<string, AttendanceRecord>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch("/api/teacher/subjects")
      .then((res) => res.ok ? res.json() : [])
      .then(setSubjects)
      .catch(console.error)
      .finally(() => setLoadingSubjects(false));
  }, []);

  useEffect(() => {
    if (!selectedSubject) return;
    setLoadingStudents(true);
    fetch(`/api/teacher/attendance?subjectId=${selectedSubject}`)
      .then((res) => res.ok ? res.json() : { students: [], existing: [] })
      .then((data) => {
        setStudents(data.students || []);
        const existing: Record<string, AttendanceRecord> = {};
        (data.existing || []).forEach((a: any) => {
          existing[a.studentId] = { studentId: a.studentId, status: a.status };
        });
        setAttendance(existing);
      })
      .catch(console.error)
      .finally(() => setLoadingStudents(false));
  }, [selectedSubject]);

  const setStatus = (studentId: string, status: "PRESENT" | "ABSENT" | "LATE") => {
    setAttendance((prev) => ({ ...prev, [studentId]: { studentId, status } }));
  };

  const handleSubmit = async () => {
    const records = Object.values(attendance);
    if (records.length === 0) {
      toast.error("No attendance to submit");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/teacher/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subjectId: selectedSubject, records }),
      });
      if (res.ok) toast.success("Attendance saved");
      else toast.error("Failed to save attendance");
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const statusColors: Record<string, string> = {
    PRESENT: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    ABSENT: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    LATE: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Mark Attendance</h1>
        <p className="text-sm text-muted-foreground mt-1">Select a class and mark student attendance for today.</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium">Select Subject</Label>
          {loadingSubjects ? (
            <Skeleton className="h-9 w-[250px]" />
          ) : (
            <Select value={selectedSubject} onValueChange={(v) => setSelectedSubject(v ?? "")}>
              <SelectTrigger className="w-[250px] h-9">
                <SelectValue placeholder="Choose a subject" />
              </SelectTrigger>
              <SelectContent>
                {subjects.length === 0 ? (
                  <SelectItem value="__none" disabled>No subjects assigned</SelectItem>
                ) : (
                  subjects.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name} — {s.class.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      {selectedSubject && loadingStudents && (
        <div className="space-y-3">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-[300px] w-full" />
        </div>
      )}

      {selectedSubject && !loadingStudents && students.length > 0 && (
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
              Students — {new Date().toLocaleDateString()}
            </CardTitle>
            <Button onClick={handleSubmit} disabled={submitting} className="h-9 transition-colors duration-150">
              {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Attendance
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student) => {
                  const current = attendance[student.id]?.status;
                  return (
                    <TableRow key={student.id} className="transition-colors duration-150 hover:bg-muted/40">
                      <TableCell className="font-medium">{student.user.name}</TableCell>
                      <TableCell>{student.user.email}</TableCell>
                      <TableCell>
                        <div className="flex gap-1.5">
                          {(["PRESENT", "ABSENT", "LATE"] as const).map((status) => (
                            <Button
                              key={status}
                              variant={current === status ? "default" : "outline"}
                              size="sm"
                              className="h-7 transition-colors duration-150"
                              onClick={() => setStatus(student.id, status)}
                            >
                              {status}
                            </Button>
                          ))}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {selectedSubject && !loadingStudents && students.length === 0 && (
        <Card className="shadow-sm">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-lg bg-muted/80 p-3 mb-3">
              <Users className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-base font-medium">No students enrolled</p>
            <p className="text-sm text-muted-foreground mt-1">No students are enrolled in this subject yet.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
