"use client";

import React, { Suspense, useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import toast from 'react-hot-toast';

function LoginContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const callbackUrl = searchParams.get("callbackUrl");
  const isFromSearch = callbackUrl?.includes("/pgs");
  const backHref = isFromSearch ? "/pgs" : "/";
  const backText = isFromSearch ? "Back to Search" : "Back to Home";

  const [identifier, setIdentifier] = useState('');
  const [otp, setOtp] = useState('');
  const [selectedRole, setSelectedRole] = useState<'student' | 'owner'>('student');
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  useEffect(() => {
    const errorParam = searchParams.get("error");
    const registeredRole = searchParams.get("registeredRole");
    if (errorParam === 'RoleMismatch' && registeredRole) {
      toast.error(`You are registered as a ${registeredRole}. Please select ${registeredRole} to log in.`, {
        duration: 5000,
      });
      setSelectedRole(registeredRole as 'student' | 'owner');
    }
  }, [searchParams]);

  const handleSendOtp = async () => {
    if (!identifier) {
      toast.error("Please enter an email or phone number");
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
        setOtpSent(true);
      } else {
        toast.error(data.error || "Failed to send OTP");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier || !otp) {
      toast.error("Please enter your identifier and OTP");
      return;
    }

    setIsLoggingIn(true);
    try {
      const res = await signIn("credentials", {
        identifier,
        otp,
        role: selectedRole,
        redirect: false,
      });

      if (res?.error) {
        toast.error(res.error);
      } else {
        toast.success("Logged in successfully!");
        router.push(callbackUrl || "/dashboard");
      }
    } catch (error) {
      toast.error("Failed to login");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleOAuthLogin = (provider: string) => {
    // Set a cookie so the backend knows which role was selected
    document.cookie = `requested_auth_role=${selectedRole}; path=/; max-age=3600; SameSite=Lax`;
    signIn(provider);
  };

  return (
    <div className="bg-background text-on-background font-body min-h-screen flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-6xl bg-surface-container-lowest rounded-xl shadow-xl overflow-hidden flex flex-col lg:flex-row h-full lg:h-[800px]">
        
        {/* Left Side: Image & Glassmorphism */}
        <div className="relative w-full lg:w-1/2 h-64 lg:h-full hidden lg:block">
          <img 
            alt="Modern Student Room" 
            className="absolute inset-0 w-full h-full object-cover" 
            src="https://images.unsplash.com/photo-1540518614846-7eded433c457?w=1000&q=80"
          />
          <div className="absolute inset-0 bg-gradient-to-t to-transparent flex items-end p-12 from-black/40">
            <div className="backdrop-blur-md bg-white/10 border border-white/20 p-8 rounded-xl shadow-2xl max-w-md">
              <p className="font-headline text-3xl font-bold text-white leading-tight mb-4">
                A home that fuels your <span className="font-accent text-5xl font-normal text-primary-fixed-dim block mt-2">ambition</span>
              </p>
              <p className="font-body text-white/80 text-lg">
                Find the perfect space to focus, relax, and thrive in Kothri. Your premium student living experience starts here.
              </p>
            </div>
          </div>
        </div>
        
        {/* Right Side: Form */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center p-8 md:p-16 h-full overflow-y-auto relative">
          
          {/* Back Button */}
          <Link href={backHref} className="absolute top-4 md:top-8 left-4 md:left-8 text-on-surface-variant hover:text-primary transition-colors flex items-center gap-2 font-label-sm text-sm">
            <span className="material-symbols-outlined text-lg">arrow_back</span> {backText}
          </Link>
          
          {/* Brand */}
          <div className="mb-10 text-center lg:text-left mt-8 md:mt-0">
            <Link href="/" className="inline-block font-display text-3xl font-extrabold text-primary flex items-center justify-center lg:justify-start gap-2">
              <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
              PG Genie
            </Link>
            <p className="text-on-surface-variant mt-2 font-body">Welcome back to premium student living.</p>
          </div>
          
          {/* Tabs */}
          <div className="flex gap-4 mb-8">
            <button
              onClick={() => setSelectedRole('student')}
              className={`flex-1 py-3 font-label font-semibold text-sm tracking-wider uppercase rounded-lg border-2 transition-colors cursor-pointer ${
                selectedRole === 'student' 
                  ? 'border-primary bg-primary/5 text-primary' 
                  : 'border-outline-variant text-on-surface-variant hover:border-primary/50'
              }`}
            >
              Student
            </button>
            <button
              onClick={() => setSelectedRole('owner')}
              className={`flex-1 py-3 font-label font-semibold text-sm tracking-wider uppercase rounded-lg border-2 transition-colors cursor-pointer ${
                selectedRole === 'owner' 
                  ? 'border-secondary bg-secondary/5 text-secondary' 
                  : 'border-outline-variant text-on-surface-variant hover:border-secondary/50'
              }`}
            >
              Property Owner
            </button>
          </div>
          
          {/* Form */}
          <form className="space-y-6" onSubmit={handleLogin}>
            <div className="space-y-2">
              <label className="font-label text-sm font-semibold tracking-wider text-on-surface uppercase" htmlFor="identifier">Email or Phone Number</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-on-surface-variant">
                  <span className="material-symbols-outlined">person</span>
                </span>
                <input 
                  className="w-full pl-12 pr-4 py-3 bg-surface-container rounded-lg border-none focus:ring-2 focus:ring-primary text-on-surface font-body outline-none transition-shadow" 
                  id="identifier" 
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="name@example.com or +91 98765 43210" 
                  required 
                  type="text" 
                  disabled={otpSent}
                />
              </div>
            </div>
            
            <div className={`space-y-2 transition-all duration-300 ${otpSent ? 'opacity-100' : 'opacity-50'}`}>
              <label className="font-label text-sm font-semibold tracking-wider text-on-surface uppercase" htmlFor="otp">OTP</label>
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-on-surface-variant">
                    <span className="material-symbols-outlined">password</span>
                  </span>
                  <input 
                    className="w-full pl-12 pr-4 py-3 bg-surface-container rounded-lg border-none focus:ring-2 focus:ring-primary text-on-surface font-body outline-none transition-shadow" 
                    id="otp" 
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter 6-digit OTP" 
                    type="text" 
                    disabled={!otpSent}
                  />
                </div>
                <button 
                  onClick={handleSendOtp}
                  disabled={isSendingOtp || !identifier || (otpSent && !isSendingOtp)}
                  className="px-6 py-3 border-[1.5px] border-primary text-primary font-semibold rounded-lg hover:bg-primary/5 transition-colors whitespace-nowrap cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed" 
                  type="button"
                >
                  {isSendingOtp ? 'Sending...' : otpSent ? 'OTP Sent' : 'Send OTP'}
                </button>
              </div>
            </div>
            
            <button 
              type="submit"
              disabled={isLoggingIn || !otpSent || !otp}
              className="block w-full bg-secondary text-center text-on-secondary py-4 rounded-lg font-bold text-lg hover:bg-secondary/90 transition-colors shadow-md mt-4 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoggingIn ? 'Verifying...' : 'Continue to Dashboard'}
            </button>
          </form>
          
          <div className="mt-8 flex items-center gap-4">
            <div className="h-px bg-outline-variant flex-1"></div>
            <span className="text-on-surface-variant font-body text-sm uppercase tracking-wider">Or continue with</span>
            <div className="h-px bg-outline-variant flex-1"></div>
          </div>
          
          <div className="mt-6 flex gap-4">
            <button 
              onClick={() => handleOAuthLogin('google')}
              className="flex-1 py-3 px-4 border border-outline-variant rounded-lg flex items-center justify-center gap-2 hover:bg-surface-container transition-colors text-on-surface font-medium cursor-pointer"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"></path></svg>
              Google
            </button>
            <button 
              onClick={() => handleOAuthLogin('facebook')}
              className="flex-1 py-3 px-4 border border-outline-variant rounded-lg flex items-center justify-center gap-2 hover:bg-surface-container transition-colors text-on-surface font-medium cursor-pointer"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12,2C6.477,2,2,6.477,2,12c0,4.991,3.657,9.128,8.438,9.878v-6.987h-2.54V12h2.54V9.797c0-2.506,1.492-3.89,3.777-3.89c1.094,0,2.238,0.195,2.238,0.195v2.46h-1.26c-1.243,0-1.63,0.771-1.63,1.562V12h2.773l-0.443,2.89h-2.33v6.988C18.343,21.128,22,16.991,22,12C22,6.477,17.523,2,12,2z"></path></svg>
              Facebook
            </button>
          </div>
          
          <p className="text-center text-sm text-on-surface-variant mt-8 font-body">
            By continuing, you agree to our <Link className="text-primary underline cursor-pointer" href="#">Terms of Service</Link> and <Link className="text-primary underline cursor-pointer" href="#">Privacy Policy</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-background">Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}
