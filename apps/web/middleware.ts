import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const pathname = req.nextUrl.pathname;
    const role = token?.role as string;

    // Audit log: SCHOOL_ADMIN and SUPER_ADMIN only
    if (pathname.startsWith("/audit-log") && !["SCHOOL_ADMIN", "SUPER_ADMIN"].includes(role)) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // Settings: SCHOOL_ADMIN and SUPER_ADMIN only
    if (pathname.startsWith("/settings") && !["SCHOOL_ADMIN", "SUPER_ADMIN"].includes(role)) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/students/:path*",
    "/staff/:path*",
    "/admissions/:path*",
    "/finance/:path*",
    "/attendance/:path*",
    "/library/:path*",
    "/inventory/:path*",
    "/transport/:path*",
    "/reports/:path*",
    "/audit-log/:path*",
    "/settings/:path*",
  ],
};
