"use client";
import { useState, useEffect } from "react";
import { setCharacterName, setCharacterLocation, increaseCharacterExp, getCharacterIds } from "@/utils/character_util";
import { getLowestFreeSlot, updateInventory } from "@/utils/inventory_util"; // Importiere die Inventar-Funktionen

const DebugPage = () => {
  const [characterId, setCharacterId] = useState("");
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [skill, setSkill] = useState("");
  const [expValue, setExpValue] = useState<number>(0);
  const [resultMessage, setResultMessage] = useState("");
  const [characterIds, setCharacterIds] = useState<string[]>([]);

  // Inventar API Test State
  const [itemType, setItemType] = useState("weapon");
  const [itemId, setItemId] = useState("sword_001");
  const [quantity, setQuantity] = useState(1);
  const [slot, setSlot] = useState<number | null>(null);

  // Funktionen für Charakterverwaltung
  const updateName = async () => {
    const result = await setCharacterName(characterId, name);
    setResultMessage(result.success ? result.message : result.error);
  };

  const updateLocation = async () => {
    const result = await setCharacterLocation(characterId, location);
    setResultMessage(result.success ? result.message : result.error);
  };

  const increaseSkillExp = async () => {
    const result = await increaseCharacterExp(characterId, skill, expValue);
    setResultMessage(result.success ? result.message : result.error);
  };

  const fetchCharacterIds = async () => {
    const ids = await getCharacterIds();
    setCharacterIds(ids);
  };

  // Funktion zum Testen der Inventar-API
  const handleUpdateInventory = async () => {
    try {
      let assignedSlot = slot;

      if (assignedSlot === null || assignedSlot === undefined) {
        // Wenn kein Slot angegeben ist, suche den niedrigsten freien Slot
        assignedSlot = await getLowestFreeSlot();
        if (assignedSlot === null) {
          setResultMessage("Inventar ist voll.");
          return;
        }
      }

      // Verwende die updateInventory Funktion aus inventory_util
      const result = await updateInventory(itemType, itemId, quantity);

      if (typeof result === "string") {
        setResultMessage(result);
      } else {
        setResultMessage(result.success ? result.message : result.error || "Unbekannte Antwort");
      }
    } catch (error) {
      setResultMessage(`Fehler: ${error instanceof Error ? error.message : "Unbekannter Fehler"}`);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Character Debug Page</h1>

      {/* Charakterverwaltung */}
      <div>
        <label>Character ID:</label>
        <input type="text" value={characterId} onChange={(e) => setCharacterId(e.target.value)} placeholder="Enter character ID" />
      </div>
      <div>
        <h2>Update Name</h2>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter new name" />
        <button onClick={updateName}>Update Name</button>
      </div>
      <div>
        <h2>Update Location</h2>
        <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Enter new location" />
        <button onClick={updateLocation}>Update Location</button>
      </div>
      <div>
        <h2>Increase Skill XP</h2>
        <input type="text" value={skill} onChange={(e) => setSkill(e.target.value)} placeholder="Enter skill (e.g. mining, fishing)" />
        <input type="number" value={expValue} onChange={(e) => setExpValue(Number(e.target.value))} placeholder="Enter XP increase" />
        <button onClick={increaseSkillExp}>Increase XP</button>
      </div>
      <div>
        <h2>Fetch Character IDs</h2>
        <button onClick={fetchCharacterIds}>Get Character IDs</button>
        <ul>
          {characterIds.map((id) => (
            <li key={id}>{id}</li>
          ))}
        </ul>
      </div>

      {/* Inventar API Test */}
      <div style={{ marginTop: "30px", padding: "15px", border: "1px solid #ccc", borderRadius: "5px" }}>
        <h2>Inventar Test</h2>
        <div>
          <label>Item Type:</label>
          <input type="text" value={itemType} onChange={(e) => setItemType(e.target.value)} />
        </div>
        <div>
          <label>Item ID:</label>
          <input type="text" value={itemId} onChange={(e) => setItemId(e.target.value)} />
        </div>
        <div>
          <label>Quantity:</label>
          <input type="number" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} />
        </div>
        <div>
          <label>Slot (optional):</label>
          <input type="number" value={slot ?? ""} onChange={(e) => setSlot(e.target.value ? Number(e.target.value) : null)} />
        </div>
        <button onClick={handleUpdateInventory}>Update Inventory</button>
      </div>

      {/* Ergebnisanzeige */}
      <div style={{ marginTop: "20px", color: "green" }}>
        <h3>{resultMessage}</h3>
      </div>
    </div>
  );
};

export default DebugPage;