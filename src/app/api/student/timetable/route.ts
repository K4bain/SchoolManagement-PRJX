import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const student = await prisma.student.findUnique({
      where: { userId: (session.user as any).id },
    });
    if (!student || !student.classId) return NextResponse.json([]);

    const timetable = await prisma.timetable.findMany({
      where: { classId: student.classId },
      include: { subject: true },
      orderBy: { day: "asc" },
    });
    return NextResponse.json(timetable);
  } catch {
    return NextResponse.json({ error: "Failed to fetch timetable" }, { status: 500 });
  }
}
