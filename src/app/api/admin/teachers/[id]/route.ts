import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const teacher = await prisma.teacher.findUnique({
      where: { id },
      include: {
        user: true,
        subjects: { include: { class: true } },
      },
    });
    if (!teacher) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(teacher);
  } catch {
    return NextResponse.json({ error: "Failed to fetch teacher" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { name, email, subjectIds } = await req.json();
    const teacher = await prisma.teacher.findUnique({ where: { id } });
    if (!teacher) return NextResponse.json({ error: "Not found" }, { status: 404 });

    if (name || email) {
      await prisma.user.update({ where: { id: teacher.userId }, data: { name, email } });
    }

    if (subjectIds !== undefined) {
      await prisma.subject.updateMany({
        where: { teacherId: id },
        data: { teacherId: null },
      });
      for (const subjectId of subjectIds) {
        try {
          await prisma.subject.update({
            where: { id: subjectId },
            data: { teacherId: id },
          });
        } catch {
          // Subject not found, skip
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to update teacher" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const teacher = await prisma.teacher.findUnique({ where: { id } });
    if (!teacher) return NextResponse.json({ error: "Not found" }, { status: 404 });

    await prisma.subject.updateMany({
      where: { teacherId: id },
      data: { teacherId: null },
    });

    await prisma.user.delete({ where: { id: teacher.userId } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete teacher" }, { status: 500 });
  }
}
