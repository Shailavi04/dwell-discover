 'use client';

import Image from 'next/image';
import { Abril_Fatface } from 'next/font/google';
import Link from 'next/link';


const black_Ops_One = Abril_Fatface({
  subsets: ['latin'],
  weight: '400',
});

export default function Logo() {
  return (
<div className="flex items-center space-x-2">
        <Image
          src="/logo2.png"
          alt="Dwell Discover Logo"
          width={50}
          height={50}
          className="rounded-full border-2 border-blue-500 animate-bounce"
        />
        <div
          className={`${black_Ops_One.className} text-3xl sm:text-5xl font-bold text-red-900 drop-shadow-[1px_1px_0_#191970]`}
        >
          Dwell Discover
        </div>
      </div>
      );
}
