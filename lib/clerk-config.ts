export function isValidClerkPublishableKey(value: string | undefined) {
  return /^(?!.*(?:your|example|placeholder|replace|\.\.\.))pk_(test|live)_[A-Za-z0-9_-]{40,}$/.test(value ?? "");
}