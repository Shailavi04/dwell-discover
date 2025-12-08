// app/api/get-listings/route.ts
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb'; // use your updated connection logic
import Listing from '@/models/Listing';

export async function GET() {
  try {
    await connectToDatabase();
    const listings = await Listing.find().lean();
    return NextResponse.json({ listings });
  } catch (error) {
    console.error('Error fetching listings:', error);
    return NextResponse.json({ error: 'Failed to fetch listings' }, { status: 500 });
  }
}
