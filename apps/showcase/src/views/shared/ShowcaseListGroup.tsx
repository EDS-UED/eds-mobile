import { StyleSheet, Text, View, type ViewStyle } from 'react-native';

import { useShowcaseColors } from '@/hooks/useShowcaseColors';

import { showcaseShallowBlockSurface, showcaseTheme as theme } from './showcaseTheme';

type ShowcaseListGroupProps = {
  label?: string;
  children: React.ReactNode;
  style?: ViewStyle;
};

export function ShowcaseListGroup({ label, children, style }: ShowcaseListGroupProps) {
  const colors = useShowcaseColors();

  return (
    <View style={[styles.wrap, style]}>
      {label ? (
        <Text style={[styles.label, { color: colors['text-base-secondary'] as string }]}>
          {label}
        </Text>
      ) : null}
      <View
        style={[
          styles.card,
          {
            backgroundColor: colors['material-card-shallow'] as string,
            borderColor: colors['stroke-divider-page'] as string,
          },
        ]}
      >
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: 8,
    paddingHorizontal: theme.layout.pageInset,
  },
  label: {
    paddingHorizontal: 0,
    ...theme.font.sectionLabel,
  },
  card: {
    ...theme.blockRadius,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
  },
});
