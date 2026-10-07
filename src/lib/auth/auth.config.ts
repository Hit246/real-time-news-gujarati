import type { NextAuthConfig } from 'next-auth';

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: '/admin/login',
    error: '/admin/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60, // 7 days session duration
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isAdminRoute = nextUrl.pathname.startsWith('/admin') || nextUrl.pathname.startsWith('/api/admin');
      const isLoginPage = nextUrl.pathname === '/admin/login';
      const adminEmail = process.env.AUTH_ADMIN_EMAIL?.trim().toLowerCase();

      // Allow public access to login page
      if (isLoginPage) {
        if (isLoggedIn && auth?.user?.email?.toLowerCase() === adminEmail) {
          return Response.redirect(new URL('/admin', nextUrl));
        }
        return true;
      }

      // Block any /admin or /api/admin access unless logged in and matching ONE admin email
      if (isAdminRoute) {
        if (!isLoggedIn) {
          return false;
        }

        const userEmail = auth.user?.email?.trim().toLowerCase();
        if (adminEmail && userEmail !== adminEmail) {
          // Log unauthorized attempt
          console.warn(`[SECURITY] Unauthorized login attempt from email: ${userEmail}`);
          return false;
        }

        return true;
      }

      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    session({ session, token }) {
      if (token && session.user) {
        session.user.email = token.email as string;
        session.user.name = token.name as string;
      }
      return session;
    },
  },
  providers: [], // Configured with full providers in auth.ts
};
