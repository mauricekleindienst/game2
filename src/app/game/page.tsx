"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import UserNavMenu from '@/components/UserNavMenu';
import CharacterSelection from '@/components/CharacterSelection';
import Inventory from '@/components/Inventory';
import Map from '@/components/Map';
import GameNav, { Location, locations } from '@/components/GameNav';
import WelcomeModal from '@/components/WelcomeModal';
import Image from 'next/image';

import BackgroundMusic from "@/components/BackgroundMusic";
import FishingDock from '@/components/FishingDock';

export default function GamePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [showWelcome, setShowWelcome] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  
  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      const hasSeenWelcome = localStorage.getItem(`welcome_seen_${user.id}`);
      if (!hasSeenWelcome) {
        setShowWelcome(true);
      }
    }
  }, [user]);

  const handleCloseWelcome = () => {
    if (user) {
      localStorage.setItem(`welcome_seen_${user.id}`, 'true');
    }
    setShowWelcome(false);
  };

  const handleLocationSelect = (location: Location | null) => {
    setSelectedLocation(location);
  };

  const handleCharacterSelect = (character: {id: number, color: string}) => {
    // Character selection now only affects the theme styling for components,
    // but not the page background
  };

  const renderLocationComponent = () => {
    if (!selectedLocation) return null;
    
    switch (selectedLocation.id) {
      case 0: 
        return <FishingDock />;
      default:
        return null;
    }
  };

  const getBackgroundImage = (): string => {
    if (!selectedLocation) return '/map-bg.jpg';
    
    switch (selectedLocation.id) {
      case 0: return '/fishing-bg.jpg';
      case 1: return '/woodcutting-bg.jpg';
      case 2: return '/cooking-bg.jpg';
      case 3: return '/farmland-bg.jpg';
      case 4: return '/mining-bg.jpg';
      case 5: return '/blacksmith-bg.jpg';
      default: return '/map-bg.jpg';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 relative">
      <div className="fixed inset-0 z-0 transition-opacity duration-1000">
        <Image
          src={getBackgroundImage()}
          alt={selectedLocation?.name || "Game world"}
          fill
          className="object-cover opacity-70"
          priority
        />
      </div>
      
      <div className="relative z-10 flex flex-col min-h-screen">
       
        <GameNav 
          selectedLocationId={selectedLocation?.id}
          onLocationSelect={handleLocationSelect}
        />
        <div className="flex-1 relative">
          <CharacterSelection onCharacterSelect={handleCharacterSelect} />
          <Inventory />
          
          {selectedLocation ? (
            renderLocationComponent()
          ) : (
            <Map 
              selectedLocation={selectedLocation}
              locations={locations}
              onLocationSelect={handleLocationSelect}
            />
          )}
          
          <BackgroundMusic />
          <UserNavMenu />

        </div>
      </div>
      <WelcomeModal isOpen={showWelcome} onClose={handleCloseWelcome} />
    </div>
    
  );
} 