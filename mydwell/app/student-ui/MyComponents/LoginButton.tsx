'use client';

import Link from 'next/link';
import useIsMobile from '../hooks/useIsMobile';

const LoginButton = () => {
  const isMobile = useIsMobile();

  const classes =
    'text-lg text-white px-10 py-3 bg-blue-700 drop-shadow-2xl shadow-lg rounded hover:bg-blue-800 transition';

  if (isMobile) {
    return (
      <div className="block md:hidden text-center mb-10">
        <Link href="/student-ui/Login" className={classes}>
          Login
        </Link>
      </div>
    );
  }

  return (
    <Link href="/student-ui/Login" className="hidden md:inline-block mr-10">
      <span className={classes}>Login</span>
    </Link>
  );
};

export default LoginButton;
