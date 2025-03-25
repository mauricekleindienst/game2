"use client";

import React, { useState, useEffect } from 'react';
import { GiSchoolBag, GiFishBucket, GiSwordsEmblem , GiMeat, GiOre, GiWoodPile       } from 'react-icons/gi';
import Storage from '@/components/Storage';
import { createClient } from '@/lib/supabase';
import { InventoryItem } from '@/lib/inventory';

const ItemIcon = ({ itemType }: { itemType: string }) => {
  switch (itemType) {
    case 'fish':
      return <GiFishBucket className="w-8 h-8 text-blue-500" />;
    case 'food':
      return <GiMeat className="w-8 h-8 text-red-500" />;
    case 'weapons':
      return <GiSwordsEmblem className="w-8 h-8 text-gray-700" />;
    case 'ores':
      return <GiOre className="w-8 h-8 text-stone-600" />;
    case 'ingots':
      return <GiOre className="w-8 h-8 text-yellow-600" />;
    case 'wood':
      return <GiWoodPile className="w-8 h-8 text-amber-700" />;
    default:
      return <GiFishBucket className="w-8 h-8 text-gray-500" />;
  }
};

export default function Inventory() {
  const [isOpen, setIsOpen] = useState(false);
  const [isStorageOpen, setIsStorageOpen] = useState(false);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const fetchItemData = async (item: InventoryItem): Promise<InventoryItem> => {
    const supabase = createClient();
    let itemData = null;
    
    try {
      const tableName = item.item_type;
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .eq('id', item.item_id)
        .single();
        
      if (error) {
      } else if (data) {
        itemData = data;
      } else {
        itemData = { 
          id: item.item_id,
          name: `Unknown ${item.item_type}` 
        };
      }
      
      return { ...item, item_data: itemData };
    } catch (error) {
      return { 
        ...item, 
        item_data: { 
          id: item.item_id,
          name: `Unknown ${item.item_type}` 
        } 
      };
    }
  };

  useEffect(() => {
    fetchInventory();
    
    const supabase = createClient();
    
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      
      const subscription = supabase
        .channel('inventory_changes')
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'inventory',
            filter: `user_id=eq.${user.id}`,
          },
          async (payload) => {
            const baseItem = payload.new as InventoryItem;
            const updatedItem = await fetchItemData(baseItem);
            
            setInventory(currentInventory => 
              currentInventory.map(item => 
                item.id === updatedItem.id ? updatedItem : item
              )
            );
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'inventory',
            filter: `user_id=eq.${user.id}`,
          },
          async (payload) => {
            const baseItem = payload.new as InventoryItem;
            const newItem = await fetchItemData(baseItem);
            
            setInventory(currentInventory => [...currentInventory, newItem]);
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'DELETE',
            schema: 'public',
            table: 'inventory',
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            const deletedItem = payload.old;
            setInventory(currentInventory => 
              currentInventory.filter(item => item.id !== deletedItem.id)
            );
          }
        )
        .subscribe();
        
      return () => {
        subscription.unsubscribe();
      };
    });
  }, []);
  
  const fetchInventory = () => {
    setLoading(true);
    fetch("/api/inventory")
      .then(res => {
        if (!res.ok) throw new Error("Fehler beim Laden des Inventars");
        return res.json();
      })
      .then(async data => {
        let inventoryWithData = data.inventory || [];
        
        const itemsNeedingData = inventoryWithData.filter((item: InventoryItem) => !item.item_data?.name);
        
        if (itemsNeedingData.length > 0) {
          const itemsWithData = await Promise.all(
            itemsNeedingData.map((item: InventoryItem) => fetchItemData(item))
          );
          
          inventoryWithData = inventoryWithData.map((item: InventoryItem) => {
            const matchingItem = itemsWithData.find(i => i.id === item.id);
            return matchingItem || item;
          });
        }
        
        setInventory(inventoryWithData);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-8 left-8 w-16 h-16 rounded-full bg-gradient-to-br from-amber-700 to-amber-900
          hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1
          flex items-center justify-center"
        aria-label="Toggle inventory"
      >
        <GiSchoolBag className="w-8 h-8 text-amber-100" />
      </button>

      {isOpen && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-228 h-160 bg-amber-100 rounded-lg shadow-xl p-6 border-2 border-amber-700 overflow-y-auto z-[1000]">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-amber-900 font-bold text-xl">Inventory</h2>
          
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center h-48">
              <p className="text-lg">Loading Inventory...</p>
            </div>
          ) : error ? (
            <div className="text-red-500 p-2">
              <p className="text-lg">{error}</p>
            </div>
          ) : (
            <div className="grid grid-cols-10 gap-4 p-2">
              {inventory.length > 0 ? (
                inventory.map((item, i) => (
                  <div key={i} className="w-20 h-20 bg-amber-200 rounded-lg border-2 border-amber-600 relative flex flex-col items-center justify-center group hover:bg-amber-300 hover:border-amber-700 transition-colors shadow-md">
                    <ItemIcon itemType={item.item_type} />
                    <span className="absolute bottom-0 left-0 bg-amber-700 text-amber-100 text-sm px-2 py-0.5 rounded-br rounded-tl font-medium">
                      {item.quantity || 1}
                    </span>
                    
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-gray-800 text-white text-sm rounded-md p-2 w-max opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-lg">
                      <span className="font-bold">
                        {item.item_data?.name || `${item.item_type}`}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                [...Array(64)].map((_, i) => (
                  <div key={i} className="w-20 h-20 bg-amber-200 rounded-lg border-2 border-amber-600 shadow-md" />
                ))
              )}
            </div>
          )}
        </div>
      )}

      <Storage isOpen={isStorageOpen} onClose={() => setIsStorageOpen(false)} />
    </>
  );
}