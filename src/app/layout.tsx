import type { Metadata } from "next";
import { Noto_Sans_Gujarati, Noto_Serif_Gujarati } from "next/font/google";
import "./globals.css";

const notoSansGujarati = Noto_Sans_Gujarati({
  subsets: ["gujarati", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

const notoSerifGujarati = Noto_Serif_Gujarati({
  subsets: ["gujarati", "latin"],
  weight: ["600", "700", "900"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "રીયલ ટાઇમ ન્યૂઝ ગુજરાતી (Real Time News Gujarati) | વિશ્વસનીય ગુજરાતી સમાચાર અને વિશ્લેષણ",
  description: "ગુજરાત, દેશ અને વિશ્વના તાજા સમાચાર, અર્થતંત્ર, ટેકનોલોજી અને નિષ્પક્ષ પત્રકારત્વ.",
  alternates: {
    types: {
      'application/rss+xml': '/feed/rss.xml',
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="gu"
      className={`${notoSansGujarati.variable} ${notoSerifGujarati.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('real-time_theme');
                  if (saved === 'dark') {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100 selection:bg-red-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
