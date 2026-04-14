import { ReviewsModerationClient } from './reviews-moderation-client';
import { createServiceClient } from '@/lib/supabase/service';

export default async function AdminReviewsPage() {
  const supabase = createServiceClient();
  const { data: pendingReviews } = await supabase
    .from('reviews')
    .select('id,rating,title,body,created_at,is_approved,product:products(id,name,slug),profile:profiles(id,full_name)')
    .eq('is_approved', false)
    .order('created_at', { ascending: false })
    .limit(200);

  return <ReviewsModerationClient initialReviews={pendingReviews ?? []} />;
}

