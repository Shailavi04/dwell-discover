'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../MyComponents/Navbar';
import Footer from '../MyComponents/Footer';
import LoginButton from '../MyComponents/LoginButton';
import HiddenNav from '../MyComponents/HiddenNav';
import DDCard from '../MyComponents/DDCard'; // ✅ import your reusable card

const Explore = () => {
  const [filters, setFilters] = useState({
    gender: '',
    type: '',
    maxPrice: '',
  });

  const [hostels, setHostels] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:9092/api/public/rooms");
        setHostels(response.data);
      } catch (error) {
        console.error("Error fetching rooms:", error);
      }
      setLoading(false);
    };

    fetchRooms();
  }, []);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleApplyFilters = () => {
    console.log("Filters Applied:", filters);
  };

  const handleClearFilters = () => {
    setFilters({ gender: "", type: "", maxPrice: "" });
  };

  const handleRemoveHostel = async (id: string) => {
    try {
      await axios.delete(`http://localhost:5000/api/hostels/${id}`);
      setHostels(hostels.filter((h) => h._id !== id));
    } catch (error) {
      console.error("Error removing hostel:", error);
    }
  };
return (
  <div
    className="min-h-screen bg-cover bg-center"
    style={{ backgroundImage: "url('/your-bg-image.jpeg')" }}
  >
    {/* DARK OVERLAY */}
    <div className="min-h-screen bg-black/40">

      {/* NAVBAR */}
      <div className="px-6 pt-4 flex justify-between items-center">
        <HiddenNav />
        <LoginButton />
      </div>

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto px-6 py-10 flex gap-8">

        {/* FILTERS */}
        <div className="w-72 bg-white/90 backdrop-blur rounded-xl shadow-lg p-5 h-fit">
          <h2 className="text-lg font-semibold mb-4">Filters</h2>

          {/* Gender */}
          <div className="mb-4">
            <label className="text-sm font-medium">Gender</label>
            <select
              name="gender"
              value={filters.gender}
              onChange={handleChange}
              className="w-full mt-1 border rounded px-3 py-2"
            >
              <option value="">Any</option>
              <option value="BOYS">Boys</option>
              <option value="GIRLS">Girls</option>
              <option value="UNISEX">Unisex</option>
            </select>
          </div>

          {/* Type */}
          <div className="mb-4">
            <label className="text-sm font-medium">Type</label>
            <select
              name="type"
              value={filters.type}
              onChange={handleChange}
              className="w-full mt-1 border rounded px-3 py-2"
            >
              <option value="">Any</option>
              <option value="PG">PG</option>
              <option value="Hostel">Hostel</option>
            </select>
          </div>

          {/* Price */}
          <div className="mb-5">
            <label className="text-sm font-medium">Max Price (₹)</label>
            <input
              type="number"
              name="maxPrice"
              value={filters.maxPrice}
              onChange={handleChange}
              placeholder="e.g. 5000"
              className="w-full mt-1 border rounded px-3 py-2"
            />
          </div>

          <div className="flex gap-2">
            <button className="flex-1 bg-purple-600 text-white py-2 rounded">
              Apply
            </button>
            <button className="flex-1 bg-gray-200 py-2 rounded">
              Clear
            </button>
          </div>
        </div>

        {/* LISTINGS */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-white mb-6">
            Explore Listings
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {hostels.map((room) => (
              <DDCard
                key={room.id}
                image={
                  room.images?.length
                    ? `http://localhost:9092/api/images/${room.images[0]}`
                    : "/placeholder.jpg"
                }
                title={room.name}
                subtitle={`Gender: ${room.genderType || "N/A"}`}
                description={`₹${room.pricePerMonth}/month`}
              >
                <span
                  className={`inline-block mb-2 px-2 py-1 text-xs font-semibold rounded ${
                    room.verified
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {room.verified ? "Verified" : "Not Verified"}
                </span>

                <button className="w-full bg-green-600 text-white py-2 rounded">
                  View Details
                </button>
              </DDCard>
            ))}
          </div>
        </div>

      </div>

      <Footer />
    </div>
  </div>
);
};

export default Explore;
