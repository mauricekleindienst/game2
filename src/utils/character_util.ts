/**
 * Ruft einen spezifischen Charakter und seinen Skill-Level über die bestehende API ab.
 * @param characterId - Die ID des Charakters
 * @param skill - Der gewünschte Skill (z.B. 'fishing', 'cooking')
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

/**
 * 
 * @param characterId Die ID des Characters
 * @param increaseBy Wert um den das Level erhöht werden soll
 * @returns 
 */
export const increaseFishingLevel = async (characterId: string, increaseBy: number) => {
  const response = await fetch('/api/update_fishing_level', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ characterId, increaseBy }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error);
  }
  return data.updatedFishingLevel;
};