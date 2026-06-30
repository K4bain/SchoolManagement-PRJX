"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { BarChart3 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface Grade {
  id: string;
  score: number;
  label: string | null;
  subject: { name: string };
  createdAt: string;
}

const COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)", "var(--chart-6)"];

export default function StudentGradesPage() {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/student/grades")
      .then((r) => r.ok ? r.json() : [])
      .then(setGrades)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const grouped = grades.reduce<Record<string, Grade[]>>((acc, grade) => {
    const subject = grade.subject.name;
    if (!acc[subject]) acc[subject] = [];
    acc[subject].push(grade);
    return acc;
  }, {});

  const chartData = Object.entries(grouped).map(([subject, subjectGrades]) => ({
    subject,
    average: Number((subjectGrades.reduce((s, g) => s + g.score, 0) / subjectGrades.length).toFixed(1)),
  }));

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600 dark:text-green-400";
    if (score >= 70) return "text-blue-600 dark:text-blue-400";
    if (score >= 50) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const getBadgeColor = (score: number) => {
    if (score >= 90) return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
    if (score >= 70) return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
    if (score >= 50) return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
    return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">My Grades</h1>
        <p className="text-sm text-muted-foreground mt-1">View your grades across all subjects.</p>
      </div>

      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-[120px] rounded-lg" />
          <Skeleton className="h-[200px] rounded-lg" />
        </div>
      ) : grades.length === 0 ? (
        <Card className="shadow-sm">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-lg bg-muted/80 p-3 mb-3">
              <BarChart3 className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-base font-medium">No grades yet</p>
            <p className="text-sm text-muted-foreground mt-1">Your grades will appear here once recorded.</p>
          </CardContent>
        </Card>
      ) : (
        <>
          {chartData.length > 0 && (
            <Card className="shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">Subject Averages</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="subject" className="text-xs" />
                    <YAxis domain={[0, 100]} className="text-xs" />
                    <Tooltip />
                    <Bar dataKey="average" radius={[4, 4, 0, 0]}>
                      {chartData.map((_, index) => (
                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}
          {Object.entries(grouped).map(([subject, subjectGrades]) => {
            const avg = subjectGrades.reduce((sum, g) => sum + g.score, 0) / subjectGrades.length;
            return (
              <Card key={subject} className="shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-base font-medium flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    {subject}
                  </CardTitle>
                  <Badge className={getBadgeColor(avg)}>
                    Avg: {avg.toFixed(1)}
                  </Badge>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent">
                        <TableHead>Assessment</TableHead>
                        <TableHead className="text-right">Score</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {subjectGrades.map((g) => (
                        <TableRow key={g.id} className="transition-colors duration-150 hover:bg-muted/40">
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
          })}
        </>
      )}
    </div>
  );
}
