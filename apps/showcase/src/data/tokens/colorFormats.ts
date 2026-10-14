type Rgb = { r: number; g: number; b: number; a: number };

export type ColorFormats = {
  displayP3: string;
  rgb: string;
  rgba: string;
};

function formatAlpha(alpha: number) {
  const rounded = Math.round(alpha * 1000) / 1000;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(3).replace(/0+$/, '').replace(/\.$/, '');
}

function formatDisplayP3Component(value: number) {
  return Number(value.toFixed(4)).toString();
}

export function formatDisplayP3(components: [number, number, number], alpha = 1) {
  if (alpha === 0) {
    return 'transparent';
  }

  const [r, g, b] = components.map(formatDisplayP3Component);
  if (alpha === 1) {
    return `color(display-p3 ${r} ${g} ${b})`;
  }

  return `color(display-p3 ${r} ${g} ${b} / ${formatAlpha(alpha)})`;
}

export function parseHexColor(hex: string): Rgb | null {
  const normalized = hex.replace('#', '');
  if (normalized.length !== 6 && normalized.length !== 8) {
    return null;
  }

  return {
    r: parseInt(normalized.slice(0, 2), 16),
    g: parseInt(normalized.slice(2, 4), 16),
    b: parseInt(normalized.slice(4, 6), 16),
    a: normalized.length === 8 ? parseInt(normalized.slice(6, 8), 16) / 255 : 1,
  };
}

export function formatRgb({ r, g, b }: Pick<Rgb, 'r' | 'g' | 'b'>) {
  return `rgb(${r}, ${g}, ${b})`;
}

export function formatRgba({ r, g, b, a }: Rgb) {
  return `rgba(${r}, ${g}, ${b}, ${formatAlpha(a)})`;
}

export function buildBaseColorFormats(displayP3: [number, number, number], hex: string): ColorFormats {
  const rgb = parseHexColor(hex);
  if (!rgb) {
    return { displayP3: hex, rgb: hex, rgba: hex };
  }

  return {
    displayP3: formatDisplayP3(displayP3, 1),
    rgb: formatRgb(rgb),
    rgba: formatRgba({ ...rgb, a: 1 }),
  };
}

/** Map spec `color(var(--eds-*) / α)` to dist semantic.css reference syntax. */
/** Semantic list row — `var(--eds-*)`, `transparent`, or `var(--eds-*) NN%` (from color-mix). */
export function formatColorSemanticListReference(reference: string): string | undefined {
  const trimmed = reference.trim();

  if (trimmed === 'transparent') {
    return trimmed;
  }

  if (/^var\(--eds-[a-z0-9-]+\)$/.test(trimmed)) {
    return trimmed;
  }

  const colorMix = trimmed.match(
    /^color-mix\(in display-p3,\s*var\((--eds-[a-z0-9-]+)\)\s+(\d+)%/,
  );
  if (colorMix) {
    return `var(${colorMix[1]}) ${colorMix[2]}%`;
  }

  const specAlpha = trimmed.match(/^color\(var\((--eds-[a-z0-9-]+)\)\s*\/\s*([0-9.]+)\)$/);
  if (specAlpha) {
    const alpha = Number(specAlpha[2]);
    if (alpha === 0) {
      return 'transparent';
    }
    if (alpha === 1) {
      return `var(${specAlpha[1]})`;
    }
    return `var(${specAlpha[1]}) ${Math.round(alpha * 100)}%`;
  }

  return undefined;
}

/** Native semantic list — opacity only (`100%`, `5%`, `0%`). */
export function formatColorSemanticOpacityPercent(reference: string | undefined): string | undefined {
  if (!reference?.trim()) {
    return undefined;
  }

  const trimmed = reference.trim();
  if (trimmed === 'transparent') {
    return '0%';
  }

  const specAlpha = trimmed.match(/^color\(var\((--eds-[a-z0-9-]+)\)\s*\/\s*([0-9.]+)\)$/);
  if (specAlpha) {
    const alpha = Number(specAlpha[2]);
    return `${Math.round(alpha * 100)}%`;
  }

  const listRef = formatColorSemanticListReference(trimmed);
  if (!listRef) {
    return undefined;
  }

  if (listRef === 'transparent') {
    return '0%';
  }

  const mixed = listRef.match(/^var\(--eds-[a-z0-9-]+\)\s+(\d+)%$/);
  if (mixed) {
    return `${mixed[1]}%`;
  }

  if (/^var\(--eds-[a-z0-9-]+\)$/.test(listRef)) {
    return '100%';
  }

  return undefined;
}

export function mapSemanticCssReference(value: string) {
  const match = value.match(/^color\(var\((--eds-[a-z-]+)\)\s*\/\s*([0-9.]+)\)$/);
  if (!match) {
    return value;
  }

  const [, varName, alphaRaw] = match;
  const alpha = Number(alphaRaw);

  if (alpha === 0) {
    return 'transparent';
  }

  if (alpha === 1) {
    return `var(${varName})`;
  }

  const percent = `${Math.round(alpha * 100)}%`;
  return `color-mix(in display-p3, var(${varName}) ${percent}, transparent)`;
}

export function buildSemanticColorFormats(
  displayP3: [number, number, number],
  hex: string,
  alpha: number,
): ColorFormats {
  const rgb = parseHexColor(hex);
  if (!rgb) {
    return { displayP3: hex, rgb: hex, rgba: hex };
  }

  return {
    displayP3: formatDisplayP3(displayP3, alpha),
    rgb: formatRgb(rgb),
    rgba: formatRgba({ ...rgb, a: alpha }),
  };
}
