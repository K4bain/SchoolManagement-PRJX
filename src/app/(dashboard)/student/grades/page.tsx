"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { BarChart3 } from "lucide-react";

interface Grade {
  id: string;
  score: number;
  label: string | null;
  subject: { name: string };
  createdAt: string;
}

export default function StudentGradesPage() {
  const [grades, setGrades] = useState<Grade[]>([]);

  useEffect(() => {
    fetch("/api/student/grades")
      .then((res) => res.json())
      .then(setGrades)
      .catch(console.error);
  }, []);

  const grouped = grades.reduce<Record<string, Grade[]>>((acc, grade) => {
    const subject = grade.subject.name;
    if (!acc[subject]) acc[subject] = [];
    acc[subject].push(grade);
    return acc;
  }, {});

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600 dark:text-green-400";
    if (score >= 70) return "text-blue-600 dark:text-blue-400";
    if (score >= 50) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My Grades</h1>
        <p className="text-muted-foreground">View your grades across all subjects.</p>
      </div>

      {Object.keys(grouped).length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">No grades yet.</CardContent>
        </Card>
      ) : (
        Object.entries(grouped).map(([subject, subjectGrades]) => {
          const avg = subjectGrades.reduce((sum, g) => sum + g.score, 0) / subjectGrades.length;
          return (
            <Card key={subject}>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  {subject}
                </CardTitle>
                <Badge variant="secondary" className={getScoreColor(avg)}>
                  Avg: {avg.toFixed(1)}
                </Badge>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Assessment</TableHead>
                      <TableHead className="text-right">Score</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {subjectGrades.map((g) => (
                      <TableRow key={g.id}>
                        <TableCell>{g.label || "Unnamed"}</TableCell>
                        <TableCell className={`text-right font-medium ${getScoreColor(g.score)}`}>
                          {g.score}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          );
        })
      )}
    </div>
  );
}
