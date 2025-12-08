'use client';

import { useState, useEffect } from 'react';
import Navbar from './Navbar'; // ✅ Import your existing Navbar component

const HiddenNav = () => {
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const controlNavbar = () => {
    if (typeof window !== 'undefined') {
      const currentScrollY = window.scrollY;

      if (currentScrollY - lastScrollY > 10) {
        setShowNavbar(false); // hide on scroll down
      } else if (lastScrollY - currentScrollY > 10) {
        setShowNavbar(true); // show on scroll up
      }
      setLastScrollY(currentScrollY);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', controlNavbar);
      return () => window.removeEventListener('scroll', controlNavbar);
    }
  }, [lastScrollY]);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-[9999] backdrop-sm bg-transparent transition-transform duration-500 ${
        showNavbar ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      {/* ✅ Use your existing Navbar inside */}
      <Navbar />
    </nav>
  );
};

export default HiddenNav;
