"use client"
import { useState } from "react";
import { setCharacterName, setCharacterLocation, increaseCharacterExp } from "@/utils/character_util";

const DebugPage = () => {
  const [characterId, setCharacterId] = useState("");
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [skill, setSkill] = useState("");
  const [expValue, setExpValue] = useState<number>(0);
  const [resultMessage, setResultMessage] = useState("");

  // Handle Name Update
  const updateName = async () => {
    const result = await setCharacterName(characterId, name);
    setResultMessage(result.success ? result.message : result.error);
  };

  // Handle Location Update
  const updateLocation = async () => {
    const result = await setCharacterLocation(characterId, location);
    setResultMessage(result.success ? result.message : result.error);
  };

  // Handle Skill XP Increase
  const increaseSkillExp = async () => {
    const result = await increaseCharacterExp(characterId, skill, expValue);
    setResultMessage(result.success ? result.message : result.error);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Character Debug Page</h1>
      <div>
        <label>Character ID:</label>
        <input
          type="text"
          value={characterId}
          onChange={(e) => setCharacterId(e.target.value)}
          placeholder="Enter character ID"
        />
      </div>
      <div>
        <h2>Update Name</h2>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter new name"
        />
        <button onClick={updateName}>Update Name</button>
      </div>
      <div>
        <h2>Update Location</h2>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Enter new location"
        />
        <button onClick={updateLocation}>Update Location</button>
      </div>
      <div>
        <h2>Increase Skill XP</h2>
        <input
          type="text"
          value={skill}
          onChange={(e) => setSkill(e.target.value)}
          placeholder="Enter skill (e.g. mining, fishing)"
        />
        <input
          type="number"
          value={expValue}
          onChange={(e) => setExpValue(Number(e.target.value))}
          placeholder="Enter XP increase"
        />
        <button onClick={increaseSkillExp}>Increase XP</button>
      </div>
      <div style={{ marginTop: "20px", color: "green" }}>
        <h3>{resultMessage}</h3>
      </div>
    </div>
  );
};

export default DebugPage;