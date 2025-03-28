import { createServerSupabaseClient } from '@/lib/supabase_server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Nicht eingeloggt" }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('characters')
      .select('id, name, level_cooking,level_fishing,level_mining, level_cutting')
      .eq('user_id', user.id);

    if (error) {
      console.error('Error fetching characters:', error); // Log the error for debugging
      throw error;
    }

    return NextResponse.json({ success: true, characters: data });
  } catch (err) {
    console.error('Error in GET function:', err); // Log the error for debugging
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    );
  }
}