import { createClient } from './supabase';

export interface InventoryItem {
    id: string;
    user_id: string;
    item_type: string;
    item_id: string;
    slot: number;
    quantity: number;
    item_data?: {
        id: string;
        name: string;
        req_level?: number;
        [key: string]: any;
    };
    fetch_error?: string | null;
}

// Total number of inventory slots
export const TOTAL_INVENTORY_SLOTS = 100;

export const getInventoryForUser = async (userId: string): Promise<InventoryItem[]> => {
    const supabase = createClient();
    
    const { data: inventory, error } = await supabase
      .from('inventory')
      .select('*')
      .eq('user_id', userId);
      
    if (error) {
        throw new Error(error.message);
    }
    
    // Initialize an array with 100 empty slots
    const organizedInventory: (InventoryItem | null)[] = Array(TOTAL_INVENTORY_SLOTS).fill(null);
    
    if (!inventory || inventory.length === 0) {
        return [];
    }
    
    const itemPromises = inventory.map(async (invItem): Promise<InventoryItem> => {
        let itemData = null;
        
        try {
            const tableName = invItem.item_type;
            
            const { data, error } = await supabase
                .from(tableName)
                .select('*')
                .eq('id', invItem.item_id)
                .single();
                
            if (!error && data) {
                itemData = data;
            }
        } catch (error) {
            console.warn(`Error fetching item data for ${invItem.item_type}:${invItem.item_id}`);
        }
        
        return { 
            ...invItem, 
            item_data: itemData
        } as InventoryItem;
    });
    
    const itemsWithData = await Promise.all(itemPromises);
    
    itemsWithData.forEach(item => {
        const zeroSlot = item.slot; // Assume slot from DB is already 0-based
        if (zeroSlot >= 0 && zeroSlot < TOTAL_INVENTORY_SLOTS) {
            organizedInventory[zeroSlot] = { ...item, slot: zeroSlot };
        } else {
            console.warn(`Item with ID ${item.id} has invalid slot number: ${item.slot}`);
        }
    });
    
    return organizedInventory.filter(item => item !== null) as InventoryItem[];
};

export const findNextAvailableSlot = async (userId: string): Promise<number> => {
    const inventory = await getInventoryForUser(userId);
    
    const occupiedSlots = new Set(inventory.map(item => item.slot));
    
    for (let i = 0; i < TOTAL_INVENTORY_SLOTS; i++) {
        if (!occupiedSlots.has(i)) {
            return i;
        }
    }
    
    return -1;
};

export const addItemToInventory = async (
    userId: string,
    itemType: string,
    itemId: string,
    quantity: number = 1,
    specificSlot?: number
): Promise<{ success: boolean; error?: string; item?: InventoryItem }> => {
    const supabase = createClient();
    
    try {
        let slot = specificSlot;
        if (slot === undefined) {
            slot = await findNextAvailableSlot(userId);
            if (slot === -1) {
                return { success: false, error: "Inventory is full" };
            }
        }
        
        if (specificSlot !== undefined) {
            const { data, error } = await supabase
                .from('inventory')
                .select('*')
                .eq('user_id', userId)
                .eq('slot', slot);
                
            if (!error && data && data.length > 0) {
                return { success: false, error: "Slot is already occupied" };
            }
        }
        
        const { data, error } = await supabase
            .from('inventory')
            .insert({
                user_id: userId,
                item_type: itemType,
                item_id: itemId,
                slot: slot, 
                quantity
            })
            .select()
            .single();
            
        if (error) {
            return { success: false, error: error.message };
        }
        
        return { success: true, item: data as InventoryItem };
    } catch (error) {
        return { 
            success: false, 
            error: error instanceof Error ? error.message : "Unknown error occurred"
        };
    }
};