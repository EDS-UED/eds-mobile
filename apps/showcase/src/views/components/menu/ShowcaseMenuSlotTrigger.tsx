import { Pressable, StyleSheet, Text } from 'react-native';

import { useShowcaseColors } from '@/hooks/useShowcaseColors';

type ShowcaseMenuSlotTriggerProps = {
  open: () => void;
  disabled: boolean;
  label: string;
};

/** Showcase「插槽」演示 — 定制面板自由文案。 */
export function ShowcaseMenuSlotTrigger({ open, disabled, label }: ShowcaseMenuSlotTriggerProps) {
  const colors = useShowcaseColors();
  return (
    <Pressable
      disabled={disabled}
      onPress={open}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [
        styles.shell,
        {
          backgroundColor: colors['material-card-moderate'] as string,
          opacity: disabled ? 0.45 : pressed ? 0.85 : 1,
        },
      ]}
    >
      <Text style={[styles.label, { color: colors['text-brand'] as string }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  shell: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
  },
});
