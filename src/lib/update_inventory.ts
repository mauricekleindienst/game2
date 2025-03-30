import { createServerSupabaseClient } from "@/lib/supabase_server";
import { getLowestFreeSlot } from "@/utils/inventory_util";

export async function updateInventory(data: {
  item_type: string;
  item_id: string;
  slot?: number | null;
  quantity: number;
  user_id: string;
}) {
  const supabase = await createServerSupabaseClient();

  // Authentifizierung des Nutzers
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: "User not authenticated" };
  }

  data.user_id = user.id;

 
  // Überprüfen, ob der Nutzer das Item bereits besitzt
  const { data: existingItem, error } = await supabase
    .from("inventory")
    .select("*")
    .eq("user_id", data.user_id)
    .eq("item_id", data.item_id)
    .single();

  if (error && error.code !== "PGRST116") {
    // Fehlerbehandlung bei anderen Fehlercodes
    console.error("Fehler beim Abrufen des Inventars:", error);
    return { error: "Failed to retrieve inventory data." };
  }

  if (existingItem) {
    // Falls das Item existiert, aktualisiere die Menge
    const newQuantity = existingItem.quantity + data.quantity;
    
    if (newQuantity <= 0) {
      // Falls die Menge 0 oder negativ wird, lösche das Item aus dem Inventar
      const { error: deleteError } = await supabase
        .from("inventory")
        .delete()
        .eq("user_id", data.user_id)
        .eq("item_id", data.item_id)
        .eq("slot",data.slot);


      if (deleteError) {
        console.error("Fehler beim Löschen des Items:", deleteError);
        return { error: "Failed to delete item from inventory." };
      }
    } else {
      // Sonst aktualisiere die Menge
      const { error: updateError } = await supabase
        .from("inventory")
        .update({ quantity: newQuantity })
        .eq("user_id", data.user_id)
        .eq("item_id", data.item_id)


      if (updateError) {
        console.error("Fehler beim Aktualisieren des Items:", updateError);
        return { error: "Failed to update item quantity." };
      }
    }
  } else if (data.quantity > 0) {
     // Hole den niedrigsten freien Slot
  const lowestSlot = await getLowestFreeSlot();
  if (lowestSlot === null) {
    return { error: "No free slot available." };
  }
  data.slot = lowestSlot;

    // Falls das Item nicht existiert und eine positive Menge hinzugefügt wird, erstelle es
    const { error: insertError } = await supabase.from("inventory").insert({
      user_id: data.user_id,
      item_id: data.item_id,
      item_type: data.item_type,
      slot: data.slot,
      quantity: data.quantity,
    });

    if (insertError) {
      console.error("Fehler beim Einfügen des Items:", insertError);
      return { error: "Failed to insert new item into inventory." };
    }
  }

  return { success: true };
}
