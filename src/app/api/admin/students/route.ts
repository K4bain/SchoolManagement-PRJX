import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET() {
  const students = await prisma.student.findMany({
    include: { user: true, class: true },
    orderBy: { user: { name: "asc" } },
  });
  return NextResponse.json(students);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, email, password, classId } = body;

  if (!name || !email || !password) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "Email already exists" }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: "STUDENT",
      student: {
        create: { classId: classId || undefined },
      },
    },
    include: { student: true },
  });

  return NextResponse.json(user, { status: 201 });
}
