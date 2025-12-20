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

  // 🔹 Load rooms
  useEffect(() => {
    axios
      .get("http://localhost:9092/api/public/rooms")
      .then((res) => setRooms(res.data))
      .catch(console.error);
  }, []);

  // 🔹 Load Razorpay script ONCE
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleBookNow = async (roomId: string) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to book");
      window.location.href = "/student-ui/Login";
      return;
    }

    try {
      // 1️⃣ Create booking
      const bookingRes = await fetch(
        "http://localhost:9092/api/bookings/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            roomId,
            bookingType: "MONTHLY",
            durationMonths: 1,
          }),
        }
      );

      if (!bookingRes.ok) {
        alert(await bookingRes.text());
        return;
      }

      const booking = await bookingRes.json();

      // 2️⃣ Create Razorpay order
      const orderRes = await axios.post(
        "http://localhost:9092/api/payments/create-order",
        {
          bookingId: booking.id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // 🔹 Backend sends string → parse it
      const order =
        typeof orderRes.data === "string"
          ? JSON.parse(orderRes.data)
          : orderRes.data;

      // 3️⃣ Open Razorpay
      const options = {
        key: "rzp_xxxxxxxxxxxx", // test key
        amount: order.amount, // paise
        currency: "INR",
        name: "StayHub",
        description: "Room Booking",
        order_id: order.id,
        handler: async function (response: any) {
          await axios.post(
            "http://localhost:9092/api/payments/verify",
            {
              ...response,
              bookingId: booking.id,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          alert("✅ Payment successful & booking confirmed!");
        },
        theme: {
          color: "#10b981",
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b bg-white">
        <HiddenNav />
      </header>

      <section className="max-w-7xl mx-auto px-6 pt-12 pb-6 text-black text-center">
        <h1 className="text-3xl font-semibold mt-10 mb-6">
          Explore nearby PGs and hotels
        </h1>

        <div className="flex flex-wrap items-center justify-center gap-3 bg-white border rounded-xl shadow-sm p-4 max-w-4xl mx-auto">
          <input
            placeholder="Enter location"
            className="border px-4 py-3 rounded-md w-56"
            value={filters.location}
            onChange={(e) =>
              setFilters({ ...filters, location: e.target.value })
            }
          />

          <select
            className="border px-4 py-3 rounded-md w-48"
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
                  className="flex-1 py-2 bg-gray-200 text-gray-800"
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
