import { Post, Category, Author, SiteSettings, Revision } from '@/types/sanity';

export const SAMPLE_CATEGORIES: Category[] = [
  {
    _id: 'cat-gujarat',
    _type: 'category',
    title: 'ગુજરાત',
    slug: { _type: 'slug', current: 'gujarat' },
    order: 1,
  },
  {
    _id: 'cat-national',
    _type: 'category',
    title: 'રાષ્ટ્રીય',
    slug: { _type: 'slug', current: 'national' },
    order: 2,
  },
  {
    _id: 'cat-business',
    _type: 'category',
    title: 'વેપાર અને ટેક',
    slug: { _type: 'slug', current: 'business-tech' },
    order: 3,
  },
  {
    _id: 'cat-world',
    _type: 'category',
    title: 'વિશ્વ',
    slug: { _type: 'slug', current: 'world' },
    order: 4,
  },
  {
    _id: 'cat-opinion',
    _type: 'category',
    title: 'મંતવ્ય / વિશ્લેષણ',
    slug: { _type: 'slug', current: 'opinion' },
    order: 5,
  },
];

export const SAMPLE_AUTHORS: Author[] = [
  {
    _id: 'author-1',
    _type: 'author',
    name: 'ધવલ ચૌહાણ',
    bio: 'વરિષ્ઠ પત્રકાર અને સ્થાનિક રાજનીતિ તેમજ શાસન વ્યવસ્થાના વિશેષ વિશ્લેષક.',
    image: {
      alt: 'અંકિતા પટેલ',
      url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    },
  },
  {
    _id: 'author-2',
    _type: 'author',
    name: 'સંજય ભોઈ',
    bio: 'ટેકનોલોજી, સેમિકન્ડક્ટર અને ગુજરાતના ઔદ્યોગિક વિકાસના નિષ્ણાત લેખક.',
    image: {
      alt: 'સંજય જોશી',
      url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    },
  },
];

export const SAMPLE_SETTINGS: SiteSettings = {
  _id: 'siteSettings',
  _type: 'siteSettings',
  siteName: 'રીયલ ટાઇમ ન્યૂઝ ગુજરાતી',
  breakingTickerEnabled: true,
  socialLinks: {
    twitter: 'https://twitter.com',
    facebook: 'https://facebook.com',
    instagram: 'https://instagram.com',
    youtube: 'https://youtube.com',
  },
  adCode: '<div class="p-6 bg-zinc-100 dark:bg-zinc-800 border border-dashed border-zinc-300 dark:border-zinc-700 text-center text-xs text-zinc-500 uppercase tracking-widest font-mono">જાહેરાત જગ્યા • ૩૦૦x૨૫૦</div>',
};

// 5 Sample Posts in Gujarati
export const SAMPLE_POSTS: Post[] = [
  {
    _id: 'post-1',
    _type: 'post',
    title: 'ગુજરાતના રિન્યુએબલ એનર્જી પાર્કનું વિસ્તરણ: કચ્છમાં વિશ્વનો સૌથી મોટો ગ્રીન એનર્જી પ્રોજેક્ટ કાર્યરત',
    slug: { _type: 'slug', current: 'gujarat-renewable-energy-park-kutch-project' },
    summary: 'કચ્છના ખાવડા ખાતે સ્થાપિત વિશાળ સૌર અને પવન ઊર્જા પ્રોજેક્ટથી લાખો ઘરોને સ્વચ્છ વીજળી મળશે, દેશના ગ્રીન મિશનને મોટું બળ મળ્યું.',
    mainImage: {
      url: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&w=1200&q=80',
      alt: 'સૂર્યાસ્ત સમયે પવનચક્કીઓ અને સૌર પેનલ',
      caption: 'કચ્છમાં સ્થાપિત અત્યાધુનિક હાઇબ્રિડ ગ્રીન એનર્જી પ્રોજેક્ટનું દ્રશ્ય.',
    },
    category: SAMPLE_CATEGORIES[0], // ગુજરાત
    tags: ['ગુજરાત', 'સૌરઊર્જા', 'કચ્છ', 'વિકાસ', 'પર્યાવરણ'],
    author: SAMPLE_AUTHORS[2],
    status: 'published',
    publishedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    updatedAt: new Date().toISOString(),
    isBreaking: true,
    isOpinion: false,
    seoTitle: 'કચ્છમાં વિશ્વનો સૌથી મોટો રિન્યુએબલ એનર્જી પ્રોજેક્ટ | રીયલ ટાઇમ ન્યૂઝ ગુજરાતી',
    seoDescription: 'ગુજરાતના કચ્છ ખાતે ગ્રીન એનર્જી ક્ષેત્રે ઐતિહાસિક સિદ્ધિ, સૌર અને પવન ઊર્જાથી વીજળી ઉત્પાદન શરૂ.',
    body: JSON.stringify({
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'ગાંધીનગર/કચ્છ — ગુજરાત સરકારે ઊર્જા ક્ષેત્રે વૈશ્વિક સ્તરે મોટો વિક્રમ સ્થાપ્યો છે. કચ્છના ખાવડા રણ વિસ્તારમાં સ્થાપિત કરવામાં આવી રહેલા ૩૦ ગીગાવોટ ક્ષમતાના વિશાળ હાઇબ્રિડ રિન્યુએબલ એનર્જી પાર્કમાંથી પ્રથમ તબક્કાનું વીજ ઉત્પાદન સત્તાવાર રીતે શરૂ કરી દેવામાં આવ્યું છે.',
            },
          ],
        },
        {
          type: 'heading',
          attrs: { level: 2 },
          content: [{ type: 'text', text: 'દેશના સ્વચ્છ ઊર્જા લક્ષ્યાંકને નવી ઊંચાઈ' }],
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'આ પ્રોજેક્ટથી વાર્ષિક કરોડો ટન કાર્બન ઉત્સર્જનમાં ઘટાડો થશે. સ્થાનિક ગ્રામીણ વિસ્તારોમાં હજારો કુશળ અને અર્ધકુશળ યુવાનો માટે નવી રોજગારીની તકો ઊભી થઈ છે.',
            },
          ],
        },
        {
          type: 'blockquote',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: '“ગુજરાત માત્ર ઔદ્યોગિક વિકાસમાં જ નહીં, પરંતુ પર્યાવરણ લક્ષી ગ્રીન ટેકનોલોજીમાં પણ સમગ્ર દેશનું નેતૃત્વ કરી રહ્યું છે.”',
                },
              ],
            },
          ],
        },
        {
          type: 'heading',
          attrs: { level: 2 },
          content: [{ type: 'text', text: 'પ્રોજેક્ટની મુખ્ય વિશેષતાઓ' }],
        },
        {
          type: 'bulletList',
          content: [
            {
              type: 'listItem',
              content: [{ type: 'paragraph', content: [{ type: 'text', text: 'વિશ્વનો સૌથી વિશાળ સિંગલ-લોકેશન એનર્જી પાર્ક' }] }],
            },
            {
              type: 'listItem',
              content: [{ type: 'paragraph', content: [{ type: 'text', text: '૭૨,૦૦૦ હેક્ટરથી વધુ જમીન પર અત્યાધુનિક પેનલ્સ' }] }],
            },
            {
              type: 'listItem',
              content: [{ type: 'paragraph', content: [{ type: 'text', text: 'હાઇ-વોલ્ટેજ ગ્રીડ કનેક્ટિવિટી મારફતે સીધું વિતરણ' }] }],
            },
          ],
        },
      ],
    }),
  },
  {
    _id: 'post-2',
    _type: 'post',
    title: 'ધોલેરા સેમિકન્ડક્ટર હબ: સ્થાનિક ઇલેક્ટ્રોનિક્સ અને ચીપ ઉત્પાદનમાં ગુજરાતનું ઐતિહાસિક કદમ',
    slug: { _type: 'slug', current: 'dholera-semiconductor-hub-gujarat-industry' },
    summary: 'ધોલેરા સ્પેશિયલ ઇન્વેસ્ટમેન્ટ રીજનમાં અત્યાધુનિક સેમિકન્ડક્ટર ફેબ્રિકેશન પ્લાન્ટનું કામ પૂરજોશમાં, વૈશ્વિક ટેક કંપનીઓનું રોકાણ.',
    mainImage: {
      url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
      alt: 'સેમિકન્ડક્ટર માઇક્રોચીપ અને સર્કિટ',
      caption: 'ધોલેરા ખાતે સ્થાપિત થઈ રહેલી સેમિકન્ડક્ટર ફેબ્રિકેશન ફેસિલિટીનું આયોજન.',
    },
    category: SAMPLE_CATEGORIES[2], // વેપાર અને ટેક
    tags: ['ધોલેરા', 'સેમિકન્ડક્ટર', 'ટેકનોલોજી', 'રોકાણ'],
    author: SAMPLE_AUTHORS[1],
    status: 'published',
    publishedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    updatedAt: new Date().toISOString(),
    isBreaking: false,
    isOpinion: false,
    seoTitle: 'ધોલેરા સેમિકન્ડક્ટર પ્લાન્ટ સાથે ગુજરાત ટેક હબ બનશે | રીયલ ટાઇમ ન્યૂઝ ગુજરાતી',
    seoDescription: 'ધોલેરામાં માઇક્રોચીપ ઉત્પાદન શરૂ થતાં ભારત વૈશ્વિક હાર્ડવેર સપ્લાય ચેઇનમાં મજબૂત સ્થાન મેળવશે.',
    body: JSON.stringify({
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'અમદાવાદ — ધોલેરા સિટી દેશના પ્રથમ સેમિકન્ડક્ટર સિટી તરીકે ઉભરી રહ્યું છે. તાઇવાન અને વૈશ્વિક ટેક દિગ્ગજો સાથેના સંયુક્ત સાહસ હેઠળ ધોલેરા ખાતે નિર્માણ પામી રહેલા ચિપ મેન્યુફેક્ચરિંગ પ્લાન્ટમાં મશીનરી ઇન્સ્ટોલેશન શરૂ થઈ ચૂક્યું છે.',
            },
          ],
        },
        {
          type: 'heading',
          attrs: { level: 2 },
          content: [{ type: 'text', text: 'સ્થાનિક ઇજનેરો માટે સુવર્ણ તક' }],
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'ગુજરાતની અગ્રણી એન્જિનિયરિંગ કોલેજો સાથે એમઓયુ કરીને વિદ્યાર્થીઓને વિશેષ વીએલએસઆઈ અને ચિપ ડિઝાઇનિંગનું તાલીમ મોડ્યુલ પૂરું પાડવામાં આવી રહ્યું છે.',
            },
          ],
        },
      ],
    }),
  },
  {
    _id: 'post-3',
    _type: 'post',
    title: 'ડિજિટલ શાસન અને નાગરિક અધિકાર: સ્થાનિક વહીવટમાં પારદર્શિતા લાવવાનો એકમાત્ર માર્ગ',
    slug: { _type: 'slug', current: 'digital-governance-citizen-rights-opinion' },
    summary: 'જિલ્લા અને ગ્રામ્ય સ્તરે ડિજિટલ પોર્ટલ અને ઇ-સેવાઓ દ્વારા સરકારી યોજનાઓનો સીધો લાભ લોકો સુધી પહોંચાડવાની તાતી જરૂરિયાત.',
    mainImage: {
      url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
      alt: 'ડિજિટલ ટેકનોલોજી અને નેટવર્ક',
      caption: 'સ્થાનિક શાસનમાં આધુનિક ડિજિટલ પ્રણાલી પારદર્શિતા વધારવામાં મદદરૂપ બને છે.',
    },
    category: SAMPLE_CATEGORIES[4], // મંતવ્ય
    tags: ['વિશ્લેષણ', 'મંતવ્ય', 'ડિજિટલશાસન', 'પારદર્શિતા'],
    author: SAMPLE_AUTHORS[0],
    status: 'published',
    publishedAt: new Date(Date.now() - 3600000 * 8).toISOString(),
    updatedAt: new Date().toISOString(),
    isBreaking: false,
    isOpinion: true, // OPINION
    seoTitle: 'સ્થાનિક શાસનમાં ડિજિટલ ક્રાંતિ — વિશેષ સંપાદકીય લેખ',
    seoDescription: 'અંકિતા પટેલનો વિશેષ લેખ: સરકારી તંત્ર અને સામાન્ય નાગરિક વચ્ચે પારદર્શિતા વધારવા ડિજિટલ સાધનો કેમ અનિવાર્ય છે.',
    body: JSON.stringify({
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'લોકશાહીની સાચી સફળતા ત્યારે જ શક્ય બને છે જ્યારે સામાન્યમાં સામાન્ય નાગરિકને સરકારી કચેરીઓના ધક્કા ખાધા વિના તેના હક્ક અને યોજનાઓના લાભ સમયસર મળે. આ દિશામાં ડિજિટલ ગવર્નન્સ સૌથી મોટું પરિવર્તનકારી પરિબળ સાબિત થઈ રહ્યું છે.',
            },
          ],
        },
        {
          type: 'heading',
          attrs: { level: 2 },
          content: [{ type: 'text', text: 'પારદર્શિતા અને જવાબદેહી' }],
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'જ્યારે યોજનાઓની ફાઈલો અને અરજીઓનું રીયલ-ટાઇમ ટ્રેકિંગ ઉપલબ્ધ થાય છે, ત્યારે વચેટિયાઓની ભૂમિકા આપમેળે શૂન્ય થઈ જાય છે. નાગરિકોનો વિશ્વાસ શાસન વ્યવસ્થા પર દ્રઢ બને છે.',
            },
          ],
        },
      ],
    }),
  },
  {
    _id: 'post-4',
    _type: 'post',
    title: 'ખેડૂતો માટે ખુશખબર: નર્મદા કેનાલ કમાન્ડ એરિયામાં સિંચાઈ માટે વધારાનું પાણી છોડવાનો નિર્ણય',
    slug: { _type: 'slug', current: 'narmada-canal-irrigation-water-release' },
    summary: 'ઉત્તર ગુજરાત અને સૌરાષ્ટ્રના લાખો હેક્ટર કૃષિ વિસ્તારને રવિ પાકની સિંચાઈ માટે પૂરતું પાણી ઉપલબ્ધ કરાવવામાં આવશે.',
    mainImage: {
      url: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=1200&q=80',
      alt: 'ખેતરમાં લહેરાતો પાક અને સિંચાઈ કેનાલ',
      caption: 'નર્મદા મુખ્ય નહેર મારફતે સૌરાષ્ટ્ર અને ઉત્તર ગુજરાતના જળાશયોમાં પાણી ભરવામાં આવી રહ્યું છે.',
    },
    category: SAMPLE_CATEGORIES[0], // ગુજરાત
    tags: ['નર્મદા', 'ખેતી', 'સિંચાઈ', 'સૌરાષ્ટ્ર'],
    author: SAMPLE_AUTHORS[0],
    status: 'published',
    publishedAt: new Date(Date.now() - 3600000 * 14).toISOString(),
    updatedAt: new Date().toISOString(),
    isBreaking: false,
    isOpinion: false,
    seoTitle: 'નર્મદા કેનાલમાંથી સિંચાઈનું પાણી છોડાયું | રીયલ ટાઇમ ન્યૂઝ ગુજરાતી',
    seoDescription: 'ગુજરાતના ખેડૂતો માટે રાહતના સમાચાર, રવિ પાક માટે નર્મદા જળ વિતરણનું સમયપત્રક જાહેર.',
    body: JSON.stringify({
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'સરદાર સરોવર નર્મદા નિગમ લિમિટેડ દ્વારા રાજ્યના ખેડૂતોના હિતમાં મહત્વનો નિર્ણય લેવામાં આવ્યો છે. જળાશયમાં પર્યાપ્ત જળસ્તર હોવાને કારણે સૌરાષ્ટ્ર બ્રાન્ચ કેનાલ અને કચ્છ બ્રાન્ચ કેનાલમાં સિંચાઈ માટે પૂર્ણ ક્ષમતાથી પાણી વહેવડાવવામાં આવશે.',
            },
          ],
        },
      ],
    }),
  },
  {
    _id: 'post-5',
    _type: 'post',
    title: 'વૈશ્વિક વેપાર પરિષદ: ભારતીય બંદરો અને લોજિસ્ટિક્સ ક્ષેત્રે નવી કનેક્ટિવિટી યોજનાઓ જાહેર',
    slug: { _type: 'slug', current: 'global-trade-summit-indian-ports-connectivity' },
    summary: 'મુંદ્રા અને કંડલા સહિતના મુખ્ય પોર્ટ્સ પરથી નિકાસ વેગવંત કરવા આધુનિક રેલ-કોરિડોર અને કાર્ગો ટર્મિનલનું નિર્માણ થશે.',
    mainImage: {
      url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80',
      alt: 'દરિયામાં જહાજ અને પોર્ટ કાર્ગો કન્ટેનર્સ',
      caption: 'મુખ્ય પોર્ટ્સ પરથી વૈશ્વિક કાર્ગો શિપિંગ માટે આધુનિક ઈન્ફ્રાસ્ટ્રક્ચર.',
    },
    category: SAMPLE_CATEGORIES[3], // વિશ્વ
    tags: ['વેપાર', 'પોર્ટ', 'કાર્ગો', 'અર્થતંત્ર'],
    author: SAMPLE_AUTHORS[1],
    status: 'published',
    publishedAt: new Date(Date.now() - 3600000 * 20).toISOString(),
    updatedAt: new Date().toISOString(),
    isBreaking: false,
    isOpinion: false,
    seoTitle: 'ભારતીય પોર્ટ્સ અને કાર્ગો વેપારમાં નવી તેજી | રીયલ ટાઇમ ન્યૂઝ ગુજરાતી',
    seoDescription: 'ગ્લોબલ સપ્લાય ચેઇનમાં ભારતના દરિયાઈ વેપાર માર્ગોની મહત્વપૂર્ણ ભૂમિકા અંગે અહેવાલ.',
    body: JSON.stringify({
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'આંતરરાષ્ટ્રીય મેરીટાઇમ સમિટમાં કંડલા, મુંદ્રા અને દહેજ બંદરોને આંતરિક ઔદ્યોગિક કોરિડોર સાથે જોડવા માટે હાઇ-સ્પીડ ફ્રેઇટ કનેક્ટિવિટીને મંજૂરી આપવામાં આવી છે.',
            },
          ],
        },
      ],
    }),
  },
];

export const SAMPLE_REVISIONS: Revision[] = [
  {
    _id: 'rev-1',
    _type: 'revision',
    postId: 'post-1',
    titleSnapshot: 'ગુજરાતના રિન્યુએબલ એનર્જી પાર્કનું વિસ્તરણ: કચ્છમાં સૌર પ્રોજેક્ટ',
    summarySnapshot: 'કચ્છના ખાવડા ખાતે સ્થાપિત વિશાળ સૌર અને પવન ઊર્જા પ્રોજેક્ટ શરૂ.',
    bodySnapshot: JSON.stringify({
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'ગાંધીનગર/કચ્છ — ગુજરાત સરકારે ઊર્જા ક્ષેત્રે મોટો નિર્ણય કર્યો છે. કચ્છના ખાવડા વિસ્તારમાં વિશાળ હાઇબ્રિડ રિન્યુએબલ એનર્જી પાર્ક શરૂ કરાયો.',
            },
          ],
        },
      ],
    }),
    savedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    authorEmail: 'admin@chronicle.local',
  },
  {
    _id: 'rev-2',
    _type: 'revision',
    postId: 'post-1',
    titleSnapshot: 'ગુજરાતના રિન્યુએબલ એનર્જી પાર્કનું વિસ્તરણ: કચ્છમાં વિશ્વનો સૌથી મોટો ગ્રીન એનર્જી પ્રોજેક્ટ કાર્યરત',
    summarySnapshot: 'કચ્છના ખાવડા ખાતે સ્થાપિત વિશાળ સૌર અને પવન ઊર્જા પ્રોજેક્ટથી લાખો ઘરોને સ્વચ્છ વીજળી મળશે, દેશના ગ્રીન મિશનને મોટું બળ મળ્યું.',
    bodySnapshot: SAMPLE_POSTS[0].body,
    savedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    authorEmail: 'admin@chronicle.local',
  },
];
