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
  const [userSettings, setUserSettings] = useState<any>(null);
  
  useEffect(() => {
    if (user) {
      const fetchUserSettings = async () => {
        try {
          const response = await fetch('/api/get_user_settings', {
            method: 'GET',
          });
          
          if (response.ok) {
            const data = await response.json();
            if (data.success) {
              setUserSettings(data.data);
              
              if (data.data === null || data.data.welcome_status === false || data.data.welcome_status === null) {
                setShowWelcome(true);
              }
            }
          }
        } catch (error) {
          console.error("Error fetching user settings:", error);
        }
      };
      
      fetchUserSettings();
    }
  }, [user]);
  
  useEffect(() => {
    if (user) {
      const recordLogin = async () => {
        try {
          await fetch('/api/update_player', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              login_time: new Date().toISOString(),
            }),
          });
        } catch (error) {
          console.error("Error recording login time:", error);
        }
      };
      
      recordLogin();
      
      const handleBeforeUnload = () => {
        const data = JSON.stringify({
          logout_time: new Date().toISOString(),
        });
        
        navigator.sendBeacon('/api/update_player', data);
      };
      
      window.addEventListener('beforeunload', handleBeforeUnload);
      
      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
      };
    }
  }, [user]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  const handleCloseWelcome = () => {
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