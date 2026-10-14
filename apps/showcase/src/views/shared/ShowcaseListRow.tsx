import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useShowcaseColors } from '@/hooks/useShowcaseColors';

import { showcaseTheme as theme } from './showcaseTheme';

type ShowcaseListRowProps = {
  title: string;
  hint?: string;
  onPress: () => void;
  nested?: boolean;
  isLast?: boolean;
};

export function ShowcaseListRow({
  title,
  hint,
  onPress,
  nested = false,
  isLast = false,
}: ShowcaseListRowProps) {
  const colors = useShowcaseColors();

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        nested && styles.rowNested,
        !isLast && { borderBottomColor: colors['stroke-divider-page'] as string, ...styles.rowDivider },
        pressed && { backgroundColor: colors['event-tap'] as string },
      ]}
    >
      <View style={styles.copy}>
        <Text style={[styles.title, { color: colors['text-base-primary'] as string }]}>
          {title}
        </Text>
        {hint ? (
          <Text style={[styles.hint, { color: colors['text-base-secondary'] as string }]}>
            {hint}
          </Text>
        ) : null}
      </View>
      <Text style={[styles.chevron, { color: colors['text-base-tertiary'] as string }]}>›</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 52,
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 12,
  },
  rowNested: {
    paddingLeft: 28,
  },
  rowDivider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  copy: {
    flex: 1,
    gap: 2,
  },
  title: {
    ...theme.font.rowTitle,
  },
  hint: {
    ...theme.font.rowHint,
  },
  chevron: {
    fontSize: 22,
    lineHeight: 24,
    fontWeight: '300',
  },
});
