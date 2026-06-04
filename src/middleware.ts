import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAuth = !!token;
    const isOwnerPage = req.nextUrl.pathname.startsWith('/owner');
    const isDashboardPage = req.nextUrl.pathname.startsWith('/dashboard');

    if (isOwnerPage) {
      if (!isAuth) {
        return NextResponse.redirect(new URL('/login?callbackUrl=' + encodeURIComponent(req.nextUrl.pathname), req.url));
      }
      if (token?.role !== 'owner') {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }
    }

    if (isDashboardPage) {
      if (!isAuth) {
        return NextResponse.redirect(new URL('/login?callbackUrl=' + encodeURIComponent(req.nextUrl.pathname), req.url));
      }
    }
  },
  {
    callbacks: {
      authorized: () => true, // Let the middleware function handle the logic
    },
  }
);

export const config = {
  matcher: ['/owner/:path*', '/dashboard/:path*'],
};
