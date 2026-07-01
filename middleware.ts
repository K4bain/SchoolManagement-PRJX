import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/login")) {
    if (token) return NextResponse.redirect(new URL("/", request.url));
    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (pathname === "/") {
    if (token.role === "ADMIN")
      return NextResponse.redirect(new URL("/admin", request.url));
    if (token.role === "TEACHER")
      return NextResponse.redirect(new URL("/teacher", request.url));
    if (token.role === "STUDENT")
      return NextResponse.redirect(new URL("/student", request.url));
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (pathname.startsWith("/admin") && token.role !== "ADMIN")
    return NextResponse.redirect(new URL("/login", request.url));

  if (pathname.startsWith("/teacher") && token.role !== "TEACHER")
    return NextResponse.redirect(new URL("/login", request.url));

  if (pathname.startsWith("/student") && token.role !== "STUDENT")
    return NextResponse.redirect(new URL("/login", request.url));

  if (pathname.startsWith("/api/admin") && token.role !== "ADMIN")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (pathname.startsWith("/api/teacher") && token.role !== "TEACHER")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (pathname.startsWith("/api/student") && token.role !== "STUDENT")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|public|landing.html).*)",
  ],
};
