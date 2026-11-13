import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import {
  addMenuItem,
  MENU_MAX_ITEMS,
  MENU_MAX_SECTIONS,
  menuGroupCustomizeControls,
  menuTriggerCustomizeControls,
  patchMenuSectionCount,
  readMenuItemCount,
  readMenuSectionCount,
  removeMenuItem,
  removeMenuSection,
} from '@/data/components/menuCustomizeModel';
import { CustomizePanel } from '@/views/shared/CustomizePanel';
import { useShowcaseColors } from '@/hooks/useShowcaseColors';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import type { ShowcaseColorMap } from '@/hooks/useShowcaseColors';
import { showcaseShallowBlockSurface, showcaseTheme as theme } from '@/views/shared/showcaseTheme';

function createMenuSectionCustomizeStyles(colors: ShowcaseColorMap) {
  return StyleSheet.create({
    root: {
      gap: 16,
    },
    sectionHeading: {
      fontSize: 14,
      fontWeight: '600',
      color: colors['text-base-primary'] as string,
    },
    groupRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      alignItems: 'center',
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
    addChip: {
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 999,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors['stroke-divider-shallow'] as string,
      borderStyle: 'dashed',
    },
    addChipDisabled: {
      opacity: 0.4,
    },
    addChipText: {
      fontSize: 13,
      color: colors['text-brand'] as string,
      fontWeight: '600',
    },
    groupPanel: {
      gap: theme.layout.cardGap,
      paddingTop: 4,
    },
    groupActions: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
    },
    textButton: {
      paddingVertical: 4,
      paddingHorizontal: 8,
    },
    textButtonLabel: {
      fontSize: 13,
      color: colors['text-base-secondary'] as string,
    },
    textButtonDanger: {
      color: colors['text-semantic-danger'] as string,
    },
    itemsBlock: {
      gap: 12,
    },
    itemCard: {
      gap: 8,
      padding: theme.layout.cardPaddingVertical,
      ...showcaseShallowBlockSurface(colors['material-card-shallow'] as string),
      ...theme.blockRadius,
    },
    itemHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    itemTitle: {
      fontSize: 13,
      fontWeight: '600',
      color: colors['text-base-primary'] as string,
    },
    fieldLabel: {
      fontSize: 13,
      color: colors['text-base-primary'] as string,
    },
    input: {
      height: 40,
      paddingHorizontal: 12,
      ...showcaseShallowBlockSurface(colors.page as string),
      color: colors['text-base-primary'] as string,
      fontSize: 16,
      borderRadius: theme.smoothRadius.sm.borderRadius,
    },
  });
}

type MenuSectionsCustomizePanelProps = {
  state: Record<string, unknown>;
  onChange: (next: Record<string, unknown>) => void;
};

export function MenuSectionsCustomizePanel({ state, onChange }: MenuSectionsCustomizePanelProps) {
  const colors = useShowcaseColors();
  const styles = useThemedStyles(createMenuSectionCustomizeStyles);
  const sectionCount = readMenuSectionCount(state);
  const [activeGroup, setActiveGroup] = useState(1);
  const selectedGroup = Math.min(Math.max(1, activeGroup), sectionCount);
  const itemCount = readMenuItemCount(state, selectedGroup);
  const canAddSection = sectionCount < MENU_MAX_SECTIONS;
  const canRemoveSection = sectionCount > 1;
  const canAddItem = itemCount < MENU_MAX_ITEMS;
  const showItemIcon = state.showItemIcon !== false;

  const groupControls = useMemo(
    () => menuGroupCustomizeControls(selectedGroup),
    [selectedGroup],
  );

  const addGroup = () => {
    if (!canAddSection) {
      return;
    }
    const next = patchMenuSectionCount(state, sectionCount + 1);
    onChange(next);
    setActiveGroup(sectionCount + 1);
  };

  const deleteGroup = () => {
    if (!canRemoveSection) {
      return;
    }
    const next = removeMenuSection(state, selectedGroup);
    onChange(next);
    setActiveGroup(Math.min(selectedGroup, readMenuSectionCount(next)));
  };

  const prefix = `group${selectedGroup}`;

  return (
    <View style={styles.root}>
      <CustomizePanel
        controls={menuTriggerCustomizeControls}
        state={state}
        onChange={onChange}
      />

      <Text style={styles.sectionHeading}>菜单分组</Text>
      <View style={styles.groupRow}>
        {Array.from({ length: sectionCount }, (_, index) => {
          const groupIndex = index + 1;
          const active = groupIndex === selectedGroup;
          return (
            <Pressable
              key={groupIndex}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              style={[styles.chip, active && styles.chipActive]}
              onPress={() => setActiveGroup(groupIndex)}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>
                组 {groupIndex}
              </Text>
            </Pressable>
          );
        })}
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ disabled: !canAddSection }}
          style={[styles.addChip, !canAddSection && styles.addChipDisabled]}
          onPress={addGroup}
        >
          <Text style={styles.addChipText}>添加分组 +</Text>
        </Pressable>
      </View>

      <View style={styles.groupPanel}>
        <View style={styles.groupActions}>
          {canRemoveSection ? (
            <Pressable
              accessibilityRole="button"
              style={styles.textButton}
              onPress={deleteGroup}
            >
              <Text style={[styles.textButtonLabel, styles.textButtonDanger]}>删除本组</Text>
            </Pressable>
          ) : null}
        </View>

        <CustomizePanel controls={groupControls} state={state} onChange={onChange} />

        <Text style={styles.sectionHeading}>Item</Text>
        <View style={styles.itemsBlock}>
          {Array.from({ length: itemCount }, (_, index) => {
            const slot = index + 1;
            const labelKey = `${prefix}Item${slot}Label`;
            const iconKey = `${prefix}Item${slot}Icon`;
            const canRemoveItem = itemCount > 1;
            return (
              <View key={slot} style={styles.itemCard}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemTitle}>Item {slot}</Text>
                  {canRemoveItem ? (
                    <Pressable
                      accessibilityRole="button"
                      style={styles.textButton}
                      onPress={() => onChange(removeMenuItem(state, selectedGroup, slot))}
                    >
                      <Text style={[styles.textButtonLabel, styles.textButtonDanger]}>删除</Text>
                    </Pressable>
                  ) : null}
                </View>
                <Text style={styles.fieldLabel}>文案</Text>
                <TextInput
                  style={styles.input}
                  value={String(state[labelKey] ?? '')}
                  placeholder={`选项 ${slot}`}
                  placeholderTextColor={colors['text-base-tertiary'] as string}
                  onChangeText={(text) => onChange({ ...state, [labelKey]: text })}
                />
                {showItemIcon ? (
                  <>
                    <Text style={styles.fieldLabel}>icon</Text>
                    <TextInput
                      style={styles.input}
                      value={String(state[iconKey] ?? '')}
                      placeholder="eds-more-ios"
                      placeholderTextColor={colors['text-base-tertiary'] as string}
                      onChangeText={(text) => onChange({ ...state, [iconKey]: text })}
                    />
                  </>
                ) : null}
              </View>
            );
          })}
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ disabled: !canAddItem }}
            style={[styles.addChip, !canAddItem && styles.addChipDisabled]}
            onPress={() => {
              if (!canAddItem) {
                return;
              }
              onChange(addMenuItem(state, selectedGroup));
            }}
          >
            <Text style={styles.addChipText}>添加 Item +</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
