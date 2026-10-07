'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Lock, Mail, AlertCircle, Loader2 } from 'lucide-react';

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/admin';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      const res = await signIn('credentials', {
        email,
        password,
        redirect: false,
        callbackUrl,
      });

      if (res?.error) {
        if (res.error.includes('Too many login attempts')) {
          setErrorMessage('Too many login attempts. Please wait 1 minute.');
        } else {
          setErrorMessage('Invalid credentials or unauthorized admin email.');
        }
        setLoading(false);
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      setErrorMessage('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  const handleOAuthLogin = (provider: 'google' | 'github') => {
    setLoading(true);
    signIn(provider, { callbackUrl });
  };

  return (
    <div className="space-y-6">
      {errorMessage && (
        <div className="p-3 bg-red-600/10 border border-red-600/30 text-red-600 dark:text-red-400 text-xs rounded-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleCredentialsSubmit} className="space-y-4">
        <div>
          <label className="block text-xs uppercase font-mono font-bold mb-1.5 text-zinc-700 dark:text-zinc-300">
            Admin Email Address
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="realtimegujaratinews@gmail.com"
              className="w-full pl-9 pr-3 py-2.5 text-sm bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-sm focus:outline-none focus:border-red-600 focus:bg-white dark:focus:bg-zinc-950 transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs uppercase font-mono font-bold mb-1.5 text-zinc-700 dark:text-zinc-300">
            Password
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full pl-9 pr-3 py-2.5 text-sm bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-sm focus:outline-none focus:border-red-600 focus:bg-white dark:focus:bg-zinc-950 transition-colors"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-red-600 hover:bg-red-700 disabled:bg-zinc-400 text-white font-bold py-2.5 px-4 text-xs uppercase tracking-wider rounded-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Log In to Editorial Console'}
        </button>
      </form>

      {/* OAuth Options Divider */}
      <div className="relative flex items-center justify-center">
        <div className="border-t border-zinc-200 dark:border-zinc-800 w-full" />
        <span className="bg-white dark:bg-zinc-950 px-2 text-[11px] font-mono text-zinc-400 uppercase tracking-wider shrink-0">
          Or OAuth Login
        </span>
        <div className="border-t border-zinc-200 dark:border-zinc-800 w-full" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => handleOAuthLogin('google')}
          className="p-2 border border-zinc-300 dark:border-zinc-700 hover:border-zinc-500 rounded-sm text-xs font-mono font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <span>Google</span>
        </button>
        <button
          type="button"
          onClick={() => handleOAuthLogin('github')}
          className="p-2 border border-zinc-300 dark:border-zinc-700 hover:border-zinc-500 rounded-sm text-xs font-mono font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <span>GitHub</span>
        </button>
      </div>
    </div>
  );
}
