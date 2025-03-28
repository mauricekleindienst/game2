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
    
      
      </div>
    </div>
  );
}
