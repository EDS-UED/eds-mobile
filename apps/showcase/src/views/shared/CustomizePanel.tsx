import type { EgMenuItem } from '@eds/mobile-components';
import { EgItem, EgItemGroup, EG_ITEM_PAD_H, EG_ITEM_PAD_V } from '@eds/mobile-components';
import { useMemo } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import {
  filterDocCustomizeControls,
  isControlVisible,
  type DocCustomizeBooleanControl,
  type DocCustomizeControl,
  type DocCustomizeSelectControl,
} from '@/data/components';

import { useShowcaseColors } from '@/hooks/useShowcaseColors';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import type { ShowcaseColorMap } from '@/hooks/useShowcaseColors';
import { useShowcaseThemeContext } from '@/theme/ShowcaseThemeProvider';
import { edsSpacing } from '@/views/shared/resolveEdsTheme';
import { showcaseTheme as theme } from '@/views/shared/showcaseTheme';

function createCustomizePanelStyles(colors: ShowcaseColorMap) {
  return StyleSheet.create({
    empty: {
      ...theme.font.customizeChipLabel,
      color: colors['text-base-tertiary'] as string,
    },
    slotCategoryTitle: {
      ...theme.font.customizeSlotCategoryTitle,
      color: colors['text-base-primary'] as string,
      paddingHorizontal: EG_ITEM_PAD_H,
      paddingBottom: edsSpacing('spacing-1'),
    },
    slotCategoryTitleFirst: {
      paddingTop: EG_ITEM_PAD_V,
    },
    slotCategoryTitleGap: {
      marginTop: edsSpacing('spacing-6'),
    },
    inlineInput: {
      minWidth: 96,
      maxWidth: 160,
      paddingVertical: 0,
      paddingHorizontal: 0,
      margin: 0,
      textAlign: 'right',
      color: colors['text-base-secondary'] as string,
      ...theme.font.customizeFieldTitle,
    },
  });
}

type CustomizePanelProps = {
  controls: DocCustomizeControl[];
  state: Record<string, unknown>;
  onChange: (next: Record<string, unknown>) => void;
  /** 插槽单卡多段 — 保留兼容；类间仅 `spacing-2` 间距、无分割线。 */
  sectionDividers?: boolean;
};

function applyBooleanChange(
  control: DocCustomizeBooleanControl,
  state: Record<string, unknown>,
  next: boolean,
): Record<string, unknown> {
  const patch: Record<string, unknown> = { [control.key]: next };
  if (next && control.exclusiveKey) {
    patch[control.exclusiveKey] = false;
  }
  if (next && control.exclusiveKeys) {
    for (const key of control.exclusiveKeys) {
      patch[key] = false;
    }
  }
  return { ...state, ...patch };
}

function resolveSelectOptions(control: DocCustomizeSelectControl, state: Record<string, unknown>) {
  return control.resolveOptions?.(state) ?? control.options;
}

function resolveSelectMenuItems(control: DocCustomizeSelectControl, state: Record<string, unknown>): EgMenuItem[] {
  return resolveSelectOptions(control, state).map((option) => ({
    id: String(option.value),
    label: option.label,
  }));
}

function resolveSelectValueLabel(control: DocCustomizeSelectControl, state: Record<string, unknown>): string {
  const options = resolveSelectOptions(control, state);
  const current = options.find((option) => option.value === state[control.key]);
  return current?.label ?? String(state[control.key] ?? '');
}

function shouldShowRowDivider(index: number, visibleControls: DocCustomizeControl[]): boolean {
  if (index >= visibleControls.length - 1) {
    return false;
  }
  const next = visibleControls[index + 1];
  if (next?.kind === 'heading') {
    return false;
  }
  return true;
}

export function CustomizePanel({ controls, state, onChange }: CustomizePanelProps) {
  const colors = useShowcaseColors();
  const styles = useThemedStyles(createCustomizePanelStyles);
  const { colorTheme } = useShowcaseThemeContext();
  const mode = colorTheme === 'dark' ? 'dark' : 'light';

  const visibleControls = useMemo(
    () => filterDocCustomizeControls(controls).filter((control) => isControlVisible(control, state)),
    [controls, state],
  );

  if (visibleControls.length === 0) {
    return <Text style={styles.empty}>No customize controls for this component.</Text>;
  }

  let visibleHeadingIndex = 0;

  return (
    <EgItemGroup mode={mode} testID="showcase-customize-panel">
      {visibleControls.map((control, index) => {
        const showDivider = shouldShowRowDivider(index, visibleControls);

        if (control.kind === 'heading') {
          const isFirstHeading = visibleHeadingIndex === 0;
          visibleHeadingIndex += 1;
          return (
            <Text
              key={control.key}
              style={[
                styles.slotCategoryTitle,
                isFirstHeading ? styles.slotCategoryTitleFirst : styles.slotCategoryTitleGap,
              ]}
            >
              {control.label}
            </Text>
          );
        }

        if (control.kind === 'boolean') {
          const value = Boolean(state[control.key]);
          return (
            <EgItem
              key={control.key}
              label={control.label}
              labelHeavy={control.labelVariant === 'category'}
              trailingEnabled
              trailingDisplay="switch"
              switchValue={value}
              onSwitchValueChange={(next) => onChange(applyBooleanChange(control, state, next))}
              showPressFeedback
              showDivider={showDivider}
              mode={mode}
              testID={`customize-${control.key}`}
            />
          );
        }

        if (control.kind === 'text') {
          return (
            <EgItem
              key={control.key}
              label={control.label}
              trailingEnabled
              trailingDisplay="custom"
              trailing={
                <TextInput
                  style={styles.inlineInput}
                  value={String(state[control.key] ?? '')}
                  placeholder={control.placeholder}
                  placeholderTextColor={colors['text-base-tertiary'] as string}
                  onChangeText={(text) => onChange({ ...state, [control.key]: text })}
                />
              }
              showPressFeedback
              showDivider={showDivider}
              mode={mode}
              testID={`customize-${control.key}`}
            />
          );
        }

        if (control.kind === 'select') {
          const options = resolveSelectOptions(control, state);
          const valueLabel = resolveSelectValueLabel(control, state);
          const selectedId = String(state[control.key] ?? options[0]?.value ?? '');

          if (options.length > 1) {
            return (
              <EgItem
                key={control.key}
                label={control.label}
                value={valueLabel}
                trailingEnabled
                trailingDisplay="menu"
                menuItems={resolveSelectMenuItems(control, state)}
                selectedMenuId={selectedId}
                onMenuSelect={(id) => onChange({ ...state, [control.key]: id })}
                showPressFeedback
                showDivider={showDivider}
                mode={mode}
                testID={`customize-${control.key}`}
              />
            );
          }

          return (
            <EgItem
              key={control.key}
              label={control.label}
              value={valueLabel}
              trailingEnabled={false}
              showPressFeedback
              showDivider={showDivider}
              mode={mode}
              testID={`customize-${control.key}`}
            />
          );
        }

        return null;
      })}
    </EgItemGroup>
  );
}