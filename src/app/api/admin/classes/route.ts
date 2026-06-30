import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const classes = await prisma.class.findMany({
    include: { _count: { select: { students: true } } },
    orderBy: { name: "asc" },
  });
  return NextResponse.json(classes);
}

export async function POST(req: NextRequest) {
  const { name, year } = await req.json();
  if (!name) return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  const existing = await prisma.class.findUnique({ where: { name } });
  if (existing) return NextResponse.json({ error: "Class exists" }, { status: 400 });
  const cls = await prisma.class.create({ data: { name, year: year || new Date().getFullYear() } });
  return NextResponse.json(cls, { status: 201 });
}
