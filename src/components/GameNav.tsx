"use client";

import React, { useState } from "react";
import { GiFishingPole, GiAxeInStump, GiVillage, GiCookingPot } from "react-icons/gi";

export default function LocationSelection() {
  const [selectedLocation, setSelectedLocation] = useState<number | null>(null);

  const locations = [
    { id: 0, gradient: "from-red-400 to-red-600", icon: <GiFishingPole className="w-8 h-8 text-white" /> },
    { id: 1, gradient: "from-blue-400 to-blue-600", icon: <GiAxeInStump className="w-8 h-8 text-white" /> },
    { id: 2, gradient: "from-green-400 to-green-600", icon: <GiCookingPot className="w-8 h-8 text-white" /> },
    { id: 3, gradient: "from-yellow-400 to-yellow-600", icon: <GiVillage className="w-8 h-8 text-white" /> },
  ];

  const handleLocationSelect = (id: number) => {
    setSelectedLocation(id);
  };

  return (
    <>
      <nav className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex gap-4">
              {locations.map((location) => (
                <button
                  key={location.id}
                  onClick={() => handleLocationSelect(location.id)}
                  className={`w-12 h-12 rounded-full bg-gradient-to-br ${location.gradient} 
                  hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl
                  flex items-center justify-center
                  ${selectedLocation === location.id 
                    ? "ring-4 ring-offset-2 ring-blue-600 dark:ring-offset-gray-800 scale-110" 
                    : "ring-2 ring-offset-2 ring-gray-300 dark:ring-offset-gray-800"
                  }`}
                  aria-label={`Select Location ${location.id + 1}`}
                >
                  {location.icon}
                  <span className="sr-only">Location {location.id + 1}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
