import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SchoolHub — Your entire school. One intelligent platform.",
  description:
    "SchoolHub gives admins, teachers, and students one unified workspace — from attendance to grades to announcements, all in real time.",
};

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
