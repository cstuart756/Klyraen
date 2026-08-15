"use client";

import { FormEvent, useEffect, useState } from "react";

type Generation = {
  id: string;
  prompt: string;
  status: "QUEUED" | "PROCESSING" | "COMPLETED" | "FAILED";
  errorMessage?: string | null;
};

const demoMode = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

export default function StudioPage() {
  const [prompt, setPrompt] = useState("");
  const [generation, setGeneration] = useState<Generation | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!generation || demoMode || generation.status === "COMPLETED" || generation.status === "FAILED") {
      return;
    }

    const poll = window.setInterval(async () => {
      const response = await fetch(`/api/generations/${generation.id}`);
      if (response.ok) {
        const data = await response.json();
        setGeneration(data.generation);
      }
    }, 2500);

    return () => window.clearInterval(poll);
  }, [generation]);

  async function createGeneration(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleanPrompt = prompt.trim();
    if (cleanPrompt.length < 3) {
      setError("Give your track a little more direction.");
      return;
    }

    setError("");
    setIsSubmitting(true);

    if (demoMode) {
      const demoGeneration = {
        id: `demo-${Date.now()}`,
        prompt: cleanPrompt,
        status: "PROCESSING" as const,
      };
      setGeneration(demoGeneration);
      window.setTimeout(() => {
        setGeneration({ ...demoGeneration, status: "COMPLETED" });
        setIsSubmitting(false);
      }, 1800);
      return;
    }

    const response = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: cleanPrompt }),
    });
    const data = await response.json();
    setIsSubmitting(false);

    if (!response.ok) {
      setError(data.error ?? "The studio could not queue that track.");
      return;
    }

    setGeneration({ id: data.generationId, prompt: cleanPrompt, status: data.status });
  }

  function playDemoPreview() {
    const AudioContextClass = window.AudioContext ??
      (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass || isPreviewing) {
      return;
    }

    const context = new AudioContextClass();
    const now = context.currentTime;
    [220, 277.18, 329.63, 440].forEach((frequency, index) => {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = "sine";
      oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(0, now + index * 0.12);
      gain.gain.linearRampToValueAtTime(0.08, now + index * 0.12 + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 2.2);
      oscillator.connect(gain).connect(context.destination);
      oscillator.start(now + index * 0.12);
      oscillator.stop(now + 2.3);
    });
    setIsPreviewing(true);
    window.setTimeout(() => {
      setIsPreviewing(false);
      void context.close();
    }, 2400);
  }

  return (
    <main className="studio-shell">
      <div className="beta-kicker">KLYRAEN / STUDIO</div>
      <div className="studio-layout">
        <section className="studio-card studio-create-card">
          <p className="eyebrow">Create / 01</p>
          <h1>Give the feeling a shape.</h1>
          <form onSubmit={createGeneration}>
            <label htmlFor="prompt">What should we make?</label>
            <textarea
              id="prompt"
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              placeholder="A late-night electronic track with glassy percussion and a warm, rising chorus..."
              maxLength={2000}
              rows={6}
            />
            <div className="prompt-footer">
              <span>{prompt.length}/2000</span>
              <button className="primary-action" type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Preparing..." : "Generate track ->"}
              </button>
            </div>
          </form>
          {error && <p className="form-error">{error}</p>}
        </section>

        <aside className="studio-card result-card">
          <p className="eyebrow">Result / 02</p>
          {!generation && (
            <div className="empty-result">
              <span className="result-mark">+</span>
              <p>Your first result will appear here.</p>
            </div>
          )}
          {generation && (
            <div className="generation-result">
              {generation.status === "COMPLETED" && demoMode ? (
                <button
                  className="status-chip status-completed status-button"
                  type="button"
                  onClick={playDemoPreview}
                >
                  {isPreviewing ? "Playing preview" : "Ready to listen"}
                </button>
              ) : (
                <div className={`status-chip status-${generation.status.toLowerCase()}`}>
                  {generation.status === "COMPLETED" ? "Ready to listen" : generation.status.toLowerCase()}
                </div>
              )}
              <h2>{generation.prompt}</h2>
              {generation.status === "PROCESSING" && <div className="progress-line" />}
              {generation.status === "COMPLETED" && (
                demoMode ? (
                  <div className="demo-audio">Demo preview ready when provider is connected.</div>
                ) : (
                  <audio controls src={`/api/generations/${generation.id}/audio`} />
                )
              )}
              {generation.status === "FAILED" && <p className="form-error">{generation.errorMessage}</p>}
            </div>
          )}
        </aside>
      </div>
    </main>
  );
}
