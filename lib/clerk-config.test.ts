import { describe, expect, it } from 'vitest';
import { isValidClerkPublishableKey } from './clerk-config';

describe('isValidClerkPublishableKey', () => {
  it('accepts a real pk_test key', () => {
    // Decodes to "striking-manatee-61.clerk.accounts.dev$"
    expect(
      isValidClerkPublishableKey('pk_test_c3RyaWtpbmctbWFuYXRlZS02MS5jbGVyay5hY2NvdW50cy5kZXYk')
    ).toBe(true);
  });

  it('rejects placeholder keys', () => {
    expect(isValidClerkPublishableKey('pk_test_your_key_here')).toBe(false);
    expect(isValidClerkPublishableKey('pk_test_...')).toBe(false);
  });

  it('rejects keys without the pk_ prefix', () => {
    expect(isValidClerkPublishableKey('test_Y2xlcmsuYWNtZS5jb20k')).toBe(false);
  });

  it('rejects completely invalid strings', () => {
    expect(isValidClerkPublishableKey('not-a-key')).toBe(false);
    expect(isValidClerkPublishableKey('')).toBe(false);
  });
});