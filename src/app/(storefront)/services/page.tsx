import type { Metadata } from 'next';
import { ServiceBookingClient } from './service-booking-client';

export const metadata: Metadata = {
  title: 'Services',
  description: 'Book a beauty service consultation with the Anashe team.',
};

export default function ServicesPage() {
  return <ServiceBookingClient />;
}
