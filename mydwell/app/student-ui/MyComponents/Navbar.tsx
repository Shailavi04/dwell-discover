'use client';

import Image from 'next/image';
import { Abril_Fatface } from 'next/font/google';
import Link from 'next/link';
import Logo from './Logo'; // ✅ Import Logo component
import LoginButton from './LoginButton'; // ✅ Import Login Button

const black_Ops_One = Abril_Fatface({
  subsets: ['latin'],
  weight: '400',
});

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-4 sm:px-8 py-2 bg-transparent pt-15">
      {/* Left Section: Logo & Title */}
      <Logo />
      {/* Right Section: Navigation Links & Login Button */}
      <div className='mt-0 mr-0'>
        <LoginButton />
      </div>
    </nav>
  );
}
