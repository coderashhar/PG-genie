'use client';

import React, { useState } from 'react';
import { X, ArrowRight, ShieldCheck, Mail } from 'lucide-react';
import { signIn } from 'next-auth/react';
import { M3Button } from './M3Button';
import { M3Card } from './M3Card';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AuthStep = 'initial' | 'phone_input' | 'otp_verification';

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [step, setStep] = useState<AuthStep>('initial');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);

  if (!isOpen) return null;

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length >= 10) {
      setStep('otp_verification');
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpValue = otp.join('');
    
    const result = await signIn('credentials', {
      phone,
      otp: otpValue,
      redirect: false,
    });

    if (result?.error) {
      console.error(result.error);
    } else {
      onClose();
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return; // Prevent multiple chars
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Auto focus next input
    if (value !== '' && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-0">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#00201a]/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <M3Card elevation={3} className="relative w-full max-w-md bg-white z-10 animate-fade-in-up">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X size={20} />
        </button>

        <div className="p-8">
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <ShieldCheck size={24} />
            </div>
            <h2 className="text-2xl font-bold text-[#181c20] mb-2">Welcome to PG Genie</h2>
            <p className="text-[#3f4945] text-sm">
              {step === 'initial' && "Sign in or create an account"}
              {step === 'phone_input' && "Enter your phone number to continue"}
              {step === 'otp_verification' && `Enter the 6-digit code sent to ${phone}`}
            </p>
          </div>

          {step === 'initial' && (
            <div className="space-y-4">
              {/* Google OAuth Button */}
              <button 
                onClick={() => signIn('google')}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors font-medium text-[#181c20]"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Continue with Google
              </button>

              <div className="relative flex items-center py-2">
                <div className="flex-grow border-t border-gray-200"></div>
                <span className="flex-shrink-0 mx-4 text-gray-400 text-sm">or</span>
                <div className="flex-grow border-t border-gray-200"></div>
              </div>

              {/* Phone Button */}
              <button 
                onClick={() => setStep('phone_input')}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors font-medium text-[#181c20]"
              >
                <div className="w-5 h-5 flex items-center justify-center text-gray-600">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                </div>
                Continue with Phone Number
              </button>
            </div>
          )}

          {step === 'phone_input' && (
            <form onSubmit={handleSendOtp} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-[#3f4945] mb-2">Phone Number</label>
                <div className="flex shadow-sm rounded-2xl overflow-hidden border border-gray-300 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary">
                  <span className="flex items-center px-4 bg-gray-50 text-gray-500 border-r border-gray-200">
                    +91
                  </span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    maxLength={10}
                    placeholder="Enter 10 digit number"
                    className="flex-1 w-full px-4 py-3 focus:outline-none"
                    autoFocus
                  />
                </div>
              </div>
              <M3Button 
                variant="primary" 
                className="w-full py-3"
                type="submit"
                disabled={phone.length < 10}
              >
                Send OTP
              </M3Button>
              <button 
                type="button"
                onClick={() => setStep('initial')}
                className="w-full text-center text-sm text-gray-500 hover:text-primary transition-colors"
              >
                Back to options
              </button>
            </form>
          )}

          {step === 'otp_verification' && (
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div className="flex justify-between gap-2">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value.replace(/\D/g, ''))}
                    className="w-12 h-14 text-center text-xl font-bold rounded-xl border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none bg-gray-50"
                  />
                ))}
              </div>
              <M3Button 
                variant="primary" 
                className="w-full py-3"
                type="submit"
                disabled={otp.some(d => d === '')}
              >
                Verify & Continue
              </M3Button>
              <div className="text-center text-sm">
                <span className="text-gray-500">Didn't receive the code? </span>
                <button type="button" className="text-primary font-medium hover:underline">
                  Resend OTP
                </button>
              </div>
            </form>
          )}

          <div className="mt-8 text-center text-xs text-gray-400">
            By continuing, you agree to our <a href="#" className="underline">Terms of Service</a> and <a href="#" className="underline">Privacy Policy</a>.
          </div>
        </div>
      </M3Card>
    </div>
  );
}
