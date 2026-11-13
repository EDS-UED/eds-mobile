import type { PropsWithChildren } from 'react';
import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useShowcaseColors } from '@/hooks/useShowcaseColors';

import { showcaseTheme as theme } from './showcaseTheme';

type DocSectionProps = PropsWithChildren<{
  title: string;
}>;

export function DocSection({ title, children }: DocSectionProps) {
  const colors = useShowcaseColors();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        root: {
          gap: 8,
          paddingHorizontal: theme.layout.pageInset,
          paddingVertical: 12,
          borderTopWidth: StyleSheet.hairlineWidth,
          borderTopColor: colors['stroke-divider-shallow'] as string,
        },
        title: {
          fontSize: 13,
          fontWeight: '700',
          letterSpacing: 0.2,
          color: colors['text-base-secondary'] as string,
          textTransform: 'uppercase',
        },
      }),
    [colors],
  );

  return (
    <View style={styles.root}>
      <Text style={styles.title}>{title}</Text>
      {children}
    </View>
  );
}
