import * as Clipboard from 'expo-clipboard';
import { Pressable, StyleSheet, Text, useColorScheme, View } from 'react-native';

import { useShowcaseColors } from '@/hooks/useShowcaseColors';
import { normalizeDetailSnippet } from '@/data/tokens/tokenDetailSnippet';
import { resolveCssSnippetSyntaxColors } from '@/theme/showcaseDocColors';
import {
  showcaseCodeBlockStyle,
  showcaseCodeSnippetLayout,
} from '@/views/shared/showcaseCodeSnippetLayout';

type CssTokenKind =
  | 'selector'
  | 'property'
  | 'function'
  | 'variable'
  | 'value'
  | 'punctuation'
  | 'comment'
  | 'number'
  | 'plain';

type CssToken = {
  kind: CssTokenKind;
  text: string;
};

type CssSyntaxColors = Record<CssTokenKind, string>;

type HighlightedCssSnippetProps = {
  snippet: string;
};

function useCssSyntaxColors(): CssSyntaxColors {
  const colorScheme = useColorScheme();
  const colors = useShowcaseColors();

  return {
    ...resolveCssSnippetSyntaxColors(colorScheme === 'dark' ? 'dark' : 'light', {
      primary: colors['text-base-primary'] as string,
      tertiary: colors['text-base-tertiary'] as string,
    }),
    plain: colors['text-base-primary'] as string,
  };
}

function tokenizeCSSValue(value: string): CssToken[] {
  const tokens: CssToken[] = [];
  let rest = value;

  while (rest.length > 0) {
    if (rest.startsWith('var')) {
      tokens.push({ kind: 'function', text: 'var' });
      rest = rest.slice(3);
      continue;
    }

    if (rest.startsWith('calc')) {
      tokens.push({ kind: 'function', text: 'calc' });
      rest = rest.slice(4);
      continue;
    }

    if (rest.startsWith('scale')) {
      tokens.push({ kind: 'function', text: 'scale' });
      rest = rest.slice(5);
      continue;
    }

    if (rest.startsWith('--')) {
      const match = rest.match(/^--[a-z0-9-]+/);
      if (match) {
        tokens.push({ kind: 'variable', text: match[0] });
        rest = rest.slice(match[0].length);
        continue;
      }
    }

    if (rest[0] === '(' || rest[0] === ')') {
      tokens.push({ kind: 'punctuation', text: rest[0] });
      rest = rest.slice(1);
      continue;
    }

    if (/^[0-9.]/.test(rest)) {
      const match = rest.match(/^[0-9.]+/);
      if (match) {
        tokens.push({ kind: 'number', text: match[0] });
        rest = rest.slice(match[0].length);
        continue;
      }
    }

    if (/^[*+\-/]/.test(rest)) {
      tokens.push({ kind: 'punctuation', text: rest[0] });
      rest = rest.slice(1);
      continue;
    }

    if (/^-?[a-z][a-z0-9-]*/.test(rest)) {
      const match = rest.match(/^-?[a-z][a-z0-9-]*/);
      if (match) {
        tokens.push({ kind: 'value', text: match[0] });
        rest = rest.slice(match[0].length);
        continue;
      }
    }

    const whitespace = rest.match(/^\s+/);
    if (whitespace) {
      tokens.push({ kind: 'plain', text: whitespace[0] });
      rest = rest.slice(whitespace[0].length);
      continue;
    }

    tokens.push({ kind: 'punctuation', text: rest[0] });
    rest = rest.slice(1);
  }

  return tokens;
}

function tokenizeCssLine(line: string): CssToken[] {
  const commentIndex = line.indexOf('/*');
  const code = commentIndex >= 0 ? line.slice(0, commentIndex) : line;
  const comment = commentIndex >= 0 ? line.slice(commentIndex) : '';

  const tokens: CssToken[] = [];
  const trimmed = code.trim();

  const varDeclMatch = code.match(/^(\s*)(--[a-z0-9-]+)(\s*:\s*)([\s\S]*?)(\s*;?\s*)$/);
  if (varDeclMatch) {
    tokens.push({ kind: 'plain', text: varDeclMatch[1] });
    tokens.push({ kind: 'variable', text: varDeclMatch[2] });
    tokens.push({ kind: 'punctuation', text: varDeclMatch[3] });
    tokens.push(...tokenizeCSSValue(varDeclMatch[4]));
    tokens.push({ kind: 'punctuation', text: varDeclMatch[5] });
  } else if (trimmed.match(/^(\.[a-z0-9-]+)(\s*\{?\s*)$/)) {
    const selectorMatch = trimmed.match(/^(\.[a-z0-9-]+)(\s*\{?\s*)$/)!;
    tokens.push({ kind: 'plain', text: code.slice(0, code.indexOf('.')) });
    tokens.push({ kind: 'selector', text: selectorMatch[1] });
    tokens.push({ kind: 'punctuation', text: selectorMatch[2] });
  } else if (trimmed === '}') {
    tokens.push({ kind: 'punctuation', text: code });
  } else {
    const propertyMatch = code.match(/^(\s*)(-?[a-z][a-z0-9-]*)(\s*:\s*)([\s\S]*?)(\s*;?\s*)$/);
    if (propertyMatch) {
      tokens.push({ kind: 'plain', text: propertyMatch[1] });
      tokens.push({ kind: 'property', text: propertyMatch[2] });
      tokens.push({ kind: 'punctuation', text: propertyMatch[3] });
      tokens.push(...tokenizeCSSValue(propertyMatch[4]));
      tokens.push({ kind: 'punctuation', text: propertyMatch[5] });
    } else {
      tokens.push({ kind: 'plain', text: code });
    }
  }

  if (comment) {
    tokens.push({ kind: 'comment', text: comment });
  }

  return tokens;
}

function CssLine({ line, syntaxColors }: { line: string; syntaxColors: CssSyntaxColors }) {
  const tokens = tokenizeCssLine(line);

  return (
    <Text style={showcaseCodeSnippetLayout.line}>
      {tokens.map((token, index) => (
        <Text
          key={`${token.kind}-${index}`}
          style={[
            { color: syntaxColors[token.kind] },
            token.kind === 'comment' ? styles.comment : null,
          ]}
        >
          {token.text}
        </Text>
      ))}
    </Text>
  );
}

export function HighlightedCssSnippet({ snippet }: HighlightedCssSnippetProps) {
  const colors = useShowcaseColors();
  const syntaxColors = useCssSyntaxColors();
  const displaySnippet = normalizeDetailSnippet(snippet);
  const lines = displaySnippet.split('\n');

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="复制 CSS"
      onPress={() => {
        void Clipboard.setStringAsync(displaySnippet);
      }}
      style={({ pressed }) => [
        showcaseCodeBlockStyle(colors['material-card-shallow'] as string),
        pressed && showcaseCodeSnippetLayout.pressed,
      ]}
    >
      <View style={showcaseCodeSnippetLayout.lines}>
        {lines.map((line, index) => (
          <CssLine key={`${index}-${line}`} line={line} syntaxColors={syntaxColors} />
        ))}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  comment: {
    fontStyle: 'italic',
  },
});
