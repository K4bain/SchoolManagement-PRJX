"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { BarChart3, Save, Loader2, Users } from "lucide-react";
import { PageTitle } from "@/components/PageTitle";

interface Subject {
  id: string;
  name: string;
  class: { id: string; name: string };
}

interface Student {
  id: string;
  user: { name: string };
}

interface GradeEntry {
  studentId: string;
  score: string;
  label: string;
}

export default function GradesPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loadingSubjects, setLoadingSubjects] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [students, setStudents] = useState<Student[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [grades, setGrades] = useState<Record<string, GradeEntry>>({});
  const [label, setLabel] = useState("Assignment");
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
    fetch(`/api/teacher/grades?subjectId=${selectedSubject}`)
      .then((res) => res.ok ? res.json() : { students: [] })
      .then((data) => setStudents(data.students || []))
      .catch(console.error)
      .finally(() => setLoadingStudents(false));
  }, [selectedSubject]);

  const setScore = (studentId: string, score: string) => {
    setGrades((prev) => ({ ...prev, [studentId]: { studentId, score, label } }));
  };

  const handleSubmit = async () => {
    const records = Object.values(grades).filter((g) => g.score);
    if (records.length === 0) {
      toast.error("No grades to submit");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/teacher/grades", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subjectId: selectedSubject,
          records: records.map((g) => ({ ...g, score: parseFloat(g.score) })),
        }),
      });
      if (res.ok) { toast.success("Grades saved"); setGrades({}); }
      else toast.error("Failed to save grades");
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageTitle title="Grades" />
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Enter Grades</h1>
        <p className="text-sm text-muted-foreground mt-1">Select a subject and enter grades for your students.</p>
      </div>

      <div className="flex items-end gap-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium">Subject</Label>
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
        <div className="space-y-2">
          <Label className="text-sm font-medium">Grade Label</Label>
          <Input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="e.g. Quiz 1, Midterm"
            className="w-[200px] h-9"
          />
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
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
              Enter Grades
            </CardTitle>
            <Button onClick={handleSubmit} disabled={submitting} className="h-9 transition-colors duration-150">
              {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Save className="mr-2 h-4 w-4" />
              Save Grades
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Student</TableHead>
                  <TableHead className="w-[200px]">Score (0-100)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student) => (
                  <TableRow key={student.id} className="transition-colors duration-150 hover:bg-muted/40">
                    <TableCell className="font-medium">{student.user.name}</TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        placeholder="—"
                        className="h-8 w-[180px]"
                        value={grades[student.id]?.score || ""}
                        onChange={(e) => setScore(student.id, e.target.value)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
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
