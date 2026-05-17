import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <>
      <Navbar hideHome />

      <main>
        {/* Hero Section */}
        <section className="relative w-full min-h-[1024px] flex items-center justify-center pt-24 pb-12 overflow-hidden bg-surface-container-lowest">
          <div className="absolute inset-0 z-0">
            <img 
              alt="Modern architectural student housing" 
              className="w-full h-full object-cover scale-105 transform origin-center opacity-90" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBIRdUUPV1bMcy8zCXF806JxoTNsfzGlB2cUjQQ-rRjJGZYJz38qr8_7wUkMlTGTHrhi8tH2Bh2E7oWyPlCpIptcMI_9W9oAZjxQEs5srU59Iu98zkTt9VbnJ85Bxp185RilpuspnJNiBTZTz86zdjVtDOX4ZRzHnFdjrehKwpgvNIM-BlsuorIu9bC49sPE9lXIWdWiOLqSRAMhmuHeAv1bNrATPTK5iJ_QNcVl4VEOgp7rHDzuikj3xMIBLAHngwJ-GOWEN1NlfW3"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent"></div>
          </div>
          
          <div className="relative z-10 w-full px-margin-mobile md:px-gutter max-w-container-max mx-auto flex flex-col md:flex-row items-center gap-12 md:gap-20 pb-24 h-full">
            <div className="w-full md:w-3/5 text-left opacity-0 animate-reveal">
              <div className="inline-flex mb-8 px-5 py-2 rounded-full glass-minimal text-sm font-semibold text-primary shadow-sm">
                <span className="flex items-center gap-3">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
                  </span>
                  New verified listings added today in Kothri
                </span>
              </div>
              <h1 className="font-display text-[64px] md:text-[96px] leading-[1.05] tracking-tight text-white mb-8 drop-shadow-md">
                Find your <span className="inline-block font-caveat text-[1.1em] text-secondary-fixed-dim -rotate-2 transform translate-y-1 ml-2 mr-2">perfect home</span> near <br/>
                <span className="font-light">VIT Bhopal</span>
              </h1>
              <p className="font-body-lg text-xl text-white/90 max-w-xl mb-12 font-light tracking-wide">
                The smartest way for students to discover, compare, and book verified accommodations. Your digital concierge to student living.
              </p>
            </div>
            
            <div className="w-full md:w-2/5 flex flex-col gap-6 opacity-0 animate-reveal-delayed">
              <div className="w-full glass-minimal rounded-3xl p-8 flex flex-col gap-6 shadow-2xl backdrop-blur-3xl">
                <div className="flex flex-col gap-2 border-b border-surface-variant/50 pb-4">
                  <span className="font-label-sm text-xs text-on-surface-variant/70 uppercase font-bold tracking-widest">Location</span>
                  <input className="bg-transparent border-none focus:ring-0 p-0 font-body-lg text-on-surface w-full font-medium cursor-pointer placeholder:text-on-surface/30 focus:outline-none" placeholder="Where do you want to live?" type="text" defaultValue="Kothri, MP" />
                </div>
                <div className="flex flex-col gap-2 border-b border-surface-variant/50 pb-4">
                  <span className="font-label-sm text-xs text-on-surface-variant/70 uppercase font-bold tracking-widest">Room Type</span>
                  <select className="bg-transparent border-none focus:ring-0 p-0 font-body-lg text-on-surface w-full font-medium cursor-pointer appearance-none focus:outline-none">
                    <option>Any Type</option>
                    <option>Single Room</option>
                    <option>Double Sharing</option>
                    <option>Triple Sharing</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2 pb-4">
                  <span className="font-label-sm text-xs text-on-surface-variant/70 uppercase font-bold tracking-widest">Budget</span>
                  <select className="bg-transparent border-none focus:ring-0 p-0 font-body-lg text-on-surface w-full font-medium cursor-pointer appearance-none focus:outline-none">
                    <option>Up to ₹8,000</option>
                    <option>Up to ₹10,000</option>
                    <option>Up to ₹15,000</option>
                  </select>
                </div>
                <Link href="/pgs" className="bg-primary hover:bg-primary-container text-white font-body-md font-semibold px-8 py-5 rounded-2xl transition-all duration-300 flex items-center justify-center w-full mt-2 group relative overflow-hidden cursor-pointer">
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1s_infinite]"></span>
                  <span className="material-symbols-outlined mr-3 text-xl transition-transform group-hover:rotate-90">arrow_forward</span>
                  Explore Properties
                </Link>
              </div>
              
              <div className="grid grid-cols-3 gap-4 w-full">
                <div className="glass-minimal rounded-2xl p-4 flex flex-col items-center justify-center text-center backdrop-blur-md">
                  <span className="font-display text-2xl font-semibold text-primary">50+</span>
                  <span className="font-label-sm text-on-surface-variant/80 uppercase tracking-wider mt-1 text-[10px]">Verified</span>
                </div>
                <div className="glass-minimal rounded-2xl p-4 flex flex-col items-center justify-center text-center backdrop-blur-md">
                  <span className="font-display text-2xl font-semibold text-primary">1.2k</span>
                  <span className="font-label-sm text-on-surface-variant/80 uppercase tracking-wider mt-1 text-[10px]">Students</span>
                </div>
                <div className="glass-minimal rounded-2xl p-4 flex flex-col items-center justify-center text-center backdrop-blur-md">
                  <span className="font-display text-2xl font-semibold text-primary">100%</span>
                  <span className="font-label-sm text-on-surface-variant/80 uppercase tracking-wider mt-1 text-[10px]">Secure</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Listings - Asymmetric Grid */}
        <section className="w-full px-margin-mobile md:px-gutter py-stack-xl max-w-container-max mx-auto bg-surface-container-lowest">
          <div className="flex justify-between items-end mb-16">
            <div className="max-w-2xl">
              <h2 className="font-display text-[48px] text-on-surface leading-tight">
                Curated Spaces <br/><span className="italic text-on-surface-variant font-light">for student living</span>
              </h2>
            </div>
            <Link href="/pgs" className="hidden md:flex text-on-surface font-body-md font-medium items-center hover:text-primary transition-colors group cursor-pointer">
              View collection <span className="material-symbols-outlined ml-2 transition-transform group-hover:translate-x-1">trending_flat</span>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-start">
            <div className="md:col-span-8 flex flex-col group cursor-pointer">
              <div className="relative w-full aspect-[16/9] overflow-hidden rounded-3xl mb-6 bg-surface-container">
                <img 
                  alt="Premium student accommodation" 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuByVkVx27_KvRpC9vRL68trMQABjayPufRpfE6GLOEfIw7tg4LvZTTa1I27qtWKLM8VgNU3NlmHZNMXTEmBXtr_PcvAxgvO88WAbVffaN2RXZOWKdvJw9nucV4oJPr5JcSaN65mfbUOY2Ac-LuICS-XWccawbZqtaI2ZsiOWiIF1InzSu6YlcM6bnb0AYkyF0Mo_3z3p1r84C_cuSHcdqFPOLnqf0g43p2IbD_Tqj-sKj4cY2uDRKL0WRXnsRnjwEvTwrB93s6VAoFG" 
                />
                <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full flex items-center shadow-lg">
                  <span className="material-symbols-outlined text-secondary text-sm mr-2" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                  <span className="font-label-sm text-on-surface tracking-wide">Verified</span>
                </div>
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-display text-3xl text-on-surface mb-2 group-hover:text-primary transition-colors">Elite Boys Hostel</h3>
                  <p className="font-body-md text-on-surface-variant flex items-center mb-4">
                    0.8 km from VIT Main Gate
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <span className="font-label-sm text-secondary bg-secondary/10 px-3 py-1 rounded-full uppercase tracking-wider">Meals</span>
                    <span className="font-label-sm text-secondary bg-secondary/10 px-3 py-1 rounded-full uppercase tracking-wider">Transport</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-display text-3xl text-on-surface">₹9,000</div>
                  <div className="font-body-md text-on-surface-variant">/month</div>
                </div>
              </div>
            </div>
            
            <div className="md:col-span-4 flex flex-col group cursor-pointer md:mt-24">
              <div className="relative w-full aspect-[3/4] overflow-hidden rounded-3xl mb-6 bg-surface-container">
                <img 
                  alt="Student PG interior" 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDM8cCDbppp0BmoIJNt3Zm7f1qSTitePgv2l-SpSYCe7gAtCv8Ezn9XChflZ543gNFzcG2vXt-hK2iktkaQOA4PxupRd5RcNLlryYcAaqPNB_cmrPyKkfOdXQhIbBeyuPXmWVGGlow57FXBayCj2WoaZZO0Dr5bPA4_k7AB4h9cY3MW-a5306M1zltW5cGgj3JsIwYxPNwewQEbPYSxrSe7f1FKtibJw6NfxFOl9ASNHHE5FgFXSbfethgWW7be29Cc5CbF2Vvk7qay" 
                />
                <div className="absolute top-6 left-6 bg-primary text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg tracking-wider uppercase">
                  New
                </div>
              </div>
              <div className="flex flex-col">
                <h3 className="font-display text-2xl text-on-surface mb-2 group-hover:text-primary transition-colors">Shanti Residency</h3>
                <p className="font-body-md text-on-surface-variant flex items-center mb-4">
                  1.2 km from VIT Main Gate
                </p>
                <div className="flex justify-between items-end mt-2">
                  <div className="flex flex-wrap gap-2">
                    <span className="font-label-sm text-secondary bg-secondary/10 px-3 py-1 rounded-full uppercase tracking-wider">WiFi</span>
                    <span className="font-label-sm text-secondary bg-secondary/10 px-3 py-1 rounded-full uppercase tracking-wider">AC</span>
                  </div>
                  <div className="font-display text-2xl text-on-surface">₹7,500<span className="font-body-md text-on-surface-variant font-sans">/mo</span></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How it Works Section */}
        <section className="w-full bg-surface-container py-stack-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent skew-x-12 translate-x-1/4"></div>
          <div className="px-margin-mobile md:px-gutter max-w-container-max mx-auto relative z-10">
            <div className="mb-20 text-center md:text-left">
              <h2 className="font-display text-[48px] text-on-surface leading-tight">Elevated Living <br/><span className="italic text-on-surface-variant font-light">simplified</span></h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-24 relative">
              <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-outline-variant/30 transform -translate-x-1/2"></div>
              
              <div className="relative pr-0 md:pr-12">
                <div className="flex items-center gap-4 mb-12">
                  <span className="font-display text-6xl text-primary/20 italic">01</span>
                  <h3 className="font-display text-3xl text-on-surface">For Students</h3>
                </div>
                <div className="space-y-12">
                  <div className="group relative pl-8 border-l border-outline-variant hover:border-primary transition-colors duration-300">
                    <div className="absolute w-3 h-3 bg-surface border-2 border-outline-variant rounded-full -left-[7px] top-2 group-hover:border-primary group-hover:bg-primary transition-all duration-300"></div>
                    <h4 className="font-body-lg font-semibold text-on-surface mb-3">Discover &amp; Curate</h4>
                    <p className="font-body-md text-on-surface-variant leading-relaxed">Filter meticulously verified properties based on proximity, aesthetics, and amenities tailored to the modern student lifestyle.</p>
                  </div>
                  <div className="group relative pl-8 border-l border-outline-variant hover:border-primary transition-colors duration-300">
                    <div className="absolute w-3 h-3 bg-surface border-2 border-outline-variant rounded-full -left-[7px] top-2 group-hover:border-primary group-hover:bg-primary transition-all duration-300"></div>
                    <h4 className="font-body-lg font-semibold text-on-surface mb-3">Experience Virtually</h4>
                    <p className="font-body-md text-on-surface-variant leading-relaxed">Immerse yourself in spaces through high-fidelity imagery and authentic resident reviews before stepping foot inside.</p>
                  </div>
                  <div className="group relative pl-8 border-l border-outline-variant hover:border-primary transition-colors duration-300">
                    <div className="absolute w-3 h-3 bg-surface border-2 border-outline-variant rounded-full -left-[7px] top-2 group-hover:border-primary group-hover:bg-primary transition-all duration-300"></div>
                    <h4 className="font-body-lg font-semibold text-on-surface mb-3">Seamless Booking</h4>
                    <p className="font-body-md text-on-surface-variant leading-relaxed">Secure your sanctuary instantly with our frictionless digital token system. No paperwork, just peace of mind.</p>
                  </div>
                </div>
              </div>
              
              <div className="relative pl-0 md:pl-12 md:mt-32">
                <div className="flex items-center gap-4 mb-12">
                  <span className="font-display text-6xl text-secondary/20 italic">02</span>
                  <h3 className="font-display text-3xl text-on-surface">For Owners</h3>
                </div>
                <div className="space-y-12">
                  <div className="group relative pl-8 border-l border-outline-variant hover:border-secondary transition-colors duration-300">
                    <div className="absolute w-3 h-3 bg-surface border-2 border-outline-variant rounded-full -left-[7px] top-2 group-hover:border-secondary group-hover:bg-secondary transition-all duration-300"></div>
                    <h4 className="font-body-lg font-semibold text-on-surface mb-3">Showcase Elegance</h4>
                    <p className="font-body-md text-on-surface-variant leading-relaxed">Present your property to an exclusive audience of verified VIT students with our premium listing aesthetics.</p>
                  </div>
                  <div className="group relative pl-8 border-l border-outline-variant hover:border-secondary transition-colors duration-300">
                    <div className="absolute w-3 h-3 bg-surface border-2 border-outline-variant rounded-full -left-[7px] top-2 group-hover:border-secondary group-hover:bg-secondary transition-all duration-300"></div>
                    <h4 className="font-body-lg font-semibold text-on-surface mb-3">Intelligent Lead Management</h4>
                    <p className="font-body-md text-on-surface-variant leading-relaxed">Engage with highly qualified prospects through a sophisticated, centralized dashboard designed for conversion.</p>
                  </div>
                  <div className="group relative pl-8 border-l border-outline-variant hover:border-secondary transition-colors duration-300">
                    <div className="absolute w-3 h-3 bg-surface border-2 border-outline-variant rounded-full -left-[7px] top-2 group-hover:border-secondary group-hover:bg-secondary transition-all duration-300"></div>
                    <h4 className="font-body-lg font-semibold text-on-surface mb-3">Frictionless Finance</h4>
                    <p className="font-body-md text-on-surface-variant leading-relaxed">Choose your flow: automated professional settlements via Razorpay or instant, direct-to-owner payment pathway.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Minimal Footer */}
      <footer className="w-full bg-on-background text-surface py-20 px-margin-mobile md:px-gutter">
        <div className="max-w-container-max mx-auto flex flex-col md:flex-row justify-between gap-12">
          <div className="flex flex-col gap-6 max-w-sm">
            <div className="font-display text-4xl text-white">
              PG Genie.
            </div>
            <p className="font-body-md text-surface-variant/70 font-light">
              Elevating the standard of student living near VIT Bhopal. A digital concierge for modern accommodations.
            </p>
            <p className="font-body-md text-surface-variant/50 text-sm mt-4">
              © 2026 PG Genie. All rights reserved.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-12 md:gap-24">
            <div className="flex flex-col gap-4">
              <span className="font-label-sm uppercase tracking-widest text-surface-variant/40 mb-2">Platform</span>
              <Link className="font-body-md text-surface-variant hover:text-white transition-colors" href="/pgs">Curated Listings</Link>
              <Link className="font-body-md text-surface-variant hover:text-white transition-colors" href="/owner/dashboard">Owner Portal</Link>
              <Link className="font-body-md text-surface-variant hover:text-white transition-colors" href="#">About Kothri</Link>
            </div>
            <div className="flex flex-col gap-4">
              <span className="font-label-sm uppercase tracking-widest text-surface-variant/40 mb-2">Legal &amp; Help</span>
              <a className="font-body-md text-surface-variant hover:text-white transition-colors" href="#">Privacy Policy</a>
              <a className="font-body-md text-surface-variant hover:text-white transition-colors" href="#">Terms of Service</a>
              <a className="font-body-md text-surface-variant hover:text-white transition-colors" href="#">Concierge Support</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
