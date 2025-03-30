
import { NextRequest, NextResponse } from "next/server";
import { updateInventory } from "@/lib/update_inventory";

export async function PUT(req: NextRequest) {
  try {
    const data = await req.json();  // Hole die Daten aus dem Request-Body
    const result = await updateInventory(data);  // Rufe die Logik aus update_inventory.ts auf
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Es gab ein Problem bei der Aktualisierung des Inventars." }, { status: 500 });
  }
}
