import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const teacher = await prisma.teacher.findUnique({
      where: { userId: (session.user as any).id },
    });
    if (!teacher) return NextResponse.json({ totalSubjects: 0, totalStudents: 0, attendanceToday: 0 });

    const subjects = await prisma.subject.findMany({
      where: { teacherId: teacher.id },
      include: { class: { include: { students: true } } },
    });

    const uniqueStudentIds = new Set<string>();
    let totalStudents = 0;
    for (const s of subjects) {
      if (s.class?.students) {
        totalStudents += s.class.students.length;
        s.class.students.forEach((st: any) => uniqueStudentIds.add(st.id));
      }
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const subjectIds = subjects.map((s) => s.id);
    const attendanceToday = await prisma.attendance.count({
      where: {
        subjectId: { in: subjectIds },
        date: { gte: today, lt: tomorrow },
      },
    });

    return NextResponse.json({
      totalSubjects: subjects.length,
      totalStudents: uniqueStudentIds.size || totalStudents,
      attendanceToday,
    });
  } catch {
    return NextResponse.json({ totalSubjects: 0, totalStudents: 0, attendanceToday: 0 });
  }
}
