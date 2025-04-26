"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiClock, FiAward, FiTarget, FiPlay, FiStopCircle, FiBox } from 'react-icons/fi';
import { GiAnvil, GiCookingPot } from 'react-icons/gi';
import { createClient } from '@/lib/supabase';

export interface CraftingRequirement {
  itemId: string;
  itemType: string;
  itemName: string;
  quantity: number;
}

export interface CraftableItem {
  id: string;
  name: string;
  req_level: number;
  xp?: number;
  min_actiontime?: number;
  max_actiontime?: number;
  requirements: CraftingRequirement[];
  resultItemId: string;
  resultItemType: string;
  resultQuantity: number;
  [key: string]: any;
}

interface CraftingComponentProps {
  title: string;
  itemType: string;
  apiEndpoint: string;
  craftEndpoint: string;
  onItemCrafted?: (item: CraftableItem) => void;
  colorTheme?: {
    primary: string;
    secondary: string;
    text: string;
    accent: string;
  };
  actionText?: {
    inProgress: string;
    completed: string;
    button: string;
    buttonActive: string;
  };
}

export default function CraftingComponent({
  title,
  itemType,
  apiEndpoint,
  craftEndpoint,
  onItemCrafted,
  colorTheme = {
    primary: 'emerald',
    secondary: 'teal',
    text: 'white',
    accent: 'blue'
  },
  actionText = {
    inProgress: 'Crafting...',
    completed: 'Crafted!',
    button: 'Craft',
    buttonActive: 'Crafting...'
  }
}: CraftingComponentProps) {
  const [hoveredItem, setHoveredItem] = useState<number | string | null>(null);
  const [items, setItems] = useState<CraftableItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeItemId, setActiveItemId] = useState<number | string | null>(null);
  const [progressMap, setProgressMap] = useState<{[key: string]: number}>({});
  const [intervalRefs, setIntervalRefs] = useState<{[key: string]: NodeJS.Timeout | null}>({});
  const [inventory, setInventory] = useState<any[]>([]);
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error' | 'info'} | null>(null);
  
  const titleColor = `text-${colorTheme.primary}-700 dark:text-${colorTheme.primary}-400`;
  const loadingColor = `text-${colorTheme.primary}-700 dark:text-${colorTheme.primary}-400`;
  const accentColor = `text-${colorTheme.accent}-500 dark:text-${colorTheme.accent}-400`;
  const borderClass = `border-${colorTheme.primary}-200 dark:border-${colorTheme.primary}-900/50`;
  const headerBgClass = `bg-gradient-to-r from-${colorTheme.primary}-500 to-${colorTheme.secondary}-600`;
  const progressBgClass = `bg-gradient-to-r from-${colorTheme.primary}-500 to-${colorTheme.accent}-500`;
  const buttonBgClass = `bg-${colorTheme.primary}-100 dark:bg-${colorTheme.primary}-900/30`;
  const buttonTextClass = `text-${colorTheme.primary}-700 dark:text-${colorTheme.primary}-400`;
  const buttonHoverBgClass = `hover:bg-${colorTheme.primary}-200 dark:hover:bg-${colorTheme.primary}-900/50`;
  const missingItemsClass = "text-red-500 dark:text-red-400";
  const availableItemsClass = "text-green-600 dark:text-green-400";
  const disabledButtonBgClass = 'bg-gray-200 dark:bg-gray-700';
  const disabledButtonTextClass = 'text-gray-400 dark:text-gray-500';
  
  useEffect(() => {
    return () => {
      Object.values(intervalRefs).forEach(interval => {
        if (interval) clearInterval(interval);
      });
    };
  }, [intervalRefs]);
  
  const fetchInventory = async () => {
    try {
      const response = await fetch("/api/inventory");
      if (!response.ok) {
        throw new Error("Error loading inventory");
      }
      const data = await response.json();
      setInventory(data.inventory || []);
    } catch (err) {
      console.error("Error fetching inventory:", err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    }
  };
  
  useEffect(() => {
    const fetchCraftableItems = async () => {
      try {
        setLoading(true);
        const response = await fetch(apiEndpoint);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.items && Array.isArray(data.items)) {
          setItems(data.items);
        } else {
          throw new Error('Invalid data format received from API');
        }
      } catch (err) {
        console.error(`Error fetching ${itemType} data:`, err);
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCraftableItems();
    fetchInventory();
    
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      const subscription = supabase
        .channel('inventory_changes')
        .on('postgres_changes', { 
          event: '*', 
          schema: 'public', 
          table: 'inventory', 
          filter: `user_id=eq.${user.id}` 
        }, () => {
          fetchInventory();
        })
        .subscribe();
      
      return () => { subscription.unsubscribe(); };
    });
    
  }, [apiEndpoint, itemType]);

  const checkRequirements = (item: CraftableItem) => {
    if (!item.requirements || !item.requirements.length) return true;
    
    const missingItems: {requirement: CraftingRequirement, have: number}[] = [];
    
    for (const req of item.requirements) {
      const inventoryItems = inventory.filter(invItem => 
        invItem.item_id === req.itemId && invItem.item_type === req.itemType
      );
      
      const totalQuantity = inventoryItems.reduce((sum, item) => sum + (item.quantity || 0), 0);
      
      if (totalQuantity < req.quantity) {
        missingItems.push({requirement: req, have: totalQuantity});
      }
    }
    
    return missingItems.length === 0 ? true : missingItems;
  };
  
  const handleItemClick = async (item: CraftableItem) => {
    const itemId = String(item.id);
    
    if (activeItemId === item.id) {
      stopProgress(itemId);
      return;
    }
    
    const requirementsCheck = checkRequirements(item);
    
    if (requirementsCheck !== true) {
      setToast({
        message: "Missing required items for crafting!",
        type: "error"
      });
      
      setTimeout(() => setToast(null), 3000);
      return;
    }
    
    if (activeItemId !== null) {
      stopProgress(String(activeItemId));
    }
    
    setActiveItemId(item.id);
    setProgressMap(prev => ({...prev, [itemId]: 0}));
    
    startCrafting(item);
  };
  
  const stopProgress = (itemId: string) => {
    if (intervalRefs[itemId]) {
      clearInterval(intervalRefs[itemId]!);
      setIntervalRefs(prev => ({...prev, [itemId]: null}));
    }
    
    setActiveItemId(null);
    setProgressMap(prev => ({...prev, [itemId]: 0}));
  };
  
  const startCrafting = (item: CraftableItem) => {
    const id = String(item.id);
    
    const minTime = item?.min_actiontime || 3;
    const maxTime = item?.max_actiontime || 6;
    
    const actionTime = Math.floor(Math.random() * (maxTime - minTime + 1) + minTime) * 1000;
    const incrementInterval = actionTime / 20; // 20 steps to complete
    
    setProgressMap(prev => ({...prev, [id]: 0}));
    
    const interval = setInterval(() => {
      setProgressMap(prev => {
        const currentProgress = prev[id] || 0;
        const newProgress = currentProgress + 5;
        
        if (newProgress >= 100) {
          if (intervalRefs[id]) {
            clearInterval(intervalRefs[id]!);
            setIntervalRefs(prev => ({...prev, [id]: null}));
          }
          
          completeCrafting(item);
          
          const finalProgress = {...prev, [id]: 100};
          setTimeout(() => {
            setActiveItemId(null); 
            setProgressMap(p => ({...p, [id]: 0})); 
          }, 1500); 
          
          return finalProgress;
        }
        
        return {...prev, [id]: newProgress};
      });
    }, incrementInterval);
    
    setIntervalRefs(prev => ({...prev, [id]: interval}));
  };
  
  const completeCrafting = async (item: CraftableItem) => {
    try {
      const response = await fetch(craftEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          itemId: item.id,
          requirements: item.requirements,
          resultItemId: item.resultItemId,
          resultItemType: item.resultItemType,
          resultQuantity: item.resultQuantity
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to craft item');
      }
      
      setToast({
        message: `Successfully crafted ${item.name}!`,
        type: "success"
      });
      
      fetchInventory();
      
      if (onItemCrafted) {
        onItemCrafted(item);
      }
    } catch (error: any) {
      setToast({
        message: error.message || 'Failed to craft item',
        type: "error"
      });
    }
    
    setTimeout(() => setToast(null), 3000);
  };
  
  const getCraftingIcon = () => {
    switch (itemType.toLowerCase()) {
      case 'weapons':
      case 'armor': 
      case 'smithing':
        return <GiAnvil className="w-6 h-6" />;
      case 'cooking':
      case 'food':
        return <GiCookingPot className="w-6 h-6" />;
      default:
        return <FiBox className="w-5 h-5" />;
    }
  };
  
  if (loading) {
    return (
      <div className="container mx-auto py-8 flex justify-center items-center h-64">
        <motion.div 
          className={`${loadingColor} text-xl flex items-center`}
          initial={{ opacity: 0.5, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
        >
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading {itemType}...
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <span className="block sm:inline">Error loading {itemType}: {error}</span>
          <button 
            className="absolute top-0 bottom-0 right-0 px-4 py-3" 
            onClick={() => setError(null)}
          >
      
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative z-10 px-2 sm:px-0">
      <div className={`flex items-center gap-2 mb-4 ${titleColor}`}>
        {getCraftingIcon()}
        <h2 className="text-2xl font-semibold">{title}</h2>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {items.map((item, index) => {
          const isItemActive = activeItemId === item.id;
          const currentProgress = progressMap[String(item.id)] || 0;
          const isCompleted = currentProgress === 100;
          const requirementsCheck = checkRequirements(item);
          const canCraft = requirementsCheck === true;
          
          return (
            <motion.div
              key={item.id}
              className={`
                relative rounded-xl shadow-md overflow-hidden group
                transition-all duration-300 ease-in-out
                bg-white dark:bg-gray-800 border ${borderClass}
                ${isItemActive ? 'shadow-lg' : 'hover:shadow-lg'}
                touch-action-manipulation
                ${!canCraft ? 'opacity-90' : ''}
              `}
              style={{ zIndex: hoveredItem === item.id ? 40 : index }}
              whileHover={{ y: -3, scale: 1.01, zIndex: 40 }}
              whileTap={{ scale: 0.99 }}
              onClick={isCompleted ? undefined : () => handleItemClick(item)}
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <div className={`p-4 ${headerBgClass} text-white`}>
                <h3 className="font-semibold text-lg truncate">{item.name}</h3>
              </div>
              
              <div className="p-4 space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center text-gray-600 dark:text-gray-400 font-medium">
                    <FiTarget className="w-4 h-4 mr-1.5 text-gray-400" />
                    <span>Level {item.req_level}</span>
                  </div>
                  
                  {item.xp && (
                    <div className={`flex items-center font-medium ${accentColor}`}>
                      <FiAward className="w-4 h-4 mr-1.5" />
                      <span>{item.xp} XP</span>
                    </div>
                  )}
                </div>
                
                {/* Requirements Section */}
                <div className="mt-2 space-y-2">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Required Items:</h4>
                  <ul className="text-xs space-y-1.5">
                    {item.requirements.map((req, idx) => {
                      const inventoryItems = inventory.filter(invItem => 
                        invItem.item_id === req.itemId && invItem.item_type === req.itemType
                      );
                      const totalQuantity = inventoryItems.reduce((sum, item) => sum + (item.quantity || 0), 0);
                      const hasEnough = totalQuantity >= req.quantity;

                      return (
                        <li key={idx} className={`flex justify-between ${hasEnough ? availableItemsClass : missingItemsClass}`}>
                          <span>{req.itemName}</span>
                          <span className="font-medium">{totalQuantity}/{req.quantity}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                {isItemActive && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center text-gray-700 dark:text-gray-300 text-xs font-medium">
                        <FiClock className="w-3 h-3 mr-1 animate-spin [animation-duration:2s]" />
                        <span>
                          {isCompleted ? actionText.completed : actionText.inProgress}
                        </span>
                      </div>
                      <span className={`text-xs font-semibold ${isCompleted ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}`}>
                        {currentProgress}%
                      </span>
                    </div>
                    
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden relative">
                      <motion.div 
                        className={`absolute top-0 left-0 h-full rounded-full ${progressBgClass}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${currentProgress}%` }}
                        transition={{ duration: 0.15, ease: "linear" }}
                      />
                      {currentProgress > 0 && currentProgress < 100 && (
                        <motion.div 
                          className={`absolute top-0 left-0 h-full rounded-full ${progressBgClass} opacity-50`}
                          initial={{ width: `${currentProgress}%` }}
                          animate={{ width: `${currentProgress}%`, opacity: [0.5, 0.2, 0.5] }}
                          transition={{ duration: 1, repeat: Infinity }}
                        />
                      )}
                    </div>
                  </div>
                )}
                
                <div className={`mt-5 ${isItemActive && !isCompleted ? 'opacity-60' : 'opacity-100'}`}>
                  <motion.button
                    whileHover={{ scale: canCraft ? 1.02 : 1, y: canCraft ? -1 : 0 }}
                    whileTap={{ scale: canCraft ? 0.98 : 1 }}
                    className={`w-full py-2.5 px-4 rounded-lg font-semibold transition-colors duration-200 text-sm flex items-center justify-center gap-2 shadow-sm
                      ${isItemActive 
                        ? `${disabledButtonBgClass} ${disabledButtonTextClass} cursor-not-allowed`
                        : canCraft
                          ? `${buttonBgClass} ${buttonTextClass} ${buttonHoverBgClass} cursor-pointer`
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                      }
                    `}
                    disabled={isItemActive || !canCraft}
                  >
                    {isItemActive ? (
                      <>{isCompleted ? actionText.completed : actionText.buttonActive}</>
                    ) : (
                      <>{getCraftingIcon()} {`${actionText.button} ${item.name}`}</>
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {toast && (
        <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 rounded shadow-lg z-50 animate-fade-in
          ${toast.type === 'success' ? 'bg-green-600 text-white' : 
            toast.type === 'error' ? 'bg-red-600 text-white' : 
            'bg-blue-600 text-white'}`}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
}