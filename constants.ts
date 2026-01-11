
import { SectionType, TabId, SectionConfig, PortfolioItem } from './types';

export const SECTIONS: SectionConfig[] = [
  {
    id: SectionType.TYPE,
    tabs: [
      { id: TabId.EDITORIAL, label: 'Editorial' },
      { id: TabId.SOCIAL, label: 'Social' },
      { id: TabId.PROMOTIONAL, label: 'Promotional' },
    ],
  },
  {
    id: SectionType.FORMAT,
    tabs: [
      { 
        id: TabId.MUSINGS, 
        label: 'Musings',
        subFilters: ['All', 'Static', 'Storytelling', 'Thread']
      },
      { 
        id: TabId.REELS, 
        label: 'Reels',
        subFilters: ['All', 'Animated', 'Vox Pop', 'Trend', 'Documentary', 'Character Sketch']
      },
      { 
        id: TabId.CAROUSELS, 
        label: 'Carousels',
        subFilters: ['All', 'Static', 'Thread', 'Explanatory', 'Informational', 'Entertaining']
      },
      { id: TabId.SCRIPTS, label: 'Scripts' },
    ],
  },
];

export const PORTFOLIO_ITEMS: PortfolioItem[] = [
  // --- PROMOTIONAL ---
  {
    id: 'prom-1',
    title: 'Pookie (Maybelline New York x TTT)',
    description: 'A vibrant collaboration with Maybelline New York. Capturing the "Pookie" aesthetic with high-energy visuals and witty copy that resonated with the beauty community.',
    contentType: 'Promotional',
    contentFormat: 'Static Carousel',
    contentStyle: 'Musing',
    brand: 'Terribly Tiny Tales',
    imageUrl: 'https://images.unsplash.com/photo-1596462502278-27bfdd403348?q=80&w=2940&auto=format&fit=crop',
    media: [
        { type: 'image', url: 'https://drive.google.com/file/d/1lGWXBfKBs_f9iVeFFfnNHwybJKGY1Q_O/view?usp=drive_link' },
        { type: 'image', url: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=2870&auto=format&fit=crop' }
    ],
    date: 'May 2024',
    instagramLink: 'https://www.instagram.com/p/DPJKNm5Eo-D/?igsh=MWV0djYwMjJpOGYxeA==',
    driveLink: 'https://drive.google.com/drive/folders/1zfnl_XET8Q8yEDW9Y9ZmeegMQF61MRzI',
    stats: [
        { value: '100K+', label: 'Views' },
        { value: '5K+', label: 'Likes' },
        { value: '3K+', label: 'Shares' }
    ]
  },
  {
    id: 'prom-2',
    title: '5 6 7 ATE (Campus x TTT)',
    description: 'Behind the scenes with Campus x TTT. A documentary-style reel capturing the raw, unpolished energy of creation and youth culture.',
    contentType: 'Promotional',
    contentFormat: 'Reel',
    contentStyle: 'Documentary BTS',
    brand: 'Terribly Tiny Tales',
    imageUrl: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=2940&auto=format&fit=crop',
    media: [
        { type: 'video', url: 'https://drive.google.com/file/d/1HQ6CLuiQm5MhtdkawICg_OG3oNb_bFdT/view?usp=drivesdk' },
        { type: 'image', url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2940&auto=format&fit=crop' }
    ],
    date: 'Apr 2024',
    instagramLink: 'https://www.instagram.com/reel/DRRswcLjB3C/?igsh=Y2hzZ2V0eWpsMWNu',
    driveLink: 'https://drive.google.com/file/d/1HQ6CLuiQm5MhtdkawICg_OG3oNb_bFdT/view?usp=drivesdk',
    stats: [
      { value: '90K+', label: 'Views' },
      { value: '500+', label: 'Likes' }
    ]
  },
  {
    id: 'prom-3',
    title: 'Viral Trend Reel',
    description: 'Hopping on the latest audio trends to amplify brand visibility. Fast, punchy, and culturally relevant content that drives immediate engagement.',
    contentType: 'Promotional',
    contentFormat: 'Reel',
    contentStyle: 'Trend',
    brand: 'Terribly Tiny Tales',
    imageUrl: 'https://images.unsplash.com/photo-1533750516457-a7f992034fec?q=80&w=2940&auto=format&fit=crop',
    media: [
        { type: 'video', url: 'https://drive.google.com/file/d/1-J3jjwMa3zaGstTASvCtEOmyXI-NpjqL/view?usp=drivesdk' }
    ],
    date: 'Apr 2024',
    instagramLink: 'https://www.instagram.com/reel/DRMxtAWkoHz/?igsh=ZHA1bms0NDhvMGE4',
    driveLink: 'https://drive.google.com/file/d/1-J3jjwMa3zaGstTASvCtEOmyXI-NpjqL/view?usp=drivesdk',
    stats: [
      { value: '300K+', label: 'Views' },
      { value: '3.5K+', label: 'Likes' }
    ]
  },
  {
    id: 'prom-4',
    title: 'Greater Kalesh on Netflix',
    description: 'A character sketch reel for Netflix. Bringing the drama of "Greater Kalesh" to life with relatable character tropes and sharp editing.',
    contentType: 'Promotional',
    contentFormat: 'Reel',
    contentStyle: 'Character Sketch Reel',
    brand: 'Terribly Tiny Tales',
    imageUrl: 'https://images.unsplash.com/photo-1585647347483-22b66260dfff?q=80&w=2940&auto=format&fit=crop',
    media: [
        { type: 'image', url: 'https://images.unsplash.com/photo-1585647347483-22b66260dfff?q=80&w=2940&auto=format&fit=crop' }
    ],
    date: 'Mar 2024',
    instagramLink: 'https://www.instagram.com/reel/DP_yryGEj--/?igsh=MXZtOTk4MXpuZXBwbQ==',
    driveLink: 'https://drive.google.com/drive/folders/1mzWQb7DmGcSsImbhOOZkYXjJc6drKC4d',
    stats: [
      { value: '100K+', label: 'Views' },
      { value: '1K+', label: 'Likes' }
    ]
  },
  {
    id: 'prom-5',
    title: 'The Yellow Umbrella x Live Love Laugh',
    description: 'Taking the mic to the streets in collaboration with the Live Love Laugh Foundation. A Vox Pop reel engaging directly with the audience on mental health.',
    contentType: 'Promotional',
    contentFormat: 'Reel',
    contentStyle: 'Vox Pop',
    brand: 'Terribly Tiny Tales',
    imageUrl: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=2940&auto=format&fit=crop',
    media: [
        { type: 'image', url: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=2940&auto=format&fit=crop' }
    ],
    date: 'Mar 2024',
    driveLink: 'https://drive.google.com/drive/folders/1RTZBFotuRKBNLGIuSuxskeMm4CzSqLIM',
    stats: [{ value: 'LIVE', label: 'Release' }]
  },

  // --- EDITORIAL ---
  {
    id: 'ed-1',
    title: 'The Healing Hug',
    description: 'POV: some hugs are better than 8 hours of sleep. A story of coming home tired, dropping the heavy office bag, and melting into a hug that says "I got you" without saying a word.',
    contentType: 'Editorial',
    contentFormat: 'Reel',
    contentStyle: 'Animated',
    brand: 'Terribly Tiny Tales',
    imageUrl: 'https://images.unsplash.com/photo-1517677130605-abb7ca91d226?q=80&w=2833&auto=format&fit=crop',
    media: [
        { type: 'image', url: 'https://images.unsplash.com/photo-1517677130605-abb7ca91d226?q=80&w=2833&auto=format&fit=crop' }
    ],
    date: 'Jan 2024',
    instagramLink: 'https://www.instagram.com/reel/DQrhdgVEkbF/?igsh=bG45a3o4YWRhcmls',
    stats: [
        { value: '300K+', label: 'Views' },
        { value: '50K', label: 'Likes' }
    ]
  },
  {
    id: 'ed-2',
    title: 'Loved By A Soft Man',
    description: 'To be loved by a soft man is to suddenly realise "oh this is what safe actually feels like". He doesn’t use silence to punish. He resolves to repair the connection.',
    contentType: 'Editorial',
    contentFormat: 'Static Carousel',
    contentStyle: 'Musing',
    brand: 'Terribly Tiny Tales',
    imageUrl: 'https://images.unsplash.com/photo-1511988617509-a57c8a288659?q=80&w=2942&auto=format&fit=crop',
    media: [
        { type: 'image', url: 'https://images.unsplash.com/photo-1511988617509-a57c8a288659?q=80&w=2942&auto=format&fit=crop' }
    ],
    date: 'Feb 2024',
    instagramLink: 'https://www.instagram.com/p/DQyD5oZEoIU/?igsh=cGQyeGdvc3kzbTdm',
    stats: [{ value: '500K+', label: 'Views' }]
  }
];
