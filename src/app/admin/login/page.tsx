"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      toast.success("Welcome, Admin!");
      router.push("/admin");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Invalid credentials");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 font-body">
      <div className="w-full max-w-md bg-surface-container-lowest p-8 rounded-3xl shadow-lg border border-outline-variant">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-error-container text-error rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-[32px]">admin_panel_settings</span>
          </div>
          <h1 className="text-h3 font-display font-bold text-on-surface">Admin Portal</h1>
          <p className="text-body-sm text-on-surface-variant">Authorized personnel only</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-label-md font-medium text-on-surface mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full h-12 px-4 rounded-xl border border-outline-variant bg-surface text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-label-md font-medium text-on-surface mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full h-12 px-4 rounded-xl border border-outline-variant bg-surface text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 rounded-full bg-primary text-on-primary font-label-lg font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {isLoading ? "Authenticating..." : "Login to Dashboard"}
          </button>
        </form>
      </div>
    </div>
  );
}
