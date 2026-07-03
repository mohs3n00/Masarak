export interface HomepageSettings {
  hero: {
    title: string;
    subtitle: string;
    description: string;
    buttonText: string;
    buttonLink: string;
  };
  featuredCourses: {
    title: string;
    subtitle: string;
  };
}

const DEFAULT_HOMEPAGE_SETTINGS: HomepageSettings = {
  hero: {
    title: "ابدأ رحلتك التعليمية | مع مسارك",
    subtitle: "منصة تعليمية حديثة تساعدك على التعلم بسهولة.",
    description: "كل ما يحتاجه طالب الثانوية العامة في مكان واحد. فيديوهات شرح، مراجعات، امتحانات، وواجبات لضمان التفوق.",
    buttonText: "ابدأ الآن",
    buttonLink: "/courses",
  },
  featuredCourses: {
    title: "الكورسات المميزة",
    subtitle: "أفضل الكورسات اللي هتساعدك تقفل المادة",
  }
};

export async function fetchHomepageSettings(): Promise<HomepageSettings> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/settings/homepage`, {
      next: { revalidate: 60 } // Cache for 60 seconds
    });
    
    if (!res.ok) return DEFAULT_HOMEPAGE_SETTINGS;

    const data = await res.json();
    
    if (!data || data.length === 0) return DEFAULT_HOMEPAGE_SETTINGS;

    const heroSection = data.find((item: any) => item.section === 'HERO');
    const featuredSection = data.find((item: any) => item.section === 'FEATURED_COURSES');

    return {
      hero: {
        title: heroSection?.title || DEFAULT_HOMEPAGE_SETTINGS.hero.title,
        subtitle: heroSection?.subtitle || DEFAULT_HOMEPAGE_SETTINGS.hero.subtitle,
        description: heroSection?.description || DEFAULT_HOMEPAGE_SETTINGS.hero.description,
        buttonText: heroSection?.buttonText || DEFAULT_HOMEPAGE_SETTINGS.hero.buttonText,
        buttonLink: heroSection?.buttonLink || DEFAULT_HOMEPAGE_SETTINGS.hero.buttonLink,
      },
      featuredCourses: {
        title: featuredSection?.title || DEFAULT_HOMEPAGE_SETTINGS.featuredCourses.title,
        subtitle: featuredSection?.subtitle || DEFAULT_HOMEPAGE_SETTINGS.featuredCourses.subtitle,
      }
    };
  } catch (error) {
    console.error('Failed to fetch homepage settings', error);
    return DEFAULT_HOMEPAGE_SETTINGS;
  }
}

export interface FooterConfigItem {
  id: string;
  platform: string;
  value: string;
  icon?: string;
  isActive: boolean;
}

const DEFAULT_FOOTER_SETTINGS: FooterConfigItem[] = [
  { id: '1', platform: 'FACEBOOK', value: 'https://facebook.com/masarak', isActive: true },
  { id: '2', platform: 'WHATSAPP', value: '+201234567890', isActive: true },
  { id: '3', platform: 'EMAIL', value: 'support@masarak.com', isActive: true },
  { id: '4', platform: 'ADDRESS', value: 'القاهرة، مصر', isActive: true },
];

export async function fetchFooterSettings(): Promise<FooterConfigItem[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/settings/footer`, {
      next: { revalidate: 60 }
    });

    if (!res.ok) return DEFAULT_FOOTER_SETTINGS;

    const data = await res.json();
    if (!data || data.length === 0) return DEFAULT_FOOTER_SETTINGS;

    return data;
  } catch (error) {
    console.error('Failed to fetch footer settings', error);
    return DEFAULT_FOOTER_SETTINGS;
  }
}
