"use client";

import React, { JSX, useState } from "react";
import { 
  GiFishingPole, 
  GiAxeInStump, 
  GiVillage, 
  GiCookingPot, 
  GiMineralPearls, 
  GiForestCamp,
  GiSwordman,
  GiTreasureMap,
  GiCastle,
  GiShop,
  GiBlacksmith,
  GiStable,
  GiSwapBag
} from "react-icons/gi";

export type Location = {
  id: number;
  name: string;
  gradient: string;
  icon: JSX.Element;
  mapPosition: { top: string; left: string };
};

export type LocationSelectProps = {
  onLocationSelect?: (location: Location | null) => void;
  selectedLocationId?: number | null;
};

export const locations: Location[] = [
  { 
    id: 0, 
    name: "Fishing Dock",
    gradient: "from-red-400 to-red-600", 
    icon: <GiFishingPole className="w-8 h-8 text-white" />,
    mapPosition: { top: "60%", left: "60%" }
  },
  { 
    id: 1, 
    name: "Woodcutter's Grove",
    gradient: "from-blue-400 to-blue-600", 
    icon: <GiAxeInStump className="w-8 h-8 text-white" />,
    mapPosition: { top: "50%", left: "20%" }
  },
  { 
    id: 2, 
    name: "Cooking Station",
    gradient: "from-green-400 to-green-600", 
    icon: <GiCookingPot className="w-8 h-8 text-white" />,
    mapPosition: { top: "30%", left: "40%" }
  },
  { 
    id: 3, 
    name: "Village Center",
    gradient: "from-yellow-400 to-yellow-600", 
    icon: <GiVillage className="w-8 h-8 text-white" />,
    mapPosition: { top: "50%", left: "70%" }
  },
  { 
    id: 4, 
    name: "Mining Cave",
    gradient: "from-purple-400 to-purple-600", 
    icon: <GiMineralPearls className="w-8 h-8 text-white" />,
    mapPosition: { top: "20%", left: "20%" }
  },

];

export default function LocationSelection({ onLocationSelect, selectedLocationId }: LocationSelectProps) {
  const [selectedAction, setSelectedAction] = useState<number | null>(null);
  const [showLocations, setShowLocations] = useState(true);

  const actions = [
    { id: 0, gradient: "from-orange-400 to-orange-600", icon: <GiSwordman className="w-8 h-8 text-white" />, name: "Adventure" },
    { id: 1, gradient: "from-amber-400 to-amber-600", icon: <GiTreasureMap className="w-8 h-8 text-white" />, name: "Quest" },
    { id: 2, gradient: "from-lime-400 to-lime-600", icon: <GiCastle className="w-8 h-8 text-white" />, name: "Castle" },
    { id: 3, gradient: "from-cyan-400 to-cyan-600", icon: <GiShop className="w-8 h-8 text-white" />, name: "Shop" },
    { id: 4, gradient: "from-rose-400 to-rose-600", icon: <GiBlacksmith className="w-8 h-8 text-white" />, name: "Blacksmith" },
    { id: 5, gradient: "from-indigo-400 to-indigo-600", icon: <GiStable className="w-8 h-8 text-white" />, name: "Stable" },
  ];

  const handleLocationSelect = (location: Location) => {
    onLocationSelect?.(location);
  };

  const handleActionSelect = (id: number) => {
    setSelectedAction(id);
  };

  const toggleView = () => {
    setShowLocations(!showLocations);
    if (!showLocations) {
      onLocationSelect?.(null);
    }
  };

  const renderButtons = (items: any[], selectedId: number | null, onSelect: (item: any) => void) => (
    <div className="flex justify-center gap-4">
      {items.map((item) => (
        <div key={item.id} className="flex flex-col items-center">
          <button
            onClick={() => onSelect(item)}
            className={`
              w-12 h-12 rounded-full bg-gradient-to-br ${item.gradient} 
              hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl
              flex items-center justify-center
              ${selectedId === item.id 
                ? "ring-4 ring-offset-2 ring-blue-600 dark:ring-offset-gray-800 scale-110" 
                : "ring-2 ring-offset-2 ring-gray-300 dark:ring-offset-gray-800"
              }
            `}
            aria-label={`Select ${item.name}`}
          >
            {item.icon}
            <span className="sr-only">{item.name}</span>
          </button>
          <span className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            {item.name}
          </span>
        </div>
      ))}
    </div>
  );

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-4 relative">
          <button
            onClick={toggleView}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-gray-200 dark:bg-gray-700 
              rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-300
              shadow-md hover:shadow-lg"
            aria-label="Switch view"
          >
            <GiSwapBag className="w-6 h-6 text-gray-700 dark:text-white" />
          </button>

          <div className="transition-all duration-300">
            {showLocations ? 
              renderButtons(locations, selectedLocationId ?? null, handleLocationSelect) :
              renderButtons(actions, selectedAction, handleActionSelect)
            }
          </div>
        </div>
      </div>
    </nav>
  );
}
