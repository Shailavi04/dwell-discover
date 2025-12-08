'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 w-full bg-amber-800 shadow-inner flex justify-around py-2 border-t z-50 text-xs md:text-sm">
      <Link href="/" className="text-white hover:text-blue-600">Home</Link>
      <Link href="/student-ui/About" className="text-white hover:text-blue-600">About</Link>
      <Link href="/student-ui/Explore" className="text-white hover:text-blue-600">Explore</Link>
      <Link href="/student-ui/SignIn" className="text-white hover:text-blue-600">SignIn</Link>
      <Link href="/student-ui/ContactUs" className="text-white hover:text-blue-600">Contact Us</Link>
    </footer>
  );
}
