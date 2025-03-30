import { createClient } from './supabase';

export interface GameItem {
  id: string;
  name: string;
  req_level: number;
  [key: string]: any;
}

export interface ItemHandler<T extends GameItem> {
  getAll: () => Promise<T[]>;
  getById: (itemId: string | number) => Promise<T | null>;
}
export const createBaseItem = <T extends GameItem>(tableName: string): ItemHandler<T> => {
  return {
    getAll: async (): Promise<T[]> => {
      const supabase = createClient();
      
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .order('req_level', { ascending: true });
        
      if (error) {
        throw new Error(`Error fetching items from ${tableName}: ${error.message}`);
      }
      
      if (!data || data.length === 0) {
        return [];
      }
      
      return data as T[];
    },
    
    getById: async (itemId: string | number): Promise<T | null> => {
      const supabase = createClient();
      
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .eq('id', itemId)
        .single();
        
      if (error) {
        return null;
      }
      
      return data as T;
    }
  };
}; 