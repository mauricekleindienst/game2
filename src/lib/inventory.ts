import { createClient } from './supabase';

export interface InventoryItem {
    id: string;
    user_id: string;
    item_type: string;
    item_id: string;
    slot: number;
    quantity: number;
    item_data?: any;


}

export const getInventoryForUser = async (userId: string) => {
    const supabase = createClient();
    const { data: inventory, error } = await supabase
      .from('inventory')
      .select('*')
      .eq('user_id', userId);

    if (error) throw new Error(error.message);
    if (!inventory) return [];

    const itemPromises = inventory.map(async (invItem) => {
        let itemData = null;

        if (invItem.item_type === 'fish') {
            const { data } = await supabase.from('fish').select('*').eq('id', invItem.item_id).single();
            itemData = data;
          } else if (invItem.item_type === 'tool') {
            const { data } = await supabase.from('tools').select('*').eq('id', invItem.item_id).single();
            itemData = data;
          } else if (invItem.item_type === 'resource') {
            const { data } = await supabase.from('resources').select('*').eq('id', invItem.item_id).single();
            itemData = data;
          }

        return { ...invItem, item_data: itemData };
    });

    return await Promise.all(itemPromises);
};