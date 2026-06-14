"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import BottomNav from "@/components/BottomNav";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

export default function ContactPage() {
  const { data: session } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: session?.user?.name || "",
    email: session?.user?.email || "",
    subject: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/tickets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit ticket");
      }

      toast.success("Support ticket submitted successfully!");
      setFormData({
        name: session?.user?.name || "",
        email: session?.user?.email || "",
        subject: "",
        message: "",
      });
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-background text-on-background min-h-screen font-body pb-24 md:pb-8">
      <Navbar />

      <main className="max-w-container-max mx-auto px-margin-mobile md:px-gutter pt-8 md:pt-12 flex flex-col items-center">
        <div className="w-full max-w-2xl bg-surface-container-lowest rounded-3xl shadow-sm border border-outline-variant overflow-hidden">
          <div className="p-8 md:p-12">
            <div className="mb-8 text-center">
              <div className="w-16 h-16 bg-primary-container text-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="material-symbols-outlined text-[32px]">support_agent</span>
              </div>
              <h1 className="text-h2 font-display font-bold mb-2 text-on-surface">Contact Support</h1>
              <p className="text-body-md text-on-surface-variant">
                Fill out the form below and our team will get back to you as soon as possible.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-label-md font-medium text-on-surface mb-2">
                    Full Name <span className="text-error">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full h-12 px-4 rounded-xl border border-outline-variant bg-surface text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-label-md font-medium text-on-surface mb-2">
                    Email Address <span className="text-error">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full h-12 px-4 rounded-xl border border-outline-variant bg-surface text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-label-md font-medium text-on-surface mb-2">
                  Subject <span className="text-error">*</span>
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full h-12 px-4 rounded-xl border border-outline-variant bg-surface text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                  placeholder="What is this regarding?"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-label-md font-medium text-on-surface mb-2">
                  Message <span className="text-error">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full p-4 rounded-xl border border-outline-variant bg-surface text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors resize-y"
                  placeholder="Please describe your issue in detail..."
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-14 rounded-full bg-primary text-on-primary font-label-lg font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <span className="material-symbols-outlined animate-spin">progress_activity</span>
                    Submitting...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined">send</span>
                    Submit Ticket
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
