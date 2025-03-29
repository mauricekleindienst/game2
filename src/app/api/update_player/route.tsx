// route.ts
import { NextResponse } from "next/server";
import { updatePlayer } from "@/lib/update_view_player";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    const result = await updatePlayer(body);
    
    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }
    
    return NextResponse.json({ success: true, data: result.data }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
}
