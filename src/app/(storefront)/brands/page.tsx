import type { Metadata } from 'next';
import { RulerCarousel, type CarouselItem } from '@/components/ui/ruler-carousel';

export const metadata: Metadata = {
  title: 'Brands',
  description: 'Explore premium skincare and beauty brands available at Anashe.',
};

const BRAND_ITEMS: CarouselItem[] = [
  { id: 1, title: 'CeraVe' },
  { id: 2, title: 'Cetaphil' },
  { id: 3, title: 'COSRX' },
  { id: 4, title: 'Eucerin' },
  { id: 5, title: 'La Roche-Posay' },
  { id: 6, title: 'Neutrogena' },
  { id: 7, title: 'The Ordinary' },
  { id: 8, title: 'Bioderma' },
  { id: 9, title: 'Paula\'s Choice' },
];

export default function BrandsPage() {
  return <RulerCarousel originalItems={BRAND_ITEMS} />;
}
