type Rgb = { r: number; g: number; b: number; a: number };

function formatAlpha(alpha: number) {
  const rounded = Math.round(alpha * 1000) / 1000;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(3).replace(/0+$/, '').replace(/\.$/, '');
}

export function parseHexColor(hex: string): Rgb | null {
  const normalized = hex.replace('#', '');
  if (normalized.length !== 6 && normalized.length !== 8) {
    return null;
  }

  return {
    r: Number.parseInt(normalized.slice(0, 2), 16),
    g: Number.parseInt(normalized.slice(2, 4), 16),
    b: Number.parseInt(normalized.slice(4, 6), 16),
    a: normalized.length === 8 ? Number.parseInt(normalized.slice(6, 8), 16) / 255 : 1,
  };
}

export function formatRgba({ r, g, b, a }: Rgb) {
  return `rgba(${r}, ${g}, ${b}, ${formatAlpha(a)})`;
}

/** RN `backgroundColor` / `borderColor` — 8 位 hex → rgba。 */
export function rnColorFromHex(hex: string): string {
  const parsed = parseHexColor(hex);
  if (!parsed) {
    return hex;
  }
  return formatRgba(parsed);
}
