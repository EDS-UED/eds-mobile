export type EdsSansTextRun = { text: string; script: 'latin' | 'cjk' };

const CJK_CHAR =
  /[\u3000-\u303f\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\uac00-\ud7af]/;

function scriptOf(char: string): EdsSansTextRun['script'] {
  return CJK_CHAR.test(char) ? 'cjk' : 'latin';
}

/** iOS 混排：按 CJK / 非 CJK 切段，供 {@link EdsSansText} 分行绑字。 */
export function splitEdsSansTextRuns(text: string): EdsSansTextRun[] {
  if (!text) {
    return [];
  }
  const runs: EdsSansTextRun[] = [];
  let buffer = '';
  let active: EdsSansTextRun['script'] | null = null;

  for (const char of text) {
    const next = scriptOf(char);
    if (active !== null && next !== active) {
      runs.push({ text: buffer, script: active });
      buffer = '';
    }
    active = next;
    buffer += char;
  }
  if (buffer && active) {
    runs.push({ text: buffer, script: active });
  }
  return runs;
}