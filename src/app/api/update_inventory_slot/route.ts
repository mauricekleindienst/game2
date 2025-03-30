import { createServerSupabaseClient } from '@/lib/supabase_server';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const supabase = await createServerSupabaseClient();
    
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.error("Authentication error:", userError);
      return NextResponse.json({ error: "Authentication error" }, { status: 401 });
    }
    
    // Parse the request body
    const { itemId, newSlot, sourceSlot } = await req.json();
    
    if (itemId === undefined || newSlot === undefined) {
      return NextResponse.json(
        { error: "itemId and newSlot are required fields" }, 
        { status: 400 }
      );
    }
    
    // Check if the target slot is already occupied
    const { data: existingItems, error: checkError } = await supabase
      .from('inventory')
      .select('id, slot')
      .eq('user_id', user.id)
      .eq('slot', newSlot);
      
    if (checkError) {
      console.error("Error checking slot availability:", checkError);
      return NextResponse.json(
        { error: "Failed to check slot availability" }, 
        { status: 500 }
      );
    }
    
    // Start a transaction
    // If there's an item in the target slot, we need to swap positions
    if (existingItems && existingItems.length > 0) {
      const existingItem = existingItems[0];
      
      // If we're swapping positions
      if (sourceSlot !== undefined) {
        // Update the existing item to take the source position
        const { error: swapError } = await supabase
          .from('inventory')
          .update({ slot: sourceSlot })
          .eq('id', existingItem.id)
          .eq('user_id', user.id);
          
        if (swapError) {
          console.error("Error swapping items:", swapError);
          return NextResponse.json(
            { error: "Failed to swap items" }, 
            { status: 500 }
          );
        }
      } else {
        // Find a free slot if we're not swapping
        const { data: allItems } = await supabase
          .from('inventory')
          .select('slot')
          .eq('user_id', user.id);
          
        const occupiedSlots = new Set((allItems || []).map(item => item.slot));
        let freeSlot = -1;
        
        for (let i = 0; i < 100; i++) {
          if (!occupiedSlots.has(i)) {
            freeSlot = i;
            break;
          }
        }
        
        if (freeSlot === -1) {
          return NextResponse.json(
            { error: "Inventory is full, cannot move items" }, 
            { status: 400 }
          );
        }
        
        // Move the existing item to the free slot
        const { error: moveError } = await supabase
          .from('inventory')
          .update({ slot: freeSlot })
          .eq('id', existingItem.id)
          .eq('user_id', user.id);
          
        if (moveError) {
          console.error("Error moving existing item:", moveError);
          return NextResponse.json(
            { error: "Failed to move existing item" }, 
            { status: 500 }
          );
        }
      }
    }
    
    // Now update the target item's position
    const { data: updatedItem, error: updateError } = await supabase
      .from('inventory')
      .update({ slot: newSlot })
      .eq('id', itemId)
      .eq('user_id', user.id)
      .select()
      .single();
      
    if (updateError) {
      console.error("Error updating item position:", updateError);
      return NextResponse.json(
        { error: "Failed to update item position" }, 
        { status: 500 }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      item: updatedItem 
    });
    
  } catch (error) {
    console.error("Uncaught exception in update_inventory_slot API:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" }, 
      { status: 500 }
    );
  }
} 