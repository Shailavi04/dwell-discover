// app/Home/MeetOurTeam.tsx (or wherever you prefer)
import React from 'react';
import Image from 'next/image';

const OurMembers= [
  {
    name: 'Shailavi Srivastava',
    role: 'Founder & Developer',
    image: '/team/shailavi.jpg', // put your image in public/team
  },
  {
    name: 'Rahul Tiwari',
    role: 'Co-Developer',
    image: '/team/rahul.jpg',
  },
  {
    name: 'Shivangi Pandey',
    role: 'Data Scientist',
    image: '/team/shivangi.jpg',
  },
  {
    name: 'Rupanshi Tiwari',
    role: 'Data Analyst',
    image: '/team/rupanshi.jpg',
  },
  {
    name: 'Saiyaj',
    role: 'Database Engineer',
    image: '/team/shivangi.jpg',
  },
];

const OurTeam = () => {
  return (
    <section className="py-16 bg-gray-100">
      <div className="max-w-6xl mx-auto px-4 text-center text-black pb-20">
        <h2 className="text-3xl text-black font-bold mb-4">Meet Our Team</h2>
        <p className="text-gray-600 mb-10">The passionate people behind Dwell Discover</p>

        <div className="grid md:grid-cols-3 gap-8">
          {OurMembers.map((member, index) => (
            <div key={index} className="bg-white rounded-2xl shadow p-6 hover:shadow-md transition">
              <Image
                src={member.image}
                alt={member.name}
                width={150}
                height={150}
                className="rounded-full mx-auto mb-4 object-cover"
              />
              <h3 className="text-xl font-semibold">{member.name}</h3>
              <p className="text-gray-500">{member.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurTeam;