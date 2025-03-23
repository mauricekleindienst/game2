"use client";

import React, { useState } from 'react';
import { GiFishingPole, GiAxeInStump, GiVillage,GiCookingPot } from 'react-icons/gi';

export default function CharacterSelection() {
  const [selectedCharacter, setSelectedCharacter] = useState<number | null>(null);

  const characters = [
    { id: 0, color: 'bg-red-500', gradient: 'from-red-400 to-red-600', icon: <GiFishingPole className="w-8 h-8 text-white ml-0" /> },
    { id: 1, color: 'bg-blue-500', gradient: 'from-blue-400 to-blue-600', icon: <GiAxeInStump className="w-8 h-8 text-white ml-0" /> },
    { id: 2, color: 'bg-green-500', gradient: 'from-green-400 to-green-600', icon: <GiCookingPot className="w-8 h-8 text-white ml-0" /> },
    { id: 3, color: 'bg-yellow-500', gradient: 'from-yellow-400 to-yellow-600', icon: <GiVillage className="w-8 h-8 text-white ml-0" /> }
  ];

  const handleCharacterSelect = (id: number) => {
    setSelectedCharacter(id);
  };

  return (
    <>
      <div className="fixed bottom-8 left-0 right-0 flex justify-center">
        <div className="flex flex-row gap-6">
          {characters.map(character => (
            <button
            key={character.id}
            onClick={() => handleCharacterSelect(character.id)}
            className={`w-16 h-16 rounded-full bg-gradient-to-br ${character.gradient} 
            hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1
            flex items-center justify-start pl-4
            ${selectedCharacter === character.id 
              ? 'ring-3 ring-offset-2 ring-blue-600 dark:ring-offset-gray-800 scale-110' 
              : 'ring-2 ring-offset-2 ring-gray-300 dark:ring-offset-gray-800'
            }`}
            aria-label={`Select character ${character.id + 1}`}
          >
            {character.icon}
              <span className="sr-only">Character {character.id + 1}</span>
          
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
