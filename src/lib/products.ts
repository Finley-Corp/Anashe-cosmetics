export type Product = {
  id: number;
  slug: string;
  name: string;
  subtitle: string;
  price: number;
  category: string;
  badge: string | null;
  isNew: boolean;
  image: string;
  hoverImage: string;
  description: string;
  details: string[];
  gallery: string[];
};

export const PRODUCTS: Product[] = [
  {
    id: 1,
    slug: "the-ordinary-niacinamide-10-zinc-1",
    name: "Niacinamide 10% + Zinc 1%",
    subtitle: "Oil control + pores",
    price: 12,
    category: "The Ordinary",
    badge: "Best Seller",
    isNew: false,
    image: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=1200&q=80",
    hoverImage: "https://images.unsplash.com/photo-1570194065650-d99fb4f9a2c2?w=1200&q=80",
    description:
      "A lightweight treatment serum that helps visibly reduce excess sebum and refine the look of enlarged pores.",
    details: [
      "10% niacinamide + 1% zinc PCA",
      "Water-based formula",
      "Use morning and evening before creams",
      "Suitable for oily and combination skin",
    ],
    gallery: [
      "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=1400&q=80",
      "https://images.unsplash.com/photo-1570194065650-d99fb4f9a2c2?w=1400&q=80",
      "https://images.unsplash.com/photo-1607602132700-068258f66c4a?w=1400&q=80",
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=1400&q=80",
    ],
  },
  {
    id: 2,
    slug: "the-ordinary-hyaluronic-acid-2-b5",
    name: "Hyaluronic Acid 2% + B5",
    subtitle: "Deep hydration",
    price: 11,
    category: "The Ordinary",
    badge: "New",
    isNew: true,
    image: "https://images.unsplash.com/photo-1607602132700-068258f66c4a?w=1200&q=80",
    hoverImage: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=1200&q=80",
    description:
      "A daily hydration serum with multi-molecular hyaluronic acid and vitamin B5 to plump and smooth dehydrated skin.",
    details: [
      "2% hyaluronic acid complex",
      "Vitamin B5 for moisture retention",
      "Fragrance-free",
      "Best layered on damp skin",
    ],
    gallery: [
      "https://images.unsplash.com/photo-1607602132700-068258f66c4a?w=1400&q=80",
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=1400&q=80",
      "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=1400&q=80",
      "https://images.unsplash.com/photo-1570194065650-d99fb4f9a2c2?w=1400&q=80",
    ],
  },
  {
    id: 3,
    slug: "black-girl-sunscreen-spf-30",
    name: "Black Girl Sunscreen SPF 30",
    subtitle: "No white cast",
    price: 19,
    category: "Black Girl Sunscreen",
    badge: "Best Seller",
    isNew: false,
    image: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=1200&q=80",
    hoverImage: "https://images.unsplash.com/photo-1624454002302-6f90e58ca11f?w=1200&q=80",
    description:
      "Moisturizing broad-spectrum sunscreen made to blend seamlessly on deeper skin tones without residue.",
    details: [
      "SPF 30 broad-spectrum UVA/UVB",
      "Infused with jojoba and avocado",
      "Leaves a natural glow finish",
      "Great under makeup",
    ],
    gallery: [
      "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=1400&q=80",
      "https://images.unsplash.com/photo-1624454002302-6f90e58ca11f?w=1400&q=80",
      "https://images.unsplash.com/photo-1611930021592-a8cfd5319ceb?w=1400&q=80",
      "https://images.unsplash.com/photo-1580870069867-74c57ee1bb07?w=1400&q=80",
    ],
  },
  {
    id: 4,
    slug: "black-girl-sunscreen-kids-spf-50",
    name: "Black Girl Sunscreen Kids SPF 50",
    subtitle: "Family-safe sunscreen",
    price: 22,
    category: "Black Girl Sunscreen",
    badge: "New",
    isNew: true,
    image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=1200&q=80",
    hoverImage: "https://images.unsplash.com/photo-1612817288484-6f916006741a?w=1200&q=80",
    description:
      "Gentle, high-protection sunscreen for face and body with a moisturizing, kid-friendly texture.",
    details: [
      "SPF 50 broad-spectrum protection",
      "Water-resistant up to 80 minutes",
      "No chalky finish",
      "Dermatologist tested",
    ],
    gallery: [
      "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=1400&q=80",
      "https://images.unsplash.com/photo-1612817288484-6f916006741a?w=1400&q=80",
      "https://images.unsplash.com/photo-1570194065650-d99fb4f9a2c2?w=1400&q=80",
      "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=1400&q=80",
    ],
  },
  {
    id: 5,
    slug: "cerave-hydrating-cleanser",
    name: "CeraVe Hydrating Cleanser",
    subtitle: "Gentle daily cleanse",
    price: 16,
    category: "CeraVe",
    badge: null,
    isNew: false,
    image: "https://images.unsplash.com/photo-1611930021592-a8cfd5319ceb?w=1200&q=80",
    hoverImage: "https://images.unsplash.com/photo-1580870069867-74c57ee1bb07?w=1200&q=80",
    description:
      "Cream cleanser with ceramides and hyaluronic acid that removes impurities while supporting the skin barrier.",
    details: [
      "With 3 essential ceramides",
      "Non-foaming, non-stripping formula",
      "Suitable for normal to dry skin",
      "Fragrance free",
    ],
    gallery: [
      "https://images.unsplash.com/photo-1611930021592-a8cfd5319ceb?w=1400&q=80",
      "https://images.unsplash.com/photo-1580870069867-74c57ee1bb07?w=1400&q=80",
      "https://images.unsplash.com/photo-1624454002302-6f90e58ca11f?w=1400&q=80",
      "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=1400&q=80",
    ],
  },
  {
    id: 6,
    slug: "cerave-moisturizing-cream",
    name: "CeraVe Moisturizing Cream",
    subtitle: "Barrier repair moisture",
    price: 18,
    category: "CeraVe",
    badge: null,
    isNew: false,
    image: "https://images.unsplash.com/photo-1624454002302-6f90e58ca11f?w=1200&q=80",
    hoverImage: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=1200&q=80",
    description:
      "Rich moisturizer that delivers long-lasting hydration and helps restore protective skin barrier function.",
    details: [
      "MVE technology for all-day hydration",
      "Contains ceramides + hyaluronic acid",
      "Face and body use",
      "Non-comedogenic",
    ],
    gallery: [
      "https://images.unsplash.com/photo-1624454002302-6f90e58ca11f?w=1400&q=80",
      "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=1400&q=80",
      "https://images.unsplash.com/photo-1570194065650-d99fb4f9a2c2?w=1400&q=80",
      "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=1400&q=80",
    ],
  },
  {
    id: 7,
    slug: "la-roche-posay-effaclar-cleanser",
    name: "La Roche-Posay Effaclar Cleanser",
    subtitle: "Foaming gel for oily skin",
    price: 18,
    category: "La Roche-Posay",
    badge: "Best Seller",
    isNew: false,
    image: "https://images.unsplash.com/photo-1612817288484-6f916006741a?w=1200&q=80",
    hoverImage: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=1200&q=80",
    description:
      "Purifying foaming cleanser with zinc pidolate to remove excess oil and visibly reduce shine.",
    details: [
      "Designed for oily, acne-prone skin",
      "Soap-free and pH balanced",
      "Helps unclog pores",
      "Dermatologist tested",
    ],
    gallery: [
      "https://images.unsplash.com/photo-1612817288484-6f916006741a?w=1400&q=80",
      "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=1400&q=80",
      "https://images.unsplash.com/photo-1624454002302-6f90e58ca11f?w=1400&q=80",
      "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=1400&q=80",
    ],
  },
  {
    id: 8,
    slug: "la-roche-posay-anthelios-spf-50",
    name: "La Roche-Posay Anthelios SPF 50",
    subtitle: "Invisible fluid sunscreen",
    price: 27,
    category: "La Roche-Posay",
    badge: "New",
    isNew: true,
    image: "https://images.unsplash.com/photo-1570194065650-d99fb4f9a2c2?w=1200&q=80",
    hoverImage: "https://images.unsplash.com/photo-1607602132700-068258f66c4a?w=1200&q=80",
    description:
      "Ultra-light, high-protection sunscreen fluid with broad-spectrum UVA/UVB defense and no greasy residue.",
    details: [
      "SPF 50+ broad-spectrum protection",
      "Lightweight, fast-absorbing finish",
      "Water and sweat resistant",
      "Suitable for sensitive skin",
    ],
    gallery: [
      "https://images.unsplash.com/photo-1570194065650-d99fb4f9a2c2?w=1400&q=80",
      "https://images.unsplash.com/photo-1607602132700-068258f66c4a?w=1400&q=80",
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=1400&q=80",
      "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=1400&q=80",
    ],
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}
