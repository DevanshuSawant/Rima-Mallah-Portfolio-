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
        subFilters: ['All', 'Static Musing', 'Storytelling Carousel']
      },
      { 
        id: TabId.REELS, 
        label: 'Reels',
        subFilters: ['All', 'Animated Reel', 'Vox Pop', 'Meme Reel', 'Trending Audio']
      },
      { 
        id: TabId.CAROUSELS, 
        label: 'Carousels',
        subFilters: ['All', 'Infographic', 'Text-over-Image', 'Thread']
      },
      { id: TabId.SCRIPTS, label: 'Scripts' },
    ],
  },
];

export const PORTFOLIO_ITEMS: PortfolioItem[] = [
  {
    id: 'post-1',
    title: 'Stop Watering Dead Plants',
    description: 'They asked: “Why are you walking away instead of fixing things with them?” I said: Because some connections can’t be forced. Sometimes you have to stop bleeding into people who won’t fight for you. Wake up. Stop watering dead plants.',
    contentType: 'Editorial',
    contentFormat: 'Static Musing',
    contentStyle: 'Empowering',
    brand: 'Terribly Tiny Tales',
    imageUrl: 'https://images.unsplash.com/photo-1508515053963-70c7f754543e?q=80&w=2940&auto=format&fit=crop', // Withered/Dry plant
    date: 'Mar 2024',
    instagramLink: 'https://www.instagram.com/p/DQTRM4FEnh9/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==',
    stats: { value: '2.5M', label: 'Views' }
  },
  {
    id: 'post-2',
    title: 'Loved By A Soft Man',
    description: 'To be loved by a soft man is to suddenly realise "oh this is what safe actually feels like". He doesn’t use silence to punish. He resolves to repair the connection. And loving him feels like you can finally drop the weight on your shoulders.',
    contentType: 'Editorial',
    contentFormat: 'Storytelling Carousel',
    contentStyle: 'Romantic',
    brand: 'Terribly Tiny Tales',
    imageUrl: 'https://images.unsplash.com/photo-1511988617509-a57c8a288659?q=80&w=2942&auto=format&fit=crop', // Gentle couple/Soft light
    date: 'Feb 2024',
    instagramLink: 'https://www.instagram.com/p/DQyD5oZEoIU/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==',
    stats: { value: '150K', label: 'Likes' }
  },
  {
    id: 'post-3',
    title: 'The Healing Hug',
    description: 'POV: some hugs are better than 8 hours of sleep. A story of coming home tired, dropping the heavy office bag, and melting into a hug that says "I got you" without saying a word.',
    contentType: 'Social',
    contentFormat: 'Animated Reel',
    contentStyle: 'Heartwarming',
    brand: 'Terribly Tiny Tales',
    imageUrl: 'https://images.unsplash.com/photo-1517677130605-abb7ca91d226?q=80&w=2833&auto=format&fit=crop', // Hug
    date: 'Jan 2024',
    instagramLink: 'https://www.instagram.com/reel/DQrhdgVEkbF/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==',
    stats: { value: 'Viral', label: 'Trending' }
  },
  {
    id: 'post-4',
    title: 'King Kohli Tribute',
    description: 'In 2006, he was just 18. A kid trying to make space for himself. Years passed, stadiums filled. Today isn’t just about runs; it’s about the Delhi boy who became a standard. King Kohli wasn’t a title we gave you - it was a feeling.',
    contentType: 'Editorial',
    contentFormat: 'Text-over-Image Carousel',
    contentStyle: 'Inspirational',
    brand: 'Terribly Tiny Tales',
    imageUrl: 'https://images.unsplash.com/photo-1624194092288-124b22c7eb19?q=80&w=2940&auto=format&fit=crop', // Cricket stadium
    date: 'Nov 2023',
    instagramLink: 'https://www.instagram.com/p/DQqYz1OkmEv/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==',
    stats: { value: '10K+', label: 'Shares' }
  }
];