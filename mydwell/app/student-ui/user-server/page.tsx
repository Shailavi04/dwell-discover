'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';

type Listing = {
  image: string;
  title: string;
  location: string;
  price: string;
};

const FeaturedSection = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await fetch('/api/hostels');
        if (!res.ok) {
          throw new Error('Failed to fetch listings');
        }
        const data = await res.json();
        setListings(data);
        setLoading(false);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchListings();
  }, []);

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-600">{error}</div>;
  }

  return (
    <section className="bg-white px-6 py-12">
      <h2 className="text-2xl md:text-3xl text-black font-bold text-center mb-10">Featured Listings</h2>
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-items-center">
        {listings.map((pg, i) => (
          <div key={i} className="bg-white shadow-md rounded-md overflow-hidden w-full sm:w-[320px] md:w-[250px] lg:w-[380px]">
            <Image src={pg.image} alt={pg.title} width={220} height={150} className="object-cover" />
            <div className="p-3 text-left">
              <h3 className="font-semibold text-sm text-black">{pg.title}</h3>
              <p className="text-gray-500 text-sm">{pg.location}</p>
              <p className="font-bold mt-1 text-black">{pg.price}</p>
              <button className="mt-2 w-full bg-blue-600 text-white py-1.5 rounded hover:bg-blue-700 text-sm">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedSection;
