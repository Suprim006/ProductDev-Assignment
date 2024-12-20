// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const session = request.cookies.get('session');
  const isAdminPath = request.nextUrl.pathname.startsWith('/admin');
  const isLoginPath = request.nextUrl.pathname === '/admin/login';

  // If we're on the login page
  if (isLoginPath) {
    // If we have a session, redirect to dashboard
    if (session) {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }
    // Otherwise, allow access to login page
    return NextResponse.next();
  }

  // For all other admin paths
  if (isAdminPath) {
    // If no session, redirect to login
    if (!session) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*']
};