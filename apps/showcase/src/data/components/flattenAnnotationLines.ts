/** 注释文案 — 按 `·` / `；` 拆成单行条目（展示层再挂项目符）。 */
export function flattenAnnotationLines(lines: string[]): string[] {
  const out: string[] = [];
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const parts = trimmed
      .split(/\s*[；;]\s*|\s+·\s+/)
      .map((part) => part.trim())
      .filter(Boolean);
    out.push(...(parts.length > 0 ? parts : [trimmed]));
  }
  return out;
}