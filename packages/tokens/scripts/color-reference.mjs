function parseEdsColorReference(value) {
  const match = value.match(/^color\(var\((--eds-[a-z-]+)\)\s*\/\s*([0-9.]+)\)$/);
  if (!match) {
    return null;
  }

  const [, varName, alphaRaw] = match;
  return { varName, edsKey: varName.slice(2), alpha: Number(alphaRaw) };
}

export function mapColorTokenValue(value) {
  const reference = parseEdsColorReference(value);
  if (!reference) {
    return value;
  }

  const { varName, alpha } = reference;

  if (alpha === 0) {
    return 'transparent';
  }

  if (alpha === 1) {
    return `var(${varName})`;
  }

  const percent = `${Math.round(alpha * 100)}%`;
  return `color-mix(in display-p3, var(${varName}) ${percent}, transparent)`;
}

function normalizeHex(hex) {
  return hex.replace('#', '').slice(0, 6).padStart(6, '0');
}

function toHexByte(value) {
  return Math.round(value).toString(16).padStart(2, '0');
}

/**
 * tag-palette.json · `ref:eds-same-black` | `ref:eds-base/0.05`
 * CSS：`var(--eds-*)` / `color(var(--eds-*) / α)`；RN：解析为 hex。
 */
export function resolveTagPaletteRef(raw, themeName, baseSpec) {
  if (typeof raw !== 'string' || !raw.startsWith('ref:')) {
    return { kind: 'hex', value: raw };
  }

  const body = raw.slice(4);
  const slash = body.indexOf('/');
  if (slash >= 0) {
    const edsKey = body.slice(0, slash);
    const alpha = body.slice(slash + 1);
    const css = `color(var(--${edsKey}) / ${alpha})`;
    return {
      kind: 'css',
      css,
      hex: resolveSemanticColorToHex(css, themeName, baseSpec),
    };
  }

  return {
    kind: 'css',
    css: `var(--${body})`,
    hex: resolveSemanticColorToHex(`color(var(--${body}) / 1)`, themeName, baseSpec),
  };
}

/** Resolve spec reference syntax to 6- or 8-digit hex for RN / JSON consumers. */
export function resolveSemanticColorToHex(value, themeName, baseSpec) {
  const reference = parseEdsColorReference(value);
  if (!reference) {
    return value;
  }

  const baseEntry = baseSpec[themeName]?.[reference.edsKey];
  const baseHex = typeof baseEntry === 'string' ? baseEntry : baseEntry?.hex;
  if (!baseHex) {
    return value;
  }

  const normalized = normalizeHex(baseHex);
  if (reference.alpha === 0) {
    return `#${normalized}00`;
  }

  if (reference.alpha === 1) {
    return `#${normalized}`;
  }

  const alphaByte = Math.round(reference.alpha * 255);
  return `#${normalized}${toHexByte(alphaByte)}`;
}
