"use client";

import React, { useState } from 'react';

export default function CharacterSelection() {
  const [selectedCharacter, setSelectedCharacter] = useState<number | null>(null);

  const characters = [
    { id: 0, color: 'bg-red-500', gradient: 'from-red-400 to-red-600', shadow: 'shadow-red-400/50' },
    { id: 1, color: 'bg-blue-500', gradient: 'from-blue-400 to-blue-600', shadow: 'shadow-blue-400/50' },
    { id: 2, color: 'bg-green-500', gradient: 'from-green-400 to-green-600', shadow: 'shadow-green-400/50' },
    { id: 3, color: 'bg-yellow-500', gradient: 'from-yellow-400 to-yellow-600', shadow: 'shadow-yellow-400/50' }
  ];

  const handleCharacterSelect = (id: number) => {
    setSelectedCharacter(id);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <nav className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-bold text-gray-800 dark:text-white">
                Game2
              </h1>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex-grow flex flex-col justify-end pb-28">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mx-auto w-auto max-w-md">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-6 text-center">
            Select Your Character
          </h2>
          
          <div className="flex space-x-8 justify-center">
            {characters.map(character => (
              <button
                key={character.id}
                onClick={() => handleCharacterSelect(character.id)}
                className={`w-16 h-16 rounded-full bg-gradient-to-br ${character.gradient} hover:scale-110 
                  transition-all duration-300 ${character.shadow} shadow-lg
                  ${selectedCharacter === character.id 
                    ? 'ring-4 ring-offset-4 ring-blue-600 dark:ring-offset-gray-800 scale-110' 
                    : 'opacity-90 hover:opacity-100'}`}
                aria-label={`Select character ${character.id + 1}`}
              >
                <span className="sr-only">Character {character.id + 1}</span>
              </button>
            ))}
          </div>
          
          {selectedCharacter !== null && (
            <div className="mt-6 text-center">
              <p className="text-gray-600 dark:text-gray-300">
                Character {selectedCharacter + 1} selected
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
