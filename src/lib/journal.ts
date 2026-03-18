export type JournalPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  image: string;
  publishedAt: string;
  author: string;
  content: string[];
};

export const JOURNAL_POSTS: JournalPost[] = [
  {
    slug: "barrier-first-night-routine",
    title: "Building A Barrier-First Night Routine",
    excerpt:
      "How to layer treatment, hydration, and recovery products for calmer skin by morning.",
    category: "Rituals",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=1800&q=80",
    publishedAt: "March 10, 2026",
    author: "ANASHE Editorial Team",
    content: [
      "Night care is where skin recovery does most of its work. A barrier-first strategy means prioritizing hydration and tolerance before aggressive actives.",
      "Start with a gentle cleanse, then apply a treatment serum while skin is still slightly damp. Follow with a moisturizer that supports ceramide balance and locks in water.",
      "If your skin feels reactive, reduce active frequency to alternate nights and keep your final layer rich but breathable. Consistency beats intensity.",
    ],
  },
  {
    slug: "fermented-actives-absorption",
    title: "Fermented Actives: Why They Absorb Better",
    excerpt: "A closer look at fermentation and how it can improve ingredient compatibility and penetration.",
    category: "Ingredients",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1614859324967-bdaa65817084?w=1200&q=80",
    publishedAt: "March 7, 2026",
    author: "Dr. Nyambura K.",
    content: [
      "Fermentation breaks ingredients into smaller molecular forms, often improving bioavailability and skin compatibility.",
      "Many fermented extracts also carry supportive compounds like amino acids and organic acids that help moisture retention.",
      "When formulated correctly, these actives can deliver visible results with less irritation than higher-dose traditional alternatives.",
    ],
  },
  {
    slug: "dry-vs-dehydrated-skin",
    title: "The Difference Between Dry and Dehydrated Skin",
    excerpt: "Understanding this distinction helps you choose the right products faster.",
    category: "Skin Science",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=1200&q=80",
    publishedAt: "March 5, 2026",
    author: "ANASHE Lab Notes",
    content: [
      "Dry skin lacks oil; dehydrated skin lacks water. You can be oily and dehydrated at the same time.",
      "Dehydration often appears as tightness, dullness, and fine lines. Dryness usually includes rough texture and flaking.",
      "Use humectants for dehydration and barrier-repair lipids for dryness, then adjust based on climate and season.",
    ],
  },
  {
    slug: "spf-with-active-serums",
    title: "How To Pair SPF With Active Serums",
    excerpt: "A practical layering guide to maximize benefits and reduce irritation.",
    category: "Daily Care",
    readTime: "4 min read",
    image: "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=1200&q=80",
    publishedAt: "March 2, 2026",
    author: "ANASHE Editorial Team",
    content: [
      "Apply active serums first after cleansing, then moisturizer, then sunscreen as the final daytime step.",
      "Give each layer a short settling time to reduce pilling and improve finish under makeup.",
      "If you use stronger exfoliating actives, prioritize broad-spectrum SPF every morning and reapply during peak sun hours.",
    ],
  },
  {
    slug: "night-repair-during-sleep",
    title: "Night Repair: What Happens While You Sleep",
    excerpt: "Why evening routines can accelerate visible improvements in texture and tone.",
    category: "Clinical Results",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=1200&q=80",
    publishedAt: "February 28, 2026",
    author: "Dr. Achieng O.",
    content: [
      "At night, transepidermal water loss rises and skin repair pathways become more active, making treatment timing meaningful.",
      "This is why richer hydration and reparative ingredients can be especially effective before sleep.",
      "A stable night routine with calm actives and barrier support often outperforms frequent routine changes.",
    ],
  },
];
