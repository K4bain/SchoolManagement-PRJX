"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { toast } from "sonner";
import { BarChart3, Save } from "lucide-react";

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
  const [selectedSubject, setSelectedSubject] = useState("");
  const [students, setStudents] = useState<Student[]>([]);
  const [grades, setGrades] = useState<Record<string, GradeEntry>>({});
  const [label, setLabel] = useState("Assignment");

  useEffect(() => {
    fetch("/api/teacher/subjects")
      .then((res) => res.json())
      .then(setSubjects)
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!selectedSubject) return;
    fetch(`/api/teacher/grades?subjectId=${selectedSubject}`)
      .then((res) => res.json())
      .then((data) => setStudents(data.students || []))
      .catch(console.error);
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
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Enter Grades</h1>
        <p className="text-muted-foreground">Select a subject and enter grades for your students.</p>
      </div>

      <div className="flex items-end gap-4">
        <div className="space-y-2">
          <Label>Subject</Label>
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
        <div className="space-y-2">
          <Label>Grade Label</Label>
          <Input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="e.g. Quiz 1, Midterm"
            className="w-[200px]"
          />
        </div>
      </div>

      {selectedSubject && students.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Enter Grades
            </CardTitle>
            <Button onClick={handleSubmit}>
              <Save className="mr-2 h-4 w-4" />
              Save Grades
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead className="w-[200px]">Score (0-100)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">{student.user.name}</TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        placeholder="—"
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
    </div>
  );
}
