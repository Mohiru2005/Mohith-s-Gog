import { NextResponse } from "next/server";

// Import global memory store reference from route.ts
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  const roomId = (resolvedParams.id || "").toUpperCase().trim();

  // Fetch room state from Vercel Server API
  const roomsRes = await fetch(new URL("/api/rooms", request.url));
  const rooms = await roomsRes.json();
  
  const room = rooms.find((r: any) => r.roomId === roomId);

  if (!room) {
    return NextResponse.json({ error: "Room not found" }, { status: 404 });
  }

  return NextResponse.json(room);
}
