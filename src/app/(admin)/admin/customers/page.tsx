import { createServiceClient } from '@/lib/supabase/service';
import { CustomersClient } from './customers-client';

export default async function AdminCustomersPage() {
  const supabase = createServiceClient();
  const { data } = await supabase
    .from('customer_contacts')
    .select('id,full_name,email,phone,notes,created_at,updated_at')
    .order('created_at', { ascending: false })
    .limit(1000);

  return <CustomersClient initialCustomers={data ?? []} />;
}

