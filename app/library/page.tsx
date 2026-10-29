"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Play, Music, Search, Heart, MoreHorizontal } from "lucide-react";

interface Track {
  id: string;
  prompt: string;
  audioStorageKey: string;
  createdAt: string;
}

export default function LibraryPage() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLibrary = async () => {
      try {
        const res = await fetch("/api/library");
        if (res.ok) {
          const data = await res.json();
          setTracks(data);
        }
      } catch (err) {
        console.error("Failed to load library", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLibrary();
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-[#0B0C10] text-white selection:bg-[#8B5CF6]/30 relative">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto p-8 lg:p-12 relative scroll-smooth z-10">
        <div className="max-w-5xl mx-auto pb-24">
          
          {/* Header */}
          <div className="flex justify-between items-center mb-10">
            <div>
              <h1 className="text-3xl font-bold font-sora tracking-tight">Your Library</h1>
              <p className="text-gray-400 mt-1">All your generated masterpieces.</p>
            </div>
            <div className="relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Search tracks..." 
                className="bg-white/5 border border-white/10 rounded-full py-2.5 pl-12 pr-6 text-sm focus:outline-none focus:border-[#8B5CF6] transition-colors"
              />
            </div>
          </div>

          {isLoading ? (
             <div className="flex justify-center items-center h-64">
               <div className="w-12 h-12 border-4 border-[#8B5CF6] border-t-transparent rounded-full animate-spin"></div>
             </div>
          ) : tracks.length === 0 ? (
            <div className="text-center py-20 glass-panel rounded-3xl">
              <Music className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">No tracks yet</h2>
              <p className="text-gray-400">Head over to the Studio to generate your first track.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {tracks.map((track, i) => (
                <div key={track.id} className="flex items-center justify-between p-4 glass-panel rounded-xl hover:bg-white/5 transition-all cursor-pointer group border border-white/5 hover:border-[#8B5CF6]/30">
                  <div className="flex items-center gap-5 flex-1 min-w-0">
                    <button className="w-12 h-12 shrink-0 rounded-full bg-[#1F2937] group-hover:bg-gradient-to-r group-hover:from-[#8B5CF6] group-hover:to-[#EC4899] flex items-center justify-center transition-all duration-300 border border-white/10 group-hover:border-transparent group-hover:shadow-[0_0_15px_rgba(139,92,246,0.4)]">
                      <Play className="w-5 h-5 text-white ml-1" />
                    </button>
                    <div className="min-w-0">
                      <h4 className="font-bold text-white text-lg group-hover:text-[#A78BFA] transition-colors truncate">
                        {track.prompt.split(']')[1] || "Untitled Track"}
                      </h4>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {track.prompt.match(/\[Genre: (.*?)\]/)?.[1] || "Unknown Genre"} • {new Date(track.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6 shrink-0">
                    {/* Audio player for this specific track */}
                    <audio controls className="h-8 rounded-full w-48 lg:w-64" src={track.audioStorageKey}>
                      <source src={track.audioStorageKey} type="audio/mpeg" />
                    </audio>
                    <button className="text-gray-500 hover:text-[#EC4899] transition-colors"><Heart className="w-5 h-5" /></button>
                    <button className="text-gray-500 hover:text-white transition-colors"><MoreHorizontal className="w-5 h-5" /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}