import type { Metadata } from 'next';
import { ServiceBookingClient } from './service-booking-client';
import { createServiceClient } from '@/lib/supabase/service';

type ServiceOption = {
  value: string;
  label: string;
  description?: string | null;
};

export const metadata: Metadata = {
  title: 'Services',
  description: 'Book a beauty service consultation with the Anashe team.',
};

const FALLBACK_SERVICE_OPTIONS: ServiceOption[] = [
  { value: 'skin-consultation', label: 'Skin Consultation', description: 'One-on-one expert assessment for your skin type and concerns.' },
  { value: 'routine-planning', label: 'Routine Planning Session', description: 'AM/PM routine plan matched to goals and budget.' },
  { value: 'product-matching', label: 'Product Matching Session', description: 'Product recommendations based on your current regimen.' },
  { value: 'bridal-beauty-consult', label: 'Bridal Beauty Consultation', description: 'Timeline-based prep and product strategy for events.' },
];

export default async function ServicesPage() {
  const supabase = createServiceClient();
  const { data } = await supabase
    .from('service_offerings')
    .select('slug,name,description,is_active')
    .eq('is_active', true)
    .order('name', { ascending: true })
    .limit(100);

  const services = (data ?? []).map((row) => ({
    value: row.slug,
    label: row.name,
    description: row.description,
  }));

  return <ServiceBookingClient serviceOptions={services.length > 0 ? services : FALLBACK_SERVICE_OPTIONS} />;
}
