"use client";

import React from 'react';
import '@/components/styles/map.css';
import { Location } from './GameNav';

type MapProps = {
  selectedLocation: Location | null;
  locations: Location[];
  onLocationSelect: (location: Location) => void;
};

export default function Map({ selectedLocation, locations, onLocationSelect }: MapProps) {
  return (
    <div className="flex items-center justify-center h-[calc(100vh-240px)]">
      <div className="relative w-full max-w-5xl aspect-video">
    
        <div className="absolute inset-0">
          {locations.map((location) => (
            <button
              key={location.id}
              onClick={() => onLocationSelect(location)}
              className={`
                absolute w-10 h-10 rounded-full bg-gradient-to-br ${location.gradient}
                transform -translate-x-1/2 -translate-y-1/2
                hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl
                flex items-center justify-center
                ${selectedLocation?.id === location.id 
                  ? "ring-4 ring-offset-2 ring-blue-600 scale-110 z-20" 
                  : "ring-2 ring-offset-2 ring-gray-300 z-10"
                }
              `}
              style={{
                top: location.mapPosition.top,
                left: location.mapPosition.left,
              }}
              aria-label={`Select ${location.name} on map`}
            >
              {location.icon}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
