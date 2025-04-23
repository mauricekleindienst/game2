

/**
 * Fetches the inventory and finds the lowest available inventory slot.
 * @param maxSlots - The maximum number of inventory slots (default is 28).
 * @returns The lowest available slot number, or null if the inventory is full.
 */
import { createServerSupabaseClient } from "@/lib/supabase_server";

export async function getLowestFreeSlot(maxSlots: number = 50): Promise<number | null> {
  try {
    const supabase = await createServerSupabaseClient();

    // Aktuellen Benutzer abrufen
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      console.error("User authentication error:", authError);
      return null;
    }

    // Inventar des Benutzers abrufen
    const { data: inventory, error } = await supabase
      .from("inventory")
      .select("slot")
      .eq("user_id", user.id); // Filter nach user_id

    if (error) {
      throw error;
    }

    const occupiedSlots = new Set(inventory.map((item: any) => item.slot));

    // Ersten freien Slot finden
    for (let i = 1; i <= maxSlots; i++) {
      if (!occupiedSlots.has(i)) {
        return i;
      }
    }

    return null; // Kein freier Slot verfügbar
  } catch (error) {
    console.error("Error fetching inventory:", error);
    return null;
  }
}

/**
 * Updates inventory.
 *
 * @param itemType type of item to add.
 * @param itemId id of item to add.
 * @param quantity quantity of items added.
 * @returns success: true, message: "Item added/updated", slot: assignedSlot, or error message.
 */
export async function updateInventory(
  itemType: string,
  itemId: string,
  quantity: number,
  

): Promise<string | { success: boolean; message: string; slot?: number }> {
  try {

    const response = await fetch("/api/update_inventory", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        item_type: itemType,
        item_id: itemId,
        quantity,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to update inventory: ${response.status}`);
    }

    const data = await response.json();
    if (data.success) {
      console.log("Inventory updated successfully");
      return data.message ? { success: true, message: data.message, slot: data.slot } : { success: true, message: "Inventory updated successfully", slot: data.slot };
    } else {
      throw new Error(data.error || "Unknown error");
    }
  } catch (error) {
    console.error("Error in updateInventory:", error);
    return `Error: ${error instanceof Error ? error.message : "Unknown error"}`;
  }
}