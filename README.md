# SchoolHub — School Management System

A fullstack school management platform built with Next.js, featuring role-based authentication for admins, teachers, and students.

## Live Demo

🔗 [View Live Demo](https://your-deployment-url.vercel.app) *(deploy soon)*

## Features

### Admin Dashboard
- Manage students, teachers, and classes (CRUD)
- Post school-wide announcements
- View school statistics with visual charts

### Teacher Dashboard
- Mark student attendance (present, absent, late)
- Enter and manage grades per subject
- View class rosters

### Student Dashboard
- View grades organized by subject with average scores
- Track attendance with attendance rate percentage
- View weekly class timetable
- Read school announcements

### Technical Highlights
- **Role-based authentication** — Admin, Teacher, Student roles with JWT sessions
- **Route protection** — Middleware prevents unauthorized access per role
- **Dark mode** — Full dark theme with system preference detection
- **Responsive design** — Works on mobile, tablet, and desktop
- **Real-time data** — Server-side API routes with Prisma ORM

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Database | PostgreSQL (Supabase) |
| ORM | Prisma 5 |
| Authentication | NextAuth.js v4 |
| UI Components | shadcn/ui v4 (Base UI) |
| Styling | Tailwind CSS v4 |
| Charts | Recharts |
| Deployment | Vercel |

## Getting Started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) account (free tier works)

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR-USERNAME/school-management.git
cd school-management

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your Supabase connection strings

# Push database schema
npx prisma db push

# Seed test data
npx ts-node --project tsconfig.seed.json prisma/seed.ts

# Start development server
npm run dev
```

### Environment Variables

```env
DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres"
NEXTAUTH_SECRET="your-random-secret"
NEXTAUTH_URL="http://localhost:3000"
```

### Test Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@school.com | admin123 |
| Teacher | teacher@school.com | teacher123 |
| Student | student@school.com | student123 |

## Project Structure

```
src/
├── app/
│   ├── (auth)/login/          # Login page
│   ├── (dashboard)/
│   │   ├── admin/             # Admin pages (CRUD)
│   │   ├── teacher/           # Teacher pages (attendance, grades)
│   │   ├── student/           # Student pages (grades, timetable)
│   │   └── layout.tsx         # Dashboard layout (sidebar + topbar)
│   └── api/                   # API routes
├── components/
│   ├── layout/                # Sidebar, Topbar
│   └── ui/                    # shadcn/ui components
├── lib/
│   ├── auth.ts                # NextAuth config
│   ├── prisma.ts              # Prisma client singleton
│   └── utils.ts               # Utility functions
└── middleware.ts               # Route protection
```

## Database Schema

- **User** — Shared auth model with role (ADMIN, TEACHER, STUDENT)
- **Teacher** — Teacher profile linked to User
- **Student** — Student profile linked to User and Class
- **Class** — Class grouping with year
- **Subject** — Subject taught by a Teacher in a Class
- **Grade** — Student grade for a Subject
- **Attendance** — Student attendance record per Subject per day
- **Timetable** — Weekly class schedule
- **Announcement** — School-wide announcements

## License

MIT
