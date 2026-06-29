import { PrismaClient, Role, AttendanceStatus, Day } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hash = (pw: string) => bcrypt.hash(pw, 10);

  await prisma.user.upsert({
    where: { email: "admin@school.com" },
    update: {},
    create: {
      name: "Admin User",
      email: "admin@school.com",
      password: await hash("admin123"),
      role: Role.ADMIN,
    },
  });

  const classA = await prisma.class.upsert({
    where: { name: "Grade 10A" },
    update: {},
    create: { name: "Grade 10A", year: 2024 },
  });

  const classB = await prisma.class.upsert({
    where: { name: "Grade 10B" },
    update: {},
    create: { name: "Grade 10B", year: 2024 },
  });

  const teacherUser = await prisma.user.upsert({
    where: { email: "teacher@school.com" },
    update: {},
    create: {
      name: "Jane Smith",
      email: "teacher@school.com",
      password: await hash("teacher123"),
      role: Role.TEACHER,
      teacher: { create: {} },
    },
    include: { teacher: true },
  });

  const teacher2User = await prisma.user.upsert({
    where: { email: "teacher2@school.com" },
    update: {},
    create: {
      name: "John Williams",
      email: "teacher2@school.com",
      password: await hash("teacher123"),
      role: Role.TEACHER,
      teacher: { create: {} },
    },
    include: { teacher: true },
  });

  const mathSubject = await prisma.subject.create({
    data: {
      name: "Mathematics",
      classId: classA.id,
      teacherId: teacherUser.teacher!.id,
    },
  });

  const scienceSubject = await prisma.subject.create({
    data: {
      name: "Science",
      classId: classA.id,
      teacherId: teacher2User.teacher!.id,
    },
  });

  const englishSubject = await prisma.subject.create({
    data: {
      name: "English",
      classId: classB.id,
      teacherId: teacherUser.teacher!.id,
    },
  });

  const studentUser = await prisma.user.upsert({
    where: { email: "student@school.com" },
    update: {},
    create: {
      name: "Alex Johnson",
      email: "student@school.com",
      password: await hash("student123"),
      role: Role.STUDENT,
      student: { create: { classId: classA.id } },
    },
    include: { student: true },
  });

  const student2User = await prisma.user.upsert({
    where: { email: "student2@school.com" },
    update: {},
    create: {
      name: "Sarah Davis",
      email: "student2@school.com",
      password: await hash("student123"),
      role: Role.STUDENT,
      student: { create: { classId: classA.id } },
    },
    include: { student: true },
  });

  const student3User = await prisma.user.upsert({
    where: { email: "student3@school.com" },
    update: {},
    create: {
      name: "Mike Brown",
      email: "student3@school.com",
      password: await hash("student123"),
      role: Role.STUDENT,
      student: { create: { classId: classB.id } },
    },
    include: { student: true },
  });

  await prisma.grade.createMany({
    data: [
      { score: 87, label: "Midterm Exam", studentId: studentUser.student!.id, subjectId: mathSubject.id },
      { score: 92, label: "Assignment 1", studentId: studentUser.student!.id, subjectId: mathSubject.id },
      { score: 78, label: "Quiz 1", studentId: studentUser.student!.id, subjectId: scienceSubject.id },
      { score: 95, label: "Midterm Exam", studentId: student2User.student!.id, subjectId: mathSubject.id },
      { score: 82, label: "Assignment 1", studentId: student2User.student!.id, subjectId: mathSubject.id },
      { score: 88, label: "Midterm Exam", studentId: student2User.student!.id, subjectId: scienceSubject.id },
      { score: 74, label: "Midterm Exam", studentId: student3User.student!.id, subjectId: englishSubject.id },
    ],
    skipDuplicates: true,
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  await prisma.attendance.createMany({
    data: [
      { date: today, status: AttendanceStatus.PRESENT, studentId: studentUser.student!.id, subjectId: mathSubject.id, markedBy: teacherUser.teacher!.id },
      { date: today, status: AttendanceStatus.PRESENT, studentId: student2User.student!.id, subjectId: mathSubject.id, markedBy: teacherUser.teacher!.id },
      { date: today, status: AttendanceStatus.ABSENT, studentId: student3User.student!.id, subjectId: englishSubject.id, markedBy: teacherUser.teacher!.id },
    ],
    skipDuplicates: true,
  });

  await prisma.timetable.createMany({
    data: [
      { day: Day.MONDAY, startTime: "09:00", endTime: "10:00", classId: classA.id, subjectId: mathSubject.id },
      { day: Day.MONDAY, startTime: "10:00", endTime: "11:00", classId: classA.id, subjectId: scienceSubject.id },
      { day: Day.TUESDAY, startTime: "09:00", endTime: "10:00", classId: classB.id, subjectId: englishSubject.id },
      { day: Day.WEDNESDAY, startTime: "09:00", endTime: "10:00", classId: classA.id, subjectId: mathSubject.id },
      { day: Day.THURSDAY, startTime: "10:00", endTime: "11:00", classId: classA.id, subjectId: scienceSubject.id },
      { day: Day.FRIDAY, startTime: "09:00", endTime: "10:00", classId: classB.id, subjectId: englishSubject.id },
    ],
    skipDuplicates: true,
  });

  await prisma.announcement.createMany({
    data: [
      { title: "Welcome to the new school year!", body: "Classes begin Monday. Check your timetable for room assignments." },
      { title: "Parent-Teacher Conference", body: "Scheduled for next Friday. Please confirm your attendance." },
    ],
  });

  console.log("Seed complete! Login credentials:");
  console.log("  admin@school.com    / admin123");
  console.log("  teacher@school.com  / teacher123");
  console.log("  student@school.com  / student123");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
