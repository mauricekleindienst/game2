"use client";

import React, { JSX, useEffect, useState, useRef } from "react";
import { 
  GiFishingPole, 
  GiAxeInStump, 
  GiCookingPot, 
  GiMineralPearls, 
  GiBlacksmith,
  GiFarmer
} from "react-icons/gi";
import { FiMenu, FiX } from "react-icons/fi";
import { getTheme, ThemeColor } from '@/lib/theme';
import UserNavMenu from "./UserNavMenu";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import SettingsModal from "./SettingsModal";
import { createPortal } from 'react-dom';

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
  activeThemeColor?: string;
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
    mapPosition: { top: "20%", left: "10%" }
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
    name: "Farmland",
    gradient: "from-rose-400 to-rose-600", 
    icon: <GiFarmer className="w-6 h-6 text-white" />,
    mapPosition: { top: "50%", left: "80%" }
  },
  { 
    id: 4, 
    name: "Mining Cave",
    gradient: "from-purple-400 to-purple-600", 
    icon: <GiMineralPearls className="w-6 h-6 text-white" />,
    mapPosition: { top: "40%", left: "20%" }
  },
  { 
    id: 5, 
    name: "Blacksmith",
    gradient: "from-green-400 to-green-600", 
    icon: <GiBlacksmith className="w-6 h-6 text-white" />,
    mapPosition: { top: "40%", left: "30%" }
  }
];

export default function LocationSelection({ onLocationSelect, selectedLocationId, activeThemeColor }: LocationSelectProps) {
  const [themeColor, setThemeColor] = useState<ThemeColor>('blue');
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const checkIfMobile = () => {
      const mobileCheck = window.innerWidth < 640;
      setIsMobile(mobileCheck);
      if (!mobileCheck) {
        setIsMobileMenuOpen(false);
      }
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);
  
  useEffect(() => {
    if (activeThemeColor) {
      setThemeColor(activeThemeColor as ThemeColor);
    }
  }, [activeThemeColor]);
  
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const theme = getTheme();
    setThemeColor(theme.color);
    
    const observer = new MutationObserver(() => {
      const theme = getTheme();
      setThemeColor(theme.color);
    });
    
    observer.observe(document.documentElement, { attributes: true });
    
    const intervalId = setInterval(() => {
      const theme = getTheme();
      setThemeColor(theme.color);
    }, 1000);
    
    return () => {
      observer.disconnect();
      clearInterval(intervalId);
    };
  }, []);

  const handleLocationSelect = (location: Location) => {
    onLocationSelect?.(location);
    setIsMobileMenuOpen(false);
  };
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  const getRingColorClass = (isSelected: boolean): string => {
    if (isSelected) {
      switch (themeColor) {
        case "red": return "ring-red-600";
        case "green": return "ring-green-600";
        case "blue": return "ring-blue-600";
        case "purple": return "ring-purple-600";
        case "yellow": return "ring-yellow-600";
        case "pink": return "ring-pink-600";
        case "indigo": return "ring-indigo-600";
        case "teal": return "ring-teal-600";
        case "orange": return "ring-orange-600";
        case "gray": return "ring-gray-600";
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
      case "yellow": return "text-yellow-600 dark:text-yellow-400";
      case "pink": return "text-pink-600 dark:text-pink-400";
      case "indigo": return "text-indigo-600 dark:text-indigo-400";
      case "teal": return "text-teal-600 dark:text-teal-400";
      case "orange": return "text-orange-600 dark:text-orange-400";
      case "gray": return "text-gray-600 dark:text-gray-400";
      default: return "text-blue-600 dark:text-blue-400";
    }
  };
  
  const getNavBackgroundColor = (): string => {
    switch (themeColor) {
      case "red": return "bg-gradient-to-r from-red-100 to-red-50 dark:from-red-900/80 dark:to-red-950/80 backdrop-blur-sm";
      case "green": return "bg-gradient-to-r from-green-100 to-green-50 dark:from-green-900/80 dark:to-green-950/80 backdrop-blur-sm";
      case "blue": return "bg-gradient-to-r from-blue-100 to-blue-50 dark:from-blue-900/80 dark:to-blue-950/80 backdrop-blur-sm";
      case "purple": return "bg-gradient-to-r from-purple-100 to-purple-50 dark:from-purple-900/80 dark:to-purple-950/80 backdrop-blur-sm";
      case "yellow": return "bg-gradient-to-r from-yellow-100 to-yellow-50 dark:from-yellow-900/80 dark:to-yellow-950/80 backdrop-blur-sm";
      case "pink": return "bg-gradient-to-r from-pink-100 to-pink-50 dark:from-pink-900/80 dark:to-pink-950/80 backdrop-blur-sm";
      case "indigo": return "bg-gradient-to-r from-indigo-100 to-indigo-50 dark:from-indigo-900/80 dark:to-indigo-950/80 backdrop-blur-sm";
      case "teal": return "bg-gradient-to-r from-teal-100 to-teal-50 dark:from-teal-900/80 dark:to-teal-950/80 backdrop-blur-sm";
      case "orange": return "bg-gradient-to-r from-orange-100 to-orange-50 dark:from-orange-900/80 dark:to-orange-950/80 backdrop-blur-sm";
      case "gray": return "bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-800/80 dark:to-gray-900/80 backdrop-blur-sm";
      default: return "bg-white dark:bg-gray-800/80 backdrop-blur-sm";
    }
  };

  const getBorderColor = (): string => {
    switch (themeColor) {
      case "red": return "border-red-300 dark:border-red-800/50";
      case "green": return "border-green-300 dark:border-green-800/50";
      case "blue": return "border-blue-300 dark:border-blue-800/50";
      case "purple": return "border-purple-300 dark:border-purple-800/50";
      case "yellow": return "border-yellow-300 dark:border-yellow-800/50";
      case "pink": return "border-pink-300 dark:border-pink-800/50";
      case "indigo": return "border-indigo-300 dark:border-indigo-800/50";
      case "teal": return "border-teal-300 dark:border-teal-800/50";
      case "orange": return "border-orange-300 dark:border-orange-800/50";
      case "gray": return "border-gray-300 dark:border-gray-700/50";
      default: return "border-gray-200 dark:border-gray-700/50";
    }
  };

  return (
    <>
      <button 
        onClick={toggleMobileMenu}
        className={`sm:hidden fixed top-4 left-4 z-[60] p-2 rounded-md 
                   ${getNavBackgroundColor()} ${getBorderColor()} border shadow-md 
                   text-gray-700 dark:text-gray-200 hover:bg-opacity-80 transition-colors`}
        aria-label="Open navigation menu"
      >
        <FiMenu className="w-6 h-6" />
      </button>

      <div className="sm:hidden fixed top-4 right-4 z-[60]">
        <ThemeAwareUserNav themeColor={themeColor} />
      </div>

      {isMobile && isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[65] sm:hidden" 
          onClick={toggleMobileMenu}
          aria-hidden="true"
        />
      )}

      <div 
        className={`fixed top-0 left-0 h-full w-64 ${getNavBackgroundColor()} ${getBorderColor()} border-r 
                  transform transition-transform duration-300 ease-in-out z-[70] sm:hidden 
                  ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className={`p-4 flex justify-between items-center border-b ${getBorderColor()}`}>
          <h2 className="font-bold text-lg text-gray-800 dark:text-gray-100">Locations</h2>
          <button 
            onClick={toggleMobileMenu}
            className={`p-1 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700`}
            aria-label="Close navigation menu"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>
        <nav className="p-4 space-y-3 overflow-y-auto h-[calc(100vh-65px)]">
          {locations.map((location) => {
            const isSelected = selectedLocationId === location.id;
            return (
              <button
                key={location.id}
                onClick={() => handleLocationSelect(location)}
                className={`
                  w-full flex items-center gap-3 p-3 rounded-lg transition-colors duration-200 
                  ${isSelected 
                    ? `bg-${themeColor}-100 dark:bg-${themeColor}-900/50 ${getSelectedTextColor()}` 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700/50'
                  }
                `}
              >
                <span className={`flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br ${location.gradient} flex items-center justify-center shadow-sm`}>
                  {React.cloneElement(location.icon, {
                    className: "w-4 h-4 text-white"
                  })}
                </span>
                <span className={`font-medium text-sm ${isSelected ? 'font-semibold' : ''}`}>
                  {location.name}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      <nav className={`hidden sm:flex fixed top-4 left-1/2 transform -translate-x-1/2 z-50 shadow-lg rounded-xl overflow-hidden ${getNavBackgroundColor()} border ${getBorderColor()} transition-all duration-300 items-center`}>
        <div className="px-4 py-3 flex flex-grow gap-4 justify-center">
          {locations.map((location) => (
            <div key={location.id} className="relative flex flex-col items-center w-auto group">
              <button
                onClick={() => handleLocationSelect(location)}
                className={`
                  w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br ${location.gradient} 
                  hover:scale-110 active:scale-95 transition-all duration-300 
                  shadow-md hover:shadow-lg
                  flex items-center justify-center
                  touch-action-manipulation
                  relative
                  ${selectedLocationId === location.id 
                    ? `ring-3 ring-offset-2 ${getRingColorClass(true)} dark:ring-offset-gray-800 scale-105` 
                    : `ring-2 ring-offset-1 ${getRingColorClass(false)} dark:ring-offset-gray-800`
                  }
                `}
                aria-label={`Go to ${location.name}`}
              >
                {React.cloneElement(location.icon, {
                  className: "w-6 h-6 md:w-7 md:h-7 text-white"
                })}
              </button>
              <span 
                className={`absolute top-full mt-2 left-1/2 transform -translate-x-1/2 whitespace-nowrap
                          px-2 py-1 text-xs font-medium rounded shadow-md 
                          ${getNavBackgroundColor()} ${getBorderColor()} border 
                          ${getSelectedTextColor()} 
                          opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-[90]`}
              >
                {location.name}
              </span>
            </div>
          ))}
        </div>
        <div className={`pr-4 pl-2 border-l ${getBorderColor()}`}>
          <ThemeAwareUserNav themeColor={themeColor} />
        </div>
      </nav>
    </>
  );
}

function ThemeAwareUserNav({ themeColor }: { themeColor: ThemeColor }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);
  
  const getButtonGradient = () => {
    switch (themeColor) {
      case 'red': return 'from-red-400 to-red-600';
      case 'green': return 'from-green-400 to-green-600';
      case 'blue': return 'from-blue-400 to-blue-600';
      case 'purple': return 'from-purple-400 to-purple-600';
      case 'yellow': return 'from-yellow-400 to-yellow-600';
      case 'pink': return 'from-pink-400 to-pink-600';
      case 'indigo': return 'from-indigo-400 to-indigo-600';
      case 'teal': return 'from-teal-400 to-teal-600';
      case 'orange': return 'from-orange-400 to-orange-600';
      case 'gray': return 'from-gray-400 to-gray-600';
      default: return 'from-blue-400 to-blue-600';
    }
  };

  const getRingColor = () => {
    switch (themeColor) {
      case 'red': return 'ring-red-400';
      case 'green': return 'ring-green-400';
      case 'blue': return 'ring-blue-400';
      case 'purple': return 'ring-purple-400';
      case 'yellow': return 'ring-yellow-400';
      case 'pink': return 'ring-pink-400';
      case 'indigo': return 'ring-indigo-400';
      case 'teal': return 'ring-teal-400';
      case 'orange': return 'ring-orange-400';
      case 'gray': return 'ring-gray-400';
      default: return 'ring-blue-400';
    }
  };
  
  const StyledButton = () => (
    <button
      onClick={() => setIsModalOpen(true)}
      className={`w-12 h-12 rounded-full bg-gradient-to-br ${getButtonGradient()}
        flex items-center justify-center hover:scale-110 active:scale-95
        transition-all duration-300 shadow-md hover:shadow-lg
        ring-2 ring-offset-2 ${getRingColor()} dark:ring-offset-gray-800`}
      aria-label="User menu"
    >
      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    </button>
  );
  
  const UserMenuModal = () => {
    if (!isModalOpen || !isMounted) return null;
    
    return createPortal(
      <div className="fixed inset-0 z-[999] flex items-center justify-center">
        <div 
          className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
          onClick={() => setIsModalOpen(false)}
          aria-hidden="true"
        />
        
        <div 
          className="z-[1001] bg-white dark:bg-gray-800 rounded-xl shadow-2xl 
                    border-2 border-gray-200 dark:border-gray-700 
                    sm:w-80 w-[90vw] max-w-sm overflow-hidden animate-fade-in-fast
                    flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          <UserNavMenu 
            isInModal={true}
            onClose={() => setIsModalOpen(false)}
            themeColor={themeColor}
          />
        </div>
      </div>,
      document.body
    );
  };
  
  return (
    <>
      <StyledButton />
      <UserMenuModal />
    </>
  );
}
