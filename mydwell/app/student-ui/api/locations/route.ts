// app/api/locations/route.ts or pages/api/locations.ts
import { NextResponse } from 'next/server';

// Simulating dynamic fetching of locations
export async function GET() {
  // You can replace this with fetching data from a database
  const locations = ['Delhi University', 'Bangalore - Koramangala', 'Pune - FC Road'];

  return NextResponse.json({ locations });
}
