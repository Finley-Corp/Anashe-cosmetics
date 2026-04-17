import { createServiceClient } from '@/lib/supabase/service';
import { DiscountsClient } from './discounts-client';

export default async function AdminDiscountsPage() {
  const supabase = createServiceClient();
  const { data } = await supabase
    .from('coupons')
    .select('id,code,description,type,value,is_active,used_count,max_uses,created_at,expires_at')
    .eq('type', 'percentage')
    .order('created_at', { ascending: false })
    .limit(500);

  return <DiscountsClient initialDiscounts={data ?? []} />;
}

