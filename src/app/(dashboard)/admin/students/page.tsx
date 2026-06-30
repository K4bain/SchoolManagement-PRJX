"use client";

import { useEffect, useState } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { StatCard } from "@/components/ui/stat-card";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Plus, Pencil, Trash2, Users, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Student {
  id: string;
  userId: string;
  user: { id: string; name: string; email: string };
  class: { id: string; name: string } | null;
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Student | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [classId, setClassId] = useState("");
  const [classes, setClasses] = useState<{ id: string; name: string }[]>([]);

  const fetchData = () => {
    setLoading(true);
    Promise.all([
      fetch("/api/admin/students").then((r) => r.ok ? r.json() : []),
      fetch("/api/admin/classes").then((r) => r.ok ? r.json() : []),
    ])
      .then(([studentsData, classesData]) => {
        setStudents(studentsData);
        setClasses(classesData.map((c: any) => ({ id: c.id, name: c.name })));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const body = editing
      ? { name, email, classId: classId || undefined }
      : { name, email, password, classId: classId || undefined };

    const url = editing ? `/api/admin/students/${editing.id}` : "/api/admin/students";
    const method = editing ? "PATCH" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        toast.success(editing ? "Student updated" : "Student created");
        fetchData();
      } else {
        const data = await res.json().catch(() => null);
        toast.error(data?.error || (editing ? "Failed to update student" : "Failed to create student"));
      }
      setOpen(false);
      resetForm();
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this student?")) return;
    const res = await fetch(`/api/admin/students/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Student deleted");
      fetchData();
    } else {
      toast.error("Failed to delete student");
    }
  };

  const resetForm = () => {
    setName(""); setEmail(""); setPassword(""); setClassId(""); setEditing(null);
  };

  const openEdit = (student: Student) => {
    setEditing(student);
    setName(student.user.name);
    setEmail(student.user.email);
    setClassId(student.class?.id || "");
    setOpen(true);
  };

  const columns: ColumnDef<Student, any>[] = [
    {
      accessorKey: "user.name",
      header: "Name",
      cell: ({ row }) => <span className="font-medium">{row.original.user.name}</span>,
    },
    {
      accessorKey: "user.email",
      header: "Email",
    },
    {
      accessorKey: "class.name",
      header: "Class",
      cell: ({ row }) =>
        row.original.class ? (
          <Badge variant="secondary">{row.original.class.name}</Badge>
        ) : (
          <span className="text-muted-foreground">—</span>
        ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-0.5">
          <Button variant="ghost" size="icon" className="h-8 w-8 transition-colors duration-150" onClick={() => openEdit(row.original)}>
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 transition-colors duration-150" onClick={() => handleDelete(row.original.id)}>
            <Trash2 className="h-3.5 w-3.5 text-destructive" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Students</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage student accounts and enrollment.</p>
        </div>
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) resetForm(); }}>
          <DialogTrigger render={<Button />}>
            <Plus className="mr-2 h-4 w-4" />
            Add Student
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? "Edit Student" : "Add Student"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Name</Label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter student name"
                  className="h-9"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Email</Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@school.com"
                  className="h-9"
                  required
                  disabled={!!editing}
                />
              </div>
              {!editing && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Password</Label>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    className="h-9"
                    required
                    minLength={6}
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Class</Label>
                <select
                  className="flex h-9 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-sm transition-colors duration-150 focus:border-ring focus:ring-2 focus:ring-ring/20"
                  value={classId}
                  onChange={(e) => setClassId(e.target.value)}
                >
                  <option value="">No class</option>
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <Button type="submit" className="w-full h-9 transition-colors duration-150" disabled={submitting}>
                {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {editing ? "Update" : "Create"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <Skeleton className="h-[108px] rounded-lg" />
      ) : (
        <StatCard
          title="Total Students"
          value={students.length}
          icon={<Users className="h-4 w-4" />}
        />
      )}

      {loading ? (
        <div className="space-y-3">
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-[400px] w-full" />
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={students}
          searchKey="user.name"
          searchPlaceholder="Search by name..."
        />
      )}
    </div>
  );
}
