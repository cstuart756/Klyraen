"use client";

import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Check, Zap, Sparkles } from "lucide-react";

export default function PricingPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleUpgrade = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", { method: "POST" });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#0B0C10] text-white selection:bg-[#8B5CF6]/30 relative">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto p-8 lg:p-12 relative scroll-smooth z-10">
        <div className="max-w-4xl mx-auto pb-24 text-center">
          
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8">
            <Sparkles className="w-4 h-4 text-[#8B5CF6]" />
            <span className="text-sm font-medium text-gray-300">Unlock your full creative potential</span>
          </div>

          <h1 className="text-5xl font-bold font-sora mb-6">Upgrade to Pro</h1>
          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
            Get more credits, priority processing, and commercial licensing for all your tracks.
          </p>

          <div className="grid md:grid-cols-2 gap-8 text-left max-w-3xl mx-auto">
            
            {/* Free Tier */}
            <div className="glass-panel p-8 rounded-3xl relative">
              <h2 className="text-2xl font-bold mb-2">Free</h2>
              <p className="text-gray-400 mb-6">Perfect for trying out Klyraen.</p>
              <p className="text-4xl font-bold mb-8">$0<span className="text-lg text-gray-400 font-normal">/mo</span></p>
              
              <ul className="space-y-4 mb-8">
                {["100 Credits", "Standard generation speed", "Personal use license", "MP3 downloads"].map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-gray-300">
                    <Check className="w-5 h-5 text-gray-500" /> {feature}
                  </li>
                ))}
              </ul>
              <button disabled className="w-full py-3 rounded-xl bg-white/5 text-gray-400 font-bold border border-white/10 cursor-not-allowed">
                Current Plan
              </button>
            </div>

            {/* Pro Tier */}
            <div className="glass-panel p-8 rounded-3xl relative overflow-hidden border-[#8B5CF6]/50 shadow-[0_0_40px_rgba(139,92,246,0.15)]">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#8B5CF6]/20 blur-[50px]" />
              <div className="absolute top-4 right-4 bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] text-white text-xs font-bold px-3 py-1 rounded-full">POPULAR</div>
              
              <h2 className="text-2xl font-bold mb-2 text-[#A78BFA]">Pro</h2>
              <p className="text-gray-400 mb-6">For serious creators and artists.</p>
              <p className="text-4xl font-bold mb-8">$19<span className="text-lg text-gray-400 font-normal">/mo</span></p>
              
              <ul className="space-y-4 mb-8">
                {["5,000 Credits / month", "Priority generation queue", "Commercial license", "WAV + MP3 downloads", "Stem separation"].map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-white">
                    <Check className="w-5 h-5 text-[#8B5CF6]" /> {feature}
                  </li>
                ))}
              </ul>
              <button 
                onClick={handleUpgrade}
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] text-white font-bold transition-all hover:opacity-90 shadow-[0_0_20px_rgba(139,92,246,0.4)] flex items-center justify-center gap-2"
              >
                {isLoading ? "Loading..." : <><Zap className="w-4 h-4" /> Upgrade Now</>}
              </button>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}