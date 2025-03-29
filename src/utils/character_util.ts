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


