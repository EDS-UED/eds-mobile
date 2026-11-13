import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useThemedStyles } from '@/hooks/useThemedStyles';
import type { ShowcaseColorMap } from '@/hooks/useShowcaseColors';
import { showcaseShallowBlockSurface, showcaseTheme as theme } from '@/views/shared/showcaseTheme';

export type ComponentDetailDocPanel = 'usage' | 'props';

type ComponentDetailDocActionsProps = {
  onOpen: (panel: ComponentDetailDocPanel) => void;
  onCopyAiPrompt?: () => void;
};

function createDocActionStyles(colors: ShowcaseColorMap) {
  return StyleSheet.create({
    row: {
      flexDirection: 'row',
      gap: theme.layout.cardGap,
      paddingHorizontal: theme.layout.pageInset,
      paddingVertical: theme.layout.cardPaddingVertical,
    },
    button: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: theme.layout.cardPaddingVertical,
      ...showcaseShallowBlockSurface(colors['material-card-shallow'] as string),
      ...theme.blockRadius,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors['stroke-divider-shallow'] as string,
    },
    label: {
      ...theme.font.sectionLabel,
      color: colors['text-base-secondary'] as string,
    },
  });
}

export function ComponentDetailDocActions({ onOpen }: ComponentDetailDocActionsProps) {
  const styles = useThemedStyles(createDocActionStyles);

  return (
    <View style={styles.row}>
      <Pressable
        style={styles.button}
        accessibilityRole="button"
        onPress={() => onOpen('usage')}
      >
        <Text style={styles.label}>USAGE</Text>
      </Pressable>
      <Pressable
        style={styles.button}
        accessibilityRole="button"
        onPress={() => onOpen('props')}
      >
        <Text style={styles.label}>PROPS / API</Text>
      </Pressable>
    </View>
  );
}
