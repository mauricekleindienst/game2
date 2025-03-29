import { NextResponse } from "next/server";
import { createDefaultCharacters } from "@/lib/update_character";
import { createServerSupabaseClient } from "@/lib/supabase_server";

export async function POST() {
  try {
    console.log("POST /api/create_characters - Starting character creation process");
    const supabase = await createServerSupabaseClient();
    
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.error("Authentication error:", userError);
      return NextResponse.json({ error: "Authentication error" }, { status: 401 });
    }
    
    console.log(`Creating characters for user ID: ${user.id}`);
    
    // Create default characters for the user
    const result = await createDefaultCharacters(user.id);
    
    if (result.error) {
      console.error("Error from createDefaultCharacters:", result.error);
      return NextResponse.json({ error: result.error }, { status: 500 });
    }
    
    console.log("Characters created successfully");
    return NextResponse.json({ success: true, data: result.data }, { status: 200 });
  } catch (error) {
    console.error("Uncaught exception in create_characters API:", error);
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
} 