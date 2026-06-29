import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const classes = await prisma.class.findMany({
    include: { students: true, subjects: true },
    orderBy: { name: "asc" },
  });
  return NextResponse.json(classes);
}

export async function POST(req: NextRequest) {
  const { name, year } = await req.json();
  if (!name || !year) return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  const existing = await prisma.class.findUnique({ where: { name } });
  if (existing) return NextResponse.json({ error: "Class exists" }, { status: 400 });
  const cls = await prisma.class.create({ data: { name, year } });
  return NextResponse.json(cls, { status: 201 });
}
