import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const announcements = await prisma.announcement.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(announcements);
  } catch {
    return NextResponse.json({ error: "Failed to fetch announcements" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { title, body, content } = await req.json();
    const announcementBody = body || content;
    if (!title || !announcementBody) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
    const announcement = await prisma.announcement.create({
      data: { title, body: announcementBody },
    });
    return NextResponse.json(announcement, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create announcement" }, { status: 500 });
  }
}
