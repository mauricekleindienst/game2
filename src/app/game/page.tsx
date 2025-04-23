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
import CharacterLevelInfo from '@/components/CharacterLevelInfo';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function GamePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [showWelcome, setShowWelcome] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [userSettings, setUserSettings] = useState<any>(null);
  const [characters, setCharacters] = useState<any[]>([]);
  const [isLoadingCharacters, setIsLoadingCharacters] = useState(true);
  const [activeThemeColor, setActiveThemeColor] = useState<string>('blue');
  const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(null);
  const supabase = React.useRef<any>(null);

  const selectedCharacter = React.useMemo(() => {
    if (!characters || characters.length === 0) return null;
    if (selectedCharacterId) {
      return characters.find((c: any) => c.id === selectedCharacterId) || characters[0];
    }
    return characters[0];
  }, [characters, selectedCharacterId]);

  const characterLevelInfoProps = React.useMemo(() => {
    if (!selectedCharacter) return null;
    return {
      characterName: selectedCharacter.name || 'Character',
      avatarUrl: selectedCharacter.imageurl || '/fallback-character.jpg',
      skills: [
        { name: "Fishing" as const, xp: selectedCharacter.level_fishing || 0 },
        { name: "Woodcutting" as const, xp: selectedCharacter.level_cutting || 0 },
        { name: "Cooking" as const, xp: selectedCharacter.level_cooking || 0 },
        { name: "Mining" as const, xp: selectedCharacter.level_mining || 0 },
        { name: "Farming" as const, xp: selectedCharacter.level_farming || 0 },
        { name: "Blacksmithing" as const, xp: selectedCharacter.level_blacksmithing || 0 },
      ]
    };
  }, [selectedCharacter]);

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
          const settingsResponse = await fetch('/api/get_user_settings', {
            method: 'GET',
          });
          
          if (settingsResponse.ok) {
            const settingsData = await settingsResponse.json();
            
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

  useEffect(() => {
    if (!supabase.current) {
      supabase.current = createClientComponentClient();
    }
    if (!selectedCharacterId) return;

    const channel = supabase.current
      .channel('public:characters')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'characters',
          filter: `id=eq.${selectedCharacterId}`,
        },
        (payload: any) => {
          fetch('/api/get_characters')
            .then(res => res.json())
            .then(data => {
              if (data.success) setCharacters(data.data);
            });
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [selectedCharacterId]);

  const handleCloseWelcome = async () => {
    setShowWelcome(false);
    
    try {
      const response = await fetch('/api/update_player', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          welcome_status: true
        }),
      });
      
      if (response.ok) {
        console.log("Welcome status updated successfully");
        setUserSettings((prev: any) => prev ? {...prev, welcome_status: true} : null);
      } else {
        console.error("Failed to update welcome status");
      }
    } catch (error) {
      console.error("Error updating welcome status:", error);
    }
  };

  const handleLocationSelect = (location: Location | null) => {
    setSelectedLocation(location);
  };

  const handleCharacterSelect = (character: {id: string, color: string}) => {
    if (character.color !== activeThemeColor) {
      setThemeByColor(character.color);
      setActiveThemeColor(character.color);
    }
    setSelectedCharacterId(character.id);
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

      <div className="flex flex-row h-full relative z-10">
        <div className="hidden md:flex flex-col items-start justify-start pt-36 pl-6 w-80">
          {characterLevelInfoProps && <CharacterLevelInfo {...characterLevelInfoProps} />}
        </div>
        <div className="flex-1 overflow-y-auto">
          <div className={`relative ${navHeightPadding} ${charSelectHeightPadding}`}>
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
        </div>
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