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

import BackgroundMusic from "@/components/BackgroundMusic";
import FishingDock from '@/components/FishingDock';
import { getTheme } from '@/lib/theme';

export default function GamePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [showWelcome, setShowWelcome] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [themeColor, setThemeColor] = useState('red');
  
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
    setThemeColor(character.color);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div style={{backgroundColor: 'var(--theme-bg)'}} 
         className="min-h-screen flex flex-col transition-colors duration-500">
      <UserNavMenu />
     
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
   
      </div>
      <WelcomeModal isOpen={showWelcome} onClose={handleCloseWelcome} />
    </div>
  );
} 