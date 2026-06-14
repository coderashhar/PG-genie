import React from "react";
import Link from "next/link";

export default function TermsOfService() {
  return (
    <main className="min-h-screen bg-surface-container-lowest pt-6 md:pt-10 pb-12 px-margin-mobile md:px-gutter">
      <div className="max-w-3xl mx-auto">
        <div className="mb-12">
          <Link href="/" className="inline-flex items-center text-primary hover:text-primary/80 font-body-md font-medium mb-8 transition-colors">
            <span className="material-symbols-outlined mr-2">arrow_back</span>
            Back to Home
          </Link>
          <h1 className="font-display text-4xl md:text-5xl text-on-surface mb-6">Terms of Service</h1>
          <p className="font-body-md text-on-surface-variant text-lg">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
        </div>

        <div className="prose prose-slate max-w-none text-on-surface-variant font-body-md space-y-8">
          <section>
            <h2 className="font-display text-2xl text-on-surface mb-4">1. Acceptance of Terms</h2>
            <p className="leading-relaxed">
              By accessing and using PG Genie, you accept and agree to be bound by the terms and provision of this agreement. In addition, when using these particular services, you shall be subject to any posted guidelines or rules applicable to such services.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-on-surface mb-4">2. Description of Service</h2>
            <p className="leading-relaxed">
              PG Genie is a platform designed to connect students with accommodation owners near VIT Bhopal. We provide a digital concierge service that allows owners to list properties and students to discover, compare, and connect with property owners.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-on-surface mb-4">3. User Accounts</h2>
            <p className="leading-relaxed mb-4">
              To use certain features of the service, you must register for an account using your Google account or email.
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>You are responsible for maintaining the confidentiality of your account.</li>
              <li>You agree to accept responsibility for all activities that occur under your account.</li>
              <li>We reserve the right to refuse service, terminate accounts, or remove content at our sole discretion.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl text-on-surface mb-4">4. Content Guidelines</h2>
            <p className="leading-relaxed mb-4">
              Property owners are solely responsible for the accuracy, legality, and validity of the content they post, including property details, images, and pricing.
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Listings must accurately represent the property.</li>
              <li>Misleading, fraudulent, or harmful content is strictly prohibited.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl text-on-surface mb-4">5. Limitation of Liability</h2>
            <p className="leading-relaxed">
              PG Genie acts as a facilitator between students and owners. We are not a real estate agency and do not own, manage, or endorse any properties listed. We shall not be liable for any direct, indirect, incidental, special, or consequential damages resulting from the use or inability to use our services, or any interactions between users.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-on-surface mb-4">6. Changes to Terms</h2>
            <p className="leading-relaxed">
              We reserve the right to modify these terms from time to time at our sole discretion. Therefore, you should review these pages periodically. Your continued use of the Website or our service after any such change constitutes your acceptance of the new Terms.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
