'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Footer from '@/app/MyComponents/Footer';
import { Eye, EyeOff } from 'lucide-react'; // Import Eye icons

const ForgetPassword = () => {
  const [email, setEmail] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // Show/hide password state
  const router = useRouter();

  const handleSendOtp = () => {
    const registeredEmail = localStorage.getItem('registeredEmail');
    if (!email) {
      setMessage('Please enter a valid email!');
      return;
    }

    if (email !== registeredEmail) {
      setMessage('This email is not registered!');
      return;
    }

    setOtpSent(true);
    alert('OTP sent to your email. (Hint: 123456)');
    setMessage('');
  };

  const handleVerifyCode = () => {
    if (code === '123456') {
      setIsVerified(true);
      setMessage('OTP Verified. Please enter your new password.');
    } else {
      setMessage('Invalid OTP. Try again.');
    }
  };

  const handleResetPassword = () => {
    if (!newPassword) {
      setMessage('Please enter a new password.');
      return;
    }

    localStorage.setItem('registeredPassword', newPassword);
    alert('Password reset successful!');
    router.push('/login');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!otpSent) {
      handleSendOtp();
    } else if (!isVerified) {
      handleVerifyCode();
    } else {
      handleResetPassword();
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col bg-cover bg-center"
      style={{
        backgroundImage: 'url(/your-bg-image.jpeg)', // Replace with your image path
      }}
    >
      <div className="flex-grow flex items-center justify-center lg:justify-end mt-20 lg:mt-0">
        <div className="bg-[rgba(0,0,0,0.3)] p-6 sm:p-8 rounded-lg shadow-md w-full max-w-sm mx-4 lg:mx-0 lg:mr-40">
          <h2 className="text-3xl font-bold mb-6 text-center text-teal-400">Forgot Password</h2>

          <form onSubmit={handleSubmit}>
            {/* Email Input */}
            {!otpSent && (
              <>
                <input
                  type="email"
                  placeholder="Enter your registered email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 mb-4 border border-gray-300 rounded-md text-black"
                  required
                />
                <button
                  type="submit"
                  className="w-full mb-4 py-2 rounded-md bg-blue-500 text-white font-semibold hover:bg-blue-600"
                >
                  Send OTP
                </button>
              </>
            )}

            {/* OTP Section */}
            {otpSent && !isVerified && (
              <>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full p-3 mb-4 border border-gray-300 rounded-md text-black"
                  required
                />
                <button
                  type="submit"
                  className="w-full mb-4 py-2 rounded-md bg-green-500 text-white font-semibold hover:bg-green-600"
                >
                  Verify OTP
                </button>
              </>
            )}

            {/* New Password Section */}
            {isVerified && (
              <>
                <div className="relative mb-4">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full p-3 pr-10 border border-gray-300 rounded-md text-black"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white" // Set text color to white
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full mb-4 py-2 rounded-md bg-purple-600 text-white font-semibold hover:bg-purple-700"
                >
                  Reset Password
                </button>
              </>
            )}
          </form>

          {/* Error or success messages */}
          {message && <p className="text-center text-red-500">{message}</p>}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ForgetPassword;
