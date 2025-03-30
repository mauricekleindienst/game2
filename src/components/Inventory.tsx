"use client";

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { GiSchoolBag, GiFishBucket, GiSwordsEmblem, GiMeat, GiOre, GiWoodPile } from 'react-icons/gi';
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


const InventoryModal = ({ 
  isOpen, 
  onClose, 
  inventory, 
  loading, 
  error 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  inventory: InventoryItem[]; 
  loading: boolean; 
  error: string | null;
}) => {
  if (!isOpen) return null;

  return createPortal(
    <>
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998]" 
        onClick={onClose}
      />

      <div 
        className={`
          fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
          w-[95vw] sm:w-[90vw] md:w-[85vw] lg:w-[80vw] max-w-[900px] 
          max-h-[85vh] overflow-hidden
          bg-amber-100/95 dark:bg-gray-800/95 backdrop-blur-sm 
          rounded-lg shadow-2xl p-4 sm:p-6 border-2 border-amber-700 dark:border-amber-600 
          z-[9999] flex flex-col
        `}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4 pb-3 border-b border-amber-300 dark:border-amber-700/50">
          <h2 className="text-amber-900 dark:text-amber-200 font-bold text-lg sm:text-xl">Inventory</h2>
          <button
            onClick={onClose}
            className="text-amber-800 dark:text-amber-200 hover:text-amber-600 dark:hover:text-amber-400 
                     transition-colors p-1 rounded-full hover:bg-amber-200 dark:hover:bg-amber-700/50"
            aria-label="Close inventory"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-48 text-amber-700 dark:text-amber-300">
            <p className="text-lg">Loading Inventory...</p>
          </div>
        ) : error ? (
          <div className="text-red-600 dark:text-red-400 p-4 bg-red-100 dark:bg-red-900/30 rounded-md">
            <p className="text-lg font-medium">Error:</p>
            <p>{error}</p>
          </div>
        ) : (
          <div className="overflow-y-auto flex-grow pr-2 custom-scrollbar">
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2 sm:gap-3 p-1 pb-4">
              {inventory.length > 0 ? (
                inventory.map((item, i) => (
                  <div 
                    key={item.id || i} 
                    className={`
                      w-14 h-14 sm:w-16 sm:h-16 md:w-18 md:h-18 lg:w-20 lg:h-20 
                      bg-amber-200/80 dark:bg-gray-700/60 
                      rounded-md border border-amber-600/50 dark:border-amber-500/30 
                      relative flex flex-col items-center justify-center p-1 
                      group hover:bg-amber-300/80 dark:hover:bg-gray-600/80 hover:border-amber-700 dark:hover:border-amber-500 
                      transition-colors shadow-sm hover:shadow-md
                    `}
                    title={item.item_data?.name || item.item_type}
                  >
                    <div className="flex-grow flex items-center justify-center w-full h-full scale-75 sm:scale-90">
                      <ItemIcon itemType={item.item_type} />
                    </div>
                    
                    <span className="absolute bottom-0 right-0 bg-amber-700 dark:bg-amber-600 text-white text-[10px] sm:text-xs px-1.5 py-0.5 rounded-tl rounded-br font-bold shadow-sm">
                      {item.quantity || 1}
                    </span>
                  </div>
                ))
              ) : (
                [...Array(64)].map((_, i) => (
                  <div 
                    key={`empty-${i}`} 
                    className="w-14 h-14 sm:w-16 sm:h-16 md:w-18 md:h-18 lg:w-20 lg:h-20 bg-amber-200/50 dark:bg-gray-700/40 rounded-md border border-amber-600/30 dark:border-amber-500/20 shadow-inner opacity-70" 
                  />
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </>,
    document.body
  );
};

export default function Inventory() {
  const [isOpen, setIsOpen] = useState(false);
  const [isStorageOpen, setIsStorageOpen] = useState(false);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);
  
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
        className="relative inline-flex w-16 h-16 rounded-full bg-gradient-to-br from-amber-700 to-amber-900
          hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1
          items-center justify-center"
        aria-label="Toggle inventory"
      >
        <GiSchoolBag className="w-8 h-8 text-amber-100" />
      </button>

      {isMounted && (
        <InventoryModal 
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          inventory={inventory}
          loading={loading}
          error={error}
        />
      )}

      <Storage isOpen={isStorageOpen} onClose={() => setIsStorageOpen(false)} />
    </>
  );
}