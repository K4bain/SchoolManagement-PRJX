import type { Metadata } from "next";
import { Inter, DM_Sans } from "next/font/google";
import "../globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

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
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var t = localStorage.getItem('theme');
                if (t === 'dark' || (!t && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                }
              } catch(e) {}
            `,
          }}
        />
      </head>
      <body
        className={`${inter.variable} ${dmSans.variable} antialiased`}
        style={{
          background: "#0D0F14",
          color: "#F0F2F8",
          fontFamily: "var(--font-inter), Inter, sans-serif",
        }}
      >
        {children}
      </body>
    </html>
  );
}
