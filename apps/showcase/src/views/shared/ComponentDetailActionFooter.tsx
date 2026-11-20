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
import type { ComponentDetailDocPanel } from '@/views/components/ComponentDetailDocActions';

/**
 * 固定底栏主体高度（不含 root `paddingBottom` safe area）— 顶 padding + 按钮行。
 * 与 `componentDetailFooterScrollPadding` 配套，ScrollView 勿再叠 EgPage spacing-10。
 */
export const COMPONENT_DETAIL_FOOTER_HEIGHT =
  theme.layout.cardPaddingVertical +
  theme.layout.cardPaddingVertical * 2 +
  (theme.font.customizeFieldTitle.lineHeight ?? 20);

/** ScrollView 底距 — 与绝对定位底栏同高，避免内容被遮挡。 */
export function componentDetailFooterScrollPadding(safeAreaBottom: number): number {
  return (
    COMPONENT_DETAIL_FOOTER_HEIGHT + Math.max(safeAreaBottom, edsSpacing('spacing-3'))
  );
}

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
  });
}

type ComponentDetailActionFooterProps = {
  onOpen: (panel: ComponentDetailDocPanel) => void;
};

export function ComponentDetailActionFooter({ onOpen }: ComponentDetailActionFooterProps) {
  const styles = useThemedStyles(createFooterStyles);
  const insets = useSafeAreaInsets();

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
      </View>
    </View>
  );
}