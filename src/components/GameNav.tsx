"use client";

import React, { JSX, useEffect, useState } from "react";
import { 
  GiFishingPole, 
  GiAxeInStump, 
  GiVillage, 
  GiCookingPot, 
  GiMineralPearls, 
  GiForestCamp
} from "react-icons/gi";
import { getTheme, ThemeColor } from '@/lib/theme';

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
    gradient: "from-blue-400 to-blue-600", 
    icon: <GiFishingPole className="w-6 h-6 text-white" />,
    mapPosition: { top: "60%", left: "60%" }
  },
  { 
    id: 1, 
    name: "Woodcutter's Grove",
    gradient: "from-emerald-400 to-emerald-600", 
    icon: <GiAxeInStump className="w-6 h-6 text-white" />,
    mapPosition: { top: "50%", left: "20%" }
  },
  { 
    id: 2, 
    name: "Cooking Station",
    gradient: "from-amber-400 to-amber-600", 
    icon: <GiCookingPot className="w-6 h-6 text-white" />,
    mapPosition: { top: "30%", left: "40%" }
  },
  { 
    id: 3, 
    name: "Village Center",
    gradient: "from-rose-400 to-rose-600", 
    icon: <GiVillage className="w-6 h-6 text-white" />,
    mapPosition: { top: "50%", left: "70%" }
  },
  { 
    id: 4, 
    name: "Mining Cave",
    gradient: "from-purple-400 to-purple-600", 
    icon: <GiMineralPearls className="w-6 h-6 text-white" />,
    mapPosition: { top: "20%", left: "20%" }
  },
  { 
    id: 5, 
    name: "Forest Camp",
    gradient: "from-green-400 to-green-600", 
    icon: <GiForestCamp className="w-6 h-6 text-white" />,
    mapPosition: { top: "40%", left: "30%" }
  }
];

export default function LocationSelection({ onLocationSelect, selectedLocationId }: LocationSelectProps) {
  const [themeColor, setThemeColor] = useState<ThemeColor>('red');
  
  // Get the current theme on mount and when it changes
  useEffect(() => {
    const theme = getTheme();
    setThemeColor(theme.color);
    
    // Setup a MutationObserver to detect theme changes via CSS variables
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'style') {
          const theme = getTheme();
          setThemeColor(theme.color);
        }
      });
    });
    
    observer.observe(document.documentElement, { attributes: true });
    
    return () => observer.disconnect();
  }, []);

  const handleLocationSelect = (location: Location) => {
    onLocationSelect?.(location);
  };
  
  const getRingColorClass = (isSelected: boolean): string => {
    if (isSelected) {
      switch (themeColor) {
        case "red": return "ring-red-600";
        case "green": return "ring-green-600";
        case "blue": return "ring-blue-600";
        case "purple": return "ring-purple-600";
        default: return "ring-blue-600";
      }
    } else {
      return "ring-gray-300 dark:ring-gray-600";
    }
  };
  
  const getSelectedTextColor = (): string => {
    switch (themeColor) {
      case "red": return "text-red-600 dark:text-red-400";
      case "green": return "text-green-600 dark:text-green-400";
      case "blue": return "text-blue-600 dark:text-blue-400";
      case "purple": return "text-purple-600 dark:text-purple-400";
      default: return "text-blue-600 dark:text-blue-400";
    }
  };
  
  const getNavBackgroundColor = (): string => {
    switch (themeColor) {
      case "red": return "bg-gradient-to-r from-red-100 to-red-50 dark:from-red-900/30 dark:to-red-900/10";
      case "green": return "bg-gradient-to-r from-green-100 to-green-50 dark:from-green-900/30 dark:to-green-900/10";
      case "blue": return "bg-gradient-to-r from-blue-100 to-blue-50 dark:from-blue-900/30 dark:to-blue-900/10";
      case "purple": return "bg-gradient-to-r from-purple-100 to-purple-50 dark:from-purple-900/30 dark:to-purple-900/10";
      default: return "bg-white dark:bg-gray-800";
    }
  };

  const getBorderColor = (): string => {
    switch (themeColor) {
      case "red": return "border-red-300 dark:border-red-800";
      case "green": return "border-green-300 dark:border-green-800";
      case "blue": return "border-blue-300 dark:border-blue-800";
      case "purple": return "border-purple-300 dark:border-purple-800";
      default: return "border-gray-200 dark:border-gray-700";
    }
  };

  return (
    <nav className={`shadow-lg rounded-xl mx-auto my-4 max-w-4xl overflow-hidden ${getNavBackgroundColor()} border-2 ${getBorderColor()} transition-all duration-300`}>
      <div className="px-4 py-5">
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-4 justify-items-center">
          {locations.map((location) => (
            <div key={location.id} className="flex flex-col items-center w-full">
              <button
                onClick={() => handleLocationSelect(location)}
                className={`
                  w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br ${location.gradient} 
                  hover:scale-110 active:scale-95 transition-all duration-300 
                  shadow-md hover:shadow-xl
                  flex items-center justify-center
                  ${selectedLocationId === location.id 
                    ? `ring-3 ring-offset-2 ${getRingColorClass(true)} dark:ring-offset-gray-800 scale-105` 
                    : `ring-2 ring-offset-1 ${getRingColorClass(false)} dark:ring-offset-gray-800`
                  }
                `}
                aria-label={`Go to ${location.name}`}
              >
                {location.icon}
              </button>
              <span className={`mt-2 text-xs sm:text-sm font-medium text-center truncate w-full ${
                selectedLocationId === location.id 
                  ? getSelectedTextColor()
                  : "text-gray-700 dark:text-gray-300"
              }`}>
                {location.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
}
