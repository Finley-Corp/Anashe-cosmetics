import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { ProfileDetailsCard } from '../ProfileDetailsCard';

export const metadata = { title: 'Profile' };

export default async function AccountProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login?redirect=/account/profile');
  }

  const { data: profile } = await supabase.from('profiles').select('full_name,phone').eq('id', user.id).maybeSingle();

  return (
    <>
      <div className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-medium tracking-tight text-[var(--text-primary)]">Profile</h1>
        <p className="mt-2 text-sm text-[var(--text-body)] max-w-lg leading-relaxed">
          Update how we address you and how to reach you about your orders.
        </p>
      </div>

      <div className="max-w-2xl">
        <ProfileDetailsCard
          initialFullName={profile?.full_name ?? null}
          email={user.email ?? 'Not set'}
          initialPhone={profile?.phone ?? null}
        />
      </div>
    </>
  );
}
