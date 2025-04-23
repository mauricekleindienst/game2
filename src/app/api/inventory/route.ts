import { createServerSupabaseClient } from '@/lib/supabase_server';
import { getInventoryForUser } from '@/lib/inventory';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();
    
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.error("Authentication error:", userError);
      return NextResponse.json({ error: "Authentication error" }, { status: 401 });
    }
    
    const inventory = await getInventoryForUser(user.id);
    
    return NextResponse.json({ 
      success: true, 
      inventory
    });
    
  } catch (error) {
    console.error("Error fetching inventory:", error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : "An unexpected error occurred" 
      }, 
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const supabase = await createServerSupabaseClient();
    
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.error("Authentication error:", userError);
      return NextResponse.json({ error: "Authentication error" }, { status: 401 });
    }
    
    const { itemType, itemId, quantity = 1, slot } = await req.json();
    
    if (!itemType || !itemId) {
      return NextResponse.json(
        { error: "itemType and itemId are required" }, 
        { status: 400 }
      );
    }
    
    const { data: itemExists, error: itemCheckError } = await supabase
      .from(itemType)
      .select('id')
      .eq('id', itemId)
      .single();
      
    if (itemCheckError || !itemExists) {
      return NextResponse.json(
        { error: `Item of type ${itemType} with id ${itemId} does not exist` }, 
        { status: 400 }
      );
    }
    
    let slotToUse = slot;
    
    if (slotToUse === undefined) {
      const { data: allItems } = await supabase
        .from('inventory')
        .select('slot')
        .eq('user_id', user.id);
        
      const occupiedSlots = new Set((allItems || []).map(item => item.slot));
      
      for (let i = 0; i < 100; i++) { 
        if (!occupiedSlots.has(i)) {
          slotToUse = i;
          break;
        }
      }
      
      if (slotToUse === undefined) {
        return NextResponse.json(
          { error: "Inventory is full" }, 
          { status: 400 }
        );
      }
    } else {
      const { data: existingItems } = await supabase
        .from('inventory')
        .select('id')
        .eq('user_id', user.id)
        .eq('slot', slotToUse); 
        
      if (existingItems && existingItems.length > 0) {
        return NextResponse.json(
          { error: `Slot ${slotToUse} is already occupied` }, 
          { status: 400 }
        );
      }
    }
    
    const { data: newItem, error: insertError } = await supabase
      .from('inventory')
      .insert({
        user_id: user.id,
        item_type: itemType,
        item_id: itemId,
        quantity,
        slot: slotToUse 
      })
      .select()
      .single();
      
    if (insertError) {
      console.error("Error adding item to inventory:", insertError);
      return NextResponse.json(
        { error: "Failed to add item to inventory" }, 
        { status: 500 }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      item: newItem 
    });
    
  } catch (error) {
    console.error("Error adding to inventory:", error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : "An unexpected error occurred" 
      }, 
      { status: 500 }
    );
  }
}
