import bcrypt from 'bcrypt';

// Compare a plain password with stored hash.
// If the stored value looks like a bcrypt hash (starts with $2), use bcrypt.compare.
// Otherwise (development convenience) fall back to plain equality so existing
// plaintext test users continue to work. REMOVE the fallback in production.
export const comparePassword = async (plain: string, hash: string): Promise<boolean> => {
  if (!hash) return false;
  try {
    if (typeof hash === 'string' && hash.startsWith('$2')) {
      return await bcrypt.compare(plain, hash);
    }
  } catch (e) {
    // if bcrypt fails for any reason, fall through to plain compare
  }
  // Development fallback — NOT SECURE for production
  return plain === hash;
};
