import type { Metadata } from 'next';
import { Mail, Phone, Lock, MapPin } from 'lucide-react';
import { ContactForm } from '@/components/public/ContactForm';

export const metadata: Metadata = {
  title: 'સંપર્ક અને સમાચાર ટિપ્સ | રીયલ ટાઇમ ન્યૂઝ ગુજરાતી',
  description: 'અમારા ન્યૂઝરૂમનો સંપર્ક કરો અથવા ગુપ્ત સમાચાર ટિપ્સ મોકલો.',
};

export default function ContactPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-10">
      <div className="border-b-2 border-zinc-900 dark:border-zinc-100 pb-4">
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
          સંપર્ક અને સમાચાર ટિપ્સ
        </h1>
        <p className="text-base text-zinc-600 dark:text-zinc-400 mt-2 font-serif italic">
          તમારી પાસે કોઈ મહત્વના સમાચાર કે દસ્તાવેજી માહિતી છે?
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="flex items-start gap-3">
            <Mail className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-sm">મુખ્ય સંપાદકીય ડેસ્ક</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">realtimegujaratinews@gmail.com</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Lock className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-sm">ગોપનીય સમાચાર ટિપ્સ</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">realtimegujaratinews@gmail.com</p>
              <p className="text-xs text-zinc-500 mt-1">એન્ક્રિપ્ટેડ વાતચીત માટે PGP સપોર્ટ ઉપલબ્ધ છે.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Phone className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-sm">ન્યૂઝરૂમ હેલ્પલાઇન</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">+91 98765 43210</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-sm">મુખ્ય કાર્યાલય</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                પ્રેસ ભવન, આશ્રમ રોડ,<br />
                અમદાવાદ, ગુજરાત - ૩૮૦૦૦૯
              </p>
            </div>
          </div>
        </div>

        {/* Client-side tip form */}
        <ContactForm />
      </div>
    </div>
  );
}
