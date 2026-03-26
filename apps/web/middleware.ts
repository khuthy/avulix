import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const pathname = req.nextUrl.pathname;
    const role = token?.role as string;

    // Redirect logged-in users from auth/marketing pages to /dashboard
    if ((pathname === "/" || pathname === "/login") && token) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

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
      authorized: ({ token, req }) => {
        const pathname = req.nextUrl.pathname;
        // Public routes — no auth required
        const publicPaths = ["/", "/features", "/pricing", "/contact", "/about", "/demo", "/login", "/register"];
        if (publicPaths.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
          return true;
        }
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - _next/static, _next/image (Next.js internals)
     * - favicon.ico, public assets
     * - API routes (handled separately)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|ico|webp)).*)",
  ],
};
