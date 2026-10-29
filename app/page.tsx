import Link from "next/link";
import { Zap, Sparkles, Headphones, Music, ArrowRight } from "lucide-react";
import { Show, SignInButton, UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0B0C10] text-white overflow-hidden selection:bg-[#8B5CF6]/30 relative">
      
      {/* THE GIRL WITH HEADPHONES WATERMARK */}
      <div 
        className="absolute inset-0 z-0 opacity-40 mix-blend-screen bg-cover bg-center bg-no-repeat"
        style={{ 
          // Swap this URL with '/girl-headphones.jpg' if you save the image in your public folder
          backgroundImage: "url('https://images.unsplash.com/photo-1614890089396-6c9e5c413111?q=80&w=2070&auto=format&fit=crop')" 
        }}
      />
      
      {/* Dark Gradient Overlay (makes text readable) */}
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-[#0B0C10] via-[#0B0C10]/80 to-transparent" />
      
      {/* Grid Background */}
      <div className="absolute inset-0 cyber-grid opacity-20 pointer-events-none z-0" />

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-[#0B0C10]/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Zap className="text-[#8B5CF6] w-8 h-8" />
            <span className="text-2xl font-bold font-sora tracking-widest text-white">KLYRAEN</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="#features" className="text-sm text-gray-400 hover:text-white transition-colors hidden md:block">Features</Link>
            
            <Show when="signed-in">
              <Link href="/studio" className="bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] hover:opacity-90 text-white px-5 py-2 rounded-full font-bold text-sm transition-all shadow-[0_0_20px_rgba(139,92,246,0.3)]">
                Enter Studio
              </Link>
              <UserButton />
            </Show>
            <Show when="signed-out">
              <SignInButton mode="modal">
                <button className="bg-white text-black px-5 py-2 rounded-full font-bold text-sm hover:bg-gray-200 transition-colors">
                  Sign In
                </button>
              </SignInButton>
            </Show>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative pt-48 pb-24 px-6 z-10">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-[#8B5CF6]" />
            <span className="text-sm font-medium text-gray-300">The future of music creation is here</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-bold font-sora tracking-tight mb-8 leading-tight drop-shadow-2xl">
            Create. Explore. <br/>
            <span className="text-neon-gradient drop-shadow-[0_0_30px_rgba(236,72,153,0.5)]">Evolve.</span>
          </h1>
          
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto drop-shadow-lg">
            Turn your ideas into powerful music with Klyraen's neural audio engine. Generate vocals, lyrics, and full arrangements in seconds.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Show when="signed-in">
              <Link href="/studio" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] hover:opacity-90 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-[0_0_30px_rgba(139,92,246,0.6)]">
                Start Creating <ArrowRight className="w-5 h-5" />
              </Link>
            </Show>
            <Show when="signed-out">
              <SignInButton mode="modal">
                <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] hover:opacity-90 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-[0_0_30px_rgba(139,92,246,0.6)]">
                  Start Creating <ArrowRight className="w-5 h-5" />
                </button>
              </SignInButton>
            </Show>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 text-center text-gray-500 relative z-10 bg-[#0B0C10]">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Zap className="w-5 h-5 text-[#8B5CF6]" />
          <span className="font-bold font-sora tracking-widest text-white">KLYRAEN</span>
        </div>
        <p>© 2026 Klyraen AI. All rights reserved.</p>
      </footer>
    </div>
  );
}