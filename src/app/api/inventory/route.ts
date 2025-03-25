import { createServerSupabaseClient } from '@/lib/supabase_server';
import { getInventoryForUser } from '@/lib/inventory';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const supabase = await createServerSupabaseClient();

    const { 
        data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Nicht eingeloggt" }, { status: 401 });
    }

    const inventory = await getInventoryForUser(user.id);

    return NextResponse.json({ inventory });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
