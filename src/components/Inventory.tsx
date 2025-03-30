"use client";

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { GiSchoolBag, GiFishBucket, GiSwordsEmblem, GiMeat, GiOre, GiWoodPile } from 'react-icons/gi';
import Storage from '@/components/Storage';
import { createClient } from '@/lib/supabase';
import { InventoryItem, TOTAL_INVENTORY_SLOTS } from '@/lib/inventory';

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

type DragItem = {
  itemId: string;
  sourceSlot: number;
};

const InventoryModal = ({ 
  isOpen, 
  onClose, 
  inventory, 
  loading, 
  error,
  onMoveItem
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  inventory: InventoryItem[]; 
  loading: boolean; 
  error: string | null;
  onMoveItem: (itemId: string, sourceSlot: number, targetSlot: number) => Promise<void>;
}) => {
  const [draggingItem, setDraggingItem] = useState<DragItem | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [itemDetails, setItemDetails] = useState<InventoryItem | null>(null);

  if (!isOpen) return null;

  // Create an array of 100 slots, filling with inventory items by slot number
  const slotArray = Array(TOTAL_INVENTORY_SLOTS).fill(null);
  inventory.forEach(item => {
    if (item.slot >= 0 && item.slot < TOTAL_INVENTORY_SLOTS) {
      slotArray[item.slot] = item;
    }
  });

  const handleDragStart = (item: InventoryItem, e: React.DragEvent) => {
    if (!item) return;
    
    // Set up drag data
    e.dataTransfer.setData('application/json', JSON.stringify({
      itemId: item.id,
      sourceSlot: item.slot
    }));
    
    // Style the drag operation
    if (e.dataTransfer.setDragImage) {
      const dragPreview = document.createElement('div');
      dragPreview.innerHTML = `<div class="w-16 h-16 bg-amber-200 rounded-md flex items-center justify-center">
        <div class="text-amber-800 text-xl font-bold">${item.item_data?.name?.charAt(0) || '?'}</div>
      </div>`;
      document.body.appendChild(dragPreview);
      e.dataTransfer.setDragImage(dragPreview, 25, 25);
      setTimeout(() => document.body.removeChild(dragPreview), 0);
    }
    
    setDraggingItem({ itemId: item.id, sourceSlot: item.slot });
    setIsDragging(true);
  };

  const handleDragOver = (e: React.DragEvent, slotIndex: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e: React.DragEvent, targetSlot: number) => {
    e.preventDefault();
    
    try {
      const data = JSON.parse(e.dataTransfer.getData('application/json')) as DragItem;
      
      // Don't do anything if dropping on the same slot
      if (data.sourceSlot === targetSlot) return;
      
      await onMoveItem(data.itemId, data.sourceSlot, targetSlot);
    } catch (err) {
      console.error('Error during drop operation:', err);
    } finally {
      setDraggingItem(null);
      setIsDragging(false);
    }
  };

  const handleItemClick = (item: InventoryItem) => {
    setItemDetails(item);
  };

  const closeItemDetails = () => {
    setItemDetails(null);
  };

  return createPortal(
    <>
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998]" 
        onClick={onClose}
      />

      <div 
        className={`
          fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
          w-[95vw] sm:w-[90vw] md:w-[85vw] lg:w-[80vw] max-w-[1000px] 
          max-h-[85vh] overflow-hidden
          bg-amber-100/95 dark:bg-gray-800/95 backdrop-blur-sm 
          rounded-lg shadow-2xl p-4 sm:p-6 border-2 border-amber-700 dark:border-amber-600 
          z-[9999] flex flex-col
        `}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4 pb-3 border-b border-amber-300 dark:border-amber-700/50">
          <h2 className="text-amber-900 dark:text-amber-200 font-bold text-lg sm:text-xl">
            Inventory ({inventory.length}/{TOTAL_INVENTORY_SLOTS} slots used)
          </h2>
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
            <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2 sm:gap-3 p-1 pb-4">
              {slotArray.map((item, slotIndex) => (
                <div 
                  key={`slot-${slotIndex}`} 
                  className={`
                    w-14 h-14 sm:w-16 sm:h-16 
                    ${item ? 'bg-amber-200/80 dark:bg-gray-700/60 hover:bg-amber-300/80 dark:hover:bg-gray-600/80 hover:border-amber-700 dark:hover:border-amber-500' : 'bg-amber-200/50 dark:bg-gray-700/40'} 
                    rounded-md border ${item ? 'border-amber-600/50 dark:border-amber-500/30' : 'border-amber-600/30 dark:border-amber-500/20'} 
                    relative flex flex-col items-center justify-center p-1 
                    group transition-colors shadow-sm hover:shadow-md
                    ${draggingItem && !item ? 'border-dashed border-amber-400 dark:border-amber-400' : ''}
                    ${draggingItem?.sourceSlot === slotIndex ? 'opacity-50' : ''}
                  `}
                  title={item?.item_data?.name || `Empty Slot ${slotIndex + 1}`}
                  onDragOver={(e) => handleDragOver(e, slotIndex)}
                  onDrop={(e) => handleDrop(e, slotIndex)}
                  onClick={() => item && handleItemClick(item)}
                >
                  {item ? (
                    <>
                      <div 
                        className="flex-grow flex items-center justify-center w-full h-full scale-75 sm:scale-90"
                        draggable={true}
                        onDragStart={(e) => handleDragStart(item, e)}
                      >
                        <ItemIcon itemType={item.item_type} />
                      </div>
                      
                      <span className="absolute bottom-0 right-0 bg-amber-700 dark:bg-amber-600 text-white text-[10px] sm:text-xs px-1.5 py-0.5 rounded-tl rounded-br font-bold shadow-sm">
                        {item.quantity || 1}
                      </span>
                      
                      <span className="absolute top-0 left-0 text-[8px] text-amber-800 dark:text-amber-300 opacity-50">
                        {slotIndex + 1}
                      </span>
                    </>
                  ) : (
                    <span className="text-[8px] text-amber-800/30 dark:text-amber-300/30 absolute top-0 left-1">
                      {slotIndex + 1}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="mt-3 pt-3 border-t border-amber-300 dark:border-amber-700/50 flex justify-between">
        
          <button
            onClick={onClose}
            className="px-4 py-1 bg-amber-700 hover:bg-amber-600 text-amber-100 rounded-md 
                    transition-colors text-sm font-medium"
          >
            Close
          </button>
        </div>
      </div>

      {itemDetails && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/70" onClick={closeItemDetails}></div>
          <div className="relative z-10 bg-amber-100 dark:bg-gray-800 rounded-lg shadow-2xl p-5 max-w-md w-full mx-4">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-amber-900 dark:text-amber-200">
                {itemDetails.item_data?.name || `Unknown ${itemDetails.item_type}`}
              </h3>
              <button 
                onClick={closeItemDetails}
                className="text-amber-800 dark:text-amber-200 hover:text-amber-600"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="flex items-center mb-4">
              <div className="w-16 h-16 bg-amber-200/80 dark:bg-gray-700/60 rounded-md flex items-center justify-center mr-4">
                <ItemIcon itemType={itemDetails.item_type} />
              </div>
              <div>
                <p className="text-amber-800 dark:text-amber-300">Type: {itemDetails.item_type}</p>
                <p className="text-amber-800 dark:text-amber-300">Quantity: {itemDetails.quantity || 1}</p>
                {itemDetails.item_data?.req_level && (
                  <p className="text-amber-800 dark:text-amber-300">Required Level: {itemDetails.item_data.req_level}</p>
                )}
              </div>
            </div>
            
            <div className="mt-4 flex justify-end">
              <button 
                className="px-4 py-2 bg-amber-700 hover:bg-amber-600 text-amber-100 rounded-md transition-colors"
                onClick={closeItemDetails}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
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
        console.warn(`Error fetching item data for ${item.item_type}:${item.item_id}: ${error.message}`);
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
      console.error(`Failed to fetch item data for ${item.item_type}:${item.item_id}`, error);
      return { 
        ...item, 
        item_data: { 
          id: item.item_id,
          name: `Unknown ${item.item_type}` 
        },
        fetch_error: error instanceof Error ? error.message : 'Unknown error'
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
        if (!res.ok) throw new Error("Error loading inventory");
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

  const handleMoveItem = async (itemId: string, sourceSlot: number, targetSlot: number) => {
    try {
      const response = await fetch('/api/update_inventory_slot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          itemId,
          newSlot: targetSlot,
          sourceSlot
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to move item');
      }

      // Update the local inventory immediately for a responsive feel
      // The database update will trigger a real-time update via the Supabase subscription
      setInventory(prevInventory => {
        const updatedInventory = [...prevInventory];
        const itemIndex = updatedInventory.findIndex(item => item.id === itemId);
        
        if (itemIndex >= 0) {
          // Find the item at the target slot
          const targetItemIndex = updatedInventory.findIndex(item => item.slot === targetSlot);
          
          // Update the item being moved
          updatedInventory[itemIndex] = {
            ...updatedInventory[itemIndex],
            slot: targetSlot
          };
          
          // If there was an item at the target slot, move it to the source slot
          if (targetItemIndex >= 0) {
            updatedInventory[targetItemIndex] = {
              ...updatedInventory[targetItemIndex],
              slot: sourceSlot
            };
          }
        }
        
        return updatedInventory;
      });
    } catch (error) {
      console.error('Error moving item:', error);
      // Optionally show an error message to the user
    }
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
        {inventory.length > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center font-bold">
            {inventory.length}
          </span>
        )}
      </button>

      {isMounted && (
        <InventoryModal 
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          inventory={inventory}
          loading={loading}
          error={error}
          onMoveItem={handleMoveItem}
        />
      )}

      <Storage isOpen={isStorageOpen} onClose={() => setIsStorageOpen(false)} />
    </>
  );
}