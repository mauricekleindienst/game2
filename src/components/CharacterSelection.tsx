"use client";

import React, { useState, useEffect } from 'react';
import { GiFishingPole, GiAxeInStump, GiVillage, GiCookingPot } from 'react-icons/gi';
import { FiEdit3, FiX } from 'react-icons/fi';
import Image from 'next/image';
import { setTheme, themes, ThemeColor, Theme, getThemeColorFromValue, setThemeByColor } from '@/lib/theme';
import {
  getCharacterIds,
  getCharacterName,
  setCharacterName as updateCharacterName,
  setCharacterColor as updateCharacterColor,
  setCharacterImageUrl as updateCharacterImageUrl
} from '@/utils/character_util';

type CharacterSelectionProps = {
  onCharacterSelect: (character: { id: number; color: string }) => void;
  characters: any[];
};

// Database character structure
interface DbCharacter {
  id: number;
  name: string;
  color: string;
  imageurl?: string;
  level_fishing: number;
  level_mining: number;
  level_cooking: number;
  level_cutting: number;
  user_id: string;
  character_nav_id?: number;
}

// Display character structure
interface Character {
  id: number;
  name: string;
  icon: React.ReactNode;
  theme: Theme;
  imageurl?: string;
  character_nav_id?: number;
}

// Function to validate if a string is a valid URL or a valid path
const isValidImageSource = (src: string | null | undefined): boolean => {
  if (!src) return false;
  
  // Any path starting with / is valid for Next.js
  if (src.startsWith('/')) return true;
  
  // Try to parse as URL
  try {
    new URL(src);
    return true;
  } catch (e) {
    return false;
  }
};

// Function to get a safe image source (fallback to default if invalid)
const getSafeImageSrc = (src: string | null | undefined): string => {
  if (!src) return '/fallback-character.png';
  
  // If it's a valid path starting with /, it's a local image
  if (src.startsWith('/')) return src;
  
  // If it's a valid URL, use it
  try {
    new URL(src);
    return src;
  } catch (e) {
    // If it's not a valid URL, use the fallback
    return '/fallback-character.png';
  }
};

// Helper function to safely apply theme color classes
const safeColorClass = (prefix: string, colorName: ThemeColor | undefined, suffix: string): string => {
  if (!colorName) return `${prefix}blue-${suffix}`;
  
  // Make sure all theme colors are handled
  switch (colorName) {
    case 'red': return `${prefix}red-${suffix}`;
    case 'green': return `${prefix}green-${suffix}`;
    case 'blue': return `${prefix}blue-${suffix}`;
    case 'purple': return `${prefix}purple-${suffix}`;
    case 'yellow': return `${prefix}yellow-${suffix}`;
    case 'pink': return `${prefix}pink-${suffix}`;
    case 'indigo': return `${prefix}indigo-${suffix}`;
    case 'teal': return `${prefix}teal-${suffix}`;
    case 'orange': return `${prefix}orange-${suffix}`;
    case 'gray': return `${prefix}gray-${suffix}`;
    default: return `${prefix}blue-${suffix}`;
  }
};

export default function CharacterSelection({ onCharacterSelect, characters = [] }: CharacterSelectionProps) {
  const [selectedCharacter, setSelectedCharacter] = useState<number | null>(null);
  const [editingCharacter, setEditingCharacter] = useState<Character | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [characterName, setCharacterName] = useState('');
  const [characterColor, setCharacterColor] = useState<string>('#7f1d1d');
  const [characterThemeColor, setCharacterThemeColor] = useState<ThemeColor>('red');
  const [characterImageUrl, setCharacterImageUrl] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [processedCharacters, setProcessedCharacters] = useState<Character[]>([]);

  // Debug log to show the character data we're receiving
  useEffect(() => {
    console.log("Characters received:", JSON.stringify(characters, null, 2));
    
    // Process raw character data into the format needed for display
    if (characters && characters.length > 0) {
      const processed = characters.map(char => {
        // Map the database character to our display format
        let icon = <GiFishingPole className="text-white w-5 h-5" />;
        
        // Assign icons based on character stats
        if (char.level_fishing > Math.max(char.level_mining, char.level_cooking, char.level_cutting)) {
          icon = <GiFishingPole className="text-white w-5 h-5" />;
        } else if (char.level_mining > Math.max(char.level_fishing, char.level_cooking, char.level_cutting)) {
          icon = <GiAxeInStump className="text-white w-5 h-5" />;
        } else if (char.level_cooking > Math.max(char.level_fishing, char.level_mining, char.level_cutting)) {
          icon = <GiCookingPot className="text-white w-5 h-5" />;
        } else if (char.level_cutting > Math.max(char.level_fishing, char.level_mining, char.level_cooking)) {
          icon = <GiVillage className="text-white w-5 h-5" />;
        }
        
        // Get the theme color from the database color value
        const themeColor = getThemeColorFromValue(char.color);
        
        // Find the correct theme by color
        const theme = themes.find(t => t.color === themeColor) || themes[0];
        
        // Create the processed character with the correct theme
        return {
          id: char.id,
          name: char.name || 'Character',
          icon,
          theme: {
            ...theme,
            bgColor: char.color || theme.bgColor,
            name: char.name || theme.name,
            color: themeColor
          },
          imageurl: char.imageurl,
          character_nav_id: char.character_nav_id || 999 // Default high value for sorting if missing
        };
      });
      
      // Sort characters by character_nav_id (from 1 to 4)
      const sortedCharacters = [...processed].sort((a, b) => 
        (a.character_nav_id || 999) - (b.character_nav_id || 999)
      );
      
      console.log("Processed and sorted characters:", sortedCharacters);
      setProcessedCharacters(sortedCharacters);
    }
  }, [characters]);
  
  // Process a real-time preview of the character changes
  const previewCharacterWithChanges = () => {
    if (!editingCharacter) return null;
    
    // Get the theme color from the current input
    const themeColor = getThemeColorFromValue(characterColor);
    
    // Find the correct theme by color
    const baseTheme = themes.find(t => t.color === themeColor) || themes[0];
    
    // Create a preview of the character with current edits
    return {
      ...editingCharacter,
      name: characterName || editingCharacter.name,
      imageurl: characterImageUrl || editingCharacter.imageurl,
      character_nav_id: editingCharacter.character_nav_id, // Preserve nav ID
      theme: {
        ...baseTheme,
        name: characterName || editingCharacter.name,
        color: themeColor,
        bgColor: characterColor || baseTheme.bgColor,
      }
    };
  };
  
  const handleCharacterSelect = (id: number) => {
    setSelectedCharacter(id);
    
    const character = processedCharacters.find(c => c?.id === id);
    if (character) {
      console.log("Selected character data:", character);
      
      // Apply the theme
      const theme = setTheme(character.theme?.id || 0);
      
      if (onCharacterSelect) {
        onCharacterSelect({id, color: theme.color || 'blue'});
      }
    }
  };
  
  const handleEditClick = (e: React.MouseEvent, character: Character) => {
    e.stopPropagation(); 
    console.log("Editing character:", character);
    setEditingCharacter(character);
    setCharacterName(character.name || '');
    setCharacterColor(character.theme?.bgColor || '#7f1d1d');
    setCharacterThemeColor(character.theme?.color || 'red');
    setCharacterImageUrl(character.imageurl || '');
    setSaveError(null);
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCharacter(null);
    setSaveError(null);
  };
  
  // Define a list of available colors
  const colorOptions = [
    { name: 'Red', value: '#7f1d1d', theme: 'red' },
    { name: 'Crimson', value: '#991b1b', theme: 'red' },
    { name: 'Green', value: '#14532d', theme: 'green' },
    { name: 'Emerald', value: '#047857', theme: 'green' },
    { name: 'Blue', value: '#1e3a8a', theme: 'blue' },
    { name: 'Sky', value: '#0369a1', theme: 'blue' },
    { name: 'Purple', value: '#581c87', theme: 'purple' },
    { name: 'Violet', value: '#6b21a8', theme: 'purple' },
    { name: 'Yellow', value: '#854d0e', theme: 'yellow' },
    { name: 'Amber', value: '#b45309', theme: 'yellow' },
    { name: 'Pink', value: '#831843', theme: 'pink' },
    { name: 'Rose', value: '#9d174d', theme: 'pink' },
    { name: 'Indigo', value: '#3730a3', theme: 'indigo' },
    { name: 'Teal', value: '#0f766e', theme: 'teal' },
    { name: 'Orange', value: '#9a3412', theme: 'orange' },
    { name: 'Gray', value: '#374151', theme: 'gray' }
  ];
  
  const handleColorButtonClick = (color: string, themeColor: ThemeColor) => {
    setCharacterColor(color);
    setCharacterThemeColor(themeColor);
    
    // If editing the currently selected character, preview the theme change
    if (editingCharacter && selectedCharacter === editingCharacter.id) {
      // Apply color change to see it in real-time on the navbar
      const previewTheme = {
        ...themes.find(t => t.color === themeColor) || themes[0],
        bgColor: color
      };
      
      // Apply the theme preview immediately
      setTheme(previewTheme.id);
      
      // Also notify parent component about color change for game navbar
      if (onCharacterSelect) {
        onCharacterSelect({id: editingCharacter.id, color: themeColor});
      }
    }
  };
  
  const handleSaveChanges = async () => {
    if (!editingCharacter) return;
    
    setIsSaving(true);
    setSaveError(null);
    
    try {
      console.log("Saving character changes for ID:", editingCharacter.id.toString());
      console.log("New name:", characterName);
      console.log("New color (hex):", characterColor);
      console.log("New theme color (name):", characterThemeColor);
      console.log("New image URL:", characterImageUrl);
      
      // First save the name
      const nameResult = await updateCharacterName(
        editingCharacter.id.toString(), 
        characterName
      );
      
      if (!nameResult.success) {
        throw new Error(nameResult.error || "Failed to update character name");
      }
      
      // Save the color - using the theme color name (red, blue, etc.)
      // instead of the hex value for better consistency
      const colorResult = await updateCharacterColor(
        editingCharacter.id.toString(), 
        characterThemeColor // Use the theme color name instead of the hex value
      );
      
      if (!colorResult.success) {
        throw new Error(colorResult.error || "Failed to update character color");
      }
      
      // Process the image URL
      // If the URL doesn't start with http/https but is a valid relative path, 
      // we'll still save it as-is
      let imageUrlToSave = characterImageUrl?.trim() || '';
      
      // If it's empty, use the fallback
      if (!imageUrlToSave) {
        imageUrlToSave = '/fallback-character.png';
      }
      
      console.log("Saving image URL:", imageUrlToSave);
      
      // Now save the image URL
      const imageResult = await updateCharacterImageUrl(
        editingCharacter.id.toString(), 
        imageUrlToSave
      );
      
      if (!imageResult.success) {
        console.error("Image URL update failed:", imageResult.error);
        throw new Error(imageResult.error || "Failed to update character image");
      }
      
      const baseTheme = themes.find(t => t.color === characterThemeColor) || editingCharacter.theme;
      
      const customTheme: Theme = {
        ...baseTheme,
        id: baseTheme?.id || 0,
        name: characterName,
        color: characterThemeColor,
        bgColor: characterColor
      };
      
      // Apply the theme immediately to see changes
      const theme = setTheme(customTheme.id);
      
      if (selectedCharacter === editingCharacter.id) {
        if (onCharacterSelect) {
          onCharacterSelect({id: editingCharacter.id, color: characterThemeColor});
        }
      }
      
      // Update the processedCharacters with the new data
      setProcessedCharacters(prevChars => {
        const updatedChars = prevChars.map(char => {
          if (char.id === editingCharacter.id) {
            return {
              ...char,
              name: characterName,
              imageurl: imageUrlToSave,
              theme: {
                ...char.theme,
                name: characterName,
                color: characterThemeColor,
                bgColor: characterColor
              }
            };
          }
          return char;
        });
        
        // Re-sort to maintain the character_nav_id order
        return [...updatedChars].sort((a, b) => 
          (a.character_nav_id || 999) - (b.character_nav_id || 999)
        );
      });
      
      handleCloseModal();
      
      // Instead of reloading the page, we just update the local state
      // which will automatically trigger a re-render
      
    } catch (error) {
      console.error("Error saving character changes:", error);
      setSaveError(error instanceof Error ? error.message : "Failed to save changes");
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    if (selectedCharacter === null && processedCharacters && processedCharacters.length > 0) {
      handleCharacterSelect(processedCharacters[0]?.id);
    }
  }, [processedCharacters]);

  const getRingColorClass = (character: any, isSelected: boolean) => {
    if (!character?.theme?.color) {
      return isSelected ? "ring-blue-600" : "ring-gray-300";
    }
    
    const color = character.theme.color;
    if (isSelected) {
      switch (color) {
        case "red": return "ring-red-600";
        case "green": return "ring-green-600";
        case "blue": return "ring-blue-600";
        case "purple": return "ring-purple-600";
        case "yellow": return "ring-yellow-600";
        case "pink": return "ring-pink-600";
        case "indigo": return "ring-indigo-600";
        case "teal": return "ring-teal-600";
        case "orange": return "ring-orange-600";
        case "gray": return "ring-gray-600";
        default: return "ring-blue-600";
      }
    } else {
      switch (color) {
        case "red": return "ring-red-300";
        case "green": return "ring-green-300";
        case "blue": return "ring-blue-300";
        case "purple": return "ring-purple-300";
        case "yellow": return "ring-yellow-300";
        case "pink": return "ring-pink-300";
        case "indigo": return "ring-indigo-300";
        case "teal": return "ring-teal-300";
        case "orange": return "ring-orange-300";
        case "gray": return "ring-gray-300";
        default: return "ring-gray-300";
      }
    }
  };

  // Get a preview character if editing, or the actual character if not
  const getCharacterToRender = (character: Character) => {
    if (isModalOpen && editingCharacter && character.id === editingCharacter.id) {
      // Create a preview with the current edited values
      const preview = previewCharacterWithChanges();
      
      // Add additional logging to diagnose color issues
      if (preview) {
        console.log("Character preview:", {
          id: preview.id,
          color: preview.theme.color,
          bgColor: preview.theme.bgColor,
          name: preview.name
        });
      }
      
      return preview || character;
    }
    return character;
  };

  if (!characters || characters.length === 0) {
    return <div className="text-center p-4">No characters available</div>;
  }

  return (
    <>
      <div className="fixed bottom-8 left-0 right-0 flex justify-center z-50">
        <div className="flex flex-row gap-6">
          {processedCharacters.map(character => {
            const renderCharacter = getCharacterToRender(character);
            return renderCharacter && (
              <div key={renderCharacter.id} className="relative group">
                <button
                  onClick={() => handleCharacterSelect(renderCharacter.id)}
                  className={`
                    w-16 h-16 rounded-full overflow-hidden relative
                    hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1
                    ${selectedCharacter === renderCharacter.id 
                      ? `ring-3 ring-offset-2 ${getRingColorClass(renderCharacter, true)} dark:ring-offset-gray-800 scale-110` 
                      : `ring-2 ring-offset-2 ${getRingColorClass(renderCharacter, false)} dark:ring-offset-gray-800`
                    }
                  `}
                  aria-label={`Select character ${renderCharacter.name || 'Unknown'}`}
                >
                  <Image
                    src={getSafeImageSrc(renderCharacter.imageurl)}
                    alt={renderCharacter.name || 'Character'}
                    fill
                    sizes="(max-width: 768px) 64px, 64px"
                    priority={selectedCharacter === renderCharacter.id}
                    className="object-cover"
                    unoptimized={!!(renderCharacter.imageurl && !renderCharacter.imageurl.startsWith('/'))}
                  />
                </button>
              
                <div className="absolute -bottom-1 -left-1 w-8 h-8 rounded-full bg-black bg-opacity-50 flex items-center justify-center">
                  {renderCharacter.icon}
                </div>
                
                <button 
                  onClick={(e) => handleEditClick(e, renderCharacter)}
                  className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-white bg-opacity-90 flex items-center justify-center shadow-md hover:bg-opacity-100 transition-all hover:scale-110 border border-gray-300"
                  aria-label={`Edit character ${renderCharacter.name || 'Unknown'}`}
                >
                  <FiEdit3 className="w-4 h-4 text-gray-700" />
                </button>
                
                <div 
                  className={`absolute -top-10 left-1/2 transform -translate-x-1/2 
                    px-3 py-1.5 rounded-lg shadow-lg backdrop-blur-md
                    ${selectedCharacter === renderCharacter.id 
                      ? `${safeColorClass('bg-', renderCharacter.theme?.color, '500/90')} text-white font-bold` 
                      : 'bg-black/75 text-white/90 font-medium'
                    }
                    transition-all duration-300 min-w-max
                    border ${selectedCharacter === renderCharacter.id 
                      ? `${safeColorClass('border-', renderCharacter.theme?.color, '400')}` 
                      : 'border-white/20'
                    }
                    flex items-center justify-center whitespace-nowrap
                    opacity-0 group-hover:opacity-100 pointer-events-none
                    translate-y-1 group-hover:translate-y-0`}
                >
                  <span className={`text-sm ${selectedCharacter === renderCharacter.id ? 'drop-shadow-md' : ''}`}>
                    {renderCharacter.name || 'Unknown'}
                  </span>
                </div>
              </div>
            );
          })}
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
                disabled={isSaving}
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              {saveError && (
                <div className="p-3 bg-red-100 border border-red-300 text-red-700 rounded-md">
                  {saveError}
                </div>
              )}
              
              <div className="flex justify-center mb-6">
                <div className="relative w-24 h-24 rounded-full overflow-hidden border-2" style={{ borderColor: characterColor }}>
                  <Image
                    src={getSafeImageSrc(characterImageUrl)}
                    alt="Character Preview"
                    fill
                    sizes="96px"
                    priority
                    className="object-cover"
                    unoptimized={!!(characterImageUrl && !characterImageUrl.startsWith('/'))}
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
                  placeholder="https://example.com/character.png or /fallback-character.png"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white font-medium"
                  disabled={isSaving}
                />
                {characterImageUrl && !isValidImageSource(characterImageUrl) && (
                  <p className="mt-1 text-sm text-red-600">
                    Please enter a valid URL (starting with http:// or https://) or path (starting with /)
                  </p>
                )}
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
                  disabled={isSaving}
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-800 dark:text-gray-200 mb-2">
                  Character Color
                </label>
                
                <div className="grid grid-cols-4 gap-2 mb-3">
                  {colorOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleColorButtonClick(option.value, option.theme as ThemeColor)}
                      className={`h-12 w-full rounded-md shadow-sm transition-all duration-150 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                        characterColor === option.value 
                          ? `ring-2 ring-offset-2 ring-${option.theme}-500 scale-105` 
                          : ''
                      }`}
                      style={{ backgroundColor: option.value }}
                      aria-label={`${option.name} color`}
                      title={option.name}
                    ></button>
                  ))}
                </div>
                
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Select a character color theme
                </p>
              </div>
            </div>
            
            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600 flex justify-end">
              <button
                onClick={handleCloseModal}
                className="mr-3 px-5 py-2.5 text-sm font-bold text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                disabled={isSaving}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveChanges}
                className={`px-5 py-2.5 text-sm font-bold text-white bg-blue-600 border border-transparent rounded-lg shadow-sm hover:bg-blue-700 transition-all duration-200 focus:outline-none transform hover:scale-105 ${isSaving ? 'opacity-75 cursor-not-allowed' : ''}`}
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
