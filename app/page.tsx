import Link from "next/link";
import { Zap, Sparkles, Headphones, Music, ArrowRight } from "lucide-react";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0B0C10] text-white overflow-hidden selection:bg-[#8B5CF6]/30">
      
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-[#0B0C10]/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Zap className="text-[#8B5CF6] w-8 h-8" />
            <span className="text-2xl font-bold font-sora tracking-widest text-white">KLYRAEN</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="#features" className="text-sm text-gray-400 hover:text-white transition-colors hidden md:block">Features</Link>
            <Link href="#pricing" className="text-sm text-gray-400 hover:text-white transition-colors hidden md:block">Pricing</Link>
            
            <SignedIn>
              <Link href="/studio" className="bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] hover:opacity-90 text-white px-5 py-2 rounded-full font-bold text-sm transition-all shadow-[0_0_20px_rgba(139,92,246,0.3)]">
                Enter Studio
              </Link>
              <UserButton />
            </SignedIn>
            <SignedOut>
              <SignInButton mode="modal">
                <button className="bg-white text-black px-5 py-2 rounded-full font-bold text-sm hover:bg-gray-200 transition-colors">
                  Sign In
                </button>
              </SignInButton>
            </SignedOut>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative pt-40 pb-24 px-6">
        {/* Glow Effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#8B5CF6]/20 blur-[150px] rounded-full pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8">
            <Sparkles className="w-4 h-4 text-[#8B5CF6]" />
            <span className="text-sm font-medium text-gray-300">The future of music creation is here</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-bold font-sora tracking-tight mb-8 leading-tight">
            Create. Explore. <br/>
            <span className="text-neon-gradient">Evolve.</span>
          </h1>
          
          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
            Turn your ideas into powerful music with Klyraen's neural audio engine. Generate vocals, lyrics, and full arrangements in seconds.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <SignedIn>
              <Link href="/studio" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] hover:opacity-90 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-[0_0_30px_rgba(139,92,246,0.4)]">
                Start Creating <ArrowRight className="w-5 h-5" />
              </Link>
            </SignedIn>
            <SignedOut>
              <SignInButton mode="modal">
                <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] hover:opacity-90 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-[0_0_30px_rgba(139,92,246,0.4)]">
                  Start Creating <ArrowRight className="w-5 h-5" />
                </button>
              </SignInButton>
            </SignedOut>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section id="features" className="py-24 px-6 relative z-10 border-t border-white/5 bg-[#0B0C10]/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold font-sora text-center mb-16">Everything you need to produce</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="glass-panel p-8 rounded-3xl hover:bg-white/5 transition-colors">
              <div className="w-14 h-14 rounded-2xl bg-[#8B5CF6]/20 flex items-center justify-center mb-6">
                <Music className="w-7 h-7 text-[#8B5CF6]" />
              </div>
              <h3 className="text-xl font-bold mb-3">Any Genre, Any Style</h3>
              <p className="text-gray-400">From Hip-Hop and Drum & Bass to Cinematic scores. Our AI understands your prompt and delivers studio-quality tracks.</p>
            </div>

            <div className="glass-panel p-8 rounded-3xl hover:bg-white/5 transition-colors">
              <div className="w-14 h-14 rounded-2xl bg-[#EC4899]/20 flex items-center justify-center mb-6">
                <Headphones className="w-7 h-7 text-[#EC4899]" />
              </div>
              <h3 className="text-xl font-bold mb-3">Vocals & Lyrics</h3>
              <p className="text-gray-400">Not just instrumentals. Klyraen generates complete songs with singing vocals and coherent, emotionally resonant lyrics.</p>
            </div>

            <div className="glass-panel p-8 rounded-3xl hover:bg-white/5 transition-colors">
              <div className="w-14 h-14 rounded-2xl bg-[#06B6D4]/20 flex items-center justify-center mb-6">
                <Zap className="w-7 h-7 text-[#06B6D4]" />
              </div>
              <h3 className="text-xl font-bold mb-3">Lightning Fast</h3>
              <p className="text-gray-400">Our asynchronous generation engine delivers full tracks in seconds. No complex DAWs, no steep learning curve.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 text-center text-gray-500 relative z-10">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Zap className="w-5 h-5 text-[#8B5CF6]" />
          <span className="font-bold font-sora tracking-widest text-white">KLYRAEN</span>
        </div>
        <p>© 2026 Klyraen AI. All rights reserved.</p>
      </footer>
    </div>
  );
}