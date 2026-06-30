"use client";

import { useEffect, useState } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { StatCard } from "@/components/ui/stat-card";
import { DataTable } from "@/components/ui/data-table";
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
import { Plus, Pencil, Trash2, Users } from "lucide-react";
import { toast } from "sonner";

interface Student {
  id: string;
  userId: string;
  user: { id: string; name: string; email: string };
  class: { id: string; name: string } | null;
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Student | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [classId, setClassId] = useState("");
  const [classes, setClasses] = useState<{ id: string; name: string }[]>([]);

  const fetchData = () => {
    fetch("/api/admin/students")
      .then((res) => res.json())
      .then(setStudents)
      .catch(console.error);
    fetch("/api/admin/classes")
      .then((res) => res.json())
      .then((data) => setClasses(data.map((c: any) => ({ id: c.id, name: c.name }))))
      .catch(console.error);
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const body = editing
      ? { name, email, classId: classId || undefined }
      : { name, email, password, classId: classId || undefined };

    const url = editing ? `/api/admin/students/${editing.id}` : "/api/admin/students";
    const method = editing ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      toast.success(editing ? "Student updated" : "Student created");
      fetchData();
    } else {
      toast.error(editing ? "Failed to update student" : "Failed to create student");
    }
    setOpen(false);
    resetForm();
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
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" onClick={() => openEdit(row.original)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => handleDelete(row.original.id)}>
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Students</h1>
          <p className="text-muted-foreground">Manage student accounts and enrollment.</p>
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
                <Label>Name</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required={!!editing} disabled={!!editing} />
              </div>
              {!editing && (
                <div className="space-y-2">
                  <Label>Password</Label>
                  <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
              )}
              <div className="space-y-2">
                <Label>Class</Label>
                <select
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                  value={classId}
                  onChange={(e) => setClassId(e.target.value)}
                >
                  <option value="">No class</option>
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <Button type="submit" className="w-full">{editing ? "Update" : "Create"}</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <StatCard
        title="Total Students"
        value={students.length}
        icon={<Users className="h-4 w-4" />}
      />

      <DataTable
        columns={columns}
        data={students}
        searchKey="user.name"
        searchPlaceholder="Search by name..."
      />
    </div>
  );
}
