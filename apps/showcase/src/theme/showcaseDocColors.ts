/**
 * Showcase-only doc UI — 代码高亮等，**不是** `--eds-brand`。
 * 品牌色由 consumer 在 `spec/color/base.json` 的 `eds-brand` 自行定义，经 semantic 派生 `text-brand` / `event-focus-brand` 等。
 */
export const showcaseDocColors = {
  light: {
    'customize-referenced': '#ff5991',
    'customize-simple': '#8976ff',
    'code-comment': '#6b7280',
    'code-keyword': '#0369a1',
    'code-title': '#6d28d9',
    'code-string': '#b45309',
    'code-type': '#0369a1',
    'code-number': '#9333ea',
    'code-symbol': '#0f766e',
  },
  dark: {
    'customize-referenced': '#ff5991',
    'customize-simple': '#8976ff',
    'code-comment': '#9ca3af',
    'code-keyword': '#38bdf8',
    'code-title': '#a3e635',
    'code-string': '#fbbf24',
    'code-type': '#38bdf8',
    'code-number': '#c084fc',
    'code-symbol': '#2dd4bf',
  },
} as const;

export type ShowcaseDocColorKey = keyof typeof showcaseDocColors.light;

type CssSnippetSyntaxColors = {
  selector: string;
  property: string;
  function: string;
  variable: string;
  value: string;
  punctuation: string;
  comment: string;
  number: string;
};

/** CSS fence — selector/值 品红 · var 橙 · --* 100% · 注释 40% · 属性/标点 100% primary. */
export function resolveCssSnippetSyntaxColors(
  theme: keyof typeof showcaseDocColors,
  text: { primary: string; tertiary: string },
): CssSnippetSyntaxColors {
  const doc = showcaseDocColors[theme];
  const primary = text.primary;
  const magenta = doc['customize-referenced'];

  return {
    selector: magenta,
    function: doc['code-string'],
    variable: primary,
    property: primary,
    value: magenta,
    punctuation: primary,
    comment: text.tertiary,
    number: magenta,
  };
}

export type NativeSnippetTokenKind =
  | 'plain'
  | 'comment'
  | 'keyword'
  | 'string'
  | 'jsxTag'
  | 'jsxAttr'
  | 'property'
  | 'number'
  | 'punctuation'
  | 'module'
  | 'call';

export type NativeSnippetSyntaxColors = Record<NativeSnippetTokenKind, string>;

/** RN / TS fence — 与 CSS 片段同一套 showcaseDocColors 语义。 */
export function resolveNativeSnippetSyntaxColors(
  theme: keyof typeof showcaseDocColors,
  text: { primary: string; tertiary: string },
): NativeSnippetSyntaxColors {
  const doc = showcaseDocColors[theme];
  const primary = text.primary;

  return {
    plain: primary,
    comment: text.tertiary,
    keyword: doc['code-keyword'],
    string: doc['code-string'],
    jsxTag: doc['code-title'],
    jsxAttr: doc['code-type'],
    property: doc['code-type'],
    number: doc['code-number'],
    punctuation: primary,
    module: doc['code-symbol'],
    call: doc['customize-referenced'],
  };
}
