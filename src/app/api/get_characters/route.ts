import { NextResponse } from "next/server";
import { getUserCharacters } from "@/lib/update_character";

export async function GET() {
  try {
    const result = await getUserCharacters();
    
    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }
    
    return NextResponse.json({ success: true, data: result.data }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
}