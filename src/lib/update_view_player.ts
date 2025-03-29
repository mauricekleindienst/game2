import { createServerSupabaseClient } from "@/lib/supabase_server";

export async function updatePlayer(data: {
  id: string;
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
    
    if (checkError && checkError.code !== 'PGRST116') { 
      return { error: `Error checking user settings: ${checkError.message}` };
    }
    
    let result;
    
    if (existingSettings) {
      const { data: updateData, error: updateError } = await supabase
        .from('user_settings')
        .update({
          theme: data.theme,
          playtime: data.playtime,
          login_time: data.login_time,
          logout_time: data.logout_time,
          welcome_status: data.welcome_status
        })
        .eq('Player', userData.user.id)
        .select();
      
      if (updateError) {
        return { error: `Error updating user settings: ${updateError.message}` };
      }
      
      result = updateData;
    } else {
      const { data: insertData, error: insertError } = await supabase
        .from('user_settings')
        .insert({
          Player: userData.user.id,
          theme: data.theme || 'dark',
          playtime: data.playtime || 0,
          login_time: data.login_time,
          logout_time: data.logout_time,
          welcome_status: data.welcome_status || false
        })
        .select();
      
      if (insertError) {
        return { error: `Error creating user settings: ${insertError.message}` };
      }
      
      result = insertData;
    }
    
    return { success: true, data: result };
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
    
    if (settingsError && settingsError.code !== 'PGRST116') {
      return { error: `Error fetching user settings: ${settingsError.message}` };
    }
    
    return { success: true, data: settings || null };
  } catch (error) {
    return { error: `Unexpected error: ${error instanceof Error ? error.message : String(error)}` };
  }
}
