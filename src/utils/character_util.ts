/**
 * Gibt Level-Infos basierend auf den Gesamt-XP zurück.
 *
 * @param xp - Die gesamten Erfahrungspunkte des Spielers.
 * @returns level: Aktuelles Level
 *          currentXp: xp im aktuellen Level
 *          maxXp: xp benötigt für das gesamte Level
 *          progressPercent: Prozentualer Fortschritt im aktuellen Level
 * @example
 * const info = getLevelInfoFromXp(900);
 * // info = { level: 8, currentXp: 97, maxXp: 167, progressPercent: 58.08 }
 */
export function getLevelFromXp(xp: number){
  const levels = {
    "1": { "total_xp": 0 },
    "2": { "total_xp": 83 },
    "3": { "total_xp": 175 },
    "4": { "total_xp": 277 },
    "5": { "total_xp": 389 },
    "6": { "total_xp": 513 },
    "7": { "total_xp": 651 },
    "8": { "total_xp": 803 },
    "9": { "total_xp": 970 },
    "10": { "total_xp": 1155 },
    "11": { "total_xp": 1360 },
    "12": { "total_xp": 1585 },
    "13": { "total_xp": 1834 },
    "14": { "total_xp": 2109 },
    "15": { "total_xp": 2413 },
    "16": { "total_xp": 2748 },
    "17": { "total_xp": 3118 },
    "18": { "total_xp": 3526 },
    "19": { "total_xp": 3976 },
    "20": { "total_xp": 4473 },
    "21": { "total_xp": 5021 },
    "22": { "total_xp": 5626 },
    "23": { "total_xp": 6294 },
    "24": { "total_xp": 7032 },
    "25": { "total_xp": 7845 },
    "26": { "total_xp": 8743 },
    "27": { "total_xp": 9734 },
    "28": { "total_xp": 10828 },
    "29": { "total_xp": 12035 },
    "30": { "total_xp": 13367 },
    "31": { "total_xp": 14837 },
    "32": { "total_xp": 16460 },
    "33": { "total_xp": 18251 },
    "34": { "total_xp": 20228 },
    "35": { "total_xp": 22410 },
    "36": { "total_xp": 24819 },
    "37": { "total_xp": 27478 },
    "38": { "total_xp": 30413 },
    "39": { "total_xp": 33652 },
    "40": { "total_xp": 37229 },
    "41": { "total_xp": 41176 },
    "42": { "total_xp": 45534 },
    "43": { "total_xp": 50344 },
    "44": { "total_xp": 55655 },
    "45": { "total_xp": 61517 },
    "46": { "total_xp": 67989 },
    "47": { "total_xp": 75133 },
    "48": { "total_xp": 83020 },
    "49": { "total_xp": 91727 },
    "50": { "total_xp": 101339 },
    "51": { "total_xp": 111951 },
    "52": { "total_xp": 123666 },
    "53": { "total_xp": 136600 },
    "54": { "total_xp": 150879 },
    "55": { "total_xp": 166642 },
    "56": { "total_xp": 184046 },
    "57": { "total_xp": 203260 },
    "58": { "total_xp": 224473 },
    "59": { "total_xp": 247892 },
    "60": { "total_xp": 273748 },
    "61": { "total_xp": 302295 },
    "62": { "total_xp": 333811 },
    "63": { "total_xp": 368606 },
    "64": { "total_xp": 407022 },
    "65": { "total_xp": 449435 },
    "66": { "total_xp": 496261 },
    "67": { "total_xp": 547960 },
    "68": { "total_xp": 605039 },
    "69": { "total_xp": 668058 },
    "70": { "total_xp": 737635 },
    "71": { "total_xp": 814452 },
    "72": { "total_xp": 899264 },
    "73": { "total_xp": 992902 },
    "74": { "total_xp": 1096286 },
    "75": { "total_xp": 1210429 },
    "76": { "total_xp": 1336451 },
    "77": { "total_xp": 1475589 },
    "78": { "total_xp": 1629208 },
    "79": { "total_xp": 1798816 },
    "80": { "total_xp": 1986076 },
    "81": { "total_xp": 2192826 },
    "82": { "total_xp": 2421095 },
    "83": { "total_xp": 2673123 },
    "84": { "total_xp": 2951382 },
    "85": { "total_xp": 3258603 },
    "86": { "total_xp": 3597800 },
    "87": { "total_xp": 3972303 },
    "88": { "total_xp": 4385785 },
    "89": { "total_xp": 4842305 },
    "90": { "total_xp": 5346341 },
    "91": { "total_xp": 5902840 },
    "92": { "total_xp": 6517263 },
    "93": { "total_xp": 7195638 },
    "94": { "total_xp": 7944624 },
    "95": { "total_xp": 8771568 },
    "96": { "total_xp": 9684587 },
    "97": { "total_xp": 10692639 },
    "98": { "total_xp": 11805616 },
    "99": { "total_xp": 13034441 },
  };

  const levelStrings = Object.keys(levels).sort((a, b) => parseInt(a) - parseInt(b));
  let resultLevel = 1;
  let currentXp = 0;
  let maxXp = 0;
  let progressPercent = 0;

  for (let i = 0; i < levelStrings.length; i++) {
    const currentLevel = parseInt(levelStrings[i]);
    const currentLevelXp = levels[levelStrings[i] as keyof typeof levels].total_xp;
    const nextLevelXp = i + 1 < levelStrings.length
      ? levels[levelStrings[i + 1] as keyof typeof levels].total_xp
      : Infinity;

    if (xp >= currentLevelXp && xp < nextLevelXp) {
      resultLevel = currentLevel;
      currentXp = xp - currentLevelXp;
      maxXp = nextLevelXp - currentLevelXp;
      progressPercent = maxXp > 0 ? (currentXp / maxXp) * 100 : 100;
      break;
    }

    if (i === levelStrings.length - 1 && xp >= currentLevelXp) {
      resultLevel = currentLevel;
      currentXp = xp - currentLevelXp;
      maxXp = 0;
      progressPercent = 100;
    }
  }

  return {
    level: resultLevel,
    currentXp,
    maxXp,
    progressPercent
  };
}


// Helper function to get the base URL for API calls
const getBaseUrl = (): string => {
  if (typeof window === 'undefined') return '';
  
  // Get the origin (protocol + hostname + port)
  const origin = window.location.origin;
  
  // Return the origin to use as base for API routes
  return origin;
};

/**
 * Ruft einen spezifischen Charakter und seinen Skill-Level über die bestehende API ab.
 * @param characterId - Die ID des Charakters
 * @param skill - Der gewünschte Skill ('fishing', 'cooking','mining','cutting')
 * @returns Den Skill-Wert oder null
 */
export async function getCharacterLevel(characterId: string, skill: string) {
  try {
    if (!characterId || !skill) {
      console.warn("Character ID and skill are required");
      return null;
    }

    const baseUrl = getBaseUrl();
    const response = await fetch(`${baseUrl}/api/get_characters`);
    if (!response.ok) throw new Error(`Fehler: ${response.status}`);

    const data = await response.json();

    if (!data.success) {
      throw new Error('Fehler beim Abrufen der Charakterdaten');
    }

    // Make sure data.data exists and is an array
    if (!data.data || !Array.isArray(data.data)) {
      throw new Error('Keine Charakterdaten gefunden');
    }

    const character = data.data.find((char: any) => char.id === characterId);
    if (!character) throw new Error('Charakter nicht gefunden');

    const skillKey = `level_${skill.toLowerCase()}`;
    if (!(skillKey in character)) throw new Error('Ungültiger Skill-Name');

    return character[skillKey];
  } catch (err) {
    console.error('Fehler in getCharacterSkill:', err);
    return null;
  }
}

export async function getCharacterIds(): Promise<string[]> {
  try {
    const baseUrl = getBaseUrl();
    const response = await fetch(`${baseUrl}/api/get_characters`);
    if (!response.ok) throw new Error(`Fehler: ${response.status}`);

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || "Failed to fetch characters");
    }

    // Make sure data.characters exists and is an array before trying to map
    if (!data.data || !Array.isArray(data.data)) {
      console.warn("Character data is missing or not an array");
      return [];
    }

    return data.data.map((char: { id: string }) => char.id || '');
  } catch (error) {
    console.error("Error fetching character IDs:", error);
    return [];
  }
}

export async function getCharacterName(characterId: string) {
  try {
    if (!characterId) {
      console.warn("Character ID is required");
      return null;
    }

    const baseUrl = getBaseUrl();
    const response = await fetch(`${baseUrl}/api/get_characters`);
    if (!response.ok) throw new Error(`Fehler: ${response.status}`);
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error('Fehler beim Abrufen der Charakterdaten');
    }
    
    // Make sure data.characters exists and is an array
    if (!data.data || !Array.isArray(data.data)) {
      throw new Error('Keine Charakterdaten gefunden');
    }
    
    const character = data.data.find((char: any) => char.id === characterId);
    if (!character) throw new Error('Charakter nicht gefunden');
    
    return character.name || '';
  }
  catch (err) {
    console.error('Fehler in getCharacterName:', err);
    return null;
  }
}

export async function setCharacterName(character_id: string, newName: string) {
  try {
    if (!character_id || !newName) {
      return { success: false, error: "Character ID and name are required" };
    }
    
    const baseUrl = getBaseUrl();
    const response = await fetch(`${baseUrl}/api/update_character`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: character_id,
        name: newName,
      }),
    });

    const result = await response.json();
    
    // Log the response for debugging
    console.log("Set character name response:", result);

    if (response.ok) {
      return { success: true, message: "Character name updated successfully!" };
    } else {
      return { success: false, error: result.error || "Failed to update character name" };
    }
  } catch (error) {
    console.error("Error updating character name:", error);
    return { success: false, error: "An error occurred while updating the name" };
  }
}

export async function setCharacterLocation(character_id: string, newLocation: string) {
  try {
    if (!character_id || !newLocation) {
      return { success: false, error: "Character ID and location are required" };
    }
    
    const baseUrl = getBaseUrl();
    const response = await fetch(`${baseUrl}/api/update_character`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: character_id,
        location: newLocation,
      }),
    });

    const result = await response.json();

    if (response.ok) {
      return { success: true, message: "Character location updated successfully!" };
    } else {
      return { success: false, error: result.error || "Failed to update character location" };
    }
  } catch (error) {
    console.error("Error updating character location:", error);
    return { success: false, error: "An error occurred while updating the location" };
  }
}

export async function setCharacterImageUrl(character_id: string, newImageUrl: string) {
  try {
    if (!character_id) {
      return { success: false, error: "Character ID is required" };
    }
    
    // Allow empty URLs or URLs that are paths
    if (newImageUrl === null || newImageUrl === undefined || newImageUrl.trim() === '') {
      newImageUrl = '/fallback-character.png';
    }

    console.log("Setting character image URL:", {
      characterId: character_id,
      newImageUrl: newImageUrl
    });
    
    const baseUrl = getBaseUrl();
    const response = await fetch(`${baseUrl}/api/update_character`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: character_id,
        imageurl: newImageUrl,  // Note: this needs to match the database field name
      }),
    });

    let result;
    try {
      result = await response.json();
    } catch (e) {
      console.error("Error parsing response:", e);
      return { 
        success: false, 
        error: "Failed to parse server response" 
      };
    }
    
    // Log the response for debugging
    console.log("Set character image response:", result);

    if (response.ok) {
      return { success: true, message: "Character image URL updated successfully!" };
    } else {
      return { success: false, error: result.error || "Failed to update character image URL" };
    }
  } catch (error) {
    console.error("Error updating character image URL:", error);
    return { success: false, error: "An error occurred while updating the image URL" };
  }
}

export async function setCharacterColor(character_id: string, newColor: string) {
  try {
    if (!character_id) {
      return { success: false, error: "Character ID is required" };
    }
    
    // Ensure we have a valid color format (either named color or hex)
    let colorToSave = newColor?.trim() || '';
    
    // If color is empty, use a default color
    if (!colorToSave) {
      colorToSave = 'blue';
    }
    
    // Map hex values to theme color names to store in the database
    // This is important for proper theme handling
    if (colorToSave.startsWith('#')) {
      // Red colors
      if (colorToSave === '#7f1d1d' || colorToSave === '#991b1b') {
        colorToSave = 'red';
      }
      // Green colors
      else if (colorToSave === '#14532d' || colorToSave === '#047857') {
        colorToSave = 'green';
      }
      // Blue colors
      else if (colorToSave === '#1e3a8a' || colorToSave === '#0369a1') {
        colorToSave = 'blue';
      }
      // Purple colors
      else if (colorToSave === '#581c87' || colorToSave === '#6b21a8') {
        colorToSave = 'purple';
      }
      // Yellow colors
      else if (colorToSave === '#854d0e' || colorToSave === '#b45309') {
        colorToSave = 'yellow';
      }
      // Pink colors
      else if (colorToSave === '#831843' || colorToSave === '#9d174d') {
        colorToSave = 'pink';
      }
      // Indigo colors
      else if (colorToSave === '#3730a3') {
        colorToSave = 'indigo';
      }
      // Teal colors
      else if (colorToSave === '#0f766e') {
        colorToSave = 'teal';
      }
      // Orange colors
      else if (colorToSave === '#9a3412') {
        colorToSave = 'orange';
      }
      // Gray colors
      else if (colorToSave === '#374151') {
        colorToSave = 'gray';
      }
    }
    
    console.log("Setting character color:", {
      characterId: character_id,
      originalColor: newColor,
      savedColor: colorToSave
    });
    
    const baseUrl = getBaseUrl();
    const response = await fetch(`${baseUrl}/api/update_character`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: character_id,
        color: colorToSave,
      }),
    });

    const result = await response.json();
    
    // Log the response for debugging
    console.log("Set character color response:", result);

    if (response.ok) {
      return { success: true, message: "Character color updated successfully!" };
    } else {
      return { success: false, error: result.error || "Failed to update character color" };
    }
  } catch (error) {
    console.error("Error updating character color:", error);
    return { success: false, error: "An error occurred while updating the color" };
  }
}

export async function increaseCharacterExp(character_id: string, skill: string, value: number) {
  const currentLevel = await getCharacterLevel(character_id, skill);
  if (currentLevel === undefined || currentLevel === null) {
    return { success: false, error: "Failed to retrieve current skill level" };
  }
  const newLevel = currentLevel + value;
  const skillKey = `level_${skill.toLowerCase()}`;
  try {
    const baseUrl = getBaseUrl();
    const response = await fetch(`${baseUrl}/api/update_character`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: character_id,
        [skillKey]: newLevel,
      }),
    });
    const result = await response.json();

    if (response.ok) {
      return { success: true, message: "Character Skill updated successfully!" };
    } else {
      return { success: false, error: result.error || "Failed to update character Skill" };
    }
  } catch (error) {
    console.error("Error updating character skill:", error);
    return { success: false, error: "An error occurred while updating the Skill" };
  }
}


