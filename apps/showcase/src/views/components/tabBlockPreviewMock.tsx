import mobileTheme from '@eds/mobile-tokens/theme';
import { StyleSheet, Text, View } from 'react-native';

import type { ShowcaseColorMap } from '@/hooks/useShowcaseColors';
import { edsTokenFont } from '@/views/shared/resolveEdsTheme';

const spacing = mobileTheme.spacing;

export function mockTabBlockBodyFields(tabId: string, colors: ShowcaseColorMap) {
  const lines = [
    `订单号 · ORD-${tabId}92841`,
    '状态 · 已完成',
    '金额 · ¥ 1,280.00',
    '创建时间 · 2026-03-12 14:20',
  ];
  return lines.map((line) => (
    <View key={line} style={tabBlockPreviewStyles.fieldRow}>
      <Text style={[tabBlockPreviewStyles.fieldText, { color: colors['text-base-primary'] as string }]}>
        {line}
      </Text>
    </View>
  ));
}

export const tabBlockPreviewStyles = StyleSheet.create({
  root: {
    alignSelf: 'stretch',
    width: '100%',
  },
  scroll: {
    maxHeight: 200,
  },
  scrollContent: {
    paddingBottom: spacing['spacing-4'] as number,
    gap: spacing['spacing-3'] as number,
  },
  fieldRow: {
    paddingVertical: spacing['spacing-2'] as number,
  },
  fieldText: {
    ...edsTokenFont('body-medium', '400'),
  },
});