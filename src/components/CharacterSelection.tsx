"use client";

import React, { useState, useEffect } from 'react';
import { GiFishingPole, GiAxeInStump, GiVillage, GiCookingPot } from 'react-icons/gi';
import { FiEdit3, FiX } from 'react-icons/fi';
import Image from 'next/image';
import { setTheme, themes, ThemeColor, Theme } from '@/lib/theme';
import {getCharacterIds,getCharacterName} from '@/utils/character_util'
interface CharacterSelectionProps {
  onCharacterSelect?: (character: {id: number, color: string}) => void;
}

interface Character {
  id: number;
  name: string;
  icon: React.ReactNode;
  theme: Theme;
  imageSrc: string;
}

const characterids = await getCharacterIds();
const name1 = await getCharacterName(characterids[0]);
const name2 = await getCharacterName(characterids[1]);
const name3 = await getCharacterName(characterids[2]);
const name4 = await getCharacterName(characterids[3]);
export default function CharacterSelection({ onCharacterSelect }: CharacterSelectionProps) {
  const [selectedCharacter, setSelectedCharacter] = useState<number | null>(null);
  const [editingCharacter, setEditingCharacter] = useState<Character | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [characterName, setCharacterName] = useState('');
  const [characterColor, setCharacterColor] = useState<string>('#7f1d1d');
  const [characterThemeColor, setCharacterThemeColor] = useState<ThemeColor>('red');
  const [characterImageUrl, setCharacterImageUrl] = useState('');
  const [characters, setCharacters] = useState<Character[]>([
    { id: 0, name: name1, icon: <GiFishingPole className="w-6 h-6 text-red-500" />, theme: themes[0], imageSrc: "/fisherman.jpg" },
    { id: 1, name: name2, icon: <GiAxeInStump className="w-6 h-6 text-green-500" />, theme: themes[1], imageSrc: "/fisherman.jpg" },
    { id: 2, name: name3, icon: <GiCookingPot className="w-6 h-6 text-blue-500" />, theme: themes[2], imageSrc: "/fisherman.jpg" },
    { id: 3, name: name4, icon: <GiVillage className="w-6 h-6 text-purple-500" />, theme: themes[3], imageSrc: "/fisherman.jpg" }
  ]);

  const handleCharacterSelect = (id: number) => {
    setSelectedCharacter(id);
    
    const character = characters.find(c => c.id === id);
    if (character) {
      const theme = setTheme(character.theme.id);
      
      if (onCharacterSelect) {
        onCharacterSelect({id, color: theme.color});
      }
    }
  };
  
  const handleEditClick = (e: React.MouseEvent, character: Character) => {
    e.stopPropagation(); 
    setEditingCharacter(character);
    setCharacterName(character.name);
    setCharacterColor(character.theme.bgColor);
    setCharacterThemeColor(character.theme.color);
    setCharacterImageUrl(character.imageSrc);
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCharacter(null);
  };
  
  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCharacterColor(e.target.value);
    const colorHex = e.target.value.toLowerCase();
    
    if (colorHex.includes('f') && (colorHex.includes('0') || colorHex.includes('1') || colorHex.includes('2'))) {
      setCharacterThemeColor('red');
    } else if (colorHex.includes('0') && colorHex.includes('f') && colorHex.includes('0')) {
      setCharacterThemeColor('green');
    } else if (colorHex.includes('0') && colorHex.includes('0') && colorHex.includes('f')) {
      setCharacterThemeColor('blue');
    } else if (colorHex.includes('a') || colorHex.includes('9') || colorHex.includes('8')) {
      setCharacterThemeColor('purple');
    } else {
      setCharacterThemeColor('red');
    }
  };
  
  const handleSaveChanges = () => {
    if (!editingCharacter) return;
    
    const baseTheme = themes.find(t => t.color === characterThemeColor) || editingCharacter.theme;
    
    const customTheme: Theme = {
      ...baseTheme,
      id: baseTheme.id,
      name: characterName,
      color: characterThemeColor,
      bgColor: characterColor
    };
    
    const updatedCharacters = characters.map(char => {
      if (char.id === editingCharacter.id) {
        return {
          ...char,
          name: characterName,
          theme: customTheme,
          imageSrc: characterImageUrl
        };
      }
      return char;
    });
    
    setCharacters(updatedCharacters);
    
    if (selectedCharacter === editingCharacter.id) {
      const theme = setTheme(customTheme.id);
      
      if (onCharacterSelect) {
        onCharacterSelect({id: editingCharacter.id, color: characterThemeColor});
      }
    }
    
    handleCloseModal();
  };

  useEffect(() => {
    if (selectedCharacter === null && characters.length > 0) {
      handleCharacterSelect(characters[0].id);
    }

    
  }, []);

  const getRingColorClass = (character: Character, isSelected: boolean) => {
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
      <div className="fixed bottom-8 left-0 right-0 flex justify-center z-50">
        <div className="flex flex-row gap-6">
          {characters.map(character => (
            <div key={character.id} className="relative group">
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
                aria-label={`Select character ${character.name}`}
              >
                <Image
                  src={character.imageSrc}
                  alt={character.name}
                  fill
                  className="object-cover"
                />
              </button>
            
              <div className="absolute -bottom-1 -left-1 w-8 h-8 rounded-full bg-black bg-opacity-50 flex items-center justify-center">
                {character.icon}
              </div>
              
              <button 
                onClick={(e) => handleEditClick(e, character)}
                className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-white bg-opacity-90 flex items-center justify-center shadow-md hover:bg-opacity-100 transition-all hover:scale-110 border border-gray-300"
                aria-label={`Edit character ${character.name}`}
              >
                <FiEdit3 className="w-4 h-4 text-gray-700" />
              </button>
              
              <div 
                className={`absolute -top-10 left-1/2 transform -translate-x-1/2 
                  px-3 py-1.5 rounded-lg shadow-lg backdrop-blur-md
                  ${selectedCharacter === character.id 
                    ? `bg-${character.theme.color}-500/90 text-white font-bold` 
                    : 'bg-black/75 text-white/90 font-medium'
                  }
                  transition-all duration-300 min-w-max
                  border ${selectedCharacter === character.id 
                    ? `border-${character.theme.color}-400` 
                    : 'border-white/20'
                  }
                  flex items-center justify-center whitespace-nowrap
                  opacity-0 group-hover:opacity-100 pointer-events-none
                  translate-y-1 group-hover:translate-y-0`}
              >
                <span className={`text-sm ${selectedCharacter === character.id ? 'drop-shadow-md' : ''}`}>
                  {character.name}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {isModalOpen && editingCharacter && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white tracking-wide">Edit Character</h3>
              <button 
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none transition-colors"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="flex justify-center mb-6">
                <div className="relative w-24 h-24 rounded-full overflow-hidden border-2" style={{ borderColor: characterColor }}>
                  <Image
                    src={characterImageUrl}
                    alt="Character Preview"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="image-url" className="block text-sm font-bold text-gray-800 dark:text-gray-200 mb-2">
                  Character Image URL
                </label>
                <input
                  type="text"
                  id="image-url"
                  value={characterImageUrl}
                  onChange={(e) => setCharacterImageUrl(e.target.value)}
                  placeholder="https://dredge.wiki.gg/images/thumb/f/f0/Fisherman.png/300px-Fisherman.png"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white font-medium"
                />
              </div>
              
              <div>
                <label htmlFor="character-name" className="block text-sm font-bold text-gray-800 dark:text-gray-200 mb-2">
                  Character Name
                </label>
                <input
                  type="text"
                  id="character-name"
                  value={characterName}
                  onChange={(e) => setCharacterName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white font-medium text-lg"
                />
              </div>
              
                <div>
                <label htmlFor="color-picker" className="block text-sm font-bold text-gray-800 dark:text-gray-200 mb-2">
                  Character Color
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    id="color-picker"
                    value={characterColor}
                    onChange={handleColorChange}
                    className="h-12 w-20 cursor-pointer rounded-md border-2 border-gray-300 dark:border-gray-600"
                  />
                  <input
                    type="text"
                    value={characterColor}
                    onChange={(e) => setCharacterColor(e.target.value)}
                    className="w-32 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white font-medium font-mono uppercase"
                    placeholder="#000000"
                  />
                </div>
              </div>
            </div>
            
            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600 flex justify-end">
              <button
                onClick={handleCloseModal}
                className="mr-3 px-5 py-2.5 text-sm font-bold text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveChanges}
                className="px-5 py-2.5 text-sm font-bold text-white bg-blue-600 border border-transparent rounded-lg shadow-sm hover:bg-blue-700 transition-all duration-200 focus:outline-none transform hover:scale-105"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
