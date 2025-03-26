/**
 * Ruft einen spezifischen Charakter und seinen Skill-Level über die bestehende API ab.
 * @param characterId - Die ID des Charakters
 * @param skill - Der gewünschte Skill ('fishing', 'cooking','mining','cutting')
 * @returns Den Skill-Wert oder null
 */
export async function getCharacterLevel(characterId: string, skill: string) {
  try {
    const response = await fetch(`/api/get_characters`); // Keine Base-URL nötig
    if (!response.ok) throw new Error(`Fehler: ${response.status}`);

    const data = await response.json();

    if (!data.success || !data.characters) {
      throw new Error('Fehler beim Abrufen der Charakterdaten');
    }

    // Charakter anhand der ID finden
    const character = data.characters.find((char: any) => char.id === characterId);
    if (!character) throw new Error('Charakter nicht gefunden');

    // Skill-Umwandlung (falls nötig)
    const skillKey = `level_${skill.toLowerCase()}`;
    if (!(skillKey in character)) throw new Error('Ungültiger Skill-Name');

    return character[skillKey];
  } catch (err) {
    console.error('Fehler in getCharacterSkill:', err);
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


