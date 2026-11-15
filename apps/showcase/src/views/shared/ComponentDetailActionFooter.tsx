import { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useThemedStyles } from '@/hooks/useThemedStyles';
import type { ShowcaseColorMap } from '@/hooks/useShowcaseColors';
import { edsSpacing } from '@/views/shared/resolveEdsTheme';
import {
  showcaseCardFillColor,
  showcaseDetailScreenBackgroundColor,
  showcaseShallowBlockSurface,
  showcaseTheme as theme,
} from '@/views/shared/showcaseTheme';
import { copyShowcaseText } from '@/views/shared/showcaseCopyText';

import type { ComponentDetailDocPanel } from '@/views/components/ComponentDetailDocActions';

/** 固定底栏高度（不含 safe area）— 与 ScrollView paddingBottom 对齐。 */
export const COMPONENT_DETAIL_FOOTER_HEIGHT = 72;

/** @deprecated 使用 {@link COMPONENT_DETAIL_FOOTER_HEIGHT} */
export const COPY_AI_PROMPT_FOOTER_HEIGHT = COMPONENT_DETAIL_FOOTER_HEIGHT;

function createFooterStyles(colors: ShowcaseColorMap) {
  return StyleSheet.create({
    root: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      paddingHorizontal: theme.layout.pageInset,
      paddingTop: theme.layout.cardPaddingVertical,
      backgroundColor: showcaseDetailScreenBackgroundColor(colors),
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: colors['stroke-divider-shallow'] as string,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'stretch',
      gap: edsSpacing('spacing-2'),
    },
    button: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: theme.layout.cardPaddingVertical,
      ...showcaseShallowBlockSurface(showcaseCardFillColor(colors)),
    },
    label: {
      ...theme.font.customizeFieldTitle,
      color: colors['text-base-primary'] as string,
    },
    labelSecondary: {
      ...theme.font.customizeChipLabel,
      color: colors['text-base-secondary'] as string,
    },
  });
}

type ComponentDetailActionFooterProps = {
  onOpen: (panel: ComponentDetailDocPanel) => void;
  copyPrompt?: string;
};

export function ComponentDetailActionFooter({ onOpen, copyPrompt }: ComponentDetailActionFooterProps) {
  const styles = useThemedStyles(createFooterStyles);
  const insets = useSafeAreaInsets();
  const [copied, setCopied] = useState(false);
  const promptRef = useRef(copyPrompt);
  promptRef.current = copyPrompt;

  useEffect(() => {
    if (!copied) {
      return;
    }
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  const onCopy = useCallback(async () => {
    const text = promptRef.current?.trim();
    if (!text) {
      return;
    }
    const ok = await copyShowcaseText(text, 'EDS Mobile AI 提示词');
    if (ok) {
      setCopied(true);
    }
  }, []);

  return (
    <View style={[styles.root, { paddingBottom: Math.max(insets.bottom, edsSpacing('spacing-3')) }]}>
      <View style={styles.row}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Usage"
          style={styles.button}
          onPress={() => onOpen('usage')}
        >
          <Text style={styles.label}>USAGE</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Props and API"
          style={styles.button}
          onPress={() => onOpen('props')}
        >
          <Text style={[styles.label, { textAlign: 'center' }]} numberOfLines={2} adjustsFontSizeToFit>
            PROPS / API
          </Text>
        </Pressable>
        {copyPrompt != null ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="复制 AI 提示词"
            style={styles.button}
            onPress={() => {
              void onCopy();
            }}
          >
            <Text style={[styles.labelSecondary, { textAlign: 'center' }]} numberOfLines={2} adjustsFontSizeToFit>
              {copied ? '已复制' : '复制 AI 提示词'}
            </Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}