"use client";

import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Play, Sparkles, Music, ChevronRight, Zap, Headphones, Disc, Radio, Mic2, Heart, MoreHorizontal } from "lucide-react";

type GenerationStatus = "QUEUED" | "PROCESSING" | "COMPLETED" | "FAILED";

interface Generation {
  id: string;
  status: GenerationStatus;
  prompt: string;
  genre?: string;
  audioStorageKey?: string;
  errorMessage?: string;
}

const GENRES = [
  { name: "Drum & Bass", icon: Disc, color: "from-[#8B5CF6] to-[#06B6D4]" },
  { name: "Techno", icon: Radio, color: "from-[#EC4899] to-[#8B5CF6]" },
  { name: "House", icon: Music, color: "from-[#06B6D4] to-[#8B5CF6]" },
  { name: "Hip-Hop", icon: Mic2, color: "from-[#F59E0B] to-[#EC4899]" },
  { name: "Cinematic", icon: Sparkles, color: "from-[#8B5CF6] to-[#EC4899]" },
  { name: "Lo-Fi", icon: Headphones, color: "from-[#06B6D4] to-[#EC4899]" },
];

export default function StudioPage() {
  const [prompt, setPrompt] = useState("");
  const [genre, setGenre] = useState("Drum & Bass");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generation, setGeneration] = useState<Generation | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (prompt.length < 10) {
      setError("Prompt must be at least 10 characters.");
      return;
    }

    setIsGenerating(true);
    setError(null);
    setGeneration(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, genre }),
      });

      if (!res.ok) throw new Error("Failed to start generation");
      const newGeneration = await res.json();
      setGeneration(newGeneration);
      pollGenerationStatus(newGeneration.id);
      
    } catch (err: any) {
      setError(err.message);
      setIsGenerating(false);
    }
  };

  const pollGenerationStatus = async (id: string) => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/generations/${id}`);
        if (!res.ok) return;
        const data = await res.json();
        setGeneration(data);

        if (data.status === "COMPLETED" || data.status === "FAILED") {
          clearInterval(interval);
          setIsGenerating(false);
        }
      } catch (err) {}
    }, 2000);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#0B0C10] text-white selection:bg-[#8B5CF6]/30 relative">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto p-8 lg:p-12 relative scroll-smooth z-10">
        <div className="max-w-5xl mx-auto pb-24">
          
          {/* Header */}
          <div className="flex justify-between items-center mb-10">
            <div>
              <h1 className="text-3xl font-bold font-sora tracking-tight">Welcome back, Creator.</h1>
              <p className="text-gray-400 mt-1">What are we producing today?</p>
            </div>
            <div className="flex items-center gap-3 bg-white/5 px-5 py-2.5 rounded-full border border-white/10 hover:border-[#8B5CF6]/50 transition-colors cursor-pointer shadow-[0_0_15px_rgba(139,92,246,0.1)]">
              <span className="text-yellow-500 text-xl">🪙</span>
              <span className="font-bold font-sora">1,240</span>
            </div>
          </div>

          {/* Cyberpunk Hero Section WITH WATERMARK */}
          <div className="relative w-full h-[300px] rounded-3xl overflow-hidden mb-8 border border-white/10 bg-[#111827] flex items-center justify-between p-10 shadow-[0_0_40px_rgba(139,92,246,0.15)] group">
            
            {/* THE GIRL WITH HEADPHONES WATERMARK */}
            <div 
              className="absolute inset-0 z-0 opacity-40 mix-blend-screen bg-cover bg-[center_top_20%] bg-no-repeat"
              style={{ 
                // Swap this URL with '/girl-headphones.jpg' if you save the image in your public folder
                backgroundImage: "url('https://images.unsplash.com/photo-1614890089396-6c9e5c413111?q=80&w=2070&auto=format&fit=crop')" 
              }}
            />
            
            {/* Dark Gradient Overlay */}
            <div className="absolute inset-0 z-0 bg-gradient-to-r from-[#0B0C10] via-[#0B0C10]/80 to-transparent"></div>
            <div className="absolute inset-0 cyber-grid opacity-30 z-0"></div>

            <div className="relative z-10 max-w-lg">
              <div className="flex items-center gap-2 mb-4">
                <span className="px-3 py-1 rounded-full bg-[#8B5CF6]/20 text-[#A78BFA] text-xs font-bold tracking-wider uppercase border border-[#8B5CF6]/30 shadow-[0_0_10px_rgba(139,92,246,0.3)]">AI Powered</span>
                <span className="px-3 py-1 rounded-full bg-[#EC4899]/20 text-[#F472B6] text-xs font-bold tracking-wider uppercase border border-[#EC4899]/30 shadow-[0_0_10px_rgba(236,72,153,0.3)]">Studio Quality</span>
              </div>
              <h2 className="text-5xl font-bold font-sora mb-4 text-white leading-tight drop-shadow-lg">
                Create. Explore. <br/><span className="text-neon-gradient">Evolve.</span>
              </h2>
              <p className="text-gray-300 text-sm md:text-base mb-6 max-w-sm drop-shadow-md">
                Turn your ideas into powerful music with Klyraen's neural audio engine.
              </p>
            </div>

            {/* The Coded Visualizer Graphic */}
            <div className="relative z-10 hidden md:flex items-center gap-8 mr-4">
              <div className="flex items-end gap-1.5 h-24">
                {[30, 60, 100, 40, 80, 50, 90, 20, 70, 45, 85].map((h, i) => (
                  <div key={i} className="waveform-bar" style={{ height: `${h}%`, animationDelay: `${i * 100}ms` }} />
                ))}
              </div>
              <div className="neon-ring">
                <div className="neon-ring-inner">
                  <Headphones className="w-10 h-10 text-white animate-pulse" />
                </div>
              </div>
            </div>
          </div>

          {/* Creation Card */}
          <div className="glass-panel p-6 md:p-8 rounded-3xl mb-12 relative overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.5)]">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-[#8B5CF6]/10 blur-[80px] pointer-events-none" />

            <p className="text-gray-300 mb-4 font-medium flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#8B5CF6]" /> Describe the music you imagine
            </p>
            
            <div className="relative">
              <textarea
                className="w-full bg-[#0B0C10]/80 h-32 p-5 rounded-2xl text-white placeholder-gray-600 border border-white/10 focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6] outline-none transition-all resize-none shadow-inner text-lg"
                placeholder="A heavy Drum & Bass track with a dark garage bassline and aggressive vocals..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                disabled={isGenerating}
              />
              <button
                onClick={handleGenerate}
                disabled={isGenerating || prompt.length < 10}
                className="absolute bottom-4 right-4 bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] hover:opacity-90 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all disabled:opacity-50 shadow-[0_0_20px_rgba(139,92,246,0.4)]"
              >
                {isGenerating ? (
                  <span className="animate-pulse">Generating...</span>
                ) : (
                  <>
                    <Zap className="w-4 h-4" /> Generate
                  </>
                )}
              </button>
            </div>

            {/* Coded Genre Selector */}
            <div className="mt-8">
              <p className="text-sm text-gray-400 mb-4 font-medium">Choose a style</p>
              <div className="flex flex-wrap gap-3">
                {GENRES.map((g) => (
                  <button
                    key={g.name}
                    onClick={() => setGenre(g.name)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all border ${
                      genre === g.name 
                        ? `bg-gradient-to-r ${g.color} text-white border-transparent shadow-[0_0_20px_rgba(139,92,246,0.3)] scale-105` 
                        : "bg-white/5 text-gray-400 border-white/10 hover:bg-white/10 hover:text-white hover:border-white/20"
                    }`}
                  >
                    <g.icon className={`w-4 h-4 ${genre === g.name ? 'text-white' : 'text-gray-500'}`} />
                    {g.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {error && (
            <div className="p-4 mb-6 bg-red-900/30 text-red-400 border border-red-500/50 rounded-xl flex items-center gap-3">
              <Zap className="w-5 h-5" />
              {error}
            </div>
          )}

          {/* Recent Creations */}
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold font-sora">Recent Creations</h2>
              <button className="text-sm text-[#8B5CF6] hover:text-[#A78BFA] font-medium transition-colors">View all</button>
            </div>
            
            {generation && (
              <div className="glass-panel p-5 rounded-2xl mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-l-4 border-l-[#EC4899] shadow-[0_0_30px_rgba(236,72,153,0.15)] relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-[#EC4899]/5 to-transparent pointer-events-none"></div>
                <div className="flex items-center gap-4 relative z-10 w-full md:w-auto">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#8B5CF6] to-[#EC4899] flex items-center justify-center shadow-lg shrink-0">
                    <Music className="text-white w-7 h-7" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-lg text-white mb-0.5">{genre} Generation</h3>
                    <p className="text-sm text-gray-400 truncate">{prompt}</p>
                  </div>
                </div>
                
                <div className="relative z-10 w-full md:w-auto flex items-center gap-4">
                  <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                    generation.status === "COMPLETED" ? "bg-green-500/20 text-green-400 border border-green-500/30 shadow-[0_0_10px_rgba(34,197,94,0.2)]" :
                    generation.status === "FAILED" ? "bg-red-500/20 text-red-400 border border-red-500/30" :
                    "bg-[#8B5CF6]/20 text-[#A78BFA] border border-[#8B5CF6]/30 animate-pulse"
                  }`}>
                    {generation.status}
                  </span>

                  {generation.status === "COMPLETED" && generation.audioStorageKey && (
                    <audio controls className="h-10 rounded-full w-full md:w-64" autoPlay>
                      <source src={generation.audioStorageKey} type="audio/mpeg" />
                    </audio>
                  )}
                </div>
              </div>
            )}

            {/* Mock Past Creations - Styled like the mockup audio player */}
            <div className="space-y-3">
              {[
                { title: "Neon Rush", genre: "Drum & Bass", bpm: "174 BPM", length: "3:28" },
                { title: "Cosmic Waves", genre: "Trance", bpm: "138 BPM", length: "4:15" },
                { title: "Midnight Drive", genre: "Synthwave", bpm: "110 BPM", length: "3:45" }
              ].map((track, i) => (
                <div key={i} className="flex items-center justify-between p-4 glass-panel rounded-xl hover:bg-white/5 transition-all cursor-pointer group">
                  <div className="flex items-center gap-5">
                    <button className="w-12 h-12 rounded-full bg-[#1F2937] group-hover:bg-gradient-to-r group-hover:from-[#8B5CF6] group-hover:to-[#EC4899] flex items-center justify-center transition-all duration-300 border border-white/10 group-hover:border-transparent group-hover:shadow-[0_0_15px_rgba(139,92,246,0.4)]">
                      <Play className="w-5 h-5 text-white ml-1" />
                    </button>
                    <div>
                      <h4 className="font-bold text-white text-lg group-hover:text-[#A78BFA] transition-colors">{track.title}</h4>
                      <p className="text-xs text-gray-400 mt-0.5">{track.genre} • {track.bpm}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="hidden sm:flex items-end gap-1 h-8 opacity-40 group-hover:opacity-100 transition-opacity">
                      {[40, 70, 100, 60, 30, 80, 50, 90, 40, 60, 20, 50, 80, 30, 60].map((h, j) => (
                        <div key={j} className="w-1 bg-gradient-to-t from-[#8B5CF6] to-[#EC4899] rounded-t-sm" style={{ height: `${h}%` }} />
                      ))}
                    </div>
                    <span className="text-xs text-gray-500">{track.length}</span>
                    <button className="text-gray-500 hover:text-white transition-colors"><Heart className="w-5 h-5" /></button>
                    <button className="text-gray-500 hover:text-white transition-colors"><MoreHorizontal className="w-5 h-5" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}