import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { name, year } = await req.json();
  const data: { name?: string; year?: number } = {};
  if (name) data.name = name;
  if (year) data.year = year;
  await prisma.class.update({ where: { id }, data });
  return NextResponse.json({ success: true });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await prisma.class.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
