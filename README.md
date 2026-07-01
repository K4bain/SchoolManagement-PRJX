# SchoolHub — School Management System

A fullstack school management platform built with Next.js, featuring role-based authentication for admins, teachers, and students — with a polished marketing landing page.

## Live Demo

- Landing page: [school-management-jet-rho.vercel.app](https://school-management-jet-rho.vercel.app)
- Login: [school-management-jet-rho.vercel.app/login](https://school-management-jet-rho.vercel.app/login)

### Test Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@school.com | admin123 |
| Teacher | teacher@school.com | teacher123 |
| Student | student@school.com | student123 |

## Features

### Landing Page
- Marketing site with hero, features, role showcase, stats, and pricing
- Animated mesh gradient hero with floating dashboard preview
- Intersection Observer fade-up reveal animations
- Tabbed role showcase (Admin/Teacher/Student)
- Counter animation on scroll
- Fully responsive with mobile hamburger menu

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
- **Loading & error states** — Skeleton spinners and error boundaries per dashboard
- **SSR-safe charts** — Dynamic imports for Recharts

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
git clone https://github.com/K4bain/SchoolManagement-PRJX-.git
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

## Project Structure

```
src/
├── app/
│   ├── (auth)/login/              # Login page
│   ├── (marketing)/               # Landing page (no sidebar)
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── (dashboard)/
│   │   ├── admin/                 # Admin pages (CRUD)
│   │   ├── teacher/               # Teacher pages (attendance, grades)
│   │   ├── student/               # Student pages (grades, timetable)
│   │   └── layout.tsx             # Dashboard layout (sidebar + topbar)
│   └── api/                       # API routes
├── components/
│   ├── charts/                    # Dynamic Recharts imports
│   ├── layout/                    # Sidebar, Topbar, CommandPalette
│   └── ui/                        # shadcn/ui components
├── hooks/                         # Custom React hooks
├── lib/
│   ├── auth.ts                    # NextAuth config
│   ├── prisma.ts                  # Prisma client singleton
│   └── utils.ts                   # Utility functions
├── types/                         # TypeScript type augmentations
└── middleware.ts                   # Route protection + role guards
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
