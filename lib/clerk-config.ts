export function isValidClerkPublishableKey(value: string | undefined) {
  const key = (value ?? "").trim();

  if (!key || /(?:your|example|placeholder|replace|\.\.\.)/i.test(key)) {
    return false;
  }

  const prefixMatch = key.match(/^((?:pk_)?(?:test|live))_/i);
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
          ? Buffer.from(padded, "base64").toString("binary")
          : "";

    return decoded.endsWith("$") && decoded.includes(".") && !decoded.slice(0, -1).includes("$");
  } catch {
    return false;
  }
}
