"use client";

import { useState } from "react";
import { UserButton, Show, SignInButton } from "@clerk/nextjs";

type GenerationStatus = "QUEUED" | "PROCESSING" | "COMPLETED" | "FAILED";

interface Generation {
  id: string;
  status: GenerationStatus;
  prompt: string;
  audioStorageKey?: string;
  errorMessage?: string;
}

export default function StudioPage() {
  const [prompt, setPrompt] = useState("");
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
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) {
        const text = await res.text();
        let errorMessage = "Failed to start generation";
        try {
          const data = JSON.parse(text);
          errorMessage = data.error || errorMessage;
        } catch (e) {
          errorMessage = `Server error (${res.status})`;
        }
        throw new Error(errorMessage);
      }

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
        if (!res.ok) {
          if (res.status >= 500) {
             clearInterval(interval);
             setIsGenerating(false);
             setError("Server error while checking status.");
             return;
          }
          throw new Error("Failed to check status");
        }
        
        const text = await res.text();
        let data;
        try {
           data = JSON.parse(text);
        } catch (e) {
           clearInterval(interval);
           setIsGenerating(false);
           setError("Received invalid data from server.");
           return;
        }

        setGeneration(data);

        if (data.status === "COMPLETED") {
          clearInterval(interval);
          setIsGenerating(false);
        } else if (data.status === "FAILED") {
          clearInterval(interval);
          setIsGenerating(false);
          setError(data.errorMessage || "Generation failed.");
        }
      } catch (err) {
        clearInterval(interval);
        setIsGenerating(false);
        setError("Lost connection to the server.");
      }
    }, 2000);
  };

  return (
    <div className="max-w-2xl mx-auto p-8 mt-12 relative">
      <div className="absolute top-4 right-4">
        <Show when="signed-in">
          <UserButton />
        </Show>
        <Show when="signed-out">
          <SignInButton mode="modal" />
        </Show>
      </div>

      <h1 className="text-3xl font-bold mb-8">Klyraen Studio</h1>

      {error && (
        <div className="p-4 mb-6 bg-red-100 text-red-700 rounded-md border border-red-200">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <textarea
          className="w-full h-32 p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          placeholder="Describe your song (e.g., A neon cyberpunk track with heavy synth bass and female vocals...)"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          disabled={isGenerating}
        />

        <button
          onClick={handleGenerate}
          disabled={isGenerating || prompt.length < 10}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg disabled:opacity-50 transition-colors"
        >
          {isGenerating ? "Generating..." : "Generate Song"}
        </button>
      </div>

      {generation && (
        <div className="mt-12 p-6 border rounded-xl bg-gray-50">
          <h2 className="text-lg font-semibold mb-2">Generation Status</h2>
          <div className="flex items-center space-x-2 mb-4">
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
              generation.status === "COMPLETED" ? "bg-green-100 text-green-800" :
              generation.status === "FAILED" ? "bg-red-100 text-red-800" :
              "bg-yellow-100 text-yellow-800"
            }`}>
              {generation.status}
            </span>
          </div>

          {generation.status === "COMPLETED" && generation.audioStorageKey && (
            <div className="mt-4">
              <p className="text-sm text-gray-500 mb-2">Audio ready!</p>
              <audio controls className="w-full">
                <source src={`https://mock-audio-storage.klyraen.com/${generation.audioStorageKey}.mp3`} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            </div>
          )}
        </div>
      )}
    </div>
  );
}