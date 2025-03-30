import { createServerSupabaseClient } from "@/lib/supabase_server";

export async function updatePlayer(data: {
  id?: string;
  theme?: string;
  playtime?: number;
  login_time?: string;
  logout_time?: string;
  welcome_status?: boolean;
}) {
  try {
    const supabase = await createServerSupabaseClient();
    
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError || !userData.user) {
      return { error: "Authentication error" };
    }
    
    const { data: existingSettings, error: checkError } = await supabase
      .from('user_settings')
      .select('*')
      .eq('Player', userData.user.id)
      .single();
    
    // Check if we're only updating login/logout times
    const isOnlyUpdatingTime = Object.keys(data).length === 1 && (data.login_time || data.logout_time);
    
    // If there's no existing settings
    if (checkError && checkError.code === 'PGRST116') {
      // Only create new settings if we're not just recording login/logout time
      // OR if we're explicitly setting welcome_status
      if (!isOnlyUpdatingTime || data.welcome_status !== undefined) {
        const { data: insertData, error: insertError } = await supabase
          .from('user_settings')
          .insert({
            Player: userData.user.id,
            theme: data.theme || 'dark',
            playtime: data.playtime || 0,
            login_time: data.login_time,
            logout_time: data.logout_time,
            welcome_status: data.welcome_status !== undefined ? data.welcome_status : false
          })
          .select();
        
        if (insertError) {
          return { error: `Error creating user settings: ${insertError.message}` };
        }
        
        return { success: true, data: insertData };
      }
      
      // Just return success without creating a record if we're only updating time
      return { success: true, data: null };
    } else if (checkError) {
      return { error: `Error checking user settings: ${checkError.message}` };
    }
    
    // Update existing settings (only set fields that are actually provided)
    const updateFields: Record<string, any> = {};
    
    if (data.theme !== undefined) updateFields.theme = data.theme;
    if (data.playtime !== undefined) updateFields.playtime = data.playtime;
    if (data.login_time !== undefined) updateFields.login_time = data.login_time;
    if (data.logout_time !== undefined) updateFields.logout_time = data.logout_time;
    if (data.welcome_status !== undefined) updateFields.welcome_status = data.welcome_status;
    
    // Only proceed with update if there are fields to update
    if (Object.keys(updateFields).length > 0) {
      const { data: updateData, error: updateError } = await supabase
        .from('user_settings')
        .update(updateFields)
        .eq('Player', userData.user.id)
        .select();
      
      if (updateError) {
        return { error: `Error updating user settings: ${updateError.message}` };
      }
      
      return { success: true, data: updateData };
    }
    
    // If nothing to update, just return the existing settings
    return { success: true, data: existingSettings };
  } catch (error) {
    return { error: `Unexpected error: ${error instanceof Error ? error.message : String(error)}` };
  }
}

export async function getUserSettings() {
  try {
    const supabase = await createServerSupabaseClient();
    
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError || !userData.user) {
      return { error: "Authentication error" };
    }
    
    const { data: settings, error: settingsError } = await supabase
      .from('user_settings')
      .select('*')
      .eq('Player', userData.user.id)
      .single();
    
    if (settingsError && settingsError.code === 'PGRST116') {
      // No settings found, but don't create them here.
      // We'll let the explicit settings creation handle this
      return { success: true, data: null };
    } else if (settingsError) {
      return { error: `Error fetching user settings: ${settingsError.message}` };
    }
    
    return { success: true, data: settings };
  } catch (error) {
    return { error: `Unexpected error: ${error instanceof Error ? error.message : String(error)}` };
  }
}
