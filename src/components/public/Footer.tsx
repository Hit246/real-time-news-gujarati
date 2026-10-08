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
          {/* Brand & Mission */}
          <div className="md:col-span-2">
            <Link href="/" className="inline-block group">
              <span className="font-serif text-2xl sm:text-3xl font-black tracking-tight text-zinc-950 dark:text-zinc-50 group-hover:text-red-600 transition-colors uppercase">
                {settings.siteName || 'રીયલ ટાઇમ ન્યૂઝ ગુજરાતી'}
              </span>
            </Link>
            <p className="mt-3 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 max-w-sm leading-relaxed font-sans">
              ગુજરાત અને દેશના નાગરિકો માટે સચોટ, વિશ્વસનીય અને તપાસાત્મક પત્રકારત્વ.
              રાજનીતિ, અર્થતંત્ર, સ્થાનિક વિકાસ અને ટેકનોલોજીના સચોટ અહેવાલો.
            </p>

            {/* Editors / Owners */}
            <div className="mt-5 pt-4 border-t border-zinc-200/80 dark:border-zinc-800/80 max-w-sm">
              <div className="text-[11px] font-mono uppercase tracking-wider text-red-600 dark:text-red-500 font-bold">
                સંપાદક અને માલિક (Editors &amp; Owners)
              </div>
              <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm font-serif font-bold text-zinc-900 dark:text-zinc-100">
                <span>ધવલ ચૌહાણ</span>
                <span className="text-red-600">•</span>
                <span>સંજય ભોઈ</span>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-mono text-xs font-bold text-zinc-900 dark:text-zinc-100 mb-3.5 uppercase tracking-wider border-b border-zinc-200 dark:border-zinc-800 pb-1.5 inline-block">
              સમાચાર વિભાગો
            </h3>
            <ul className="space-y-2 text-xs font-medium text-zinc-600 dark:text-zinc-400 font-sans">
              {categories.map((cat) => (
                <li key={cat._id}>
                  <Link href={`/${cat.slug.current}`} className="hover:text-red-600 transition-colors">
                    {cat.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Information & Links */}
          <div>
            <h3 className="font-mono text-xs font-bold text-zinc-900 dark:text-zinc-100 mb-3.5 uppercase tracking-wider border-b border-zinc-200 dark:border-zinc-800 pb-1.5 inline-block">
              સંસ્થા અને માહિતી
            </h3>
            <ul className="space-y-2 text-xs font-medium text-zinc-600 dark:text-zinc-400 font-sans">
              <li>
                <Link href="/about" className="hover:text-red-600 transition-colors">
                  અમારા વિશે (About Us)
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-red-600 transition-colors">
                  સંપર્ક અને સમાચાર ટિપ્સ (Contact & Tips)
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-red-600 transition-colors">
                  ગોપનીયતા નીતિ (Privacy Policy)
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Credits & Developer Attribution */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 gap-4 text-center md:text-left">
          <p className="font-sans text-[11px]">
            © {new Date().getFullYear()} {settings.siteName || 'રીયલ ટાઇમ ન્યૂઝ ગુજરાતી'}. સર્વાધિકાર સુરક્ષિત.
          </p>

          {/* Developer Attribution with Distinct Font Styling */}
          <div className="inline-flex items-center gap-2 bg-white dark:bg-zinc-900 px-3.5 py-1.5 rounded-sm border border-zinc-200 dark:border-zinc-800 shadow-2xs">
            <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-500 font-bold">
              Developed by
            </span>
            <a href='https://hitarth-chauhan.vercel.app' className="font-serif italic font-black text-sm tracking-wide text-zinc-950 dark:text-zinc-50 text-red-600 dark:text-red-500">
              Hitarth Chauhan
            </a>
          </div>

          <p className="font-sans text-[11px] text-zinc-400">
            ચોકસાઈ, નિર્ભયતા અને વિશ્વસનીય પત્રકારત્વ.
          </p>
        </div>
      </div>
    </footer>
  );
}
