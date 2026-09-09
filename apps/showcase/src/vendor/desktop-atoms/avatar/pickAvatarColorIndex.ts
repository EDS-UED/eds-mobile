import { AVATAR_NATIVE_PALETTE_SIZE } from './avatarPalette';

function hashSeed(seed: string): number {
  let hash = 0;
  for (let index = 0; index < seed.length; index += 1) {
    hash = (hash * 31 + seed.charCodeAt(index)) >>> 0;
  }
  return hash;
}

export function pickAvatarColorIndex(options: {
  seed?: string;
  colorIndex?: number;
  random?: boolean;
}): number {
  if (typeof options.colorIndex === 'number' && Number.isFinite(options.colorIndex)) {
    const normalized = Math.trunc(options.colorIndex);
    return ((normalized % AVATAR_NATIVE_PALETTE_SIZE) + AVATAR_NATIVE_PALETTE_SIZE) % AVATAR_NATIVE_PALETTE_SIZE;
  }

  if (options.random) {
    return Math.floor(Math.random() * AVATAR_NATIVE_PALETTE_SIZE);
  }

  const seed = options.seed?.trim() || 'N';
  return hashSeed(seed) % AVATAR_NATIVE_PALETTE_SIZE;
}
