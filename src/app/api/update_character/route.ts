// route.ts
import { NextResponse } from "next/server";
import { updateCharacter } from "@/lib/update_character";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body.id) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }
    
    const result = await updateCharacter(body);
    
    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }
    
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
}
