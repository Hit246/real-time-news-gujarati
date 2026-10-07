'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';

export function ContactForm() {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [details, setDetails] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!details.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/tips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, contact, details }),
      });

      if (res.ok) {
        setSubmitted(true);
        setName('');
        setContact('');
        setDetails('');
      } else {
        alert('સંદેશ મોકલવામાં સમસ્યા આવી. કૃપા કરીને ફરી પ્રયાસ કરો.');
      }
    } catch {
      alert('સંદેશ મોકલવામાં સમસ્યા આવી. કૃપા કરીને ફરી પ્રયાસ કરો.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-zinc-50 dark:bg-zinc-900 p-6 border border-zinc-200 dark:border-zinc-800 rounded-sm">
      <h2 className="font-serif text-lg font-bold mb-4">સંદેશ અથવા સમાચાર ટિપ મોકલો</h2>

      {submitted ? (
        <div className="p-4 bg-green-600/10 border border-green-600/30 text-green-700 dark:text-green-400 text-sm font-medium rounded-sm">
          ✓ આભાર. તમારો સંદેશ અમારા સંપાદકીય ડેસ્કને સફળતાપૂર્વક મોકલી દેવાયો છે.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          <div>
            <label className="block text-xs font-bold mb-1">
              તમારું નામ (મરજિયાત)
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="અનામી રહેવા માટે ખાલી રાખો"
              className="w-full px-3 py-2 bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-sm focus:outline-none focus:border-red-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold mb-1">
              ઇમેઇલ અથવા ફોન નંબર
            </label>
            <input
              type="text"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder="જ્યાં અમારા પત્રકાર તમારો સંપર્ક કરી શકે"
              className="w-full px-3 py-2 bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-sm focus:outline-none focus:border-red-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold mb-1">
              સમાચાર વિગત / ટિપ *
            </label>
            <textarea
              required
              rows={4}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="ઘટના, સ્થળ, સમય અને પુરાવા સંબંધિત વિગતો લખો..."
              className="w-full px-3 py-2 bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-sm focus:outline-none focus:border-red-600"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-zinc-950 hover:bg-red-600 dark:bg-zinc-100 dark:hover:bg-red-600 dark:text-zinc-950 text-white font-bold py-2.5 px-4 text-xs tracking-wider transition-colors rounded-sm cursor-pointer flex items-center justify-center gap-2"
          >
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'ન્યૂઝરૂમમાં મોકલો'}
          </button>
        </form>
      )}
    </div>
  );
}
