"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { GiSwordman, GiWizardFace, GiArcheryTarget, GiTreasureMap, GiBackpack, GiChest } from "react-icons/gi";
import { FaArrowLeft, FaArrowRight, FaArrowUp, FaArrowDown } from "react-icons/fa";
import { getTheme, ThemeColor } from '@/lib/theme';

// Mock character data
const characters = [
  { id: 1, name: "Warrior", level: 12, health: 240, attack: 35, defense: 28, icon: <GiSwordman className="w-8 h-8" /> },
  { id: 2, name: "Mage", level: 10, health: 180, attack: 45, defense: 15, icon: <GiWizardFace className="w-8 h-8" /> },
];

// Mock inventory items
const inventoryItems = [
  { id: 1, name: "Health Potion", quantity: 5, description: "Restores 50 HP", rarity: "common" },
  { id: 2, name: "Mana Crystal", quantity: 3, description: "Restores 30 MP", rarity: "uncommon" },
  { id: 3, name: "Dragon Scale", quantity: 1, description: "Rare crafting material", rarity: "rare" },
  { id: 4, name: "Wooden Sword", quantity: 1, description: "+5 Attack", rarity: "common" },
  { id: 5, name: "Enchanted Amulet", quantity: 1, description: "+10% Magic Resistance", rarity: "epic" },
];

// World map tiles
const mapTiles = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 2, 2, 0, 0, 3, 3, 3, 0, 0, 2, 2, 0, 1],
  [1, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 1, 1, 4, 1, 1, 0, 0, 0, 0, 1],
  [1, 0, 3, 0, 0, 1, 0, 0, 0, 1, 0, 0, 3, 0, 1],
  [1, 0, 3, 0, 0, 4, 0, 5, 0, 4, 0, 0, 3, 0, 1],
  [1, 0, 3, 0, 0, 1, 0, 0, 0, 1, 0, 0, 3, 0, 1],
  [1, 0, 0, 0, 0, 1, 1, 4, 1, 1, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 1],
  [1, 0, 2, 2, 0, 0, 3, 3, 3, 0, 0, 2, 2, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

// Player position
const initialPlayerPosition = { x: 7, y: 7 };

// Tile colors
const getTileColor = (tileType: number, themeColor: ThemeColor) => {
  switch (tileType) {
    case 0: return `bg-${themeColor}-100 dark:bg-${themeColor}-900/30`; // Path
    case 1: return "bg-gray-500 dark:bg-gray-700"; // Wall
    case 2: return "bg-emerald-300 dark:bg-emerald-800"; // Trees
    case 3: return "bg-blue-300 dark:bg-blue-800"; // Water
    case 4: return "bg-amber-300 dark:bg-amber-800"; // Door
    case 5: return "bg-purple-300 dark:bg-purple-800"; // Special
    default: return "bg-gray-200 dark:bg-gray-800";
  }
};

// Tile walkability
const isTileWalkable = (tileType: number) => {
  return tileType === 0 || tileType === 4 || tileType === 5;
};

export default function ArenaPage() {
  const [activeTab, setActiveTab] = useState<'map' | 'inventory' | 'characters'>('map');
  const [playerPosition, setPlayerPosition] = useState(initialPlayerPosition);
  const [themeColor, setThemeColor] = useState<ThemeColor>('blue');
  const [selectedCharacter, setSelectedCharacter] = useState<number | null>(1);
  const [selectedItem, setSelectedItem] = useState<number | null>(null);
  
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const theme = getTheme();
    setThemeColor(theme.color);
    
    const observer = new MutationObserver(() => {
      const theme = getTheme();
      setThemeColor(theme.color);
    });
    
    observer.observe(document.documentElement, { attributes: true });
    
    return () => {
      observer.disconnect();
    };
  }, []);

  const movePlayer = (dx: number, dy: number) => {
    const newX = playerPosition.x + dx;
    const newY = playerPosition.y + dy;
    
    // Check boundaries and walkability
    if (
      newX >= 0 && 
      newX < mapTiles[0].length && 
      newY >= 0 && 
      newY < mapTiles.length && 
      isTileWalkable(mapTiles[newY][newX])
    ) {
      setPlayerPosition({ x: newX, y: newY });
    }
  };

  const getItemRarityClass = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-600 dark:text-gray-400';
      case 'uncommon': return 'text-green-600 dark:text-green-400';
      case 'rare': return 'text-blue-600 dark:text-blue-400';
      case 'epic': return 'text-purple-600 dark:text-purple-400';
      case 'legendary': return 'text-orange-600 dark:text-orange-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getThemeGradient = () => {
    switch (themeColor) {
      case 'red': return 'from-red-100 to-red-50 dark:from-red-900/30 dark:to-red-950/30';
      case 'green': return 'from-green-100 to-green-50 dark:from-green-900/30 dark:to-green-950/30';
      case 'blue': return 'from-blue-100 to-blue-50 dark:from-blue-900/30 dark:to-blue-950/30';
      case 'purple': return 'from-purple-100 to-purple-50 dark:from-purple-900/30 dark:to-purple-950/30';
      case 'yellow': return 'from-yellow-100 to-yellow-50 dark:from-yellow-900/30 dark:to-yellow-950/30';
      case 'pink': return 'from-pink-100 to-pink-50 dark:from-pink-900/30 dark:to-pink-950/30';
      case 'indigo': return 'from-indigo-100 to-indigo-50 dark:from-indigo-900/30 dark:to-indigo-950/30';
      case 'teal': return 'from-teal-100 to-teal-50 dark:from-teal-900/30 dark:to-teal-950/30';
      case 'orange': return 'from-orange-100 to-orange-50 dark:from-orange-900/30 dark:to-orange-950/30';
      case 'gray': return 'from-gray-100 to-gray-50 dark:from-gray-800/30 dark:to-gray-900/30';
      default: return 'from-blue-100 to-blue-50 dark:from-blue-900/30 dark:to-blue-950/30';
    }
  };

  const getThemeAccent = () => {
    switch (themeColor) {
      case 'red': return 'bg-red-500 dark:bg-red-600';
      case 'green': return 'bg-green-500 dark:bg-green-600';
      case 'blue': return 'bg-blue-500 dark:bg-blue-600';
      case 'purple': return 'bg-purple-500 dark:bg-purple-600';
      case 'yellow': return 'bg-yellow-500 dark:bg-yellow-600';
      case 'pink': return 'bg-pink-500 dark:bg-pink-600';
      case 'indigo': return 'bg-indigo-500 dark:bg-indigo-600';
      case 'teal': return 'bg-teal-500 dark:bg-teal-600';
      case 'orange': return 'bg-orange-500 dark:bg-orange-600';
      case 'gray': return 'bg-gray-500 dark:bg-gray-600';
      default: return 'bg-blue-500 dark:bg-blue-600';
    }
  };

  const getThemeText = () => {
    switch (themeColor) {
      case 'red': return 'text-red-600 dark:text-red-400';
      case 'green': return 'text-green-600 dark:text-green-400';
      case 'blue': return 'text-blue-600 dark:text-blue-400';
      case 'purple': return 'text-purple-600 dark:text-purple-400';
      case 'yellow': return 'text-yellow-600 dark:text-yellow-400';
      case 'pink': return 'text-pink-600 dark:text-pink-400';
      case 'indigo': return 'text-indigo-600 dark:text-indigo-400';
      case 'teal': return 'text-teal-600 dark:text-teal-400';
      case 'orange': return 'text-orange-600 dark:text-orange-400';
      case 'gray': return 'text-gray-600 dark:text-gray-400';
      default: return 'text-blue-600 dark:text-blue-400';
    }
  };

  const getThemeBorder = () => {
    switch (themeColor) {
      case 'red': return 'border-red-300 dark:border-red-700';
      case 'green': return 'border-green-300 dark:border-green-700';
      case 'blue': return 'border-blue-300 dark:border-blue-700';
      case 'purple': return 'border-purple-300 dark:border-purple-700';
      case 'yellow': return 'border-yellow-300 dark:border-yellow-700';
      case 'pink': return 'border-pink-300 dark:border-pink-700';
      case 'indigo': return 'border-indigo-300 dark:border-indigo-700';
      case 'teal': return 'border-teal-300 dark:border-teal-700';
      case 'orange': return 'border-orange-300 dark:border-orange-700';
      case 'gray': return 'border-gray-300 dark:border-gray-700';
      default: return 'border-blue-300 dark:border-blue-700';
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${getThemeGradient()} pt-24 pb-16 px-4`}>
      <div className="max-w-6xl mx-auto">
        <h1 className={`text-3xl font-bold mb-6 ${getThemeText()}`}>Arena</h1>
        
        <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-xl border ${getThemeBorder()} overflow-hidden`}>
          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            <button 
              onClick={() => setActiveTab('map')}
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                activeTab === 'map' 
                  ? `${getThemeAccent()} text-white` 
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <GiTreasureMap className="inline-block mr-2 w-5 h-5" />
              World Map
            </button>
            <button 
              onClick={() => setActiveTab('inventory')}
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                activeTab === 'inventory' 
                  ? `${getThemeAccent()} text-white` 
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <GiBackpack className="inline-block mr-2 w-5 h-5" />
              Inventory
            </button>
            <button 
              onClick={() => setActiveTab('characters')}
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                activeTab === 'characters' 
                  ? `${getThemeAccent()} text-white` 
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <GiSwordman className="inline-block mr-2 w-5 h-5" />
              Characters
            </button>
          </div>
          
          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'map' && (
              <div>
                <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">World Map</h2>
                
                <div className="flex flex-col items-center">
                  {/* Game Map */}
                  <div className="mb-6 border-4 border-gray-800 dark:border-gray-600 rounded-lg overflow-hidden shadow-lg">
                    <div className="grid grid-cols-15 gap-0">
                      {mapTiles.map((row, y) => 
                        row.map((tile, x) => (
                          <div 
                            key={`${x}-${y}`} 
                            className={`w-8 h-8 sm:w-10 sm:h-10 ${getTileColor(tile, themeColor)} relative`}
                          >
                            {playerPosition.x === x && playerPosition.y === y && (
                              <div className={`absolute inset-0 flex items-center justify-center ${getThemeAccent()} rounded-full m-1`}>
                                <span className="text-white font-bold">P</span>
                              </div>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                  
                  {/* Controls */}
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <div></div>
                    <button 
                      onClick={() => movePlayer(0, -1)} 
                      className={`p-3 ${getThemeAccent()} rounded-lg text-white hover:opacity-90 active:scale-95 transition-all`}
                    >
                      <FaArrowUp className="mx-auto" />
                    </button>
                    <div></div>
                    
                    <button 
                      onClick={() => movePlayer(-1, 0)} 
                      className={`p-3 ${getThemeAccent()} rounded-lg text-white hover:opacity-90 active:scale-95 transition-all`}
                    >
                      <FaArrowLeft className="mx-auto" />
                    </button>
                    <div></div>
                    <button 
                      onClick={() => movePlayer(1, 0)} 
                      className={`p-3 ${getThemeAccent()} rounded-lg text-white hover:opacity-90 active:scale-95 transition-all`}
                    >
                      <FaArrowRight className="mx-auto" />
                    </button>
                    
                    <div></div>
                    <button 
                      onClick={() => movePlayer(0, 1)} 
                      className={`p-3 ${getThemeAccent()} rounded-lg text-white hover:opacity-90 active:scale-95 transition-all`}
                    >
                      <FaArrowDown className="mx-auto" />
                    </button>
                    <div></div>
                  </div>
                  
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    <p>Use the arrow buttons to move around the map.</p>
                    <p className="mt-2">Current position: ({playerPosition.x}, {playerPosition.y})</p>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'inventory' && (
              <div>
                <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Inventory</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className={`border ${getThemeBorder()} rounded-lg p-4`}>
                    <h3 className="text-lg font-medium mb-3 text-gray-700 dark:text-gray-300">Items</h3>
                    <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
                      {inventoryItems.map(item => (
                        <div 
                          key={item.id}
                          onClick={() => setSelectedItem(item.id === selectedItem ? null : item.id)}
                          className={`p-3 rounded-lg cursor-pointer transition-colors ${
                            selectedItem === item.id 
                              ? `bg-${themeColor}-100 dark:bg-${themeColor}-900/50 border-2 ${getThemeBorder()}` 
                              : 'bg-gray-100 dark:bg-gray-700/50 hover:bg-gray-200 dark:hover:bg-gray-700'
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <span className={`font-medium ${getItemRarityClass(item.rarity)}`}>{item.name}</span>
                            <span className="text-sm text-gray-500 dark:text-gray-400">x{item.quantity}</span>
                          </div>
                          {selectedItem === item.id && (
                            <p className="text-sm mt-2 text-gray-600 dark:text-gray-400">{item.description}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className={`border ${getThemeBorder()} rounded-lg p-4`}>
                    <h3 className="text-lg font-medium mb-3 text-gray-700 dark:text-gray-300">Equipment</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className={`aspect-square rounded-lg border-2 border-dashed ${getThemeBorder()} flex items-center justify-center`}>
                        <span className="text-gray-400 dark:text-gray-500">Helmet</span>
                      </div>
                      <div className={`aspect-square rounded-lg border-2 border-dashed ${getThemeBorder()} flex items-center justify-center`}>
                        <span className="text-gray-400 dark:text-gray-500">Armor</span>
                      </div>
                      <div className={`aspect-square rounded-lg border-2 border-dashed ${getThemeBorder()} flex items-center justify-center`}>
                        <span className="text-gray-400 dark:text-gray-500">Weapon</span>
                      </div>
                      <div className={`aspect-square rounded-lg border-2 border-dashed ${getThemeBorder()} flex items-center justify-center`}>
                        <span className="text-gray-400 dark:text-gray-500">Shield</span>
                      </div>
                      <div className={`aspect-square rounded-lg border-2 border-dashed ${getThemeBorder()} flex items-center justify-center`}>
                        <span className="text-gray-400 dark:text-gray-500">Ring</span>
                      </div>
                      <div className={`aspect-square rounded-lg border-2 border-dashed ${getThemeBorder()} flex items-center justify-center`}>
                        <span className="text-gray-400 dark:text-gray-500">Amulet</span>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <h4 className="font-medium mb-2 text-gray-700 dark:text-gray-300">Gold</h4>
                      <div className={`p-3 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center`}>
                        <GiChest className="text-amber-500 mr-2 w-5 h-5" />
                        <span className="font-medium text-amber-700 dark:text-amber-300">1,250</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'characters' && (
              <div>
                <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Characters</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {characters.map(character => (
                    <div 
                      key={character.id}
                      onClick={() => setSelectedCharacter(character.id === selectedCharacter ? null : character.id)}
                      className={`p-4 rounded-lg cursor-pointer transition-all ${
                        selectedCharacter === character.id 
                          ? `bg-${themeColor}-100 dark:bg-${themeColor}-900/50 border-2 ${getThemeBorder()} shadow-lg` 
                          : 'bg-gray-100 dark:bg-gray-700/50 hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      <div className="flex items-center mb-3">
                        <div className={`p-3 rounded-full ${getThemeAccent()} mr-3`}>
                          {character.icon}
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-gray-800 dark:text-gray-200">{character.name}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Level {character.level}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600 dark:text-gray-400">Health</span>
                            <span className="font-medium text-gray-800 dark:text-gray-200">{character.health}</span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div className="bg-red-500 h-2 rounded-full" style={{ width: '100%' }}></div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 mt-3">
                          <div>
                            <span className="text-sm text-gray-600 dark:text-gray-400">Attack</span>
                            <p className="font-medium text-gray-800 dark:text-gray-200">{character.attack}</p>
                          </div>
                          <div>
                            <span className="text-sm text-gray-600 dark:text-gray-400">Defense</span>
                            <p className="font-medium text-gray-800 dark:text-gray-200">{character.defense}</p>
                          </div>
                        </div>
                        
                        {selectedCharacter === character.id && (
                          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                            <button 
                              className={`w-full py-2 px-4 rounded-lg ${getThemeAccent()} text-white font-medium hover:opacity-90 active:scale-95 transition-all`}
                            >
                              Select Character
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 