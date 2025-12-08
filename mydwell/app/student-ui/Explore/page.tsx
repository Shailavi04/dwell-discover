'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../MyComponents/Navbar';
import Footer from '../MyComponents/Footer';
import LoginButton from '../MyComponents/LoginButton';
import HiddenNav from '../MyComponents/HiddenNav';

// app/explore/page.tsx
import ExplorePage from '../MyComponents/ExplorePage'; 




const Explore = () => {
  const [filters, setFilters] = useState({
    gender: '',
    type: '',
    maxPrice: '',
  });

  const [hostels, setHostels] = useState<any[]>([]); // State to hold hostels
  const [loading, setLoading] = useState<boolean>(false);

  // Fetch all hostels from the backend API
  useEffect(() => {
    const fetchHostels = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:5000/api/hostels');
        setHostels(response.data);
      } catch (error) {
        console.error('Error fetching hostels:', error);
      }
      setLoading(false);
    };

    fetchHostels();
  }, []);

  // Handle filter change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  // Handle apply filters
  const handleApplyFilters = () => {
    console.log('Filters Applied:', filters);
  };

  // Handle clear filters
  const handleClearFilters = () => {
    setFilters({ gender: '', type: '', maxPrice: '' });
  };

  // Handle removing a hostel
  const handleRemoveHostel = async (id: string) => {
    try {
      await axios.delete(`http://localhost:5000/api/hostels/${id}`);
      setHostels(hostels.filter(hostel => hostel._id !== id)); 
    } catch (error) {
      console.error('Error removing hostel:', error);
    }
  };

  return (
<div
      className="min-h-screen flex flex-col items-center justify-start bg-cover"
      style={{ backgroundImage: "url('/your-bg-image.jpeg')" }}
    >

  {/* Rest of your content */}
      {/* NAVBAR + LOGIN DESKTOP ROW */}
      <div className="flex justify-between items-center gap-270 mb-6 px-4 pt-4">
        <HiddenNav />
      </div>

      <div className="min-h-screen flex bg-transparent gap-50 p-4 ">
        {/* Filter Section */}
        <div className="w-full md:w-1/6 bg-transparent rounded-lg shadow-lg p-6">
          <h2 className="text-xl text-red-500 font-semibold mb-4 ">Filters</h2>

          {/* Filter Inputs */}
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

          <div className=" text-black mb-4">
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

        {/* Listings Section */}
        <div className="w-full md:w-3/4 md:pl-6 mt-6 md:mt-0">
          <h1 className="text-2xl font-bold mb-4">Explore Listings</h1>

          {loading ? (
            <p>Loading hostels...</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {hostels.map((hostel) => (
                <div
                  key={hostel._id}
                  className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition"
                >
                  {/* Hostel Info */}
                  <img
                    src={hostel.imageUrl}
                    alt={hostel.name}
                    className="w-full h-48 object-cover mb-4 rounded"
                  />
                  <h3 className="text-lg font-semibold">{hostel.name}</h3>
                  <p className="text-gray-600">Location: {hostel.location}</p>
                  <p className="text-gray-600">Gender: {hostel.gender}</p>
                  <p className="text-gray-800 font-bold mt-2">₹{hostel.price}/month</p>
                  <div className="mt-3 flex justify-between">
                    <button className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700">
                      View Details
                    </button>
                    <button
                      onClick={() => handleRemoveHostel(hostel._id)}
                      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}<ExplorePage />;
        </div>
      </div>
      
      <Footer/>
    </div>
    
  );
};

export default Explore;
