import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const subjectId = req.nextUrl.searchParams.get("subjectId");
  if (!subjectId) return NextResponse.json({ students: [], existing: [] });

  const subject = await prisma.subject.findUnique({
    where: { id: subjectId },
    include: { class: { include: { students: { include: { user: true } } } } },
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const existing = await prisma.attendance.findMany({
    where: { subjectId, date: today },
  });

  return NextResponse.json({
    students: subject?.class.students || [],
    existing,
  });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const teacher = await prisma.teacher.findUnique({
    where: { userId: (session.user as any).id },
  });
  if (!teacher) return NextResponse.json({ error: "Not a teacher" }, { status: 400 });

  const { subjectId, records } = await req.json();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (const record of records) {
    await prisma.attendance.upsert({
      where: {
        studentId_subjectId_date: {
          studentId: record.studentId,
          subjectId,
          date: today,
        },
      },
      update: { status: record.status },
      create: {
        date: today,
        status: record.status,
        studentId: record.studentId,
        subjectId,
        markedBy: teacher.id,
      },
    });
  }

  return NextResponse.json({ success: true });
}
