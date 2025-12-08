'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function ExplorePage() {
  const [listings, setListings] = useState([]);

  useEffect(() => {
    const fetchHostels = async () => {
      try {
        const res = await axios.get('/api/get-listings');
        setListings(res.data.listings);
      } catch (error) {
        console.error('Error fetching hostels:', error);
      }
    };

    fetchHostels();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Explore Hostels</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {listings.map((item: any) => (
          <div key={item._id} className="border rounded-lg p-4 shadow">
            <img src={item.image} alt="Listing" className="w-full h-40 object-cover mb-2 rounded" />
            <h2 className="text-lg font-semibold">{item.propertyName}</h2>
            <p>Owner: {item.ownerName}</p>
            <p>Rent: ₹{item.rent}</p>
            <p>Amenities: {item.amenities}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
