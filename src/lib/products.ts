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
    slug: "orbital-lamp",
    name: "Orbital Lamp",
    subtitle: "Matte Black Steel",
    price: 320,
    category: "Lighting",
    badge: null,
    isNew: false,
    image: "https://images.unsplash.com/photo-1604610728890-6f4b631ed081?w=800&q=80",
    hoverImage: "https://images.unsplash.com/photo-1603801705819-e3b27f8bb8cc?w=800&q=80",
    description:
      "A minimal arc lamp crafted from precision-bent matte black steel tubing. The weighted base ensures stability while the articulated head lets you direct light exactly where it's needed.",
    details: ["Matte powder-coated steel", "E27 bulb socket (bulb not included)", "H 165 cm × Base Ø 25 cm", "3-meter fabric-wrapped cord", "5-year structural warranty"],
    gallery: [
      "https://images.unsplash.com/photo-1604610728890-6f4b631ed081?w=1200&q=80",
      "https://images.unsplash.com/photo-1603801705819-e3b27f8bb8cc?w=1200&q=80",
      "https://images.unsplash.com/photo-1513506003901-1e6a35eb7b4e?w=1200&q=80",
      "https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=1200&q=80",
    ],
  },
  {
    id: 2,
    slug: "linen-lounge-chair",
    name: "Linen Lounge Chair",
    subtitle: "Natural Oak Frame",
    price: 890,
    category: "Furniture",
    badge: "New",
    isNew: true,
    image: "https://images.unsplash.com/photo-1592078615290-033ee584e267?q=80&w=1964&auto=format&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80",
    description:
      "Hand-crafted lounge chair with a solid white-oak frame and removable Belgian linen cushion covers. Designed for the long sit — ergonomically shaped with a reclined backrest and broad armrests.",
    details: ["Solid white-oak joinery", "Belgian linen (stone wash) — removable covers", "W 80 × D 85 × H 76 cm, seat H 40 cm", "Max load 120 kg", "OEKO-TEX certified fabric"],
    gallery: [
      "https://images.unsplash.com/photo-1592078615290-033ee584e267?w=1200&q=80",
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&q=80",
      "https://images.unsplash.com/photo-1567016432779-094069958ea5?w=1200&q=80",
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1200&q=80",
    ],
  },
  {
    id: 3,
    slug: "sculpt-vase-02",
    name: "Sculpt Vase 02",
    subtitle: "Raw Clay",
    price: 140,
    category: "Accessories",
    badge: null,
    isNew: false,
    image: "https://images.unsplash.com/photo-1597696929736-6d13bed8e6a8?w=800&q=80",
    hoverImage: "https://images.unsplash.com/photo-1608111115633-872fa895d40d?w=800&q=80",
    description:
      "Wheel-thrown stoneware vase with an unglazed raw-clay exterior and a smooth waterproof interior glaze. No two pieces are identical — each carries its own subtle texture from the throwing process.",
    details: ["Stoneware clay, reduction-fired", "Raw exterior / glazed interior", "H 28 cm × Ø 14 cm", "Holds water — suitable for fresh flowers", "Hand wash only"],
    gallery: [
      "https://images.unsplash.com/photo-1597696929736-6d13bed8e6a8?w=1200&q=80",
      "https://images.unsplash.com/photo-1608111115633-872fa895d40d?w=1200&q=80",
      "https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?w=1200&q=80",
      "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=1200&q=80",
    ],
  },
  {
    id: 4,
    slug: "side-table",
    name: "Side Table",
    subtitle: "Walnut Finish",
    price: 450,
    category: "Furniture",
    badge: null,
    isNew: false,
    image: "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?q=80&w=1888&auto=format&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1605239435870-67df4c54a0b3?w=800&q=80",
    description:
      "Compact side table in American black walnut with a hand-rubbed oil finish. Slender tapered legs give it an airy silhouette that works beside a sofa, bed, or armchair.",
    details: ["Solid American black walnut", "Hard-wax oil finish (food-safe)", "Ø 45 cm × H 55 cm", "Weight capacity 15 kg", "5-year structural warranty"],
    gallery: [
      "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=1200&q=80",
      "https://images.unsplash.com/photo-1605239435870-67df4c54a0b3?w=1200&q=80",
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&q=80",
      "https://images.unsplash.com/photo-1592078615290-033ee584e267?w=1200&q=80",
    ],
  },
  {
    id: 5,
    slug: "arc-floor-lamp",
    name: "Arc Floor Lamp",
    subtitle: "Brushed Brass",
    price: 560,
    category: "Lighting",
    badge: "New",
    isNew: true,
    image: "https://images.unsplash.com/photo-1513506003901-1e6a35eb7b4e?w=800&q=80",
    hoverImage: "https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=800&q=80",
    description:
      "A sweeping arc floor lamp in living brushed brass. The oversized round shade casts a warm, diffused glow — ideal above a reading chair or dining nook. Dimmer integrated into the cord.",
    details: ["Brushed brass-plated steel", "Linen shade, natural", "Arc span 180 cm, base Ø 28 cm", "Inline dimmer, E27 socket", "5-year structural warranty"],
    gallery: [
      "https://images.unsplash.com/photo-1513506003901-1e6a35eb7b4e?w=1200&q=80",
      "https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=1200&q=80",
      "https://images.unsplash.com/photo-1604610728890-6f4b631ed081?w=1200&q=80",
      "https://images.unsplash.com/photo-1603801705819-e3b27f8bb8cc?w=1200&q=80",
    ],
  },
  {
    id: 6,
    slug: "woven-throw",
    name: "Woven Throw",
    subtitle: "Organic Merino",
    price: 180,
    category: "Accessories",
    badge: null,
    isNew: false,
    image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&q=80",
    hoverImage: "https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=800&q=80",
    description:
      "Hand-loomed throw in 100% organic merino wool. A loose, open-weave structure keeps it breathable in warmer months while still providing cosy warmth in the evening.",
    details: ["100% organic merino wool", "Open-plain weave", "130 × 170 cm", "Machine wash cold, reshape damp", "GOTS certified"],
    gallery: [
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=1200&q=80",
      "https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=1200&q=80",
      "https://images.unsplash.com/photo-1608111115633-872fa895d40d?w=1200&q=80",
      "https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?w=1200&q=80",
    ],
  },
  {
    id: 7,
    slug: "dining-chair",
    name: "Dining Chair",
    subtitle: "Ash Wood + Linen",
    price: 620,
    category: "Furniture",
    badge: null,
    isNew: false,
    image: "https://images.unsplash.com/photo-1567016432779-094069958ea5?q=80&w=1780&auto=format&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1567016376408-0226e4d0c1ea?w=800&q=80",
    description:
      "A refined dining chair in steam-bent ash with an upholstered seat in sand linen. The sculptural back leg forms a single continuous curve with the backrest — a hallmark of careful joinery.",
    details: ["Steam-bent solid ash", "Sand linen seat pad — removable cover", "W 48 × D 52 × H 80 cm, seat H 45 cm", "Max load 130 kg", "FSC certified timber"],
    gallery: [
      "https://images.unsplash.com/photo-1567016432779-094069958ea5?w=1200&q=80",
      "https://images.unsplash.com/photo-1567016376408-0226e4d0c1ea?w=1200&q=80",
      "https://images.unsplash.com/photo-1592078615290-033ee584e267?w=1200&q=80",
      "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=1200&q=80",
    ],
  },
  {
    id: 8,
    slug: "ceramic-tray",
    name: "Ceramic Tray",
    subtitle: "Stone White",
    price: 95,
    category: "Accessories",
    badge: null,
    isNew: false,
    image: "https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?q=80&w=2070&auto=format&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800&q=80",
    description:
      "Slip-cast stoneware tray in a muted stone-white glaze. Broad, low walls contain clutter while the matt surface gives it a quiet, architectural presence on any surface.",
    details: ["Slip-cast stoneware", "Stone-white satin glaze", "W 30 × D 20 × H 3 cm", "Dishwasher safe", "Stackable"],
    gallery: [
      "https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?w=1200&q=80",
      "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=1200&q=80",
      "https://images.unsplash.com/photo-1597696929736-6d13bed8e6a8?w=1200&q=80",
      "https://images.unsplash.com/photo-1608111115633-872fa895d40d?w=1200&q=80",
    ],
  },
  {
    id: 9,
    slug: "pendant-light",
    name: "Pendant Light",
    subtitle: "Hand-blown Glass",
    price: 740,
    category: "Lighting",
    badge: null,
    isNew: false,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
    hoverImage: "https://images.unsplash.com/photo-1540932239986-30128078f3c5?w=800&q=80",
    description:
      "Each globe is individually mouth-blown by artisans in Bohemia, resulting in a gently uneven form that catches light in a way no machine-made piece can. Comes with adjustable black braided cord.",
    details: ["Hand-blown borosilicate glass", "Matte black canopy + adjustable cord (max 200 cm)", "E27 socket, compatible with smart bulbs", "Ø 28 cm", "Each piece unique"],
    gallery: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80",
      "https://images.unsplash.com/photo-1540932239986-30128078f3c5?w=1200&q=80",
      "https://images.unsplash.com/photo-1513506003901-1e6a35eb7b4e?w=1200&q=80",
      "https://images.unsplash.com/photo-1604610728890-6f4b631ed081?w=1200&q=80",
    ],
  },
  {
    id: 10,
    slug: "modular-shelf",
    name: "Modular Shelf",
    subtitle: "Solid Oak",
    price: 1100,
    category: "Furniture",
    badge: null,
    isNew: false,
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80",
    hoverImage: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80",
    description:
      "Solid oak shelving system built around a simple mortise-and-tenon joint — no hardware visible from the front. Panels can be reconfigured as your needs change, making it a piece that lasts a lifetime.",
    details: ["Solid white oak, natural oil finish", "Modular — configurable width & height", "Shelf depth 30 cm, load 25 kg per shelf", "Wall anchors included", "FSC certified"],
    gallery: [
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&q=80",
      "https://images.unsplash.com/photo-1592078615290-033ee584e267?w=1200&q=80",
      "https://images.unsplash.com/photo-1567016432779-094069958ea5?w=1200&q=80",
      "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=1200&q=80",
    ],
  },
  {
    id: 11,
    slug: "pillar-candle-set",
    name: "Pillar Candle Set",
    subtitle: "Soy Wax",
    price: 65,
    category: "Accessories",
    badge: "Sale",
    isNew: false,
    image: "https://images.unsplash.com/photo-1608111115633-872fa895d40d?w=800&q=80",
    hoverImage: "https://images.unsplash.com/photo-1599619351208-3e6c839d6828?w=800&q=80",
    description:
      "Set of three unscented pillar candles in pure soy wax. Slow-burning with a clean, even melt pool and minimal soot. A neutral palette — alabaster, chalk, and warm flax — works in any interior.",
    details: ["100% soy wax, cotton wick", "Unscented — no synthetic fragrance", "Set of 3: H 10 / 15 / 20 cm", "Burn time: approx. 40 / 60 / 80 hrs", "Vegan & biodegradable"],
    gallery: [
      "https://images.unsplash.com/photo-1608111115633-872fa895d40d?w=1200&q=80",
      "https://images.unsplash.com/photo-1599619351208-3e6c839d6828?w=1200&q=80",
      "https://images.unsplash.com/photo-1597696929736-6d13bed8e6a8?w=1200&q=80",
      "https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?w=1200&q=80",
    ],
  },
  {
    id: 12,
    slug: "ottoman-cube",
    name: "Ottoman Cube",
    subtitle: "Bouclé Fabric",
    price: 390,
    category: "Furniture",
    badge: "New",
    isNew: true,
    image: "https://images.unsplash.com/photo-1631679706909-1844bbd07221?q=80&w=1992&auto=format&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80",
    description:
      "A versatile bouclé cube that works as a footrest, extra seat, or occasional table with a tray on top. Wrapped in a tight, tactile loop-yarn fabric over a solid birch frame with high-density foam.",
    details: ["Bouclé loop-yarn fabric (85% wool, 15% nylon)", "Solid birch frame, high-density foam", "W 45 × D 45 × H 45 cm", "Max load 150 kg", "Removable cover — dry clean only"],
    gallery: [
      "https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=1200&q=80",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&q=80",
      "https://images.unsplash.com/photo-1592078615290-033ee584e267?w=1200&q=80",
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&q=80",
    ],
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}
