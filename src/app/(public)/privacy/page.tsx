import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ગોપનીયતા નીતિ (Privacy Policy) | રીયલ ટાઇમ ન્યૂઝ ગુજરાતી',
  description: 'વાચકોના ડેટા સંરક્ષણ અને સુરક્ષા સંબંધિત અમારી નીતિ.',
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-10">
      <div className="border-b-2 border-zinc-900 dark:border-zinc-100 pb-4">
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
          ગોપનીયતા નીતિ
        </h1>
        <p className="text-xs text-zinc-500 mt-2">
          છેલ્લે સુધારેલ: ૨૦૨૬ • રીયલ ટાઇમ ન્યૂઝ ગુજરાતી વાચક સુરક્ષા નીતિ
        </p>
      </div>

      <div className="prose-custom">
        <p>
          <strong>રીયલ ટાઇમ ન્યૂઝ ગુજરાતી</strong> અમારા વાચકોની ગોપનીયતાનું સંપૂર્ણ સન્માન કરે છે. અમે તમારી અંગત માહિતીની સુરક્ષા માટે પ્રતિબદ્ધ છીએ.
        </p>

        <h2>૧. માહિતી સંગ્રહ</h2>
        <p>
          અમે બિનજરૂરી વ્યક્તિગત ડેટા એકત્રિત કરતા નથી.
        </p>
        <ul>
          <li><strong>ન્યૂઝલેટર અને સંપર્ક:</strong> જ્યારે તમે ન્યૂઝલેટર સબ્સ્ક્રાઇબ કરો છો અથવા સમાચાર ટિપ મોકલો છો ત્યારે માત્ર તમે આપેલી સંપર્ક વિગતોનો ઉપયોગ થાય છે.</li>
          <li><strong>કોઈ ડેટા વેચાણ નહીં:</strong> અમે ક્યારેય વાચકોનો ડેટા તૃતીય પક્ષોને વેચતા કે ભાડે આપતા નથી.</li>
        </ul>

        <h2>૨. કૂકીઝ અને થીમ પસંદગી</h2>
        <p>
          વેબસાઇટ પર માત્ર તમારી લાઈટ/ડાર્ક મોડ પસંદગી યાદ રાખવા માટે જ બ્રાઉઝર લોકલ સ્ટોરેજનો ઉપયોગ થાય છે.
        </p>

        <h2>૩. સંપર્ક</h2>
        <p>
          ગોપનીયતા સંબંધિત કોઈપણ પ્રશ્ન માટે સંપર્ક કરો: <a href="mailto:realtimegujaratinews@gmail.com">realtimegujaratinews@gmail.com</a>.
        </p>
      </div>
    </div>
  );
}
