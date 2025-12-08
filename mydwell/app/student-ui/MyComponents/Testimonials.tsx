// components/Home/TestimonialSection.tsx
import React from 'react';
import Image from 'next/image';

const Testimonials = () => {
  const testimonialData = [
    {
      name: "Aarav Mehta",
      feedback: "Found a perfect PG within minutes. Dwell Discover is a lifesaver!",
      image: "/avatar1.jpg"
    },
    {
      name: "Neha Sharma",
      feedback: "Safe and clean accommodations, just as promised. Highly recommend!",
      image: "/avatar2.jpg"
    },
    {
      name: "Rohit Verma",
      feedback: "User-friendly site and quick results. Helped me shift stress-free.",
      image: "/avatar3.jpg"
    },
    {
      name: "Priya Desai",
      feedback: "Great platform with verified options. Helped me find a PG that felt like home!",
      image: "/avatar4.jpg"
    },
  ];

  return (
    <section className="bg-gray-50 py-8 px-6">
      <h2 className="text-3xl font-bold text-black text-center mb-4">What Our Users Say</h2>
      <p className="text-gray-600 text-center mb-6">Real stories from real students</p>

      <div className="max-w-6xl mx-auto grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {testimonialData.map((user, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6 text-center">
            <Image
              src={user.image}
              alt={user.name}
              width={80}
              height={80}
              className="mx-auto rounded-full mb-4 border-2 border-blue-500"
            />
            <p className="text-gray-700 italic mb-3">"{user.feedback}"</p>
            <h4 className="font-semibold text-black">{user.name}</h4>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;