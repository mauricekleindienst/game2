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

  

  // Create an object that only contains fields with values (i.e., non-empty)
  const validUpdates: Record<string, any> = {}; // We can still keep it flexible

  // Loop through the fields and add them to validUpdates if they are not empty or undefined
  for (const key in updates) {
    if (updates[key as keyof typeof updates] !== undefined && updates[key as keyof typeof updates] !== "") {
      validUpdates[key] = updates[key as keyof typeof updates]; // Type assertion here
    }
  }

  // If there are no valid updates, return an error
  if (Object.keys(validUpdates).length === 0) {
    return { error: "No fields to update." };
  }

  // Ensure that the location exists in the locations table, if it's being updated
  if (validUpdates.location) {
    const { data: locationData, error: locationError } = await supabase
      .from("locations")
      .select("id")
      .eq("name", validUpdates.location)
      .single();

    if (locationError || !locationData) {
      return { error: "Location not found." };
    }

    validUpdates.location = locationData.id; // Replace location with the location_id
  }

  // Perform the update only with valid data
  const { error } = await supabase
    .from("characters")
    .update({ ...validUpdates})  // Add user_id to the update query
    .eq("id", id)
    .eq("user_id", user.id);  // Ensure the update is only allowed for the correct user

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}
