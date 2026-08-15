export type GenerationRequest = {
  prompt: string;
  durationSeconds?: number;
};

export type GenerationResult = {
  audio: Uint8Array;
  contentType: string;
  model: string;
  providerCostCredits?: number;
};

export async function generateWithStableAudio({
  prompt,
  durationSeconds = 30,
}: GenerationRequest): Promise<GenerationResult> {
  const apiKey = process.env.STABILITY_API_KEY;
  const endpoint = process.env.STABILITY_API_URL;

  if (!apiKey || !endpoint) {
    throw new Error("Stable Audio provider configuration is incomplete.");
  }

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      Accept: "audio/mpeg",
    },
    body: JSON.stringify({ prompt, duration_seconds: durationSeconds }),
    signal: AbortSignal.timeout(Number(process.env.MUSIC_GENERATION_TIMEOUT_MS ?? 300000)),
  });

  if (!response.ok) {
    throw new Error(`Stable Audio request failed with status ${response.status}.`);
  }

  return {
    audio: new Uint8Array(await response.arrayBuffer()),
    contentType: response.headers.get("content-type") ?? "audio/mpeg",
    model: process.env.STABILITY_MODEL ?? "stable-audio",
  };
}
