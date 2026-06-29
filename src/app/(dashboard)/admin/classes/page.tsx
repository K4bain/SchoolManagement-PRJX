"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Plus, BookOpen, Users } from "lucide-react";
import { toast } from "sonner";

interface ClassItem {
  id: string;
  name: string;
  year: number;
  students: { id: string }[];
  subjects: { id: string; name: string }[];
}

export default function ClassesPage() {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [open, setOpen] = useState(false);
  const [className, setClassName] = useState("");
  const [year, setYear] = useState(new Date().getFullYear().toString());

  const fetchClasses = () => {
    fetch("/api/admin/classes")
      .then((res) => res.json())
      .then(setClasses)
      .catch(console.error);
  };

  useEffect(() => { fetchClasses(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/admin/classes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: className, year: parseInt(year) }),
    });
    if (res.ok) {
      toast.success("Class created");
      fetchClasses();
      setOpen(false);
      setClassName("");
    } else {
      toast.error("Failed to create class");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Classes</h1>
          <p className="text-muted-foreground">Manage school classes and subjects.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger render={<Button />}>
            <Plus className="mr-2 h-4 w-4" />Add Class
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Class</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-2">
                <Label>Class Name</Label>
                <Input value={className} onChange={(e) => setClassName(e.target.value)} placeholder="e.g. Grade 10A" required />
              </div>
              <div className="space-y-2">
                <Label>Year</Label>
                <Input type="number" value={year} onChange={(e) => setYear(e.target.value)} required />
              </div>
              <Button type="submit" className="w-full">Create</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {classes.map((cls) => (
          <Card key={cls.id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                {cls.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground">Year: {cls.year}</p>
              <div className="flex gap-2">
                <Badge variant="secondary">
                  <Users className="mr-1 h-3 w-3" />
                  {cls.students.length} students
                </Badge>
                <Badge variant="secondary">
                  {cls.subjects.length} subjects
                </Badge>
              </div>
              {cls.subjects.length > 0 && (
                <div className="flex flex-wrap gap-1 pt-2">
                  {cls.subjects.map((s) => (
                    <Badge key={s.id} variant="outline" className="text-xs">{s.name}</Badge>
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
