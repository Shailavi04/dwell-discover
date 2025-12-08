import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import { connectToDatabase } from '@/lib/mongodb';
import Listing from '@/models/Listing';


export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const ownerName = formData.get('ownerName') as string;
    const propertyName = formData.get('propertyName') as string;
    const rent = formData.get('rent') as string;
    const amenities = formData.get('amenities') as string;
    const file = formData.get('image') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Save image
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fileName = `${Date.now()}-${file.name}`;
    const filePath = path.join(uploadsDir, fileName);
    await fs.promises.writeFile(filePath, buffer);

    // Connect to DB
    await connectToDatabase();

    // Save to MongoDB using Mongoose
    const newListing = await Listing.create({
      ownerName,
      propertyName,
      rent,
      amenities,
      image: `/uploads/${fileName}`,
    });

    return NextResponse.json({
      message: 'Property listed successfully!',
      data: newListing,
    });
  } catch (error) {
    console.error('Upload or DB Error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
