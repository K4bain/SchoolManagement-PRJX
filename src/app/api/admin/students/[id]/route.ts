import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const student = await prisma.student.findUnique({
      where: { id },
      include: { user: true, class: true },
    });
    if (!student) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(student);
  } catch {
    return NextResponse.json({ error: "Failed to fetch student" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { name, email, classId } = body;

    const student = await prisma.student.findUnique({ where: { id }, include: { user: true } });
    if (!student) return NextResponse.json({ error: "Not found" }, { status: 404 });

    if (email && email !== student.user.email) {
      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) {
        return NextResponse.json({ error: "Email already exists" }, { status: 400 });
      }
    }

    if (classId) {
      const cls = await prisma.class.findUnique({ where: { id: classId } });
      if (!cls) {
        return NextResponse.json({ error: "Class not found" }, { status: 400 });
      }
    }

    await prisma.user.update({
      where: { id: student.userId },
      data: { name, email },
    });

    await prisma.student.update({
      where: { id },
      data: { classId: classId || null },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to update student" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const student = await prisma.student.findUnique({ where: { id } });
    if (!student) return NextResponse.json({ error: "Not found" }, { status: 404 });

    await prisma.user.delete({ where: { id: student.userId } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete student" }, { status: 500 });
  }
}
