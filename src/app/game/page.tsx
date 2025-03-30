"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import CharacterSelection from '@/components/CharacterSelection';
import Inventory from '@/components/Inventory';
import Map from '@/components/Map';
import GameNav, { Location, locations } from '@/components/GameNav';
import WelcomeModal from '@/components/WelcomeModal';
import Image from 'next/image';
import { setThemeByColor } from '@/lib/theme';

import BackgroundMusic from "@/components/BackgroundMusic";
import FishingDock from '@/components/FishingDock';
import WoodcuttersGrove from '@/components/WoodcuttersGrove';
import MiningCave from '@/components/MiningCave';
import Farmland from '@/components/Farmland';
import LoadingScreen from '@/components/LoadingScreen';

export default function GamePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [showWelcome, setShowWelcome] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [userSettings, setUserSettings] = useState<any>(null);
  const [characters, setCharacters] = useState<any[]>([]);
  const [isLoadingCharacters, setIsLoadingCharacters] = useState(true);
  const [activeThemeColor, setActiveThemeColor] = useState<string>('blue');
  
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
      const checkAndCreateCharacters = async () => {
        setIsLoadingCharacters(true);
        try {
          const response = await fetch('/api/get_characters');
          
          if (response.ok) {
            const data = await response.json();
            
            if (data.success) {
              console.log("Character data from API:", data.data);
              
              if (!data.data || data.data.length < 4) {
                const createResponse = await fetch('/api/create_characters', {
                  method: 'POST',
                });
                
                if (createResponse.ok) {
                  const newCharactersResponse = await fetch('/api/get_characters');
                  if (newCharactersResponse.ok) {
                    const newData = await newCharactersResponse.json();
                    if (newData.success) {
                      console.log("New character data created:", newData.data);
                      setCharacters(newData.data || []);
                    }
                  }
                }
              } else {
                setCharacters(data.data);
              }
            }
          }
        } catch (error) {
          console.error("Error checking/creating characters:", error);
        } finally {
          setIsLoadingCharacters(false);
        }
      };
      
      checkAndCreateCharacters();
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
      
      const initializeUserSettings = async () => {
        try {
          // First, check if user settings already exist
          const settingsResponse = await fetch('/api/get_user_settings', {
            method: 'GET',
          });
          
          if (settingsResponse.ok) {
            const settingsData = await settingsResponse.json();
            
            // If there are no settings yet, create them with full initialization data
            if (!settingsData.data) {
              await fetch('/api/update_player', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  theme: 'dark',
                  playtime: 0,
                  login_time: new Date().toISOString(),
                  welcome_status: false
                }),
              });
              
              console.log("Created initial user settings");
            }
          }
        } catch (error) {
          console.error("Error initializing user settings:", error);
        }
      };
      
      recordLogin();
      initializeUserSettings();
      
      if (typeof window !== 'undefined') {
        const handleBeforeUnload = () => {
          const data = JSON.stringify({
            logout_time: new Date().toISOString(),
          });
          
          if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
            navigator.sendBeacon('/api/update_player', data);
          } else {
            try {
              const xhr = new XMLHttpRequest();
              xhr.open('POST', '/api/update_player', false); 
              xhr.setRequestHeader('Content-Type', 'application/json');
              xhr.send(data);
            } catch (e) {
              console.error("Error sending logout data:", e);
            }
          }
        };
        
        window.addEventListener('beforeunload', handleBeforeUnload);
        
        return () => {
          window.removeEventListener('beforeunload', handleBeforeUnload);
        };
      }
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
    console.log("Character selected with color:", character.color);
    
    if (character.color !== activeThemeColor) {
      setThemeByColor(character.color);
      setActiveThemeColor(character.color);
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

  if (loading || isLoadingCharacters) {
    return (
      <LoadingScreen 
        minDisplayTime={5000} 
        onLoadingComplete={() => {
      
        }}
      />
    );
  }

  const navHeightPadding = 'pt-35';
  const charSelectHeightPadding = 'pb-28';

  return (
    <div className="h-screen flex flex-col bg-gray-900 relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src={getBackgroundImage()}
          alt={selectedLocation?.name || "Game world"}
          fill
          className="object-cover opacity-70"
          priority
        />
      </div>

      <GameNav 
        selectedLocationId={selectedLocation?.id}
        onLocationSelect={handleLocationSelect}
        activeThemeColor={activeThemeColor}
      />

      <div className={`flex-1 overflow-y-auto relative z-10 ${navHeightPadding} ${charSelectHeightPadding}`}>
        {selectedLocation ? (
          <div className="px-4">
            <div className={selectedLocation.id === 0 ? 'block' : 'hidden'}>
              <FishingDock />
            </div>
            <div className={selectedLocation.id === 1 ? 'block' : 'hidden'}>
              <WoodcuttersGrove />
            </div>
            <div className={selectedLocation.id === 3 ? 'block' : 'hidden'}>
              <Farmland />
            </div>
            <div className={selectedLocation.id === 4 ? 'block' : 'hidden'}>
              <MiningCave />
            </div>
          </div>
        ) : (
          <Map 
            selectedLocation={selectedLocation}
            locations={locations}
            onLocationSelect={handleLocationSelect}
          />
        )}
      </div>

      <div className="fixed bottom-28 left-1/2 transform -translate-x-1/2 z-40 flex justify-center">
        <Inventory />
      </div>

      <CharacterSelection 
        onCharacterSelect={handleCharacterSelect} 
        characters={characters}
      />

      <BackgroundMusic />
      <WelcomeModal isOpen={showWelcome} onClose={handleCloseWelcome} />
    </div>
  );
} 