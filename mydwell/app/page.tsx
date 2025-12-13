'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from "react";
import { Abril_Fatface } from 'next/font/google';
import {
  ShieldCheck,
  Home as HomeIcon,
  MapPin,
} from 'lucide-react';

import Footer from './student-ui/MyComponents/Footer';
import FeaturedSection from './student-ui/MyComponents/FeaturedSection';
import Testimonials from './student-ui/MyComponents/Testimonials';
import OurTeam from './student-ui/MyComponents/OurTeam';
import HiddenNav from './student-ui/MyComponents/HiddenNav';
import DDButton from './student-ui/MyComponents/DDButton';  // ✅ import your button

const abrilFatface = Abril_Fatface({ subsets: ['latin'], weight: '400' });

export default function Home() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  return (
    <div className="w-full overflow-hidden">

      {/* Hero Section */}
      <div
        className="h-[75vh] w-full bg-cover bg-center bg-no-repeat sm:bg-fixed"
        style={{ backgroundImage: "url('/your-bg-image.jpeg')" }}
      >
        <div className='pt-20'>
          <nav className="relative w-full px-4 py-4 flex items-center justify-between flex-col sm:flex-row">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <HiddenNav />
            </div>
          </nav>

          {/* Hero */}
          <div className="relative z-20 flex flex-col items-center justify-center text-white text-center px-4 mt-20 sm:mt-16 md:mt-24">
            <h1 className="text-2xl md:text-4xl font-bold mb-4">
              Your Perfect PG or Hostel is Just a Click Away
            </h1>
            <p className="text-base md:text-lg mb-6 max-w-2xl">
              Helping students discover safe, affordable, and convenient stays near their campus
            </p>

            {/* Search Bar */}
            <div className="flex flex-wrap justify-center bg-white rounded-md shadow-md p-4 gap-3 w-full max-w-4xl">
              <input type="text" placeholder="Enter location" className="flex-1 min-w-[120px] px-3 py-2 border border-gray-300 rounded text-black" />
              <input type="text" placeholder="Budget" className="flex-1 min-w-[100px] px-3 py-2 border border-gray-300 rounded text-black" />
              <select className="flex-1 min-w-[150px] px-3 py-2 border border-gray-300 rounded text-black">
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              <input type="text" placeholder="Amenities" className="flex-1 min-w-[100px] px-3 py-2 border border-gray-300 rounded text-black" />
              <DDButton
                text="Start Searching"
                className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded"
              />

            </div>
          </div>
        </div>
      </div>


      {/* Why Dwell Discover */}
      <section className="py-12 bg-white">
        <div className="text-center mb-10">
          <h2 className="text-3xl text-black font-bold">Why Dwell Discover?</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">

          <div className="bg-gray-100 p-6 rounded-xl text-center shadow">
            <div className="flex justify-center mb-4">
              <ShieldCheck className="text-blue-600 w-6 h-6" />
            </div>
            <h3 className="font-bold text-xl mb-2 text-black">Verified Listings</h3>
            <p className="text-black">We ensure every hostel and PG is verified by our team.</p>
          </div>

          <div className="bg-gray-100 p-6 rounded-xl text-center shadow">
            <div className="flex justify-center mb-4">
              <HomeIcon className="text-green-600 w-6 h-6" />
            </div>
            <h3 className="font-bold text-xl mb-2 text-black">Student-Friendly Spaces</h3>
            <p className="text-black">Tailored to fit student needs – affordable, safe & accessible.</p>
          </div>

          <div className="bg-gray-100 p-6 rounded-xl text-center shadow">
            <div className="flex justify-center mb-4">
              <MapPin className="text-red-600 w-6 h-6" />
            </div>
            <h3 className="font-bold text-xl mb-2 text-black">Easy Discovery</h3>
            <p className="text-black">Find hostels or PGs near your campus in seconds.</p>
          </div>

        </div>
      </section>

      <FeaturedSection />


      {/* ⭐ List Your Property Section */}
      {!isLoggedIn && (
        <section className="py-12 bg-gray-100 text-center">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-black mb-4">Are You a PG or Hostel Owner?</h2>

            <p className="text-gray-700 mb-6">
              List your property on Dwell Discover to reach thousands of students searching for accommodations.
            </p>

            {/* Use your DDButton here */}

            <Link href="/owner-auth/login">
              <DDButton
                text="List Your Property"
                className="px-7 py-4 rounded-md drop-shadow-lg"
              />
            </Link>

          </div>
        </section>
      )}


      <Testimonials />
      <OurTeam />
      <Footer />

    </div>
  );
}
