"use client";

import { useEffect, useState } from "react";
import { StatCard } from "@/components/ui/stat-card";
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
import { Plus, Pencil, Trash2, BookOpen, Users } from "lucide-react";
import { toast } from "sonner";

interface Class {
  id: string;
  name: string;
  _count: { students: number };
}

export default function ClassesPage() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Class | null>(null);
  const [name, setName] = useState("");

  const fetchData = () => {
    fetch("/api/admin/classes")
      .then((res) => res.json())
      .then(setClasses)
      .catch(console.error);
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editing ? "PATCH" : "POST";
    const url = editing ? `/api/admin/classes/${editing.id}` : "/api/admin/classes";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });

    if (res.ok) {
      toast.success(editing ? "Class updated" : "Class created");
      fetchData();
    } else {
      toast.error(editing ? "Failed to update class" : "Failed to create class");
    }
    setOpen(false);
    setName("");
    setEditing(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this class?")) return;
    const res = await fetch(`/api/admin/classes/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Class deleted");
      fetchData();
    } else {
      toast.error("Failed to delete class");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Classes</h1>
          <p className="text-muted-foreground">Manage classes and student enrollment.</p>
        </div>
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) { setName(""); setEditing(null); } }}>
          <DialogTrigger render={<Button />}>
            <Plus className="mr-2 h-4 w-4" />
            Add Class
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? "Edit Class" : "Add Class"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Class Name</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <Button type="submit" className="w-full">{editing ? "Update" : "Create"}</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard title="Total Classes" value={classes.length} icon={<BookOpen className="h-4 w-4" />} />
        <StatCard
          title="Total Students"
          value={classes.reduce((sum, c) => sum + c._count.students, 0)}
          icon={<Users className="h-4 w-4" />}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {classes.map((cls) => (
          <Card key={cls.id} className="transition-colors hover:bg-muted/50">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{cls.name}</CardTitle>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => { setEditing(cls); setName(cls.name); setOpen(true); }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(cls.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Badge variant="secondary">
                {cls._count.students} {cls._count.students === 1 ? "student" : "students"}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
