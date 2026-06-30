import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const pathname = req.nextUrl.pathname;

    if (pathname === "/") {
      if (token?.role === "ADMIN")
        return NextResponse.redirect(new URL("/admin", req.url));
      if (token?.role === "TEACHER")
        return NextResponse.redirect(new URL("/teacher", req.url));
      if (token?.role === "STUDENT")
        return NextResponse.redirect(new URL("/student", req.url));
      return NextResponse.redirect(new URL("/login", req.url));
    }

    if (pathname.startsWith("/admin") && token?.role !== "ADMIN")
      return NextResponse.redirect(new URL("/login", req.url));

    if (pathname.startsWith("/teacher") && token?.role !== "TEACHER")
      return NextResponse.redirect(new URL("/login", req.url));

    if (pathname.startsWith("/student") && token?.role !== "STUDENT")
      return NextResponse.redirect(new URL("/login", req.url));

    if (pathname.startsWith("/api/admin") && token?.role !== "ADMIN")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    if (pathname.startsWith("/api/teacher") && token?.role !== "TEACHER")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    if (pathname.startsWith("/api/student") && token?.role !== "STUDENT")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/", "/admin/:path*", "/teacher/:path*", "/student/:path*", "/api/admin/:path*", "/api/teacher/:path*", "/api/student/:path*"],
};
