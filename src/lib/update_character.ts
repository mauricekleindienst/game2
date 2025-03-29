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
