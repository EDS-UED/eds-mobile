import { StyleSheet, Text, View } from 'react-native';
import type { DocPropRow } from '@/data/components';

import { useThemedStyles } from '@/hooks/useThemedStyles';
import type { ShowcaseColorMap } from '@/hooks/useShowcaseColors';

function createPropsDocTableStyles(colors: ShowcaseColorMap) {
  return StyleSheet.create({
    root: {
      gap: 10,
    },
    empty: {
      fontSize: 14,
      color: colors['text-base-tertiary'] as string,
    },
    row: {
      gap: 2,
      paddingBottom: 8,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors['stroke-divider-page'] as string,
    },
    name: {
      fontSize: 14,
      fontWeight: '600',
      color: colors['text-base-primary'] as string,
      fontFamily: 'Menlo',
    },
    type: {
      fontSize: 12,
      color: colors['text-base-secondary'] as string,
      fontFamily: 'Menlo',
    },
    meta: {
      fontSize: 12,
      lineHeight: 18,
      color: colors['text-base-tertiary'] as string,
    },
  });
}

type PropsDocTableProps = {
  rows: DocPropRow[];
};

export function PropsDocTable({ rows }: PropsDocTableProps) {
  const styles = useThemedStyles(createPropsDocTableStyles);

  if (rows.length === 0) {
    return <Text style={styles.empty}>No props documented.</Text>;
  }

  return (
    <View style={styles.root}>
      {rows.map((row) => (
        <View key={row.name} style={styles.row}>
          <Text style={styles.name}>{row.name}</Text>
          <Text style={styles.type}>{row.type}</Text>
          <Text style={styles.meta}>
            default: {row.defaultValue} · {row.description}
          </Text>
        </View>
      ))}
    </View>
  );
}
