import Link from 'next/link';
import { getCategories, getSiteSettings } from '@/lib/sanity/fetch';

export async function Footer() {
  const [categories, settings] = await Promise.all([
    getCategories(),
    getSiteSettings(),
  ]);

  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-950 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-zinc-200 dark:border-zinc-800">
          <div className="md:col-span-2">
            <Link href="/">
              <span className="font-serif text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 uppercase">
                {settings.siteName || 'રીયલ ટાઇમ ન્યૂઝ ગુજરાતી'}
              </span>
            </Link>
            <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400 max-w-sm leading-relaxed">
              ગુજરાત અને દેશના નાગરિકો માટે સચોટ, વિશ્વસનીય અને તપાસાત્મક પત્રકારત્વ.
              રાજનીતિ, અર્થતંત્ર, સ્થાનિક વિકાસ અને ટેકનોલોજીના સચોટ અહેવાલો.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 mb-3 uppercase tracking-wider">
              વિભાગો
            </h3>
            <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
              {categories.map((cat) => (
                <li key={cat._id}>
                  <Link href={`/${cat.slug.current}`} className="hover:text-red-600 transition-colors">
                    {cat.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 mb-3 uppercase tracking-wider">
              સંસ્થા અને માહિતી
            </h3>
            <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
              <li>
                <Link href="/about" className="hover:text-red-600 transition-colors">
                  અમારા વિશે
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-red-600 transition-colors">
                  સંપર્ક અને સમાચાર ટિપ્સ
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-red-600 transition-colors">
                  ગોપનીયતા નીતિ
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 dark:text-zinc-500 gap-4">
          <p>© {new Date().getFullYear()} {settings.siteName || 'રીયલ ટાઇમ ન્યૂઝ ગુજરાતી'}. સર્વાધિકાર સુરક્ષિત.</p>
          <p>ચોકસાઈ, નિર્ભયતા અને વિશ્વસનીય પત્રકારત્વ.</p>
        </div>
      </div>
    </footer>
  );
}
