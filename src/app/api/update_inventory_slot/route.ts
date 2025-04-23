import { createServerSupabaseClient } from '@/lib/supabase_server';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const supabase = await createServerSupabaseClient();

  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    console.error("Authentication error:", userError);
    return NextResponse.json({ error: "Authentication error" }, { status: 401 });
  }

  try {
    const { itemId, newSlot, sourceSlot } = await req.json();

    if (itemId === undefined || newSlot === undefined || sourceSlot === undefined) {
      return NextResponse.json(
        { error: "itemId, newSlot, and sourceSlot are required fields" },
        { status: 400 }
      );
    }


    const MAX_SLOTS = 100; 
    if (newSlot < 0 || newSlot >= MAX_SLOTS || sourceSlot < 0 || sourceSlot >= MAX_SLOTS) {
      return NextResponse.json({ error: "Invalid slot index" }, { status: 400 });
    }

    const { data: itemToMove, error: moveError } = await supabase
      .from('inventory')
      .select('id, slot')
      .eq('user_id', user.id)
      .eq('id', itemId)
      .single();

    if (moveError || !itemToMove) {
      console.error("Error fetching item to move:", moveError);
      return NextResponse.json({ error: "Item to move not found or access denied" }, { status: 404 });
    }

    if (itemToMove.slot !== sourceSlot) {
       console.warn(`Mismatch: Item ${itemId} is in slot ${itemToMove.slot}, but request claims sourceSlot ${sourceSlot}`);

       return NextResponse.json({ error: "Source slot mismatch" }, { status: 409 }); 
    }


    const { data: itemInTargetSlot, error: targetCheckError } = await supabase
      .from('inventory')
      .select('id, slot')
      .eq('user_id', user.id)
      .eq('slot', newSlot)
      .neq('id', itemId) 
      .maybeSingle(); 
    if (targetCheckError) {
      console.error("Error checking target slot:", targetCheckError);
      return NextResponse.json({ error: "Failed to check target slot" }, { status: 500 });
    }


    if (itemInTargetSlot) {
 
      const { error: swapError } = await supabase
        .from('inventory')
        .update({ slot: sourceSlot })
        .eq('id', itemInTargetSlot.id)
        .eq('user_id', user.id);

      if (swapError) {
        console.error("Error swapping item (step 1):", swapError);
     
        return NextResponse.json({ error: "Failed to swap items (step 1)" }, { status: 500 });
      }

      const { error: finalMoveError } = await supabase
        .from('inventory')
        .update({ slot: newSlot })
        .eq('id', itemToMove.id) 
        .eq('user_id', user.id);

      if (finalMoveError) {
        console.error("Error swapping item (step 2):", finalMoveError);
     
        return NextResponse.json({ error: "Failed to swap items (step 2)" }, { status: 500 });
      }

   
       return NextResponse.json({
         success: true,
         movedItemId: itemToMove.id,
         swappedItemId: itemInTargetSlot.id
       });

    } else {

      const { data: updatedItem, error: updateError } = await supabase
        .from('inventory')
        .update({ slot: newSlot })
        .eq('id', itemToMove.id) 
        .eq('user_id', user.id)
        .select() 
        .single();

      if (updateError) {
        console.error("Error moving item to empty slot:", updateError);
        return NextResponse.json({ error: "Failed to move item" }, { status: 500 });
      }

       return NextResponse.json({
         success: true,
         item: updatedItem 
       });
    }

  } catch (error) {
    console.error("Uncaught exception in update_inventory_slot API:", error);
     if (error instanceof SyntaxError) {
       return NextResponse.json({ error: "Invalid JSON format in request body" }, { status: 400 });
     }
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}