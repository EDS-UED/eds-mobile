import { useMemo } from 'react';
import { Pressable, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import {
  filterDocCustomizeControls,
  isControlVisible,
  type DocCustomizeControl,
} from '@/data/components';

import { useShowcaseColors } from '@/hooks/useShowcaseColors';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import type { ShowcaseColorMap } from '@/hooks/useShowcaseColors';
import { showcaseShallowBlockSurface } from '@/views/shared/showcaseTheme';

function createCustomizePanelStyles(colors: ShowcaseColorMap) {
  return StyleSheet.create({
    root: {
      gap: 12,
    },
    empty: {
      fontSize: 14,
      color: colors['text-base-tertiary'] as string,
    },
    heading: {
      fontSize: 14,
      fontWeight: '600',
      color: colors['text-base-primary'] as string,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12,
    },
    field: {
      gap: 8,
    },
    label: {
      fontSize: 14,
      color: colors['text-base-primary'] as string,
    },
    input: {
      height: 40,
      paddingHorizontal: 12,
      ...showcaseShallowBlockSurface(colors['material-card-shallow'] as string),
      color: colors['text-base-primary'] as string,
      fontSize: 16,
    },
    chips: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    chip: {
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 999,
      backgroundColor: colors['material-card-shallow'] as string,
    },
    chipActive: {
      backgroundColor: colors['fill-brand-primary'] as string,
    },
    chipText: {
      fontSize: 13,
      color: colors['text-base-primary'] as string,
    },
    chipTextActive: {
      color: colors['text-face-primary'] as string,
      fontWeight: '600',
    },
  });
}

type CustomizePanelProps = {
  controls: DocCustomizeControl[];
  state: Record<string, unknown>;
  onChange: (next: Record<string, unknown>) => void;
};

export function CustomizePanel({ controls, state, onChange }: CustomizePanelProps) {
  const colors = useShowcaseColors();
  const styles = useThemedStyles(createCustomizePanelStyles);
  const visibleControls = useMemo(
    () => filterDocCustomizeControls(controls).filter((control) => isControlVisible(control, state)),
    [controls, state],
  );

  if (visibleControls.length === 0) {
    return <Text style={styles.empty}>No customize controls for this component.</Text>;
  }

  return (
    <View style={styles.root}>
      {visibleControls.map((control) => {
        if (control.kind === 'heading') {
          return (
            <Text key={control.key} style={styles.heading}>
              {control.label}
            </Text>
          );
        }

        if (control.kind === 'boolean') {
          const value = Boolean(state[control.key]);
          return (
            <View key={control.key} style={styles.row}>
              <Text style={styles.label}>{control.label}</Text>
              <Switch
                value={value}
                onValueChange={(next) => {
                  const patch: Record<string, unknown> = { [control.key]: next };
                  if (next && control.exclusiveKey) {
                    patch[control.exclusiveKey] = false;
                  }
                  if (next && control.exclusiveKeys) {
                    for (const key of control.exclusiveKeys) {
                      patch[key] = false;
                    }
                  }
                  onChange({ ...state, ...patch });
                }}
              />
            </View>
          );
        }

        if (control.kind === 'text') {
          return (
            <View key={control.key} style={styles.field}>
              <Text style={styles.label}>{control.label}</Text>
              <TextInput
                style={styles.input}
                value={String(state[control.key] ?? '')}
                placeholder={control.placeholder}
                placeholderTextColor={colors['text-base-tertiary'] as string}
                onChangeText={(text) => onChange({ ...state, [control.key]: text })}
              />
            </View>
          );
        }

        if (control.kind === 'select') {
          return (
            <View key={control.key} style={styles.field}>
              <Text style={styles.label}>{control.label}</Text>
              <View style={styles.chips}>
                {control.options.map((option) => {
                  const active = state[control.key] === option.value;
                  return (
                    <Pressable
                      key={option.value}
                      accessibilityRole="button"
                      style={[styles.chip, active && styles.chipActive]}
                      onPress={() => onChange({ ...state, [control.key]: option.value })}
                    >
                      <Text style={[styles.chipText, active && styles.chipTextActive]}>
                        {option.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          );
        }

        return null;
      })}
    </View>
  );
}
