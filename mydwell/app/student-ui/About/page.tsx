import React from "react";
import Navbar from "../MyComponents/Navbar";
import Footer from "../MyComponents/Footer";
import OurTeam from "../MyComponents/OurTeam";
import Login from "../(auth)/Login/page";
import LoginButton from "../MyComponents/LoginButton";
import HiddenNav from "../MyComponents/HiddenNav";

export default function AboutPage() {
  return (
    <div className="bg-white min-h-screen px-4 md:px-16 pt-8 relative">
      
      {/* NAVBAR + LOGIN DESKTOP ROW */}
      <div className="flex justify-between items-center mb-6">
        <HiddenNav />
        {/* Login Button for Desktop */}
      </div>

      {/* HERO SECTION */}
      <section className="flex flex-col md:flex-row items-center gap-10 mb-16">
        <div className="md:w-1/2">
          <h2 className="text-3xl md:text-4xl font-bold text-[#002e2e] mb-4">
            Connecting Students to the Perfect Stay.
          </h2>
          <p className="text-gray-700 mb-10">
            Dwell Discover is your trusted partner for finding safe, affordable,
            and comfortable hostels and PGs.
          </p>

          {/* Login Button for Mobile */}
          

          <h1 className="text-black text-4xl font-bold mb-5">
            How Dwell Discover Works?
          </h1>

          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>
              <strong>Search for Listings:</strong> Enter your preferred city or
              location, and browse through PGs and hostels.
            </li>
            <li>
              <strong>Filter Your Preferences:</strong> Sort by meals, budget,
              proximity, and more.
            </li>
            <li>
              <strong>View Verified Listings:</strong> All our listings are
              verified and trustworthy.
            </li>
            <li>
              <strong>Contact Owners:</strong> Reach out directly to property
              owners for booking.
            </li>
          </ul>
        </div>

        <div className="md:w-1/2">
          <img
            src="/hostel-illustration.png"
            alt="Student in front of hostel"
            className="w-full mt-10 h-auto object-contain max-h-[500px]"
          />
        </div>
      </section>

      {/* Mission Statement */}
      <section className="mb-16">
        <h3 className="text-xl font-semibold text-[#002e2e] mb-4">
          Mission Statement
        </h3>
        <p className="text-gray-700 mb-6">
          Our mission is to simplify the process of finding student accommodation
          by offering verified listings, user <strong>reviews</strong>, and
          seamless communication between students and <strong>providers</strong>.
        </p>

        {/* Features */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <FeatureCard
            icon="✅"
            title="Verified Hostels/PGs"
            desc="Trusted and pre-screened listings."
          />
          <FeatureCard
            icon="⚙️"
            title="Filters"
            desc="Sort by location, price, amenities."
          />
          <FeatureCard
            icon="🛡️"
            title="Secure Booking"
            desc="Easy and protected booking process."
          />
          <FeatureCard
            icon="⭐"
            title="Student Reviews"
            desc="Ratings and insights from peers."
          />
        </div>
      </section>

      {/* Why Choose Us */}
      <section>
        <h3 className="text-xl font-semibold text-[#002e2e] mb-4">
          Why Choose Us?
        </h3>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-gray-700 list-disc list-inside">
          <li>Student-focused design</li>
          <li>Affordable options</li>
          <li>User-friendly platform</li>
          <li>Responsive support</li>
        </ul>
      </section>

      {/* CTA Button */}
      <div className="mt-10 text-center">
        <button className="bg-[#f28c38] text-white px-6 py-3 rounded-md font-medium hover:bg-[#da7a2e] transition mb-20">
          Browse PGs & Hostels Now
        </button>
        <OurTeam/>
      </div>

      {/* Optional Footer */}
      {/* <Footer /> */}
    </div>
  );
}

// FeatureCard Component
function FeatureCard({
  icon,
  title,
  desc,
}: {
  icon: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="text-2xl mb-2">{icon}</div>
      <h4 className="font-semibold text-[#002e2e] mb-1">{title}</h4>
      <p className="text-sm text-gray-600">{desc}</p>
      <Footer />
      
    </div>
  );
}
