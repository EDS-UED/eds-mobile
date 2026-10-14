import { StyleSheet, Text, View } from 'react-native';

import { useShowcaseColors } from '@/hooks/useShowcaseColors';

import { showcaseTheme as theme } from './showcaseTheme';

type ImplementationBadgeProps = {
  implemented: boolean;
};

export function ImplementationBadge({ implemented }: ImplementationBadgeProps) {
  const colors = useShowcaseColors();

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: implemented
            ? (colors['status-success-weaken'] as string)
            : (colors['material-card-shallow'] as string),
        },
      ]}
    >
      <Text
        style={[
          styles.text,
          {
            color: implemented
              ? (colors['status-success'] as string)
              : (colors['text-base-tertiary'] as string),
          },
        ]}
      >
        {implemented ? '已实现' : '脚手架'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    borderRadius: theme.radius.full,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  text: {
    fontSize: 11,
    fontWeight: '600',
  },
});
