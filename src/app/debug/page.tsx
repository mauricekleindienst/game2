"use client"
import { useState, useEffect } from "react";
import { setCharacterName, setCharacterLocation, increaseCharacterExp, getCharacterIds } from "@/utils/character_util";

const DebugPage = () => {
  const [characterId, setCharacterId] = useState("");
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [skill, setSkill] = useState("");
  const [expValue, setExpValue] = useState<number>(0);
  const [resultMessage, setResultMessage] = useState("");
  const [characterIds, setCharacterIds] = useState<string[]>([]);
  
  // User settings state
  const [userSettings, setUserSettings] = useState<any>(null);
  const [theme, setTheme] = useState("dark");
  const [welcomeStatus, setWelcomeStatus] = useState(false);

  // Record login time when page loads
  useEffect(() => {
    const recordLogin = async () => {
      try {
        const response = await fetch('/api/update_player', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            login_time: new Date().toISOString(),
          }),
        });
        
        if (response.ok) {
          fetchUserSettings();
        }
      } catch (error) {
        console.error("Error recording login time:", error);
      }
    };
    
    recordLogin();
    
    // Record logout time when user leaves the page
    const handleBeforeUnload = () => {
      // Using navigator.sendBeacon for more reliable data sending during page unload
      const data = JSON.stringify({
        logout_time: new Date().toISOString(),
      });
      
      navigator.sendBeacon('/api/update_player', data);
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);
  
  // Fetch user settings
  const fetchUserSettings = async () => {
    try {
      const response = await fetch('/api/get_user_settings', {
        method: 'GET',
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          setUserSettings(data.data);
          setTheme(data.data.theme || "dark");
          setWelcomeStatus(data.data.welcome_status || false);
        }
      }
    } catch (error) {
      console.error("Error fetching user settings:", error);
    }
  };

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

  // Fetch Character IDs
  const fetchCharacterIds = async () => {
    const ids = await getCharacterIds();
    setCharacterIds(ids);
  };
  
  // Update user settings
  const updateUserSettings = async () => {
    try {
      const response = await fetch('/api/update_player', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          theme,
          welcome_status: welcomeStatus,
        }),
      });
      
      if (response.ok) {
        setResultMessage("User settings updated successfully");
        fetchUserSettings();
      } else {
        setResultMessage("Failed to update user settings");
      }
    } catch (error) {
      setResultMessage(`Error: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Character Debug Page</h1>
      
      <div style={{ marginBottom: "30px", padding: "15px", border: "1px solid #ccc", borderRadius: "5px" }}>
        <h2>User Settings</h2>
        {userSettings ? (
          <div>
            <p><strong>Player ID:</strong> {userSettings.Player}</p>
            <p><strong>Last Login:</strong> {userSettings.login_time ? new Date(userSettings.login_time).toLocaleString() : 'Never'}</p>
            <p><strong>Last Logout:</strong> {userSettings.logout_time ? new Date(userSettings.logout_time).toLocaleString() : 'Never'}</p>
            <p><strong>Playtime:</strong> {userSettings.playtime || 0} minutes</p>
            
            <div style={{ marginTop: "15px" }}>
              <label>Theme: </label>
              <select value={theme} onChange={(e) => setTheme(e.target.value)}>
                <option value="dark">Dark</option>
                <option value="light">Light</option>
              </select>
            </div>
            
            <div style={{ marginTop: "10px" }}>
              <label>
                <input 
                  type="checkbox" 
                  checked={welcomeStatus} 
                  onChange={(e) => setWelcomeStatus(e.target.checked)} 
                />
                Welcome Status
              </label>
            </div>
            
            <button 
              style={{ marginTop: "10px" }} 
              onClick={updateUserSettings}
            >
              Update Settings
            </button>
          </div>
        ) : (
          <p>Loading user settings...</p>
        )}
      </div>
      
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
      <div>
        <h2>Fetch Character IDs</h2>
        <button onClick={fetchCharacterIds}>Get Character IDs</button>
        <ul>
          {characterIds.map((id) => (
            <li key={id}>{id}</li>
          ))}
        </ul>
      </div>
      <div style={{ marginTop: "20px", color: "green" }}>
        <h3>{resultMessage}</h3>
      </div>
    </div>
  );
};

export default DebugPage;
