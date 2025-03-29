import { NextResponse } from "next/server";
import { getUserSettings } from "@/lib/update_view_player";

export async function GET() {
  try {
    const result = await getUserSettings();
    
    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }
    
    return NextResponse.json({ success: true, data: result.data }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
} 