import type { LayoutContent, Locale, PageDoc } from '@/lib/content/types';

/**
 * Default content per locale.
 *
 * `layout` is the zero-CMS fallback for shared chrome; `pages` maps slugs to
 * page documents used when no Keystatic page exists for a route. A fresh
 * checkout renders complete pages with no CMS content on disk.
 */

const enLayout: LayoutContent = {
  brand: 'analytt',
  brandEmphasis: 'digital',
  navLinks: [
    { label: 'Services', href: '/#capabilities' },
    { label: 'Process', href: '/#process' },
    { label: 'Work', href: '/#work' },
    { label: 'Insights', href: '/#insights' },
  ],
  navCta: 'Get a free audit',
  navCtaHref: '/#contact',
  footerHeadline: 'Ready to see exactly where your growth is hiding?',
  footerCta: 'Start with a free audit',
  footerCtaHref: '/#contact',
  tagline: 'Performance marketing & growth infrastructure, from Nairobi.',
  footnote: 'A measurement-first agency, by design.',
  footerColumns: [
    {
      title: 'Navigate',
      links: [
        { label: 'Services', href: '/#capabilities' },
        { label: 'Process', href: '/#process' },
        { label: 'Work', href: '/#work' },
        { label: 'Insights', href: '/#insights' },
      ],
    },
    {
      title: 'Contact',
      links: [
        { label: 'hello@analyttdigital.com', href: 'mailto:hello@analyttdigital.com' },
        { label: 'Request an audit', href: '/#contact' },
      ],
    },
  ],
  contactEmail: 'hello@analyttdigital.com',
  contactNote: 'Nairobi · across East Africa',
  legal: '© 2026 Analytt Digital. All rights reserved.',
};

const enHome: PageDoc = {
  title: 'home',
  description:
    'A data-driven performance marketing agency in Kenya helping startups and small businesses turn ad spending into measurable growth.',
  sections: [
    {
      type: 'hero',
      eyebrow: 'NAIROBI — ACROSS EAST AFRICA',
      headline: 'Ad spend, turned into\nmeasurable growth.',
      sub: 'Analytt Digital is a performance marketing partner for startups and small businesses — paid media, measurement and growth strategy, all tracked to revenue.',
      cta: 'Start with a free audit',
      ctaHref: '/#contact',
      marquee: [
        'GOOGLE ADS',
        'META',
        'YOUTUBE',
        'TIKTOK',
        'LINKEDIN',
        'GA4 + GTM',
        '90-DAY GROWTH PLANS',
        'MONTHLY REPORTS',
      ],
    },
    {
      type: 'problem',
      eyebrow: 'THE PROBLEM',
      headline: 'The spend was never the problem.',
      paragraphs: [
        'Kenyan businesses already know they should be on Google, Meta and TikTok — the budgets are there. What is scarce is the call: which channels deserve money, which funnels leak, and what each shilling actually returns.',
        'Most reports stop at reach and impressions. The decision — where the next shilling goes — gets made on gut feel. That gap between reporting and revenue is where growth stalls.',
      ],
      closing: 'Analytt Digital exists to close that gap.',
    },
    {
      type: 'belief',
      eyebrow: 'WHAT WE BELIEVE',
      headline: 'The value of data is the decision, not the dashboard.',
      points: [
        {
          title: 'Attribution before amplification',
          body: 'Pixels, conversions and dashboards are set up before a single campaign goes live. If it cannot be measured, it is not launched.',
        },
        {
          title: 'Decisions over deliverables',
          body: 'Every report ends in a clear next action — what to scale, what to cut, what to test next. No vanity metrics.',
        },
        {
          title: 'Built for your team',
          body: 'The engagement is finished when your team can read the numbers and make the next call without us.',
        },
      ],
    },
    {
      type: 'process',
      eyebrow: 'HOW WE WORK',
      chapterTitle: 'PROCESS',
      steps: [
        {
          title: 'Diagnose.',
          body: 'A deep audit of spend, tracking, funnels and competitive position. We find where the money and the data are leaking before anything else moves.',
        },
        {
          title: 'Blueprint.',
          body: 'A custom performance plan with defined KPIs, channel mix, budget allocation and 90-day targets — built for your market, not a template.',
        },
        {
          title: 'Launch.',
          body: 'Campaigns go live with full measurement in place: pixels, conversions, attribution windows and a live dashboard — all before day one.',
        },
        {
          title: 'Optimise.',
          body: 'Weekly reviews. Every data point informs the next decision. We test relentlessly until the winning formula is proven.',
        },
        {
          title: 'Scale.',
          body: 'Once performance is proven, budget, channels and markets expand systematically. Growth becomes predictable, not accidental.',
        },
      ],
    },
    {
      type: 'capabilities',
      eyebrow: 'OUR SERVICES',
      headline: 'Performance-led services,\nmeasured to the shilling.',
      items: [
        {
          tag: 'PAID MEDIA',
          title: 'Paid Media & Performance Advertising',
          body: 'Google, YouTube, Meta, TikTok and LinkedIn campaigns engineered for acquisition — every shilling tracked to revenue, across East Africa.',
        },
        {
          tag: 'MEASUREMENT',
          title: 'Data, Analytics & Attribution',
          body: 'GA4, Google Tag Manager, server-side tracking and multi-touch attribution built and audited by hand. The layer most agencies skip.',
        },
        {
          tag: 'STRATEGY',
          title: 'Growth & Demand Strategy',
          body: 'Market sizing, channel-mix modelling and clear 90-day plans that fix broken funnels and lower cost-per-lead.',
        },
        {
          tag: 'CONTENT',
          title: 'Content, SEO & Reporting',
          body: 'Content creation, posting calendars, organic growth and monthly performance reports your whole team can act on.',
        },
      ],
    },
    {
      type: 'work',
      eyebrow: 'CLIENT RESULTS',
      headline: 'Proof, not promises.',
      cases: [
        {
          client: 'Mandevu BeardCare',
          industry: 'Retail · Nairobi',
          headline: 'From KES 80K/mo in losses to KES 2.4M in monthly revenue.',
          body: 'A Nairobi retailer was spending KES 200K/month on Meta Ads with zero attribution and a 1.1x ROAS. We rebuilt the tracking stack, restructured the ad account and launched Kenya-specific creatives. Within 90 days they were profitable at scale.',
          metric: '2.4M',
          metricLabel: 'KES monthly revenue within 90 days',
        },
        {
          client: 'ZoomTech Ke',
          industry: 'Technology',
          headline: '1,200+ qualified leads per month at KES 280 CPL.',
          body: 'A licensed tech company was paying over KES 1,800 per unqualified lead through Google Search. We restructured keywords, built intent-segmented landing pages and integrated lead scoring. CPL dropped 84% in 60 days.',
          metric: '-84%',
          metricLabel: 'cost per lead in 60 days',
        },
        {
          client: 'Kings Bliss Developers',
          industry: 'Real Estate',
          headline: '37 property inquiries per week from a KES 150K budget.',
          body: 'A real estate developer generating 3–4 leads a week from generic boosted posts. We built a full-funnel campaign with virtual tours, retargeting sequences and WhatsApp lead follow-up. Inquiries grew 9x.',
          metric: '9×',
          metricLabel: 'growth in weekly inquiries',
        },
        {
          client: 'Mabati Yetu',
          industry: 'Logistics',
          headline: 'Page 1 rankings for 47 high-intent keywords in 8 months.',
          body: 'A logistics company with zero organic presence. We built a Kenyan-search content strategy, a technical SEO foundation and product landing pages. Organic became their highest-converting channel.',
          metric: '47',
          metricLabel: 'page-1 keywords in 8 months',
        },
      ],
    },
    {
      type: 'stats',
      eyebrow: 'OUR PHILOSOPHY',
      headline: "Data is not a dashboard. It's your competitive edge.",
      body: 'In a market where most agencies still report reach and impressions, we treat data as a strategic asset — the thing that separates agencies who guess from agencies who know.',
      stats: [
        { value: '100%', label: 'Campaigns tracked to conversion' },
        { value: '7-day', label: 'Optimization cycle' },
        { value: 'Zero', label: 'Vanity metrics reported' },
        { value: '8+ yrs', label: 'Of driving growth worldwide' },
      ],
    },
    {
      type: 'industries',
      eyebrow: 'SECTORS',
      headline: 'Industries we have grown.',
      body: 'From scaling e-commerce in Nairobi to expanding logistics into Kampala and Dar es Salaam — we have helped brands like yours generate revenue faster, and prove it.',
      items: [
        'Real Estate',
        'E-commerce',
        'FMCG',
        'Retail',
        'B2B',
        'SaaS',
        'Education',
        'Logistics',
        'Technology',
        'Beauty',
        'Restaurants',
        'Travel',
        'Insurance',
      ],
    },
    {
      type: 'insights',
      eyebrow: 'INSIGHTS',
      headline: 'Notes from the data.',
      articles: [
        {
          index: '01',
          title: 'Why your CPA doubles every December',
          description:
            'East African auction prices spike with holiday competition. Here is the budget structure that keeps Q4 profitable.',
          href: '#',
        },
        {
          index: '02',
          title: 'The 90-day plan template we actually use',
          description:
            'How a growth sprint is structured: diagnosis week one, quick wins by day 30, compounding systems by day 90.',
          href: '#',
        },
        {
          index: '03',
          title: 'Attribution is a purchase decision',
          description:
            'Server-side tracking, consent mode and what changes when Meta loses the pixel signal.',
          href: '#',
        },
      ],
    },
    {
      type: 'cta',
      eyebrow: 'START GROWING',
      headline: 'Most businesses find KES 50K–200K in recoverable spend in the first audit.',
      body: 'We will audit your current marketing setup for free — no obligation — and show you precisely where budget is being wasted and where your biggest opportunities lie.',
      cta: 'Request a free digital audit',
      ctaHref: 'mailto:hello@analyttdigital.com',
      note: 'No deck. No obligation. Just the findings.',
    },
  ],
};

const swLayout: LayoutContent = {
  brand: 'analytt',
  brandEmphasis: 'digital',
  navLinks: [
    { label: 'Huduma', href: '/sw#capabilities' },
    { label: 'Mchakato', href: '/sw#process' },
    { label: 'Kazi', href: '/sw#work' },
    { label: 'Maarifa', href: '/sw#insights' },
  ],
  navCta: 'Pata ukaguzi wa bure',
  navCtaHref: '/sw#contact',
  footerHeadline: 'Uko tayari kuona wako uko wapi ukuaji unafichwa?',
  footerCta: 'Anza na ukaguzi wa bure',
  footerCtaHref: '/sw#contact',
  tagline: 'Uuzaji wa utendaji na miundombinu ya ukuaji, kutoka Nairobi.',
  footnote: 'Shirika linalopima kwanza, kwa makusudi.',
  footerColumns: [
    {
      title: 'Vinjari',
      links: [
        { label: 'Huduma', href: '/sw#capabilities' },
        { label: 'Mchakato', href: '/sw#process' },
        { label: 'Kazi', href: '/sw#work' },
        { label: 'Maarifa', href: '/sw#insights' },
      ],
    },
    {
      title: 'Mawasiliano',
      links: [
        { label: 'hello@analyttdigital.com', href: 'mailto:hello@analyttdigital.com' },
        { label: 'Omba ukaguzi', href: '/sw#contact' },
      ],
    },
  ],
  contactEmail: 'hello@analyttdigital.com',
  contactNote: 'Nairobi · Afrika Mashariki',
  legal: '© 2026 Analytt Digital. Haki zote zimehifadhiwa.',
};

const swHome: PageDoc = {
  title: 'home',
  description: 'Analytt Digital — mshirika wa uuzaji wa utendaji unaoongozwa na data nchini Kenya.',
  sections: [
    {
      type: 'hero',
      eyebrow: 'NAIROBI — AFRIKA MASHARIKI',
      headline: 'Matumizi ya matangazo,\nyakuwe ukuaji unaoipimika.',
      sub: 'Analytt Digital ni mshirika wa uuzaji wa utendaji kwa biashara zinazoanzishwa na ndogo — matangazo ya kulipwa, vipimo na mkakati wa ukuaji, vyote vinavyofuatiliwa hadi mapato.',
      cta: 'Anza na ukaguzi wa bure',
      ctaHref: '/sw#contact',
      marquee: [
        'GOOGLE ADS',
        'META',
        'YOUTUBE',
        'TIKTOK',
        'LINKEDIN',
        'GA4 + GTM',
        'MPANGO WA SIKU 90',
        'RIPOTI ZA KILA MWEZI',
      ],
    },
    {
      type: 'problem',
      eyebrow: 'TATIZO',
      headline: 'Matumizi hayakuwa tatizo.',
      paragraphs: [
        'Biashara za Kenya tayari zinajua ziko Google, Meta na TikTok — bajeti zipo. Kinachokosekana ni uamuzi: ni mchakato upi unaostahili pesa, ni funnels zipi zinavuja, na kila shilingi inarudisha nini.',
        'Ripoti nyingi zinaishia kwa wanaofikia na wanaoona. Uamuzi — shilingi inayofuata inakwenda wapi — unafanywa kwa mtazamo. Tofauti hiyo kati ya ripoti na mapato ndipo ukuaji unakwama.',
      ],
      closing: 'Analytt Digital ipo kufunga mapengo hayo.',
    },
    {
      type: 'belief',
      eyebrow: 'TUNACHOAMINI',
      headline: 'Thamani ya data ni uamuzi, si dashibodi.',
      points: [
        {
          title: 'Ufuatiliaji kwanza, uenezaji baadaye',
          body: 'Pixels, conversions na dashibodi zinawekwa tayari kabla kampeni moja haijaanzishwa. Isiyopimika, haizinduiwi.',
        },
        {
          title: 'Maamuzi, si makaratasi',
          body: 'Kila ripoti inaisha na hatua inayofuata — cha kuongeza, cha kupunguza, cha kujaribu. Hakuna vipimo vya umbo.',
        },
        {
          title: 'Imejengwa kwa timu yako',
          body: 'Kazi inaisha timu yako inapoweza kusoma namba na kufanya uamuzi unaofuata bila sisi.',
        },
      ],
    },
    {
      type: 'process',
      eyebrow: 'TUNAVYOFANYA KAZI',
      chapterTitle: 'MCHAKATO',
      steps: [
        {
          title: 'Chunguza.',
          body: 'Ukaguzi wa kina wa matumizi, ufuatiliaji, na nafasi ya ushindani. Tunapakia wapi pesa na data zinavuja kabla ya hatua nyingine.',
        },
        {
          title: 'Panga.',
          body: 'Mpango maalum wa utendaji na KPI, mchanganyiko wa chaneli, ugawaji wa bajeti na malengo ya siku 90 — kwa soko lako.',
        },
        {
          title: 'Zindua.',
          body: 'Kampeni zinaanza na vipimo kamili: pixels, conversions na dashibodi — zote kabla ya siku ya kwanza.',
        },
        {
          title: 'Boresha.',
          body: 'Mapitio ya kila wiki. Kila data inaleta uamuzi mpya. Tunajaribu bila kuchoka hadi formula imethibitika.',
        },
        {
          title: 'Panua.',
          body: 'Utendaji unapothibitika, bajeti, chaneli na masoko zinapanuliwa kwa mpangilio. Ukuaji unakuwa wa kutabirika.',
        },
      ],
    },
    {
      type: 'capabilities',
      eyebrow: 'HUDUMA ZETU',
      headline: 'Huduma za utendaji,\nzinazopimwa kwa shilingi.',
      items: [
        {
          tag: 'MATANGAZO',
          title: 'Matangazo ya Kulipwa',
          body: 'Kampeni za Google, YouTube, Meta, TikTok na LinkedIn zilizoundwa kupata wateja — kila shilingi inafuatiliwa hadi mapato.',
        },
        {
          tag: 'VIPIMO',
          title: 'Data, Uchambuzi na Sifa',
          body: 'GA4, Google Tag Manager, ufuatiliaji wa server-side na sifa ya ncha nyingi — iliyoundwa kwa mkono. Tabaka ambalo wengi wunaruka.',
        },
        {
          tag: 'MKAKATI',
          title: 'Mkakati wa Ukuaji',
          body: 'Upimaji wa soko, mchanganyiko wa chaneli na mipango ya wazi ya siku 90 inayotengeneza funnels na kupunguza gharama kwa kila mteja.',
        },
        {
          tag: 'MAUDHUI',
          title: 'Maudhui, SEO na Ripoti',
          body: 'Uundaji wa maudhui, kalenda za machapisho, ukuaji wa asili na ripoti za utendaji za kila mwezi ambazo timu yako inaweza kutumia.',
        },
      ],
    },
    {
      type: 'work',
      eyebrow: 'MATOKEO YA WATEJA',
      headline: 'Ushahidi, si ahadi.',
      cases: [
        {
          client: 'Mandevu BeardCare',
          industry: 'Reja Reja · Nairobi',
          headline: 'Kutokana na hasara za KES 80K/mwezi hadi mapato ya KES 2.4M.',
          body: 'Muuzaji wa Nairobi alitumia KES 200K/mwezi kwenye Meta Ads bila sifa na ROAS ya 1.1x. Tukajenga upya mfumo wa ufuatiliaji na kuweka kampeni maalum kwa Kenya. Ndani ya siku 90 walikuwa na faida.',
          metric: '2.4M',
          metricLabel: 'KES mapato ya mwezi ndani ya siku 90',
        },
        {
          client: 'ZoomTech Ke',
          industry: 'Teknolojia',
          headline: 'Wateja zaidi ya 1,200 kwa mwezi kwa KES 280 kila mmoja.',
          body: 'Kampuni ya teknolojia ililipa zaidi ya KES 1,800 kwa kila mteja asiye halali kutoka Google Search. Tukapanga maneno, kujenga kurasa na kuunganisha uchambuzi wa lead. Gharama ilishuka 84% ndani ya siku 60.',
          metric: '-84%',
          metricLabel: 'gharama kwa mteja ndani ya siku 60',
        },
        {
          client: 'Kings Bliss Developers',
          industry: 'Ardhi na Nyumba',
          headline: 'Maswali 37 ya nyumba kwa wiki kwa bajeti ya KES 150K.',
          body: 'Msanidi wa ardhi alipata maswali 3–4 kwa wiki kutokana na machapisho ya kawaida. Tukajenga kampeni ya funnel kamili na ziara za mtandaoni na ufuatiliaji wa WhatsApp. Maswali yaliongezwa mara 9.',
          metric: '9×',
          metricLabel: 'kuongezeka kwa maswali ya wiki',
        },
        {
          client: 'Mabati Yetu',
          industry: 'Usafirishaji',
          headline: 'Uorodeshaji wa ukurasa wa kwanza kwa maneno 47 ya nia kuu.',
          body: 'Kampuni ya usafirishaji ilikuwa haiwiani mtandaoni. Tukajenga mkakati wa maudhui wa utafutaji wa Kenya, msingi wa kiufundi wa SEO na kurasa za bidhaa. Tija ya asili ikawa chaneli bora zaidi.',
          metric: '47',
          metricLabel: 'maneno ya ukurasa wa kwanza ndani ya miezi 8',
        },
      ],
    },
    {
      type: 'stats',
      eyebrow: 'FALSIFA ZETU',
      headline: 'Data si dashibodi. Ni faida yako ya ushindani.',
      body: 'Katika soko ambapo mashirika mengi bado yaripoti ufanisi wa kufikia, tunachukulia data kama mali ya kimkakati — kitu kinachotenganisha mashirika yanayokadiri na yanayojua.',
      stats: [
        { value: '100%', label: 'Kampeni zinafuatiliwa hadi conversion' },
        { value: 'Siku 7', label: 'Mzunguko wa kuboresha' },
        { value: 'Sifuri', label: 'Vipimo vya umbo vinaripotiwa' },
        { value: 'Miaka 8+', label: 'Ya kuendeleza ukuaji duniani' },
      ],
    },
    {
      type: 'industries',
      eyebrow: 'SEKTA',
      headline: 'Sekta tulizokuza.',
      body: 'Kutoka e-commerce Nairobi hadi usafirishaji Kampala na Dar es Salaam — tumeonyesha kizazi cha haraka cha mapato, na kuthibitisha.',
      items: [
        'Ardhi na Nyumba',
        'Duka la Mtandaoni',
        'FMCG',
        'Reja Reja',
        'B2B',
        'SaaS',
        'Elimu',
        'Usafirishaji',
        'Teknolojia',
        'Uberi',
        'Mahoteli',
        'Usafiri',
        'Bima',
      ],
    },
    {
      type: 'insights',
      eyebrow: 'MAARIFA',
      headline: 'Maelezo kutoka kwenye data.',
      articles: [
        {
          index: '01',
          title: 'Kwa nini CPA yako inaongezeka kila Desemba',
          description:
            'Bei za zabuni za Afrika Mashariki zinapanda na ushindani wa likizo. Hii ndiyo muundo wa bajeti unaozalisha faida ya Q4.',
          href: '#',
        },
        {
          index: '02',
          title: 'Kigezo cha mpango wa siku 90 tunachotumia',
          description:
            'Jinsi gurudumu la ukuaji limepangwa: utambuzi wiki ya kwanza, matokeo ifikapo siku 30, mifumo inayokua ifikapo siku 90.',
          href: '#',
        },
        {
          index: '03',
          title: 'Sifa ni uamuzi wa ununuzi',
          description: 'Ufuatiliaji wa server-side, hali ya ridhaa, na kinachobadilika Meta inapopoteza ishara ya pixel.',
          href: '#',
        },
      ],
    },
    {
      type: 'cta',
      eyebrow: 'ANZA KUKUA',
      headline: 'Wengi hupata KES 50K–200K zinazorejelewa katika ukaguzi wa kwanza.',
      body: 'Tutakagulia mipangilio yako ya sasa ya soko bila malipo — bila wajibu — na kukuonyesha wapi bajeti inapotea na wapi fursa kubwa zipo.',
      cta: 'Omba ukaguzi wa dijitali wa bure',
      ctaHref: 'mailto:hello@analyttdigital.com',
      note: 'Hakuna deck. Hakuna wajibu. Matokeo tu.',
    },
  ],
};

export const defaults: Record<Locale, { layout: LayoutContent; pages: Record<string, PageDoc> }> = {
  en: { layout: enLayout, pages: { home: enHome } },
  sw: { layout: swLayout, pages: { home: swHome } },
};
