import { createServerSupabaseClient } from '@/lib/supabase_server';
import { NextResponse } from 'next/server';
import { fishHandler } from '@/lib/fish';
import { ItemHandler, GameItem } from '@/lib/game-items';

const itemHandlers: Record<string, ItemHandler<GameItem>> = {
  'fish': fishHandler,
};

export async function GET(req: Request) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    const url = new URL(req.url);
    const itemType = url.searchParams.get('type');
    const itemId = url.searchParams.get('id');
    
    if (!itemType) {
      return NextResponse.json({ error: "Parameter 'type' is required" }, { status: 400 });
    }
    
    const handler = itemHandlers[itemType];
    if (!handler) {
      return NextResponse.json({ error: `Unknown item type: ${itemType}` }, { status: 400 });
    }
    
    if (itemType === 'player-specific' && !user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }
    
    if (itemId && handler.getById) {
      const item = await handler.getById(itemId);
      if (!item) {
        return NextResponse.json({ error: `Item with ID ${itemId} not found` }, { status: 404 });
      }
      
      return NextResponse.json({ item });
    }
    
    const data = await handler.getAll();
    return NextResponse.json({ items: data });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 