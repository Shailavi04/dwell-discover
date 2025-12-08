'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Footer from '../../MyComponents/Footer';
import HiddenNav from '../../MyComponents/HiddenNav';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isCodeInputEnabled, setIsCodeInputEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showVerificationMessage, setShowVerificationMessage] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isOtpButtonDisabled, setIsOtpButtonDisabled] = useState(false);
  const [isAlreadyRegistered, setIsAlreadyRegistered] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState('');

  const router = useRouter();

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setShowVerificationMessage(false);
    setIsEmailVerified(false);
    setIsCodeInputEnabled(false);
    setOtpSent(false);
    setTimer(0);
    setIsOtpButtonDisabled(false);
    setIsAlreadyRegistered(false);
    setVerificationMessage('');
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const startTimer = (duration: number) => {
    setIsOtpButtonDisabled(true);
    setTimer(duration);
    let timeLeft = duration;

    const countdown = setInterval(() => {
      timeLeft -= 1;
      setTimer(timeLeft);

      if (timeLeft <= 0) {
        clearInterval(countdown);
        setIsOtpButtonDisabled(false);
      }
    }, 1000);
  };

  const checkIfUserExists = (email: string) => {
    const storedEmail = localStorage.getItem('registeredEmail');
    return storedEmail === email;
  };

  const handleSendOrResendOtp = () => {
    if (!email) {
      setShowVerificationMessage(true);
      return;
    }

    if (checkIfUserExists(email)) {
      setIsAlreadyRegistered(true);
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setOtpSent(true);
      setIsEmailVerified(true);
      setIsCodeInputEnabled(true);
      setIsLoading(false);
      startTimer(10);
      alert('OTP has been sent to your email!');
    }, 1500);
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCode(e.target.value);
  };

  const handleVerifyCode = () => {
    if (!code) {
      setVerificationMessage('Invalid OTP! Please enter a valid code.');
      return;
    }

    if (code === '123456') {
      setIsEmailVerified(true);
      setVerificationMessage('Email Verified!');
    } else {
      setVerificationMessage('Invalid OTP! Please try again.');
    }
  };

  const handleSignUp = () => {
    if (!email || !code || !password) {
      alert('Please enter email, verification code, and password!');
      return;
    }

    localStorage.setItem('registeredEmail', email);
    localStorage.setItem('registeredPassword', password);

    setIsLoading(true);
    setTimeout(() => {
      alert('Email and code verified successfully!');
      setIsLoading(false);
      router.push('/preferences');
    }, 2000);
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-start bg-cover bg-center relative"
      style={{ backgroundImage: "url('/your-bg-image.jpeg')" }}
    >
      {/* NAVBAR + LOGIN DESKTOP ROW */}
<div className="w-full flex justify-between items-center px-6 pt-4">
  <HiddenNav />

</div>

      {/* Form Section */}
      <div className="w-full flex justify-center lg:justify-end px-4 mb-8">
        <div className="bg-[rgba(0,0,0,0.3)] p-8 rounded-lg shadow-md w-full max-w-md lg:absolute lg:right-40 lg:top-1/2 lg:transform lg:-translate-y-1/2 mb-20">
          <h2 className="text-4xl font-bold mb-2 text-center text-teal-500">Dwell Discover</h2>
          <h2 className="text-2xl font-bold mb-6 text-center text-teal-950">Create your account</h2>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSignUp();
            }}
          >
            {/* Email */}
            <div className="mb-4">
              <label className="block text-sm text-black font-medium">Email</label>
              <input
                type="email"
                className="w-full mt-2 p-3 border border-white rounded-md text-white"
                value={email}
                onChange={handleEmailChange}
                placeholder="Enter your email"
                required
              />
              <button
                type="button"
                onClick={handleSendOrResendOtp}
                className={`mt-2 px-4 py-2 rounded-md text-white font-semibold ${
                  isOtpButtonDisabled
                    ? 'bg-gray-400'
                    : 'bg-green-500 shadow-2xl hover:bg-[rgba(0,0,0,0.3)]'
                }`}
                disabled={isOtpButtonDisabled}
              >
                {otpSent ? (isOtpButtonDisabled ? `Resend OTP (${timer}s)` : 'Resend OTP') : 'Get OTP'}
              </button>
            </div>

            {/* Verification Code */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-black">Verification Code</label>
              <input
                type="text"
                className={`w-full mt-2 p-3 border rounded-md text-white ${
                  !isCodeInputEnabled ? 'bg-transparent cursor-not-allowed' : ''
                }`}
                value={code}
                onChange={handleCodeChange}
                placeholder="Enter verification code"
                disabled={!isCodeInputEnabled}
              />
            </div>

            {/* Verify Code Button */}
            {isCodeInputEnabled && (
              <button
                type="button"
                onClick={handleVerifyCode}
                className="w-full mt-2 py-3 rounded-md bg-blue-500 hover:bg-blue-400 text-white font-semibold"
              >
                Verify Code
              </button>
            )}

            {/* Password */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-black">Password</label>
              <input
                type="password"
                className="w-full mt-2 p-3 border border-white rounded-md text-white"
                value={password}
                onChange={handlePasswordChange}
                placeholder="Enter your password"
                required
              />
            </div>

            {/* Already Registered */}
            {isAlreadyRegistered && (
              <div className="mt-2">
                <p className="text-red-500 text-sm">This user is already registered!</p>
                <a
                  href="/Login"
                  className="text-blue-600 hover:underline text-sm inline-block mt-1"
                >
                  Go to Login
                </a>
              </div>
            )}

            {/* Empty Email */}
            {showVerificationMessage && (
              <p className="text-red-500 text-sm mt-2">Please fill the email first to get the verification code!</p>
            )}

            {/* OTP Message */}
            {verificationMessage && (
              <p
                className={`text-sm mt-2 ${
                  verificationMessage.includes('Invalid') ? 'text-red-500' : 'text-green-500'
                }`}
              >
                {verificationMessage}
              </p>
            )}

            {/* Sign In Button */}
            <button
              type="submit"
              className={`w-full mt-4 py-3 rounded-md ${
                isLoading ? 'bg-gray-300' : 'bg-blue-500 hover:bg-[rgba(0,0,0,0.3)]'
              } text-white font-semibold`}
              disabled={isLoading}
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SignUp;
