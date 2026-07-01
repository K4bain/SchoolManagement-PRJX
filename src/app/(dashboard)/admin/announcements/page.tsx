"use client";

import { useEffect, useState } from "react";
import { StatCard } from "@/components/ui/stat-card";
import { DataTable } from "@/components/ui/data-table";
import { type ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
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
import { Plus, Pencil, Trash2, Bell, Loader2, Download } from "lucide-react";
import { exportToCSV } from "@/lib/csv";
import { toast } from "sonner";
import { PageTitle } from "@/components/PageTitle";

interface Announcement {
  id: string;
  title: string;
  body: string;
  createdAt: string;
}

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Announcement | null>(null);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const fetchData = () => {
    setLoading(true);
    fetch("/api/admin/announcements")
      .then((res) => res.ok ? res.json() : [])
      .then(setAnnouncements)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const url = editing ? `/api/admin/announcements/${editing.id}` : "/api/admin/announcements";
    const method = editing ? "PATCH" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, body }),
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
    setTitle(""); setBody(""); setEditing(null);
  };

  const columns: ColumnDef<Announcement, any>[] = [
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => <span className="font-medium">{row.original.title}</span>,
    },
    {
      accessorKey: "body",
      header: "Content",
      cell: ({ row }) => (
        <span className="text-muted-foreground line-clamp-1">{row.original.body}</span>
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
        <div className="flex gap-0.5">
          <Button variant="ghost" size="icon" className="h-8 w-8 transition-colors duration-150" onClick={() => {
            setEditing(row.original);
            setTitle(row.original.title);
            setBody(row.original.body);
            setOpen(true);
          }}>
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
      <PageTitle title="Announcements" />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Announcements</h1>
          <p className="text-sm text-muted-foreground mt-1">Post and manage school announcements.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              exportToCSV(
                announcements.map((a) => ({
                  title: a.title,
                  created: new Date(a.createdAt).toLocaleDateString(),
                })),
                [
                  { key: "title", label: "Title" },
                  { key: "created", label: "Created" },
                ],
                "announcements.csv"
              )
            }
          >
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
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
                <Label className="text-sm font-medium">Title</Label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Announcement title"
                  className="h-9"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Content</Label>
                <Textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Write your announcement here..."
                  required
                  rows={4}
                />
              </div>
              <Button type="submit" className="w-full h-9 transition-colors duration-150" disabled={submitting}>
                {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {editing ? "Update" : "Post"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
        </div>
      </div>

      {loading ? (
        <Skeleton className="h-[108px] rounded-lg" />
      ) : (
        <StatCard title="Total Announcements" value={announcements.length} icon={<Bell className="h-4 w-4" />} />
      )}

      {loading ? (
        <div className="space-y-3">
          <Skeleton className="h-9 w-full" />
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
