import manifest from './generated/distCssManifest.json';

function cssValueLine(value: string) {
  const trimmed = value.trim();
  return trimmed.endsWith(';') ? trimmed : `${trimmed};`;
}

type CssRule = { selector: string; lines: string[] };
type SourceRef = { file: string; startLine: number; endLine: number; snippet: string };
type Manifest = {
  vars: Record<string, Record<string, string>>;
  sourceRefs?: Record<string, Record<string, SourceRef>>;
  classes: Record<string, Record<string, CssRule[]>>;
};

const distManifest = manifest as Manifest;

function formatResolvedNumber(value: number) {
  return Number.isInteger(value) ? String(value) : String(Number(value.toFixed(4).replace(/\.?0+$/, '')));
}

export function distLookupVar(varName: string) {
  const key = varName.startsWith('--') ? varName.slice(2) : varName;

  for (const pool of Object.values(distManifest.vars)) {
    if (pool[key] !== undefined) {
      return String(pool[key]);
    }
  }

  return undefined;
}

export function distResolveValue(raw: string, depth = 0): string {
  if (depth > 12) {
    return raw.trim();
  }

  const trimmed = raw.trim();
  const pureVar = /^var\((--[a-z0-9-]+)\)$/.exec(trimmed);

  if (pureVar) {
    const next = distLookupVar(pureVar[1]);
    return next ? distResolveValue(next, depth + 1) : trimmed;
  }

  if (trimmed.startsWith('calc(') && trimmed.endsWith(')')) {
    return distEvaluateCalc(trimmed.slice(5, -1));
  }

  return trimmed;
}

function distEvaluateCalc(expression: string) {
  const resolvedExpression = expression.replace(/var\((--[a-z0-9-]+)\)/g, (_, varName) => {
    const value = distResolveValue(`var(${varName})`);
    const pxMatch = /^(-?[\d.]+)px$/.exec(value);
    if (pxMatch) {
      return pxMatch[1];
    }

    const unitlessMatch = /^(-?[\d.]+)$/.exec(value);
    if (unitlessMatch) {
      return unitlessMatch[1];
    }

    return value;
  });

  const normalized = resolvedExpression.replace(/\s+/g, '');

  if (!/^[-+*/().0-9]+$/.test(normalized)) {
    return `calc(${expression})`;
  }

  try {
    const result = Function(`"use strict"; return (${normalized})`)() as number;
    if (typeof result === 'number' && Number.isFinite(result)) {
      if (/%/.test(expression)) {
        return `${formatResolvedNumber(result)}%`;
      }

      return `${formatResolvedNumber(result)}px`;
    }
  } catch {
    return `calc(${expression})`;
  }

  return `calc(${expression})`;
}

export function distVarValue(category: string, name: string) {
  return distManifest.vars[category]?.[name];
}

export function distVarLines(category: string, name: string) {
  const value = distVarValue(category, name);
  return value ? [cssValueLine(String(value))] : [];
}

export function distClassDetailLines(category: string, className: string) {
  const rules = distManifest.classes[category]?.[className];
  if (!rules) {
    return [];
  }

  return rules.flatMap((rule) => rule.lines);
}

export function distClassNames(category: string) {
  return Object.keys(distManifest.classes[category] ?? {});
}

export function distSourceRef(category: string, className: string): SourceRef | undefined {
  return distManifest.sourceRefs?.[category]?.[className];
}
