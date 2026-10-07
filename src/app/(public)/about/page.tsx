import type { Metadata } from 'next';
import { ShieldCheck, Award, Users } from 'lucide-react';

export const metadata: Metadata = {
  title: 'અમારા વિશે | રીયલ ટાઇમ ન્યૂઝ ગુજરાતી',
  description: 'રીયલ ટાઇમ ન્યૂઝ ગુજરાતીનું પત્રકારત્વ મિશન, નીતિમત્તા અને નિષ્પક્ષ અહેવાલ પ્રણાલી.',
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-10">
      <div className="border-b-2 border-zinc-900 dark:border-zinc-100 pb-4">
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
          અમારા વિશે
        </h1>
        <p className="text-base text-zinc-600 dark:text-zinc-400 mt-2 font-serif italic">
          નિષ્પક્ષ, નિર્ભય અને તથ્ય આધારિત સ્વતંત્ર પત્રકારત્વ.
        </p>
      </div>

      <div className="prose-custom">
        <p>
          જાગૃત નાગરિકો જ લોકશાહીની સાચી કરોડરજ્જુ છે. આ મૂળભૂત સિદ્ધાંત સાથે <strong>રીયલ ટાઇમ ન્યૂઝ ગુજરાતી</strong> સ્થાનિક સ્તરથી લઈને રાજ્ય અને દેશના મહત્વના મુદ્દાઓ પર ગહન તપાસ અને પૃથ્થકરણ આધારિત સમાચાર રજૂ કરે છે.
        </p>

        <p>
          અમે કોઈપણ રાજકીય પક્ષપાત કે કોર્પોરેટ પ્રભાવ વિના કામ કરીએ છીએ. અમારા તમામ સમાચારો સખત તથ્ય ચકાસણી (Fact-Checking) પછી જ પ્રસારિત કરવામાં આવે છે.
        </p>

        <h2>અમારા પત્રકારત્વના માપદંડો</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 not-prose my-8">
          <div className="p-5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-sm">
            <ShieldCheck className="w-6 h-6 text-red-600 mb-2" />
            <h3 className="font-serif text-base font-bold mb-1">તથ્યોની સચોટ ચકાસણી</h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400">
              દરેક માહિતી અને દાવાની સત્તાવાર દસ્તાવેજો અને આધારભૂત સ્ત્રોતો સાથે પુષ્ટિ કરવામાં આવે છે.
            </p>
          </div>

          <div className="p-5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-sm">
            <Award className="w-6 h-6 text-red-600 mb-2" />
            <h3 className="font-serif text-base font-bold mb-1">સ્પષ્ટ વર્ગીકરણ</h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400">
              વાચકોની સ્પષ્ટતા માટે સામાન્ય સમાચારો અને સંપાદકીય મંતવ્યો વચ્ચે સ્પષ્ટ ભેદરેખા રખાય છે.
            </p>
          </div>

          <div className="p-5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-sm">
            <Users className="w-6 h-6 text-red-600 mb-2" />
            <h3 className="font-serif text-base font-bold mb-1">સ્ત્રોતોની સુરક્ષા</h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400">
              અમારી ન્યૂઝરૂમને ગુપ્ત માહિતી આપનાર સ્ત્રોતોની ગોપનીયતાની ૧૦૦% સુરક્ષા સુનિશ્ચિત કરીએ છીએ.
            </p>
          </div>
        </div>

        <h2>ભૂલ સુધારણા નીતિ (Corrections Policy)</h2>
        <p>
          જો કોઈ અહેવાલમાં અજાણતા કોઈ ભૂલ રહી જાય, તો અમે તેને તાત્કાલિક સ્વીકારીને સ્પષ્ટ સુધારા નોંધ (Correction Note) સાથે અહેવાલ અપડેટ કરીએ છીએ.
        </p>
      </div>
    </div>
  );
}
