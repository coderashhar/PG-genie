"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function ForgotPasswordPage() {
  const router = useRouter();
  
  const [step, setStep] = useState<1 | 2>(1);
  const [identifier, setIdentifier] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);

  React.useEffect(() => {
    if (otpTimer > 0) {
      const interval = setInterval(() => setOtpTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [otpTimer]);

  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!identifier) {
      toast.error("Please enter your email or phone number");
      return;
    }
    
    setIsSendingOtp(true);
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier }),
      });
      const data = await res.json();
      
      if (res.ok) {
        toast.success("OTP sent! (Check server console)");
        setStep(2);
        setOtpTimer(300);
      } else {
        toast.error(data.error || "Failed to send OTP");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || !newPassword) {
      toast.error("Please enter the OTP and your new password");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, otp, newPassword }),
      });
      const data = await res.json();

      if (res.ok) {
        toast.success("Password reset successfully! Please log in.");
        router.push("/login");
      } else {
        toast.error(data.error || "Failed to reset password");
      }
    } catch (error) {
      toast.error("An error occurred during password reset");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-background text-on-background font-body min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-surface-container-lowest rounded-xl shadow-xl overflow-hidden flex flex-col p-8">
        
        <Link href="/login" className="text-on-surface-variant hover:text-primary transition-colors flex items-center gap-2 font-label-sm text-sm mb-8 w-fit">
          <span className="material-symbols-outlined text-lg">arrow_back</span> Back to Login
        </Link>
        
        <div className="mb-8 text-center">
          <h1 className="font-display text-2xl font-bold text-primary mb-2">Reset Password</h1>
          <p className="text-on-surface-variant font-body text-sm">
            {step === 1 ? "Enter your email or phone number to receive a verification code." : "Enter the verification code and your new password."}
          </p>
        </div>

        {step === 1 && (
          <form className="space-y-4" onSubmit={handleSendOtp}>
            <div className="space-y-1">
              <label className="font-label text-xs font-semibold tracking-wider text-on-surface uppercase" htmlFor="identifier">Email or Phone Number</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-on-surface-variant">
                  <span className="material-symbols-outlined">person</span>
                </span>
                <input 
                  className="w-full pl-12 pr-4 py-3 bg-surface-container rounded-lg border-none focus:ring-2 focus:ring-primary text-on-surface font-body outline-none transition-shadow" 
                  id="identifier" value={identifier} onChange={(e) => setIdentifier(e.target.value)} placeholder="name@example.com or +91 98765 43210" required type="text" 
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={isSendingOtp}
              className="block w-full bg-primary text-center text-on-primary py-3 rounded-lg font-bold text-md hover:bg-primary/90 transition-colors shadow-md mt-6 cursor-pointer disabled:opacity-50"
            >
              {isSendingOtp ? 'Sending...' : 'Send Verification Code'}
            </button>
          </form>
        )}

        {step === 2 && (
          <form className="space-y-4" onSubmit={handleResetPassword}>
            <div className="bg-primary/5 p-4 rounded-lg border border-primary/20 text-center mb-4">
              <p className="text-primary font-body-sm text-sm">We've sent an OTP to <strong>{identifier}</strong>.</p>
              <button type="button" onClick={() => setStep(1)} className="text-xs text-secondary font-bold hover:underline mt-1 cursor-pointer">Change</button>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="font-label text-xs font-semibold tracking-wider text-on-surface uppercase" htmlFor="otp">Enter OTP</label>
                <button type="button" onClick={handleSendOtp} disabled={otpTimer > 0} className={`text-xs font-bold hover:underline cursor-pointer ${otpTimer > 0 ? 'text-on-surface-variant' : 'text-primary'}`}>
                  {otpTimer > 0 ? `Resend OTP in ${Math.floor(otpTimer / 60)}:${(otpTimer % 60).toString().padStart(2, '0')}` : 'Resend OTP'}
                </button>
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-on-surface-variant">
                  <span className="material-symbols-outlined">password</span>
                </span>
                <input 
                  className="w-full pl-12 pr-4 py-3 bg-surface-container rounded-lg border-none focus:ring-2 focus:ring-primary text-on-surface font-body outline-none transition-shadow tracking-widest text-lg" 
                  id="otp" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="123456" required type="text" 
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-label text-xs font-semibold tracking-wider text-on-surface uppercase" htmlFor="newPassword">New Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-on-surface-variant">
                  <span className="material-symbols-outlined">lock</span>
                </span>
                <input 
                  className="w-full pl-12 pr-4 py-3 bg-surface-container rounded-lg border-none focus:ring-2 focus:ring-primary text-on-surface font-body outline-none transition-shadow" 
                  id="newPassword" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Create a strong password" required type="password" 
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={isSubmitting}
              className="block w-full bg-primary text-center text-on-primary py-3 rounded-lg font-bold text-md hover:bg-primary/90 transition-colors shadow-md mt-6 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
