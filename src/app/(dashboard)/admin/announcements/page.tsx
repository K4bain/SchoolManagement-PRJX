"use client";

import { useEffect, useState } from "react";
import { StatCard } from "@/components/ui/stat-card";
import { DataTable } from "@/components/ui/data-table";
import { type ColumnDef } from "@tanstack/react-table";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Pencil, Trash2, Bell, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Announcement {
  id: string;
  title: string;
  content: string;
  targetRole: string | null;
  createdAt: string;
}

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Announcement | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [targetRole, setTargetRole] = useState("ALL");

  const fetchData = () => {
    setLoading(true);
    fetch("/api/admin/announcements")
      .then((res) => res.json())
      .then(setAnnouncements)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const body = { title, content, targetRole };
    const method = editing ? "PATCH" : "POST";
    const url = editing ? `/api/admin/announcements/${editing.id}` : "/api/admin/announcements";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        toast.success(editing ? "Announcement updated" : "Announcement posted");
        fetchData();
      } else {
        const data = await res.json().catch(() => null);
        toast.error(data?.error || (editing ? "Failed to update" : "Failed to post"));
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
    if (!confirm("Are you sure you want to delete this announcement?")) return;
    const res = await fetch(`/api/admin/announcements/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Announcement deleted");
      fetchData();
    } else {
      toast.error("Failed to delete");
    }
  };

  const resetForm = () => {
    setTitle(""); setContent(""); setTargetRole("ALL"); setEditing(null);
  };

  const columns: ColumnDef<Announcement, any>[] = [
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => <span className="font-medium">{row.original.title}</span>,
    },
    {
      accessorKey: "content",
      header: "Content",
      cell: ({ row }) => (
        <span className="text-muted-foreground line-clamp-1">{row.original.content}</span>
      ),
    },
    {
      accessorKey: "targetRole",
      header: "Target",
      cell: ({ row }) => (
        <Badge variant={row.original.targetRole === "ALL" ? "default" : "secondary"}>
          {row.original.targetRole || "ALL"}
        </Badge>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Posted",
      cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" onClick={() => {
            setEditing(row.original);
            setTitle(row.original.title);
            setContent(row.original.content);
            setTargetRole(row.original.targetRole || "ALL");
            setOpen(true);
          }}>
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
          <h1 className="text-2xl font-bold tracking-tight">Announcements</h1>
          <p className="text-muted-foreground">Post and manage school announcements.</p>
        </div>
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) resetForm(); }}>
          <DialogTrigger render={<Button />}>
            <Plus className="mr-2 h-4 w-4" />
            Post Announcement
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? "Edit Announcement" : "Post Announcement"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Announcement title"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Content</Label>
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your announcement here..."
                  required
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label>Target Audience</Label>
                <Select value={targetRole} onValueChange={(v) => setTargetRole(v ?? "ALL")}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">Everyone</SelectItem>
                    <SelectItem value="STUDENT">Students</SelectItem>
                    <SelectItem value="TEACHER">Teachers</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {editing ? "Update" : "Post"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <Skeleton className="h-[100px] rounded-lg" />
      ) : (
        <StatCard title="Total Announcements" value={announcements.length} icon={<Bell className="h-4 w-4" />} />
      )}

      {loading ? (
        <div className="space-y-3">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-[400px] w-full" />
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={announcements}
          searchKey="title"
          searchPlaceholder="Search announcements..."
        />
      )}
    </div>
  );
}
