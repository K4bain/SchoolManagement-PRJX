import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await prisma.announcement.delete({ where: { id } });
  return NextResponse.json({ success: true });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { title, body, content } = await req.json();
  const announcementBody = body || content;
  const data: { title?: string; body?: string } = {};
  if (title) data.title = title;
  if (announcementBody) data.body = announcementBody;
  await prisma.announcement.update({ where: { id }, data });
  return NextResponse.json({ success: true });
}
