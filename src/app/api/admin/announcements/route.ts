import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const announcements = await prisma.announcement.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(announcements);
}

export async function POST(req: NextRequest) {
  const { title, body } = await req.json();
  if (!title || !body) return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  const announcement = await prisma.announcement.create({ data: { title, body } });
  return NextResponse.json(announcement, { status: 201 });
}
