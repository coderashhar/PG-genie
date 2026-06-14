import React from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import BottomNav from "@/components/BottomNav";

export const metadata = {
  title: "Help Center - PG Genie",
  description: "Find answers to frequently asked questions and get support.",
};

export default function HelpPage() {
  const faqs = [
    {
      question: "How do I book a PG on PG Genie?",
      answer: "Booking a PG is simple. Search for properties in your desired area, click on a PG that fits your requirements, and select 'Book Now' to view availability. Follow the prompts to confirm your booking and pay the token amount if required.",
    },
    {
      question: "Are the PG listings verified?",
      answer: "We strive to verify all our listings. Look for the 'Verified' badge on property cards. We conduct physical verifications or require owners to submit official documents to ensure the PG exists and matches the description.",
    },
    {
      question: "How do I contact the PG owner?",
      answer: "Once you create an account and verify your details, you can request contact details or directly message the PG owner through our platform on the specific property's page.",
    },
    {
      question: "I am a PG Owner. How do I list my property?",
      answer: "Sign up as an 'Owner' on our registration page. Once your account is active, go to your Dashboard and click 'Add New Property'. Fill in the details, upload clear photos, and submit. Your listing will go live after a quick review.",
    },
    {
      question: "Can I cancel my booking?",
      answer: "Yes, you can cancel your booking from your Dashboard under the 'Bookings' tab. Please review the specific cancellation policy of the PG you booked, as token refund policies vary by owner.",
    },
  ];

  return (
    <div className="bg-background text-on-background min-h-screen font-body pb-24 md:pb-8">
      <Navbar />

      <main className="max-w-container-max mx-auto px-margin-mobile md:px-gutter pt-8 md:pt-12">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-h1 font-display font-extrabold text-primary mb-4">
              Help Center
            </h1>
            <p className="text-body-lg text-on-surface-variant">
              Find answers to common questions or reach out to our support team.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
            <Link href="/contact" className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant hover:border-primary transition-colors flex items-start gap-4 cursor-pointer">
              <div className="w-12 h-12 rounded-full bg-primary-container text-primary flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined">support_agent</span>
              </div>
              <div>
                <h3 className="text-h3 font-display font-bold mb-2">Contact Support</h3>
                <p className="text-body-sm text-on-surface-variant">
                  Have a specific issue? Open a support ticket and our team will get back to you.
                </p>
              </div>
            </Link>

            <Link href="/pgs" className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant hover:border-primary transition-colors flex items-start gap-4 cursor-pointer">
              <div className="w-12 h-12 rounded-full bg-secondary-container text-secondary flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined">search</span>
              </div>
              <div>
                <h3 className="text-h3 font-display font-bold mb-2">Browse PGs</h3>
                <p className="text-body-sm text-on-surface-variant">
                  Looking for a place? Start searching our verified listings right away.
                </p>
              </div>
            </Link>
          </div>

          {/* FAQs */}
          <h2 className="text-h2 font-display font-bold mb-8 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <details
                key={index}
                className="group bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden [&_summary::-webkit-details-marker]:hidden"
              >
                <summary className="flex items-center justify-between p-6 cursor-pointer font-bold text-lg select-none">
                  {faq.question}
                  <span className="material-symbols-outlined transition-transform duration-300 group-open:-rotate-180 text-on-surface-variant">
                    expand_more
                  </span>
                </summary>
                <div className="p-6 pt-0 text-on-surface-variant text-body-md leading-relaxed border-t border-outline-variant mx-6 mt-2 pb-6">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>

          {/* Still need help */}
          <div className="mt-16 text-center bg-primary-container/30 rounded-3xl p-8 border border-primary/20">
            <h3 className="text-h3 font-display font-bold mb-4">Still need help?</h3>
            <p className="text-body-md text-on-surface-variant mb-6">
              If you couldn't find the answer to your question, our support team is ready to assist you.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center h-12 px-8 rounded-full bg-primary text-on-primary font-label-lg font-medium hover:opacity-90 transition-opacity"
            >
              Submit a Ticket
            </Link>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
