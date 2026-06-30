import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    const teachers = await prisma.teacher.findMany({
      include: {
        user: true,
        subjects: { include: { class: true } },
      },
      orderBy: { user: { name: "asc" } },
    });
    return NextResponse.json(teachers);
  } catch {
    return NextResponse.json({ error: "Failed to fetch teachers" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, subjectIds } = await req.json();
    if (!name || !email || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
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
        try {
          await prisma.subject.update({
            where: { id: subjectId },
            data: { teacherId: user.teacher.id },
          });
        } catch {
          // Subject not found or already assigned, skip
        }
      }
    }

    return NextResponse.json(user, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create teacher" }, { status: 500 });
  }
}
