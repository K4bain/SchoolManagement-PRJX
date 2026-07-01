import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

    const [totalStudents, totalTeachers, totalClasses, totalAnnouncements, attendanceToday, attendanceTrend] =
      await Promise.all([
        prisma.student.count(),
        prisma.teacher.count(),
        prisma.class.count(),
        prisma.announcement.count(),
        prisma.attendance.count({
          where: { date: { gte: today, lt: tomorrow } },
        }),
        prisma.$queryRaw<{ date: Date; count: bigint }[]>`
          SELECT DATE(date) as date, COUNT(*) as count
          FROM attendance
          WHERE date >= ${sevenDaysAgo}
          GROUP BY DATE(date)
          ORDER BY date ASC
        `,
      ]);

    return NextResponse.json({
      totalStudents,
      totalTeachers,
      totalClasses,
      totalAnnouncements,
      attendanceToday,
      attendanceTrend: attendanceTrend.map((row) => ({
        date: row.date,
        count: Number(row.count),
      })),
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
