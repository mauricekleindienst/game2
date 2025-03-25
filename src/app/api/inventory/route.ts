import { createClient } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const supabase = createClient();

    const { 
        data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Nicht eingeloggt" }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('inventory')
      .select('*')
      .eq('user_id', user.id);

    if (error) throw error;

    return NextResponse.json({ inventory: data });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
