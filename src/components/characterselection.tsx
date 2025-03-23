"use client";

import React, { useState } from 'react';

export default function CharacterSelection() {
  const [selectedCharacter, setSelectedCharacter] = useState<number | null>(null);


  const characters = [
    { id: 0, color: 'bg-red-500' },
    { id: 1, color: 'bg-blue-500' },
    { id: 2, color: 'bg-green-500' },
    { id: 3, color: 'bg-yellow-500' }
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


      <div className="flex-grow flex items-end justify-center pb-12">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mx-auto">
        
          <div className="flex space-x-6 justify-center">
            {characters.map(character => (
              <button
                key={character.id}
                onClick={() => handleCharacterSelect(character.id)}
                className={`w-16 h-16 rounded-full ${character.color} hover:opacity-90 transition-opacity shadow-md
                  ${selectedCharacter === character.id ? 'ring-4 ring-offset-2 ring-blue-600' : ''}`}
                aria-label={`Select character ${character.id + 1}`}
              />
            ))}
          </div>
          
   
        </div>
      </div>
    </div>
  );
}
