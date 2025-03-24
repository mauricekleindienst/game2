"use client";

import React, { useState } from 'react';
import { GiFishingPole, GiAxeInStump, GiVillage, GiCookingPot } from 'react-icons/gi';
import Image from 'next/image';

export default function CharacterSelection() {
  const [selectedCharacter, setSelectedCharacter] = useState<number | null>(null);

  const characters = [
    { id: 0, icon: <GiFishingPole className="w-6 h-6 text-white" /> },
    { id: 1, icon: <GiAxeInStump className="w-6 h-6 text-white" /> },
    { id: 2, icon: <GiCookingPot className="w-6 h-6 text-white" /> },
    { id: 3, icon: <GiVillage className="w-6 h-6 text-white" /> }
  ];

  const handleCharacterSelect = (id: number) => {
    setSelectedCharacter(id);
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
                    ? 'ring-3 ring-offset-2 ring-blue-600 dark:ring-offset-gray-800 scale-110' 
                    : 'ring-2 ring-offset-2 ring-gray-300 dark:ring-offset-gray-800'
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
