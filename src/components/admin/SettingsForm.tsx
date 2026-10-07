'use client';

import { useState } from 'react';
import { SiteSettings } from '@/types/sanity';
import { Save, CheckCircle2, AlertCircle, Loader2, Globe, Image as ImageIcon, Share2, DollarSign } from 'lucide-react';

interface SettingsFormProps {
  initialSettings: SiteSettings;
}

export function SettingsForm({ initialSettings }: SettingsFormProps) {
  const [siteName, setSiteName] = useState(initialSettings.siteName || 'રીયલ ટાઇમ ન્યૂઝ ગુજરાતી');
  const [logoUrl, setLogoUrl] = useState(initialSettings.logo?.url || '');
  const [logoAlt, setLogoAlt] = useState(initialSettings.logo?.alt || '');
  const [twitter, setTwitter] = useState(initialSettings.socialLinks?.twitter || '');
  const [facebook, setFacebook] = useState(initialSettings.socialLinks?.facebook || '');
  const [instagram, setInstagram] = useState(initialSettings.socialLinks?.instagram || '');
  const [youtube, setYoutube] = useState(initialSettings.socialLinks?.youtube || '');
  const [adCode, setAdCode] = useState(initialSettings.adCode || '');
  const [breakingTickerEnabled, setBreakingTickerEnabled] = useState(
    initialSettings.breakingTickerEnabled !== false
  );

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    setError('');

    const payload = {
      siteName,
      logo: logoUrl ? { url: logoUrl, alt: logoAlt || siteName } : undefined,
      socialLinks: {
        twitter: twitter || undefined,
        facebook: facebook || undefined,
        instagram: instagram || undefined,
        youtube: youtube || undefined,
      },
      adCode: adCode || undefined,
      breakingTickerEnabled,
    };

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || 'Failed to save settings');
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || 'An error occurred while saving.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-8 max-w-4xl pb-20">
      {/* Header action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <div>
          <h1 className="font-serif text-3xl font-black uppercase tracking-tight text-zinc-950 dark:text-zinc-50">
            વેબસાઇટ સેટિંગ્સ (Site Settings)
          </h1>
          <p className="text-xs font-mono text-zinc-500 mt-1 uppercase">
            Configure site name, logo, social channels, and ad slots
          </p>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:bg-zinc-400 text-white font-mono text-xs uppercase tracking-wider font-bold px-5 py-2.5 rounded-sm transition-colors cursor-pointer shrink-0"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          સેટિંગ્સ સેવ કરો (Save Settings)
        </button>
      </div>

      {/* Notifications */}
      {success && (
        <div className="p-4 bg-green-600/10 border border-green-600/30 text-green-700 dark:text-green-400 text-sm rounded-sm flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>સેટિંગ્સ સફળતાપૂર્વક અપડેટ થઈ ગઈ છે! (Settings updated successfully)</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-600/10 border border-red-600/30 text-red-600 dark:text-red-400 text-sm rounded-sm flex items-center gap-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="space-y-6">
        {/* General & Logo Section */}
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-sm border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100 font-serif font-bold text-base border-b border-zinc-200 dark:border-zinc-800 pb-2">
            <Globe className="w-4 h-4 text-red-600" />
            <h3>વેબસાઇટ ઓળખ અને લોગો (Branding & Identity)</h3>
          </div>

          <div>
            <label className="block text-xs uppercase font-mono font-bold mb-1.5 text-zinc-700 dark:text-zinc-300">
              સાઇટનું નામ (Site Name) *
            </label>
            <input
              type="text"
              required
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              placeholder="રીયલ ટાઇમ ન્યૂઝ ગુજરાતી (REAL TIME NEWS GUJARATI)"
              className="w-full px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-sm focus:outline-none focus:border-red-600 font-serif"
            />
          </div>

          <div>
            <label className="block text-xs uppercase font-mono font-bold mb-1.5 text-zinc-700 dark:text-zinc-300">
              લોગો URL (Logo Image Path or URL)
            </label>
            <input
              type="text"
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
              placeholder="/logo.png અથવા https://images.unsplash.com/..."
              className="w-full px-3 py-2 text-xs bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-sm focus:outline-none focus:border-red-600 font-mono"
            />
            <p className="text-[11px] text-zinc-400 mt-1">
              ટીપ: જો તમે તમારા કમ્પ્યુટર પરથી લોગો મૂકવા માંગતા હોવ, તો ઇમેજ ફાઇલને `public/logo.png` માં સેવ કરો અને અહીં `/logo.png` લખો.
            </p>
          </div>

          {logoUrl && (
            <div className="p-4 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-sm inline-block">
              <div className="text-xs text-zinc-400 font-mono mb-2">લોગો પ્રિવ્યૂ (Logo Preview):</div>
              <img src={logoUrl} alt="Logo Preview" className="h-12 max-w-xs object-contain" />
            </div>
          )}

          <div>
            <label className="block text-xs uppercase font-mono font-bold mb-1.5 text-zinc-700 dark:text-zinc-300">
              લોગો Alt ટેક્સ્ટ (Logo Alt Text)
            </label>
            <input
              type="text"
              value={logoAlt}
              onChange={(e) => setLogoAlt(e.target.value)}
              placeholder="રીયલ ટાઇમ ન્યૂઝ ગુજરાતી ન્યૂઝ લોગો"
              className="w-full px-3 py-2 text-xs bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-sm focus:outline-none focus:border-red-600"
            />
          </div>

          <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800">
            <label className="flex items-center gap-3 text-xs font-medium cursor-pointer">
              <input
                type="checkbox"
                checked={breakingTickerEnabled}
                onChange={(e) => setBreakingTickerEnabled(e.target.checked)}
                className="rounded text-red-600 focus:ring-red-500 w-4 h-4 cursor-pointer"
              />
              <span>ટોચ પર બ્રેકિંગ ન્યૂઝ ટિકર ચાલુ રાખો (Enable Breaking News Ticker)</span>
            </label>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-sm border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100 font-serif font-bold text-base border-b border-zinc-200 dark:border-zinc-800 pb-2">
            <Share2 className="w-4 h-4 text-red-600" />
            <h3>સોશિયલ મીડિયા લિંક્સ (Social Media Profiles)</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono font-bold mb-1 text-zinc-600 dark:text-zinc-400">
                Twitter / X URL
              </label>
              <input
                type="url"
                value={twitter}
                onChange={(e) => setTwitter(e.target.value)}
                placeholder="https://twitter.com/"
                className="w-full px-3 py-2 text-xs bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-sm focus:outline-none focus:border-red-600"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-bold mb-1 text-zinc-600 dark:text-zinc-400">
                Facebook URL
              </label>
              <input
                type="url"
                value={facebook}
                onChange={(e) => setFacebook(e.target.value)}
                placeholder="https://facebook.com/"
                className="w-full px-3 py-2 text-xs bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-sm focus:outline-none focus:border-red-600"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-bold mb-1 text-zinc-600 dark:text-zinc-400">
                Instagram URL
              </label>
              <input
                type="url"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                placeholder="https://instagram.com/"
                className="w-full px-3 py-2 text-xs bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-sm focus:outline-none focus:border-red-600"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-bold mb-1 text-zinc-600 dark:text-zinc-400">
                YouTube URL
              </label>
              <input
                type="url"
                value={youtube}
                onChange={(e) => setYoutube(e.target.value)}
                placeholder="https://youtube.com/@"
                className="w-full px-3 py-2 text-xs bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-sm focus:outline-none focus:border-red-600"
              />
            </div>
          </div>
        </div>

        {/* Advertisement Slot */}
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-sm border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100 font-serif font-bold text-base border-b border-zinc-200 dark:border-zinc-800 pb-2">
            <DollarSign className="w-4 h-4 text-red-600" />
            <h3>જાહેરાત સ્લોટ કોડ (Sidebar Ad Code / HTML)</h3>
          </div>

          <div>
            <label className="block text-xs font-mono font-bold mb-1 text-zinc-600 dark:text-zinc-400">
              જાહેરાત સ્ક્રિપ્ટ અથવા કસ્ટમ બેનર HTML (Ad Slot HTML)
            </label>
            <textarea
              rows={4}
              value={adCode}
              onChange={(e) => setAdCode(e.target.value)}
              placeholder="<div class='ad-banner'>...</div>"
              className="w-full px-3 py-2 text-xs bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-sm focus:outline-none focus:border-red-600 font-mono"
            />
            <p className="text-[11px] text-zinc-400 mt-1">
              સાઇડબારમાં ૩૦૦x૨૫૦ બેનર અથવા ગૂગલ એડસેન્સ કોડ અહીં પેસ્ટ કરી શકાય છે.
            </p>
          </div>
        </div>
      </div>
    </form>
  );
}
