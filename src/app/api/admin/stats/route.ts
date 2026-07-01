import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [totalStudents, totalTeachers, totalClasses, totalAnnouncements, attendanceToday] =
      await Promise.all([
        prisma.student.count(),
        prisma.teacher.count(),
        prisma.class.count(),
        prisma.announcement.count(),
        prisma.attendance.count({
          where: { date: { gte: today, lt: tomorrow } },
        }),
      ]);

    return NextResponse.json({
      totalStudents,
      totalTeachers,
      totalClasses,
      totalAnnouncements,
      attendanceToday,
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
