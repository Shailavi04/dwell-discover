// route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  const dummyHostels = [
    {
      title: 'GreenWood Residency',
      location: 'Bangalore',
      price: '₹3,500/month',
      image: '/room1.jpg',
    },
    {
      title: 'Single Room PG',
      location: 'Mumbai',
      price: '₹10,000/month',
      image: '/room2.jpg',
    },
    {
      title: 'Urban Hostel',
      location: 'Delhi',
      price: '₹6,000/month',
      image: '/room3.jpg',
    },
    {
      title: 'Sunrise PG',
      location: 'Pune',
      price: '₹7,500/month',
      image: '/room4.jpg',
    }
  ];

  return NextResponse.json(dummyHostels);
}
