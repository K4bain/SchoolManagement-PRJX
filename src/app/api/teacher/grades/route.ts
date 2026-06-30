import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const subjectId = req.nextUrl.searchParams.get("subjectId");
    if (!subjectId) return NextResponse.json({ students: [] });

    const subject = await prisma.subject.findUnique({
      where: { id: subjectId },
      include: { class: { include: { students: { include: { user: true } } } } },
    });

    return NextResponse.json({ students: subject?.class.students || [] });
  } catch {
    return NextResponse.json({ error: "Failed to fetch students" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { subjectId, records } = await req.json();

    if (!subjectId || !records || !Array.isArray(records) || records.length === 0) {
      return NextResponse.json({ error: "Missing or invalid fields" }, { status: 400 });
    }

    for (const record of records) {
      if (!record.studentId || record.score === undefined || record.score === null) continue;

      const score = parseFloat(record.score);
      if (isNaN(score) || score < 0 || score > 100) continue;

      await prisma.grade.create({
        data: {
          score,
          label: record.label || null,
          studentId: record.studentId,
          subjectId,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to save grades" }, { status: 500 });
  }
}
