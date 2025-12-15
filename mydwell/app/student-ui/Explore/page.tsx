"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import HiddenNav from "../MyComponents/HiddenNav";
import Footer from "../MyComponents/Footer";
import DDCard from "../MyComponents/DDCard";
import DDButton from "../MyComponents/DDButton";

const Explore = () => {
  const [rooms, setRooms] = useState<any[]>([]);
  const [filters, setFilters] = useState({
    location: "",
    gender: "",
    type: "",
  });

  useEffect(() => {
    axios
      .get("http://localhost:9092/api/public/rooms")
      .then((res) => setRooms(res.data))
      .catch(console.error);
  }, []);

const handleBookNow = async (roomId: string) => {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Please login to book");
    window.location.href = "/student-ui/Login";
    return;
  }

  try {
    const res = await fetch("http://localhost:9092/api/bookings/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        roomId,
        bookingType: "MONTHLY",   // ✅ REQUIRED
        durationMonths: 1         // ✅ REQUIRED for MONTHLY
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      alert(err || "Booking failed");
      return;
    }

    alert("✅ Booking confirmed!");
  } catch (error) {
    console.error(error);
    alert("Something went wrong");
  }
};



  return (
    <div className="min-h-screen bg-white">
      {/* NAVBAR */}
      <header className="border-b bg-white">
        <HiddenNav />
      </header>


      {/* HERO */}
      <section className="max-w-7xl mx-auto px-6 pt-12 pb-6 text-black text-center">
        <h1 className="text-3xl font-semibold mt-10 mb-6 text-center">
          Explore nearby PGs and hotels
        </h1>


        {/* SEARCH BAR */}
        <div className="flex flex-wrap items-center justify-center gap-3 text-black bg-white border rounded-xl shadow-sm p-4 max-w-4xl mx-auto">
          <input
            placeholder="Enter location"
            className="border px-4 py-3 rounded-md w-56 focus:outline-none"
            value={filters.location}
            onChange={(e) =>
              setFilters({ ...filters, location: e.target.value })
            }
          />

          <select
            className="border px-4 py-3 text-black rounded-md w-48"
            value={filters.gender}
            onChange={(e) =>
              setFilters({ ...filters, gender: e.target.value })
            }
          >
            <option value="">Select gender</option>
            <option value="BOYS">Boys</option>
            <option value="GIRLS">Girls</option>
            <option value="UNISEX">Unisex</option>
          </select>

          <select
            className="border px-4 py-3 rounded-md w-40"
            value={filters.type}
            onChange={(e) =>
              setFilters({ ...filters, type: e.target.value })
            }
          >
            <option value="">Type</option>
            <option value="PG">PG</option>
            <option value="HOSTEL">Hostel</option>
          </select>

          <DDButton text="Search" />
        </div>
      </section>

      {/* LISTINGS */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {rooms.map((room) => (
            <DDCard
              key={room.id}
              image={
                room.images?.length
                  ? `http://localhost:9092/api/images/${room.images[0]}`
                  : "/placeholder.jpg"
              }
              title={room.name}
              subtitle={`${room.genderType || "Any"} · ${room.type}`}
              description={`₹${room.pricePerMonth} / month`}
            >
              <p className="text-sm text-gray-500 mt-1">
                {room.verified ? "Verified" : "Not verified"}
              </p>

              <div className="mt-4 flex gap-3">
                <DDButton
                  text="View Details"
                  className="flex-1 py-2 bg-gray-200 text-gray-800 hover:bg-gray-300"
                />
                <DDButton
                  text="Book Now"
                  onClick={() => handleBookNow(room.id)}
                  className="w-full"
                />

              </div>
            </DDCard>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Explore;
