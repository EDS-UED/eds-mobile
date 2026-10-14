import type { NativeSnippetTokenKind } from '@/theme/showcaseDocColors';

export type NativeSnippetToken = {
  kind: NativeSnippetTokenKind;
  text: string;
};

const KEYWORDS = new Set([
  'import',
  'from',
  'const',
  'let',
  'export',
  'return',
  'typeof',
  'undefined',
  'null',
  'true',
  'false',
  'as',
  'type',
]);

function pushStringToken(tokens: NativeSnippetToken[], quote: "'" | '"', rest: string) {
  let index = 1;
  while (index < rest.length) {
    if (rest[index] === '\\') {
      index += 2;
      continue;
    }
    if (rest[index] === quote) {
      tokens.push({ kind: 'string', text: rest.slice(0, index + 1) });
      return rest.slice(index + 1);
    }
    index += 1;
  }
  tokens.push({ kind: 'string', text: rest });
  return '';
}

function tokenizeJsxComment(rest: string): { consumed: string; remainder: string } | null {
  if (!rest.startsWith('{/*')) {
    return null;
  }
  const end = rest.indexOf('*/}');
  if (end === -1) {
    return { consumed: rest, remainder: '' };
  }
  return { consumed: rest.slice(0, end + 3), remainder: rest.slice(end + 3) };
}

function tokenizeLineComment(rest: string): { consumed: string; remainder: string } | null {
  if (!rest.startsWith('//')) {
    return null;
  }
  return { consumed: rest, remainder: '' };
}

function tokenizeIdentifier(rest: string, tokens: NativeSnippetToken[]): string {
  const match = rest.match(/^[@a-zA-Z_$][\w$]*/);
  if (!match) {
    return rest;
  }

  const word = match[0];
  if (word.startsWith('@')) {
    tokens.push({ kind: 'module', text: word });
  } else if (KEYWORDS.has(word)) {
    tokens.push({ kind: 'keyword', text: word });
  } else if (/^[A-Z]/.test(word)) {
    tokens.push({ kind: 'jsxTag', text: word });
  } else if (rest[word.length] === '(') {
    tokens.push({ kind: 'call', text: word });
  } else {
    tokens.push({ kind: 'plain', text: word });
  }

  return rest.slice(word.length);
}

/** Lightweight RN/TS highlighter for token detail fences. */
export function tokenizeNativeSnippetLine(line: string): NativeSnippetToken[] {
  const tokens: NativeSnippetToken[] = [];
  let rest = line;

  const jsxComment = tokenizeJsxComment(rest);
  if (jsxComment && jsxComment.consumed === rest) {
    return [{ kind: 'comment', text: rest }];
  }

  const lineComment = tokenizeLineComment(rest);
  if (lineComment) {
    const code = lineComment.consumed.slice(0, lineComment.consumed.indexOf('//'));
    if (code) {
      tokens.push(...tokenizeNativeSnippetLine(code));
    }
    tokens.push({ kind: 'comment', text: lineComment.consumed.slice(lineComment.consumed.indexOf('//')) });
    return tokens;
  }

  while (rest.length > 0) {
    const jsxInline = tokenizeJsxComment(rest);
    if (jsxInline) {
      tokens.push({ kind: 'comment', text: jsxInline.consumed });
      rest = jsxInline.remainder;
      continue;
    }

    if (rest[0] === "'" || rest[0] === '"') {
      const quote = rest[0] as "'" | '"';
      rest = pushStringToken(tokens, quote, rest);
      continue;
    }

    if (rest.startsWith('</')) {
      tokens.push({ kind: 'punctuation', text: '</' });
      rest = rest.slice(2);
      rest = tokenizeIdentifier(rest, tokens);
      continue;
    }

    if (rest[0] === '<' && /<\/?[A-Za-z]/.test(rest)) {
      tokens.push({ kind: 'punctuation', text: rest[0] });
      rest = rest.slice(1);
      if (rest[0] === '/') {
        tokens.push({ kind: 'punctuation', text: '/' });
        rest = rest.slice(1);
      }
      rest = tokenizeIdentifier(rest, tokens);
      continue;
    }

    if (/^\s/.test(rest)) {
      const match = rest.match(/^\s+/);
      tokens.push({ kind: 'plain', text: match![0] });
      rest = rest.slice(match![0].length);
      continue;
    }

    if (/^[0-9.]/.test(rest)) {
      const match = rest.match(/^[0-9.]+/);
      tokens.push({ kind: 'number', text: match![0] });
      rest = rest.slice(match![0].length);
      continue;
    }

    if (/^[a-zA-Z_$@]/.test(rest)) {
      rest = tokenizeIdentifier(rest, tokens);
      continue;
    }

    if (/^[{}[\](),.:;=<>/?|&*+\-]/.test(rest)) {
      const two = rest.slice(0, 2);
      if (two === '=>' || two === '??' || two === '?.') {
        tokens.push({ kind: 'punctuation', text: two });
        rest = rest.slice(2);
        continue;
      }
      tokens.push({ kind: 'punctuation', text: rest[0] });
      rest = rest.slice(1);
      continue;
    }

    tokens.push({ kind: 'plain', text: rest[0] });
    rest = rest.slice(1);
  }

  return retokenizeObjectKeys(tokens);
}

function retokenizeObjectKeys(tokens: NativeSnippetToken[]): NativeSnippetToken[] {
  const out: NativeSnippetToken[] = [];
  for (let index = 0; index < tokens.length; index += 1) {
    const token = tokens[index];
    const prev = out[out.length - 1];
    if (
      token.kind === 'plain' &&
      /^[a-zA-Z_$][\w$]*$/.test(token.text) &&
      prev?.text.trim().endsWith('{') &&
      tokens[index + 1]?.text === ':'
    ) {
      out.push({ kind: 'property', text: token.text });
      continue;
    }
    if (
      token.kind === 'plain' &&
      /^[a-zA-Z_$][\w$]*$/.test(token.text) &&
      tokens[index + 1]?.text === '='
    ) {
      out.push({ kind: 'jsxAttr', text: token.text });
      continue;
    }
    out.push(token);
  }
  return out;
}
