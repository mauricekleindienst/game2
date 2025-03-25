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


export const getInventoryForUser = async (userId: string): Promise<InventoryItem[]> => {
    const supabase = createClient();
    
    const { data: inventory, error } = await supabase
      .from('inventory')
      .select('*')
      .eq('user_id', userId);
      
    if (error) {
        throw new Error(error.message);
    }
    
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
        }
        
        return { 
            ...invItem, 
            item_data: itemData
        } as InventoryItem;
    });
    
    const result = await Promise.all(itemPromises);
    return result;
};