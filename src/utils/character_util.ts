/**
 * Ruft einen spezifischen Charakter und seinen Skill-Level über die bestehende API ab.
 * @param characterId - Die ID des Charakters
 * @param skill - Der gewünschte Skill ('fishing', 'cooking','mining','cutting')
 * @returns Den Skill-Wert oder null
 */
export async function getCharacterLevel(characterId: string, skill: string) {
  try {
    const response = await fetch(`/api/get_characters`);
    if (!response.ok) throw new Error(`Fehler: ${response.status}`);

    const data = await response.json();

    if (!data.success || !data.characters) {
      throw new Error('Fehler beim Abrufen der Charakterdaten');
    }

    const character = data.characters.find((char: any) => char.id === characterId);
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
    const response = await fetch("/api/get_characters");
    if (!response.ok) throw new Error(`Fehler: ${response.status}`);

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.error || "Failed to fetch characters");
    }

    return data.characters.map((char: { id: string }) => char.id);
  } catch (error) {
    console.error("Error fetching character IDs:", error);
    return [];
  }
}
export async function getCharacterName(characterId:string) {
  try {
    const response = await fetch(`/api/get_characters`);
    const data = await response.json();
    
    if (!data.success || !data.characters) {
      throw new Error('Fehler beim Abrufen der Charakterdaten');
    }
    const character = data.characters.find((char: any) => char.id === characterId);
    if (!character) throw new Error('Charakter nicht gefunden');
    return character.name;
  }
  catch (err) {
  console.error('Fehler in getCharacterName:', err);
  return null;
}
}


export async function setCharacterName(character_id: string, newName: string) {
  try {
    const response = await fetch("/api/update_character", {
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

    if (response.ok) {
      return { success: true, message: "Character name updated successfully!" };
    } else {
      return { success: false, error: result.error || "Failed to update character name" };
    }
  } catch (error) {
    return { success: false, error: "An error occurred while updating the name" };
  }
}

export async function setCharacterLocation(character_id: string, newLocation: string) {
  try {
    const response = await fetch("/api/update_character", {
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
    return { success: false, error: "An error occurred while updating the location" };
  }
}
export async function setCharacterImageUrl(character_id: string, newImageUrl: string) {
  try {
    const response = await fetch("/api/update_character", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: character_id,
        imageurl: newImageUrl,
      }),
    });

    const result = await response.json();

    if (response.ok) {
      return { success: true, message: "Character ImageUrl updated successfully!" };
    } else {
      return { success: false, error: result.error || "Failed to update character ImageUrl" };
    }
  } catch (error) {
    return { success: false, error: "An error occurred while updating the ImageUrl" };
  }
}


export async function setCharacterColor(character_id: string, newColor: string) {
  try {
    const response = await fetch("/api/update_character", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: character_id,
        color: newColor,
      }),
    });

    const result = await response.json();

    if (response.ok) {
      return { success: true, message: "Character Color updated successfully!" };
    } else {
      return { success: false, error: result.error || "Failed to update character Color" };
    }
  } catch (error) {
    return { success: false, error: "An error occurred while updating the Color" };
  }
}
export async function increaseCharacterExp(character_id: string,skill: string,value:number ) {

  const currentLevel = await getCharacterLevel(character_id,skill);
  if (currentLevel === undefined || currentLevel === null) {
    return { success: false, error: "Failed to retrieve current skill level" };
  }
  const newLevel = currentLevel + value;
  const skillKey = `level_${skill.toLowerCase()}`;
  try {
    const response = await fetch("api/update_character", {
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
    return { success: false, error: "An error occurred while updating the Skill" };
  }
  
  
  }


