import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import GitHub from 'next-auth/providers/github';
import { authConfig } from './auth.config';
import { checkRateLimit } from '@/lib/utils/rate-limit';

const providers: any[] = [
  Credentials({
    name: 'Admin Credentials',
    credentials: {
      email: { label: 'Admin Email', type: 'email' },
      password: { label: 'Password', type: 'password' },
    },
    async authorize(credentials, req) {
      if (!credentials?.email || !credentials?.password) {
        return null;
      }

      const email = (credentials.email as string).trim().toLowerCase();
      const password = credentials.password as string;
      const expectedEmail = (process.env.AUTH_ADMIN_EMAIL || 'realtimegujaratinews@gmail.com').trim().toLowerCase();
      const expectedPassword = process.env.ADMIN_PASSWORD || 'Hitarth1136c';

      // 1. Rate Limit Login Attempts (Max 5 attempts per 60s per email/IP)
      const ip = (req?.headers?.get?.('x-forwarded-for') as string) || email;
      const rateCheck = checkRateLimit(`login:${ip}`, 5, 60000);
      if (!rateCheck.success) {
        throw new Error('Too many login attempts. Please wait 1 minute.');
      }

      // 2. Verify Single Admin Email Match
      if (email !== expectedEmail) {
        console.warn(`[AUTH] Failed login: email mismatch (${email} !== ${expectedEmail})`);
        return null;
      }

      // 3. Verify Password
      if (password !== expectedPassword) {
        console.warn(`[AUTH] Failed login: incorrect password for ${email}`);
        return null;
      }

      return {
        id: 'admin-1',
        name: 'Newsroom Chief Editor',
        email: expectedEmail,
      };
    },
  }),
];

// Add Google Provider if environment keys exist
if (process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET) {
  providers.push(
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    })
  );
}

// Add GitHub Provider if environment keys exist
if (process.env.AUTH_GITHUB_ID && process.env.AUTH_GITHUB_SECRET) {
  providers.push(
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    })
  );
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers,
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || 'fallback-secret-development-only-replace',
  trustHost: true,
});
