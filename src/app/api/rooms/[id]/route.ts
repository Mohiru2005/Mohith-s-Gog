import { NextResponse } from "next/server";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders,
  });
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  const roomId = (resolvedParams.id || "").toUpperCase().trim();

  try {
    const roomsRes = await fetch(new URL("/api/rooms", request.url));
    if (roomsRes.ok) {
      const rooms = await roomsRes.json();
      const room = rooms.find((r: any) => r.roomId === roomId);
      if (room) {
        return NextResponse.json(room, { headers: corsHeaders });
      }
    }
  } catch (e) {}

  return NextResponse.json({ error: "Room not found" }, { status: 404, headers: corsHeaders });
}
