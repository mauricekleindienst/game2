import { createServerSupabaseClient } from "@/lib/supabase_server";

export async function updateCharacter(data: {
  id: string;
  user_id: string;
  name?: string;
  location?: string;
  level_mining?: number;
  level_cooking?: number;
  level_cutting?: number;
  level_fishing?: number;
  color?: string;
  imageurl?: string;
  character_nav_id?: number;
}) {
  const supabase = await createServerSupabaseClient();

  const { id, ...updates } = data;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user){
    return {error: "User not authenticated"}
  }
  
  updates.user_id = user.id;

  const validUpdates: Record<string, any> = {};

  for (const key in updates) {
    if (updates[key as keyof typeof updates] !== undefined && updates[key as keyof typeof updates] !== "") {
      validUpdates[key] = updates[key as keyof typeof updates]; 
    }
  }

  if (Object.keys(validUpdates).length === 0) {
    return { error: "No fields to update." };
  }

  if (validUpdates.location) {
    const { data: locationData, error: locationError } = await supabase
      .from("locations")
      .select("id")
      .eq("name", validUpdates.location)
      .single();

    if (locationError || !locationData) {
      return { error: "Location not found." };
    }

    validUpdates.location = locationData.id; 
  }

  const { error } = await supabase
    .from("characters")
    .update({ ...validUpdates})
    .eq("id", id)
    .eq("user_id", user.id);  
  if (error) {
    return { error: error.message };
  }

  return { success: true };
}

export async function createDefaultCharacters(userId: string) {
  try {

    const supabase = await createServerSupabaseClient();
    
    const { data: existingCharacters, error: checkError } = await supabase
      .from("characters")
      .select("id")
      .eq("user_id", userId);
    
    if (checkError) {
      return { error: `Error checking existing characters: ${checkError.message}` };
    }
    
    if (existingCharacters && existingCharacters.length >= 4) {
      return { success: true, message: "User already has characters" };
    }
    

    const defaultCharacters = [
      {
        user_id: userId,
        name: "Tobi",
        color: "blue",
        level_fishing: 1,
        level_mining: 1,
        level_cooking: 1,
        level_cutting: 1,
        imageurl: "https://dredge.wiki.gg/images/thumb/f/f0/Fisherman.png/300px-Fisherman.png",
        character_nav_id: 1
      },
      {
        user_id: userId,
        name: "Markus",
        color: "gray",
        level_mining: 1,
        level_fishing: 1,
        level_cooking: 1,
        level_cutting: 1,
        imageurl: "https://dredge.wiki.gg/images/thumb/f/f0/Fisherman.png/300px-Fisherman.png",
        character_nav_id: 2
      },
      {
        user_id: userId,
        name: "Sebastian",
        color: "red",
        level_cooking: 1,
        level_fishing: 1,
        level_mining: 1,
        level_cutting: 1,
        imageurl: "https://dredge.wiki.gg/images/thumb/f/f0/Fisherman.png/300px-Fisherman.png",
        character_nav_id: 3
      },
      {
        user_id: userId,
        name: "Lukas",
        color: "green",
        level_cutting: 1,
        level_fishing: 1,
        level_mining: 1,
        level_cooking: 1,
        imageurl: "https://dredge.wiki.gg/images/thumb/f/f0/Fisherman.png/300px-Fisherman.png",
        character_nav_id: 4	
      }
    ];
    
    
    try {
      const { data, error } = await supabase
        .from("characters")
        .insert(defaultCharacters)
        .select();
      
      if (error) {
        return { error: `Error creating characters: ${error.message}` };
      }
      
      return { success: true, data };
    } catch (insertError) {
      return { error: `Error during insert: ${insertError instanceof Error ? insertError.message : String(insertError)}` };
    }
  } catch (error) {
    return { error: `Unexpected error: ${error instanceof Error ? error.message : String(error)}` };
  }
}

export async function getUserCharacters() {
  try {
    const supabase = await createServerSupabaseClient();
    
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return { error: "Authentication error" };
    }
    
    const { data, error } = await supabase
      .from("characters")
      .select("*")
      .eq("user_id", user.id);
    
    if (error) {
      return { error: `Error fetching characters: ${error.message}` };
    }
    
    return { success: true, data };
  } catch (error) {
    return { error: `Unexpected error: ${error instanceof Error ? error.message : String(error)}` };
  }
}
