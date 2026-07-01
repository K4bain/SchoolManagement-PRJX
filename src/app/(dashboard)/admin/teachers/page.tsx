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
import { Plus, Pencil, Trash2, GraduationCap, Loader2, Download } from "lucide-react";
import { exportToCSV } from "@/lib/csv";
import { toast } from "sonner";
import { PageTitle } from "@/components/PageTitle";

interface TeacherClass {
  id: string;
  name: string;
}

interface Teacher {
  id: string;
  userId: string;
  user: { id: string; name: string; email: string };
  subjects: { id: string; name: string; class: TeacherClass }[];
}

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Teacher | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [allSubjects, setAllSubjects] = useState<{ id: string; name: string; class: TeacherClass }[]>([]);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);

  const fetchData = () => {
    setLoading(true);
    Promise.all([
      fetch("/api/admin/teachers").then((r) => r.ok ? r.json() : []),
      fetch("/api/admin/subjects").then((r) => r.ok ? r.json() : []),
    ])
      .then(([teachersData, subjectsData]) => {
        setTeachers(teachersData);
        setAllSubjects(subjectsData);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const body = editing
      ? { name, email, subjectIds: selectedSubjects }
      : { name, email, password, subjectIds: selectedSubjects };

    const url = editing ? `/api/admin/teachers/${editing.id}` : "/api/admin/teachers";
    const method = editing ? "PATCH" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        toast.success(editing ? "Teacher updated" : "Teacher created");
        fetchData();
      } else {
        const data = await res.json().catch(() => null);
        toast.error(data?.error || (editing ? "Failed to update teacher" : "Failed to create teacher"));
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
    setName(""); setEmail(""); setPassword(""); setSelectedSubjects([]); setEditing(null);
  };

  const openEdit = (teacher: Teacher) => {
    setEditing(teacher);
    setName(teacher.user.name);
    setEmail(teacher.user.email);
    setSelectedSubjects(teacher.subjects.map((s) => s.id));
    setOpen(true);
  };

  const getTeacherClasses = (teacher: Teacher): string[] => {
    const classMap = new Map<string, string>();
    teacher.subjects.forEach((s) => {
      if (s.class) classMap.set(s.class.id, s.class.name);
    });
    return Array.from(classMap.values());
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
      cell: ({ row }) => {
        const subjects = row.original.subjects || [];
        return subjects.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {subjects.map((s: any) => (
              <Badge key={s.id} variant="outline">{s.name}</Badge>
            ))}
          </div>
        ) : (
          <span className="text-muted-foreground">—</span>
        );
      },
    },
    {
      id: "classes",
      header: "Classes",
      cell: ({ row }) => {
        const classes = getTeacherClasses(row.original);
        return classes.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {classes.map((name, i) => (
              <Badge key={i} variant="secondary">{name}</Badge>
            ))}
          </div>
        ) : (
          <span className="text-muted-foreground">—</span>
        );
      },
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
      <PageTitle title="Teachers" />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Teachers</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage teacher accounts and assignments.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              exportToCSV(
                teachers.map((t) => ({
                  name: t.user.name,
                  email: t.user.email,
                  subjects: t.subjects.map((s) => s.name).join("; "),
                })),
                [
                  { key: "name", label: "Name" },
                  { key: "email", label: "Email" },
                  { key: "subjects", label: "Subjects" },
                ],
                "teachers.csv"
              )
            }
          >
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
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
                <Label className="text-sm font-medium">Name</Label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter teacher name"
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
                  placeholder="teacher@school.com"
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
                <Label className="text-sm font-medium">Assign Subjects</Label>
                <div className="flex flex-wrap gap-2">
                  {allSubjects.length === 0 && (
                    <span className="text-sm text-muted-foreground">No subjects available</span>
                  )}
                  {allSubjects.map((s) => (
                    <Badge
                      key={s.id}
                      variant={selectedSubjects.includes(s.id) ? "default" : "outline"}
                      className="cursor-pointer transition-colors duration-150"
                      onClick={() => {
                        setSelectedSubjects((prev) =>
                          prev.includes(s.id) ? prev.filter((id) => id !== s.id) : [...prev, s.id]
                        );
                      }}
                    >
                      {s.name} ({s.class.name})
                    </Badge>
                  ))}
                </div>
              </div>
              <Button type="submit" className="w-full h-9 transition-colors duration-150" disabled={submitting}>
                {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {editing ? "Update" : "Create"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
        </div>
      </div>

      {loading ? (
        <Skeleton className="h-[108px] rounded-lg" />
      ) : (
        <StatCard
          title="Total Teachers"
          value={teachers.length}
          icon={<GraduationCap className="h-4 w-4" />}
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
          data={teachers}
          searchKey="user.name"
          searchPlaceholder="Search by name..."
        />
      )}
    </div>
  );
}
