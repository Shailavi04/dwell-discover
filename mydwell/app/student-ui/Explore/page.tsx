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
        const response = await axios.get("http://localhost:9092/api/rooms");
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
      className="min-h-screen flex flex-col items-center justify-start bg-cover"
      style={{ backgroundImage: "url('/your-bg-image.jpeg')" }}
    >
      {/* NAVBAR */}
      <div className="flex justify-between items-center gap-270 mb-6 px-4 pt-4">
        <HiddenNav />
      </div>

      <div className="min-h-screen flex bg-transparent gap-50 p-4">

        {/* FILTERS */}
        <div className="w-full md:w-1/6 bg-transparent rounded-lg shadow-lg p-6">
          <h2 className="text-xl text-red-500 font-semibold mb-4">Filters</h2>

          {/* Gender Filter */}
          <div className="mb-4">
            <label className="block font-medium mb-1 text-black">Gender</label>
            <select
              name="gender"
              value={filters.gender}
              onChange={handleChange}
              className="w-full p-2 border rounded text-black"
            >
              <option value="">Any</option>
              <option value="Boys">Boys</option>
              <option value="Girls">Girls</option>
              <option value="Co-ed">Co-ed</option>
            </select>
          </div>

          {/* Type Filter */}
          <div className="text-black mb-4">
            <label className="block font-medium mb-1">Type</label>
            <select
              name="type"
              value={filters.type}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="">Any</option>
              <option value="PG">PG</option>
              <option value="Hostel">Hostel</option>
            </select>
          </div>

          {/* Price Filter */}
          <div className="mb-4 text-black">
            <label className="block font-medium mb-1">Max Price (₹)</label>
            <input
              type="number"
              name="maxPrice"
              value={filters.maxPrice}
              onChange={handleChange}
              placeholder="e.g. 5000"
              className="w-full p-2 border rounded"
            />
          </div>

          {/* Filter Buttons */}
          <div className="flex gap-2">
            <button
              onClick={handleApplyFilters}
              className="w-1/2 bg-blue-600 text-white py-2 rounded hover:bg-blue-400"
            >
              Apply
            </button>

            <button
              onClick={handleClearFilters}
              className="w-1/2 bg-gray-300 text-black py-2 rounded hover:bg-gray-400"
            >
              Clear
            </button>
          </div>
        </div>

        {/* LISTINGS */}
        <div className="w-full md:w-3/4 md:pl-6 mt-6 md:mt-0">
          <h1 className="text-2xl font-bold mb-4">Explore Listings</h1>

          {loading ? (
            <p>Loading hostels...</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

              {hostels.map((room) => (
                <DDCard
                  key={room.id}
                  image={
                    room.images && room.images.length > 0
                      ? `http://localhost:9092/api/files/${room.images[0]}`
                      : "/placeholder.jpg"
                  }
                  title={room.name}
                  subtitle={`Gender: ${room.genderType || "N/A"}`}
                  description={`₹${room.pricePerMonth}/month`}
                >
                  <button className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
                    View Details
                  </button>
                </DDCard>

              ))}

            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Explore;
