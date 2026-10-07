import NextAuth from 'next-auth';
import { authConfig } from '@/lib/auth/auth.config';

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const isLoggedIn = !!req.auth?.user;
  const isAdminRoute = req.nextUrl.pathname.startsWith('/admin') || req.nextUrl.pathname.startsWith('/api/admin');
  const isLoginPage = req.nextUrl.pathname === '/admin/login';
  const adminEmail = process.env.AUTH_ADMIN_EMAIL?.trim().toLowerCase();

  // If on login page and already logged in with admin email, redirect to /admin
  if (isLoginPage) {
    if (isLoggedIn && req.auth?.user?.email?.toLowerCase() === adminEmail) {
      return Response.redirect(new URL('/admin', req.nextUrl));
    }
    return;
  }

  // If attempting to access /admin or /api/admin without valid single admin email
  if (isAdminRoute) {
    if (!isLoggedIn) {
      const loginUrl = new URL('/admin/login', req.nextUrl);
      loginUrl.searchParams.set('callbackUrl', req.nextUrl.pathname);
      return Response.redirect(loginUrl);
    }

    const userEmail = req.auth?.user?.email?.trim().toLowerCase();
    if (adminEmail && userEmail !== adminEmail) {
      console.warn(`[SECURITY MIDDLEWARE] Blocked unauthorized email: ${userEmail}`);
      const loginUrl = new URL('/admin/login', req.nextUrl);
      loginUrl.searchParams.set('error', 'UnauthorizedEmail');
      return Response.redirect(loginUrl);
    }
  }
});

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
