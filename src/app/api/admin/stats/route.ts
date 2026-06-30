import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [totalStudents, totalTeachers, totalClasses, totalAnnouncements] = await Promise.all([
      prisma.student.count(),
      prisma.teacher.count(),
      prisma.class.count(),
      prisma.announcement.count(),
    ]);

    return NextResponse.json({
      totalStudents,
      totalTeachers,
      totalClasses,
      totalAnnouncements,
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
