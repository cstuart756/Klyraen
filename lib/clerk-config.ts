export function isValidClerkPublishableKey(value: string | undefined) {
  const key = (value ?? "").trim();

  if (!key) {
    return false;
  }

  // Clerk publishable keys are ALWAYS pk_test_... or pk_live_... . No bare test_/live_.
  // This regex requires the pk_ prefix. (Fixed from the original)
  const prefixMatch = key.match(/^pk_(test|live)_/i);
  if (!prefixMatch) {
    return false;
  }

  const encoded = key.slice(prefixMatch[0].length);
  if (!encoded || !/^[A-Za-z0-9_-]+$/.test(encoded)) {
    return false;
  }

  try {
    const normalized = encoded.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
    const decoded =
      typeof globalThis.atob === "function"
        ? globalThis.atob(padded)
        : typeof Buffer !== "undefined"
          ? Buffer.from(padded, "base64").toString("utf-8")
          : "";

    // A real Clerk key decodes to "<frontend-api-hostname>$".
    if (!decoded.endsWith("$")) return false;

    const host = decoded.slice(0, -1);

    // Reject empty, embedded "$", missing dots, and obvious placeholder hosts.
    if (!host || host.includes("$") || !host.includes(".")) return false;
    if (/(^|\.)(example|placeholder|your-domain)\./i.test(host)) return false;

    return true;
  } catch {
    return false;
  }
}