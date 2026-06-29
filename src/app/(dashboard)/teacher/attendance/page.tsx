"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
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
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ClipboardCheck } from "lucide-react";

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
  const [selectedSubject, setSelectedSubject] = useState("");
  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<Record<string, AttendanceRecord>>({});

  useEffect(() => {
    fetch("/api/teacher/subjects")
      .then((res) => res.json())
      .then(setSubjects)
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!selectedSubject) return;
    fetch(`/api/teacher/attendance?subjectId=${selectedSubject}`)
      .then((res) => res.json())
      .then((data) => {
        setStudents(data.students || []);
        const existing: Record<string, AttendanceRecord> = {};
        (data.existing || []).forEach((a: any) => {
          existing[a.studentId] = { studentId: a.studentId, status: a.status };
        });
        setAttendance(existing);
      })
      .catch(console.error);
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
    const res = await fetch("/api/teacher/attendance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subjectId: selectedSubject, records }),
    });
    if (res.ok) toast.success("Attendance saved");
    else toast.error("Failed to save attendance");
  };

  const statusColors: Record<string, string> = {
    PRESENT: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    ABSENT: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    LATE: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Mark Attendance</h1>
        <p className="text-muted-foreground">Select a class and mark student attendance for today.</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="space-y-2">
          <Label>Select Subject</Label>
          <Select value={selectedSubject} onValueChange={(v) => setSelectedSubject(v ?? "")}>
            <SelectTrigger className="w-[250px]">
              <SelectValue placeholder="Choose a subject" />
            </SelectTrigger>
            <SelectContent>
              {subjects.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.name} — {s.class.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {selectedSubject && students.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <ClipboardCheck className="h-5 w-5" />
              Students — {new Date().toLocaleDateString()}
            </CardTitle>
            <Button onClick={handleSubmit}>Save Attendance</Button>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student) => {
                  const current = attendance[student.id]?.status;
                  return (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">{student.user.name}</TableCell>
                      <TableCell>{student.user.email}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {(["PRESENT", "ABSENT", "LATE"] as const).map((status) => (
                            <Button
                              key={status}
                              variant={current === status ? "default" : "outline"}
                              size="sm"
                              onClick={() => setStatus(student.id, status)}
                              className={current === status ? statusColors[status] : ""}
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

      {selectedSubject && students.length === 0 && (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No students enrolled in this subject.
          </CardContent>
        </Card>
      )}
    </div>
  );
}
