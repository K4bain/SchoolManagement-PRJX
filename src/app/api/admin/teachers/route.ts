import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET() {
  const teachers = await prisma.teacher.findMany({
    include: {
      user: true,
      subjects: { include: { class: true } },
    },
    orderBy: { user: { name: "asc" } },
  });
  return NextResponse.json(teachers);
}

export async function POST(req: NextRequest) {
  const { name, email, password, subjectIds } = await req.json();
  if (!name || !email || !password) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return NextResponse.json({ error: "Email exists" }, { status: 400 });

  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashed,
      role: "TEACHER",
      teacher: { create: {} },
    },
    include: { teacher: true },
  });

  if (subjectIds && subjectIds.length > 0 && user.teacher) {
    for (const subjectId of subjectIds) {
      await prisma.subject.update({
        where: { id: subjectId },
        data: { teacherId: user.teacher.id },
      }).catch(() => {});
    }
  }

  return NextResponse.json(user, { status: 201 });
}
