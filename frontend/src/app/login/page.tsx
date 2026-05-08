"use client";

import React from 'react';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="bg-background text-on-background font-body min-h-screen flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-6xl bg-surface-container-lowest rounded-xl shadow-xl overflow-hidden flex flex-col lg:flex-row h-full lg:h-[800px]">
        
        {/* Left Side: Image & Glassmorphism */}
        <div className="relative w-full lg:w-1/2 h-64 lg:h-full hidden lg:block">
          <img 
            alt="Modern Student Room" 
            className="absolute inset-0 w-full h-full object-cover" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCAfBu3oMh2nXI0DzLR4ctJnkMWjZDAj2gckjMGyjF2Lg-TJZhPAtvqN9ze-y8Lj0K24EmLhn4YRdIy83WSCT4tqMhzpBsnE6Q26BYPvrh3mlnAJANnskVIZWXFNwT9qm9-qayjI6fgrUPAVXjnF-TmYWvYlbJ9TPfWuqvhUtnQuf8GMgrd1BqOPjFk-lo4AP_3W988honv1PJ4xim7-aJtGmhJk1zZYbFuj1kbWekhrf3nSEKEkrKYWMCYaK3WiuPU4x8C_47L2vq5"
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
        <div className="w-full lg:w-1/2 flex flex-col justify-center p-8 md:p-16 h-full overflow-y-auto">
          
          {/* Brand */}
          <div className="mb-10 text-center lg:text-left">
            <Link href="/" className="inline-block font-display text-3xl font-extrabold text-primary flex items-center justify-center lg:justify-start gap-2">
              <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
              PG Genie
            </Link>
            <p className="text-on-surface-variant mt-2 font-body">Welcome back to premium student living.</p>
          </div>
          
          {/* Tabs */}
          <div className="flex gap-8 border-b border-outline-variant mb-8">
            <button className="pb-3 text-primary font-bold border-b-2 border-primary font-body text-lg transition-colors cursor-pointer">Log In</button>
            <button className="pb-3 text-on-surface-variant hover:text-primary transition-colors font-body text-lg cursor-pointer">Sign Up</button>
          </div>
          
          {/* Form */}
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-2">
              <label className="font-label text-sm font-semibold tracking-wider text-on-surface uppercase" htmlFor="phone">Phone Number</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-on-surface-variant">
                  <span className="material-symbols-outlined">phone_iphone</span>
                </span>
                <input className="w-full pl-12 pr-4 py-3 bg-surface-container rounded-lg border-none focus:ring-2 focus:ring-primary text-on-surface font-body outline-none transition-shadow" id="phone" placeholder="+91 98765 43210" required type="tel" />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="font-label text-sm font-semibold tracking-wider text-on-surface uppercase" htmlFor="otp">OTP</label>
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-on-surface-variant">
                    <span className="material-symbols-outlined">password</span>
                  </span>
                  <input className="w-full pl-12 pr-4 py-3 bg-surface-container rounded-lg border-none focus:ring-2 focus:ring-primary text-on-surface font-body outline-none transition-shadow" id="otp" placeholder="Enter 6-digit OTP" type="text" />
                </div>
                <button className="px-6 py-3 border-[1.5px] border-primary text-primary font-semibold rounded-lg hover:bg-primary/5 transition-colors whitespace-nowrap cursor-pointer" type="button">
                  Send OTP
                </button>
              </div>
            </div>
            
            <Link href="/dashboard" className="block w-full bg-secondary text-center text-on-secondary py-4 rounded-lg font-bold text-lg hover:bg-secondary/90 transition-colors shadow-md mt-4 cursor-pointer">
              Continue to Dashboard
            </Link>
          </form>
          
          <div className="mt-8 flex items-center gap-4">
            <div className="h-px bg-outline-variant flex-1"></div>
            <span className="text-on-surface-variant font-body text-sm uppercase tracking-wider">Or continue with</span>
            <div className="h-px bg-outline-variant flex-1"></div>
          </div>
          
          <div className="mt-6 flex gap-4">
            <button className="flex-1 py-3 px-4 border border-outline-variant rounded-lg flex items-center justify-center gap-2 hover:bg-surface-container transition-colors text-on-surface font-medium cursor-pointer">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"></path></svg>
              Google
            </button>
            <button className="flex-1 py-3 px-4 border border-outline-variant rounded-lg flex items-center justify-center gap-2 hover:bg-surface-container transition-colors text-on-surface font-medium cursor-pointer">
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
