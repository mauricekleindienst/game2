import { createServerSupabaseClient } from '@/lib/supabase_server';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const supabase = await createServerSupabaseClient();
    const { characterId, increaseBy } = await req.json();

    if (!characterId || !increaseBy) {
      return NextResponse.json({ error: "Character ID and increase value are required" }, { status: 400 });
    }

    // Fetch the current fishing level
    const { data: currentData, error: fetchError } = await supabase
      .from('characters')
      .select('level_fishing')
      .eq('id', characterId)
      .single();

    if (fetchError || !currentData) {
      console.error('Error fetching current fishing level:', fetchError); // Log the error for debugging
      return NextResponse.json({ error: "Character not found or error fetching data" }, { status: 404 });
    }

    // Increment the fishing level
    const newFishingLevel = currentData.level_fishing + increaseBy;

    // Update the character's fishing level
    const { data, error } = await supabase
      .from('characters')
      .update({ level_fishing: newFishingLevel })
      .eq('id', characterId);

    if (error) {
      console.error('Error updating fishing level:', error); // Log the error for debugging
      throw error;
    }

    return NextResponse.json({ success: true, updatedFishingLevel: data });
  } catch (err) {
    console.error('Error in POST function:', err); // Log the error for debugging
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    );
  }
}