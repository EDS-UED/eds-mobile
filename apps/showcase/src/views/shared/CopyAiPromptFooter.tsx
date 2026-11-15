import { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useThemedStyles } from '@/hooks/useThemedStyles';
import type { ShowcaseColorMap } from '@/hooks/useShowcaseColors';
import {
  showcaseCardFillColor,
  showcasePageBackgroundColor,
  showcaseShallowBlockSurface,
  showcaseTheme as theme,
} from '@/views/shared/showcaseTheme';
import { edsSpacing } from '@/views/shared/resolveEdsTheme';
import { copyShowcaseText } from '@/views/shared/showcaseCopyText';

export {
  COMPONENT_DETAIL_FOOTER_HEIGHT as COPY_AI_PROMPT_FOOTER_HEIGHT,
} from '@/views/shared/ComponentDetailActionFooter';

function createCopyAiPromptFooterStyles(colors: ShowcaseColorMap) {
  return StyleSheet.create({
    root: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      paddingHorizontal: theme.layout.pageInset,
      paddingTop: theme.layout.cardPaddingVertical,
      backgroundColor: showcasePageBackgroundColor(colors),
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: colors['stroke-divider-shallow'] as string,
    },
    button: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: theme.layout.cardPaddingVertical,
      ...showcaseShallowBlockSurface(showcaseCardFillColor(colors)),
    },
    label: {
      fontSize: 15,
      fontWeight: '600',
      color: colors['text-base-primary'] as string,
    },
  });
}

type CopyAiPromptFooterProps = {
  prompt: string;
};

/** @deprecated 使用 `ComponentDetailActionFooter`。 */

export function CopyAiPromptFooter({ prompt }: CopyAiPromptFooterProps) {
  const styles = useThemedStyles(createCopyAiPromptFooterStyles);
  const insets = useSafeAreaInsets();
  const [copied, setCopied] = useState(false);
  const promptRef = useRef(prompt);
  promptRef.current = prompt;

  useEffect(() => {
    if (!copied) {
      return;
    }
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  const onCopy = useCallback(async () => {
    const ok = await copyShowcaseText(promptRef.current, 'EDS Mobile AI 提示词');
    if (ok) {
      setCopied(true);
    }
  }, []);

  return (
    <View style={[styles.root, { paddingBottom: Math.max(insets.bottom, edsSpacing('spacing-3')) }]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="复制 AI 提示词"
        style={styles.button}
        onPress={() => {
          void onCopy();
        }}
      >
        <Text style={styles.label}>{copied ? '已复制' : '复制 AI 提示词'}</Text>
      </Pressable>
    </View>
  );
}
