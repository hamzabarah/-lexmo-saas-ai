import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import AvisClients from "./components/AvisClients";
import Phases from "./components/Phases";
import Bonus from "./components/Bonus";
import WhoIsThisFor from "./components/WhoIsThisFor";
import Pricing from "./components/Pricing";
import FAQ from "./components/FAQ";
import Footer from "./components/Footer";
import FloatingCTA from "./components/FloatingCTA";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#030712] text-white font-cairo">
      <Navbar />
      <Hero />
      <AvisClients />
      <Phases />
      <Bonus />
      <WhoIsThisFor />
      <Pricing />
      <FAQ />
      <Footer />

      {/* Floating CTA - appears on scroll */}
      <FloatingCTA />

      {/* Sticky Mobile CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#030712]/80 backdrop-blur-lg border-t border-white/10 md:hidden z-50">
        <button
          onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
          className="w-full bg-gradient-to-r from-[#00d2ff] to-[#9d50bb] text-white py-3 rounded-full font-bold shadow-[0_0_20px_rgba(0,210,255,0.3)] animate-pulse"
        >
          احجز مكانك الآن
        </button>
      </div>
    </main>
  );
}
