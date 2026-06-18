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

  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [loginMethod, setLoginMethod] = useState<'password' | 'otp'>('password');
  const [step, setStep] = useState<1 | 2>(1); // Step 1: Form, Step 2: OTP (for signup and otp-login)
  
  const [selectedRole, setSelectedRole] = useState<'student' | 'owner'>('student');
  const [name, setName] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);

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

  useEffect(() => {
    if (otpTimer > 0) {
      const interval = setInterval(() => setOtpTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [otpTimer]);

  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
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
        toast.success(data.message || "OTP sent successfully!");
        setOtpSent(true);
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

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !identifier || !password) {
      toast.error("Please fill all fields");
      return;
    }
    // Proceed to OTP step
    handleSendOtp();
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) {
      toast.error("Please enter the OTP");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, identifier, password, role: selectedRole, otp }),
      });
      const data = await res.json();

      if (res.ok) {
        toast.success("Account created! Logging you in...");
        // Auto login
        const loginRes = await signIn("credentials", {
          identifier,
          password,
          role: selectedRole,
          loginType: 'password',
          redirect: false,
        });

        if (loginRes?.error) {
          toast.error(loginRes.error);
        } else {
          router.push(callbackUrl || "/dashboard");
        }
      } else {
        toast.error(data.error || "Failed to register");
      }
    } catch (error) {
      toast.error("An error occurred during registration");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loginMethod === 'password') {
      if (!identifier || !password) {
        toast.error("Please enter your identifier and password");
        return;
      }
    } else {
      if (!identifier || !otp) {
        toast.error("Please enter your identifier and OTP");
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const res = await signIn("credentials", {
        identifier,
        otp: loginMethod === 'otp' ? otp : undefined,
        password: loginMethod === 'password' ? password : undefined,
        role: selectedRole,
        loginType: loginMethod,
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
      setIsSubmitting(false);
    }
  };

  const handleOAuthLogin = (provider: string) => {
    document.cookie = `requested_auth_role=${selectedRole}; path=/; max-age=3600; SameSite=Lax`;
    signIn(provider, { callbackUrl: callbackUrl || "/dashboard" });
  };

  return (
    <div className="bg-background text-on-background font-body min-h-screen flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-6xl bg-surface-container-lowest rounded-xl shadow-xl overflow-hidden flex flex-col lg:flex-row h-full lg:min-h-[800px]">
        
        {/* Left Side: Image & Glassmorphism */}
        <div className="relative w-full lg:w-1/2 h-64 lg:h-auto hidden lg:block">
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
        <div className="w-full lg:w-1/2 flex flex-col justify-start p-8 md:p-16 h-full overflow-y-auto relative pt-24 lg:pt-16">
          
          {/* Back Button */}
          <Link href={backHref} className="absolute top-4 md:top-8 left-4 md:left-8 text-on-surface-variant hover:text-primary transition-colors flex items-center gap-2 font-label-sm text-sm">
            <span className="material-symbols-outlined text-lg">arrow_back</span> {backText}
          </Link>
          
          {/* Brand */}
          <div className="mb-8 text-center lg:text-left mt-8 md:mt-0">
            <Link href="/" className="inline-block font-display text-3xl font-extrabold text-primary flex items-center justify-center lg:justify-start gap-2">
              <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
              PG Genie
            </Link>
            <p className="text-on-surface-variant mt-2 font-body">Welcome to premium student living.</p>
          </div>
          
          {/* Toggle Login/Signup */}
          <div className="flex gap-6 border-b border-outline-variant pb-2 mb-8">
            <button
              onClick={() => { setAuthMode('login'); setStep(1); }}
              className={`font-label text-sm tracking-wider uppercase cursor-pointer pb-2 -mb-[9px] border-b-2 transition-colors ${
                authMode === 'login' ? 'border-primary text-primary font-bold' : 'border-transparent text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Log In
            </button>
            <button
              onClick={() => { setAuthMode('signup'); setStep(1); }}
              className={`font-label text-sm tracking-wider uppercase cursor-pointer pb-2 -mb-[9px] border-b-2 transition-colors ${
                authMode === 'signup' ? 'border-primary text-primary font-bold' : 'border-transparent text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Form */}
          {authMode === 'signup' && step === 1 && (
            <form className="space-y-5" onSubmit={handleSignupSubmit}>
              <div className="space-y-1">
                <label className="font-label text-xs font-semibold tracking-wider text-on-surface uppercase" htmlFor="name">Full Name</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-on-surface-variant">
                    <span className="material-symbols-outlined">badge</span>
                  </span>
                  <input 
                    className="w-full pl-12 pr-4 py-3 bg-surface-container rounded-lg border-none focus:ring-2 focus:ring-primary text-on-surface font-body outline-none transition-shadow" 
                    id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" required type="text" 
                  />
                </div>
              </div>
              
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

              <div className="space-y-1">
                <label className="font-label text-xs font-semibold tracking-wider text-on-surface uppercase" htmlFor="password">Password</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-on-surface-variant">
                    <span className="material-symbols-outlined">lock</span>
                  </span>
                  <input 
                    className="w-full pl-12 pr-4 py-3 bg-surface-container rounded-lg border-none focus:ring-2 focus:ring-primary text-on-surface font-body outline-none transition-shadow" 
                    id="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Create a strong password" required type="password" 
                  />
                </div>
              </div>

              {/* Roles */}
              <div className="space-y-2 mt-6">
                <label className="font-label text-xs font-semibold tracking-wider text-on-surface uppercase block text-left">Account Type</label>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setSelectedRole('student')}
                    className={`flex-1 py-2 font-label font-semibold text-sm tracking-wider uppercase rounded-lg border-2 transition-colors cursor-pointer ${
                      selectedRole === 'student' 
                        ? 'border-primary bg-primary/5 text-primary' 
                        : 'border-outline-variant text-on-surface-variant hover:border-primary/50'
                    }`}
                  >
                    Student
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedRole('owner')}
                    className={`flex-1 py-2 font-label font-semibold text-sm tracking-wider uppercase rounded-lg border-2 transition-colors cursor-pointer ${
                      selectedRole === 'owner' 
                        ? 'border-secondary bg-secondary/5 text-secondary' 
                        : 'border-outline-variant text-on-surface-variant hover:border-secondary/50'
                    }`}
                  >
                    PG Owner
                  </button>
                </div>
              </div>

              <button 
                type="submit"
                disabled={isSendingOtp}
                className="block w-full bg-secondary text-center text-on-secondary py-3 rounded-lg font-bold text-md hover:bg-secondary/90 transition-colors shadow-md mt-6 cursor-pointer disabled:opacity-50"
              >
                {isSendingOtp ? 'Sending OTP...' : 'Continue'}
              </button>
            </form>
          )}

          {authMode === 'signup' && step === 2 && (
            <form className="space-y-6" onSubmit={handleRegister}>
              <div className="bg-primary/5 p-4 rounded-lg border border-primary/20 text-center">
                <p className="text-primary font-body-md">We've sent an OTP to <strong>{identifier}</strong>.</p>
                <button type="button" onClick={() => setStep(1)} className="text-sm text-secondary font-bold hover:underline mt-2 cursor-pointer">Change</button>
              </div>

              <div className="space-y-1">
                <label className="font-label text-xs font-semibold tracking-wider text-on-surface uppercase" htmlFor="otp">Enter OTP</label>
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

              <button 
                type="submit"
                disabled={isSubmitting}
                className="block w-full bg-secondary text-center text-on-secondary py-3 rounded-lg font-bold text-md hover:bg-secondary/90 transition-colors shadow-md mt-6 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? 'Creating Account...' : 'Verify & Create Account'}
              </button>
            </form>
          )}

          {authMode === 'login' && (
            <form className="space-y-5" onSubmit={loginMethod === 'password' ? handleLogin : (step === 1 ? handleSendOtp : handleLogin)}>
              
              <div className="space-y-1">
                <label className="font-label text-xs font-semibold tracking-wider text-on-surface uppercase" htmlFor="identifier">Email or Phone Number</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-on-surface-variant">
                    <span className="material-symbols-outlined">person</span>
                  </span>
                  <input 
                    className="w-full pl-12 pr-4 py-3 bg-surface-container rounded-lg border-none focus:ring-2 focus:ring-primary text-on-surface font-body outline-none transition-shadow" 
                    id="identifier" value={identifier} onChange={(e) => setIdentifier(e.target.value)} placeholder="name@example.com or +91 98765 43210" required type="text" disabled={step === 2 && loginMethod === 'otp'}
                  />
                </div>
              </div>

              {loginMethod === 'password' && (
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <label className="font-label text-xs font-semibold tracking-wider text-on-surface uppercase" htmlFor="password">Password</label>
                    <Link href="/forgot-password" className="text-xs font-bold text-primary hover:underline cursor-pointer">Forgot Password?</Link>
                  </div>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-on-surface-variant">
                      <span className="material-symbols-outlined">lock</span>
                    </span>
                    <input 
                      className="w-full pl-12 pr-4 py-3 bg-surface-container rounded-lg border-none focus:ring-2 focus:ring-primary text-on-surface font-body outline-none transition-shadow" 
                      id="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" required type="password" 
                    />
                  </div>
                </div>
              )}

              {loginMethod === 'otp' && step === 2 && (
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
              )}

              {/* Roles */}
              <div className="space-y-2 mt-6">
                <label className="font-label text-xs font-semibold tracking-wider text-on-surface uppercase block text-left">Account Type</label>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setSelectedRole('student')}
                    className={`flex-1 py-2 font-label font-semibold text-sm tracking-wider uppercase rounded-lg border-2 transition-colors cursor-pointer ${
                      selectedRole === 'student' 
                        ? 'border-primary bg-primary/5 text-primary' 
                        : 'border-outline-variant text-on-surface-variant hover:border-primary/50'
                    }`}
                  >
                    Student
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedRole('owner')}
                    className={`flex-1 py-2 font-label font-semibold text-sm tracking-wider uppercase rounded-lg border-2 transition-colors cursor-pointer ${
                      selectedRole === 'owner' 
                        ? 'border-secondary bg-secondary/5 text-secondary' 
                        : 'border-outline-variant text-on-surface-variant hover:border-secondary/50'
                    }`}
                  >
                    PG Owner
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button 
                  type="submit"
                  disabled={isSubmitting || isSendingOtp}
                  className="block w-full bg-secondary text-center text-on-secondary py-3 rounded-lg font-bold text-md hover:bg-secondary/90 transition-colors shadow-md cursor-pointer disabled:opacity-50"
                >
                  {loginMethod === 'password' 
                    ? (isSubmitting ? 'Logging in...' : 'Log In') 
                    : (step === 1 ? (isSendingOtp ? 'Sending...' : 'Send OTP') : (isSubmitting ? 'Verifying...' : 'Log In'))
                  }
                </button>
                
                <div className="text-center mt-4">
                  {loginMethod === 'password' ? (
                    <button type="button" onClick={() => { setLoginMethod('otp'); setStep(1); }} className="text-xs font-bold text-on-surface-variant hover:text-primary transition-colors cursor-pointer underline decoration-outline-variant hover:decoration-primary">
                      Log in with OTP instead
                    </button>
                  ) : (
                    <button type="button" onClick={() => { setLoginMethod('password'); setStep(1); }} className="text-xs font-bold text-on-surface-variant hover:text-primary transition-colors cursor-pointer underline decoration-outline-variant hover:decoration-primary">
                      Log in with Password instead
                    </button>
                  )}
                </div>
              </div>
            </form>
          )}
          
          <div className="mt-8 flex items-center gap-4">
            <div className="h-px bg-outline-variant flex-1"></div>
            <span className="text-on-surface-variant font-body text-xs uppercase tracking-wider">Or continue with</span>
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
          </div>
          
          <p className="text-center text-xs text-on-surface-variant mt-8 font-body">
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
