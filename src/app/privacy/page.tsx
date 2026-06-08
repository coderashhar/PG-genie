import React from "react";
import Link from "next/link";

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-surface-container-lowest pt-32 pb-24 px-margin-mobile md:px-gutter">
      <div className="max-w-3xl mx-auto">
        <div className="mb-12">
          <Link href="/" className="inline-flex items-center text-primary hover:text-primary/80 font-body-md font-medium mb-8 transition-colors">
            <span className="material-symbols-outlined mr-2">arrow_back</span>
            Back to Home
          </Link>
          <h1 className="font-display text-4xl md:text-5xl text-on-surface mb-6">Privacy Policy</h1>
          <p className="font-body-md text-on-surface-variant text-lg">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
        </div>

        <div className="prose prose-slate max-w-none text-on-surface-variant font-body-md space-y-8">
          <section>
            <h2 className="font-display text-2xl text-on-surface mb-4">1. Introduction</h2>
            <p className="leading-relaxed">
              Welcome to PG Genie. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you about how we look after your personal data when you visit our website (regardless of where you visit it from) and tell you about your privacy rights and how the law protects you.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-on-surface mb-4">2. Data We Collect</h2>
            <p className="leading-relaxed mb-4">
              We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Identity Data</strong> includes first name, last name, username or similar identifier. When using Google Login, this includes your Google profile information.</li>
              <li><strong>Contact Data</strong> includes email address and telephone numbers.</li>
              <li><strong>Profile Data</strong> includes your university, role (student or owner), interests, preferences, and saved properties.</li>
              <li><strong>Usage Data</strong> includes information about how you use our website and services.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl text-on-surface mb-4">3. Google API Data Usage</h2>
            <p className="leading-relaxed">
              Our application uses Google OAuth to authenticate users. We only request basic profile information (name, email, and profile picture) to create your account and personalize your experience. We do not request access to your contacts, Google Drive, or any other sensitive scopes.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-on-surface mb-4">4. How We Use Your Data</h2>
            <p className="leading-relaxed mb-4">
              We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>To register you as a new user.</li>
              <li>To manage our relationship with you.</li>
              <li>To enable owners to list properties and students to book or save them.</li>
              <li>To improve our website, services, marketing, and customer relationships.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl text-on-surface mb-4">5. Data Security</h2>
            <p className="leading-relaxed">
              We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used, or accessed in an unauthorized way, altered, or disclosed.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-on-surface mb-4">6. Contact Us</h2>
            <p className="leading-relaxed">
              If you have any questions about this privacy policy or our privacy practices, please contact us at support@pggenie.com.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
