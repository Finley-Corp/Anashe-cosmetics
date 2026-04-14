import { redirect } from 'next/navigation';

// Redirect root to storefront home
export default function RootPage() {
  redirect('/home');
}
