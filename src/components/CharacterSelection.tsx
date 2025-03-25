"use client";

import React, { useState, useEffect } from 'react';
import { GiFishingPole, GiAxeInStump, GiVillage, GiCookingPot } from 'react-icons/gi';
import Image from 'next/image';
import { setTheme, themes } from '@/lib/theme';

// Neue Schnittstelle für den Callback
interface CharacterSelectionProps {
  onCharacterSelect?: (character: {id: number, color: string}) => void;
}

export default function CharacterSelection({ onCharacterSelect }: CharacterSelectionProps) {
  const [selectedCharacter, setSelectedCharacter] = useState<number | null>(null);

  const characters = [
    { id: 0, icon: <GiFishingPole className="w-6 h-6 text-red-500" />, theme: themes[0] },
    { id: 1, icon: <GiAxeInStump className="w-6 h-6 text-green-500" />, theme: themes[1] },
    { id: 2, icon: <GiCookingPot className="w-6 h-6 text-blue-500" />, theme: themes[2] },
    { id: 3, icon: <GiVillage className="w-6 h-6 text-purple-500" />, theme: themes[3] }
  ];

  const handleCharacterSelect = (id: number) => {
    setSelectedCharacter(id);
    
    const character = characters.find(c => c.id === id);
    if (character) {
      // Thema setzen
      const theme = setTheme(character.theme.id);
      
      // Callback zum Elternelement
      if (onCharacterSelect) {
        onCharacterSelect({id, color: theme.color});
      }
    }
  };

  // Beim ersten Laden den ersten Charakter auswählen
  useEffect(() => {
    if (selectedCharacter === null && characters.length > 0) {
      handleCharacterSelect(characters[0].id);
    }
  }, []);

  const getRingColorClass = (character: typeof characters[0], isSelected: boolean) => {
    const color = character.theme.color;
    if (isSelected) {
      switch (color) {
        case "red": return "ring-red-600";
        case "green": return "ring-green-600";
        case "blue": return "ring-blue-600";
        case "purple": return "ring-purple-600";
        default: return "ring-blue-600";
      }
    } else {
      switch (color) {
        case "red": return "ring-red-300";
        case "green": return "ring-green-300";
        case "blue": return "ring-blue-300";
        case "purple": return "ring-purple-300";
        default: return "ring-gray-300";
      }
    }
  };

  return (
    <>
      <div className="fixed bottom-8 left-0 right-0 flex justify-center">
        <div className="flex flex-row gap-6">
          {characters.map(character => (
            <div key={character.id} className="relative">
              <button
                onClick={() => handleCharacterSelect(character.id)}
                className={`
                  w-16 h-16 rounded-full overflow-hidden relative
                  hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1
                  ${selectedCharacter === character.id 
                    ? `ring-3 ring-offset-2 ${getRingColorClass(character, true)} dark:ring-offset-gray-800 scale-110` 
                    : `ring-2 ring-offset-2 ${getRingColorClass(character, false)} dark:ring-offset-gray-800`
                  }
                `}
                aria-label={`Select character ${character.id + 1}`}
              >
                <Image
                  src="/fisherman.jpg"
                  alt={`Character ${character.id + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            
              <div className="absolute -bottom-1 -left-1 w-8 h-8 rounded-full bg-black bg-opacity-50 flex items-center justify-center">
                {character.icon}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
