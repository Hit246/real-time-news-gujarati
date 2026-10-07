'use client';

import { useState } from 'react';
import { Mail } from 'lucide-react';

export function NewsletterForm() {
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
  };

  return (
    <div className="bg-zinc-100 dark:bg-zinc-900 p-6 rounded-sm border border-zinc-200 dark:border-zinc-800">
      <div className="flex items-center gap-2 mb-2 text-red-600">
        <Mail className="w-4 h-4" />
        <span className="text-xs font-bold tracking-wide font-sans">
          રોજિંદી ન્યૂઝલેટર
        </span>
      </div>
      <h4 className="font-serif text-base font-bold text-zinc-900 dark:text-zinc-100 mb-2">
        ગુજરાત અને દેશના સૌથી મહત્વપૂર્ણ સમાચારો દરરોજ સવારે સીધા તમારા ઇનબોક્સમાં મેળવો.
      </h4>

      {subscribed ? (
        <div className="p-3 bg-red-600/10 border border-red-600/30 text-red-600 dark:text-red-400 text-xs font-medium rounded-sm">
          ✓ આભાર! તમે સફળતાપૂર્વક ન્યૂઝલેટર સબ્સ્ક્રાઇબ કર્યું છે.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-2 mt-4">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="તમારું ઇમેઇલ એડ્રેસ દાખલ કરો"
            className="w-full px-3 py-2 text-sm bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-sm focus:outline-none focus:border-red-600"
          />
          <button
            type="submit"
            className="w-full bg-zinc-950 hover:bg-red-600 dark:bg-zinc-100 dark:hover:bg-red-600 dark:text-zinc-950 text-white font-bold py-2.5 px-4 text-xs tracking-wider transition-colors rounded-sm cursor-pointer"
          >
            મફત સબ્સ્ક્રાઇબ કરો
          </button>
        </form>
      )}
    </div>
  );
}
