export type { Session } from "next-auth";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "TEACHER" | "STUDENT";
}

export interface StudentWithUser {
  id: string;
  userId: string;
  user: User;
  classId: string | null;
  class?: ClassWithSubjects;
}

export interface TeacherWithUser {
  id: string;
  userId: string;
  user: User;
}

export interface ClassWithSubjects {
  id: string;
  name: string;
  year: number;
  subjects?: SubjectWithTeacher[];
  students?: StudentWithUser[];
}

export interface SubjectWithTeacher {
  id: string;
  name: string;
  classId: string;
  teacherId: string;
  teacher: TeacherWithUser;
}

export interface Grade {
  id: string;
  score: number;
  label: string | null;
  studentId: string;
  subjectId: string;
  subject?: SubjectWithTeacher;
  createdAt: Date;
}

export interface Attendance {
  id: string;
  date: Date;
  status: "PRESENT" | "ABSENT" | "LATE";
  studentId: string;
  subjectId: string;
  markedBy: string;
}

export interface Timetable {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
  classId: string;
  subjectId: string;
  subject?: SubjectWithTeacher;
}

export interface Announcement {
  id: string;
  title: string;
  body: string;
  createdAt: Date;
}

export interface DashboardStats {
  totalStudents: number;
  totalTeachers: number;
  totalClasses: number;
  totalSubjects: number;
}
