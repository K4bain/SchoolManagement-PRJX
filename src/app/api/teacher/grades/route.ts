import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const subjectId = req.nextUrl.searchParams.get("subjectId");
  if (!subjectId) return NextResponse.json({ students: [] });

  const subject = await prisma.subject.findUnique({
    where: { id: subjectId },
    include: { class: { include: { students: { include: { user: true } } } } },
  });

  return NextResponse.json({ students: subject?.class.students || [] });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { subjectId, records } = await req.json();

  for (const record of records) {
    await prisma.grade.create({
      data: {
        score: record.score,
        label: record.label,
        studentId: record.studentId,
        subjectId,
      },
    });
  }

  return NextResponse.json({ success: true });
}
