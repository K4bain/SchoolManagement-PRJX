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
import { Plus, Pencil, Trash2, GraduationCap } from "lucide-react";
import { toast } from "sonner";

interface Teacher {
  id: string;
  userId: string;
  user: { id: string; name: string; email: string };
  subjects: { id: string; name: string }[];
  classes: { id: string; name: string }[];
}

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Teacher | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [subjects, setSubjects] = useState<{ id: string; name: string }[]>([]);
  const [classes, setClasses] = useState<{ id: string; name: string }[]>([]);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);

  const fetchData = () => {
    fetch("/api/admin/teachers")
      .then((res) => res.json())
      .then(setTeachers)
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
      ? { name, email, subjectIds: selectedSubjects, classIds: selectedClasses }
      : { name, email, password, subjectIds: selectedSubjects, classIds: selectedClasses };

    const url = editing ? `/api/admin/teachers/${editing.id}` : "/api/admin/teachers";
    const method = editing ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      toast.success(editing ? "Teacher updated" : "Teacher created");
      fetchData();
    } else {
      toast.error(editing ? "Failed to update teacher" : "Failed to create teacher");
    }
    setOpen(false);
    resetForm();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this teacher?")) return;
    const res = await fetch(`/api/admin/teachers/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Teacher deleted");
      fetchData();
    } else {
      toast.error("Failed to delete teacher");
    }
  };

  const resetForm = () => {
    setName(""); setEmail(""); setPassword(""); setSelectedSubjects([]); setSelectedClasses([]); setEditing(null);
  };

  const openEdit = (teacher: Teacher) => {
    setEditing(teacher);
    setName(teacher.user.name);
    setEmail(teacher.user.email);
    setSelectedSubjects(teacher.subjects.map((s) => s.id));
    setSelectedClasses(teacher.classes.map((c) => c.id));
    setOpen(true);
  };

  const columns: ColumnDef<Teacher, any>[] = [
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
      accessorKey: "subjects",
      header: "Subjects",
      cell: ({ row }) =>
        row.original.subjects.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {row.original.subjects.map((s: any) => (
              <Badge key={s.id} variant="outline">{s.name}</Badge>
            ))}
          </div>
        ) : (
          <span className="text-muted-foreground">—</span>
        ),
    },
    {
      accessorKey: "classes",
      header: "Classes",
      cell: ({ row }) =>
        row.original.classes.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {row.original.classes.map((c: any) => (
              <Badge key={c.id} variant="secondary">{c.name}</Badge>
            ))}
          </div>
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
          <h1 className="text-2xl font-bold tracking-tight">Teachers</h1>
          <p className="text-muted-foreground">Manage teacher accounts and assignments.</p>
        </div>
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) resetForm(); }}>
          <DialogTrigger render={<Button />}>
            <Plus className="mr-2 h-4 w-4" />
            Add Teacher
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? "Edit Teacher" : "Add Teacher"}</DialogTitle>
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
                <Label>Subjects</Label>
                <div className="flex flex-wrap gap-2">
                  {subjects.map((s) => (
                    <Badge
                      key={s.id}
                      variant={selectedSubjects.includes(s.id) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => {
                        setSelectedSubjects((prev) =>
                          prev.includes(s.id) ? prev.filter((id) => id !== s.id) : [...prev, s.id]
                        );
                      }}
                    >
                      {s.name}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Classes</Label>
                <div className="flex flex-wrap gap-2">
                  {classes.map((c) => (
                    <Badge
                      key={c.id}
                      variant={selectedClasses.includes(c.id) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => {
                        setSelectedClasses((prev) =>
                          prev.includes(c.id) ? prev.filter((id) => id !== c.id) : [...prev, c.id]
                        );
                      }}
                    >
                      {c.name}
                    </Badge>
                  ))}
                </div>
              </div>
              <Button type="submit" className="w-full">{editing ? "Update" : "Create"}</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <StatCard
        title="Total Teachers"
        value={teachers.length}
        icon={<GraduationCap className="h-4 w-4" />}
      />

      <DataTable
        columns={columns}
        data={teachers}
        searchKey="user.name"
        searchPlaceholder="Search by name..."
      />
    </div>
  );
}
