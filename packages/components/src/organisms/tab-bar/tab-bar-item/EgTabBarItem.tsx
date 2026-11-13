import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type ViewProps,
} from 'react-native';

import { EgSymbol } from '../../../atoms/_shared/symbol/EgSymbol.js';
import { resolveColor } from '../../../shared/resolveColor.js';
import { getThemeColors, mobileTheme } from '../../../theme/index.js';
import { renderTabBarItemSymbol } from '../_shared/renderTabBarItemSymbol.js';
import {
  TAB_BAR_ICON_SIZE,
  TAB_BAR_ICON_SLOT,
  TAB_BAR_ITEM_GAP,
  TAB_BAR_ITEM_PADDING_VERTICAL,
  TAB_BAR_PILL_RADIUS,
} from '../_shared/tabBarMetrics.js';
import { egTabBarSelectionLabelToken } from '../_shared/tabBarSelectionAccent.js';
import { tabBarLabelTypography } from '../_shared/tabBarTypography.js';
import type { EgTabBarItemProps } from './EgTabBarItem.types.js';

export function EgTabBarItem(
  props: EgTabBarItemProps & Pick<ViewProps, 'style'>,
) {
  const {
    testID,
    mode = 'light',
    label,
    selected = false,
    disabled = false,
    embedded = false,
    icon,
    symbolName,
    symbolNameSelected,
    onPress,
    onLayout,
    style,
    accessibilityLabel,
    selectionAccent = 'brand',
  } = props;

  const colors = getThemeColors(mode);
  const showItemSelectionBg = selected && !embedded;
  const labelColor = resolveColor(
    colors,
    selected ? egTabBarSelectionLabelToken(selectionAccent) : 'text-base-primary',
  );

  const defaultIcon = (
    <EgSymbol
      name="eds-square"
      mode={mode}
      size={TAB_BAR_ICON_SIZE}
      strokeColorToken={selected ? 'stroke-color-brand' : 'stroke-base-primary'}
    />
  );

  const tabIcon =
    icon ??
    (symbolName
      ? renderTabBarItemSymbol({
          symbolName,
          symbolNameSelected,
          selected,
          mode,
          selectionAccent,
        })
      : defaultIcon);

  const content = (
    <>
      <View style={styles.iconSlot}>{tabIcon}</View>
      <Text
        style={[tabBarLabelTypography(selected), { color: labelColor }]}
        numberOfLines={1}
      >
        {label}
      </Text>
    </>
  );

  if (embedded) {
    const hostProps = {
      style: StyleSheet.flatten([styles.itemHost, style]),
      onLayout,
      accessibilityRole: 'tab' as const,
      accessibilityState: { selected, disabled },
      accessibilityLabel: accessibilityLabel ?? label,
      testID: testID ?? 'tab-bar-item',
    };

    if (onPress) {
      return (
        <View {...hostProps} pointerEvents="box-none">
          <Pressable
            disabled={disabled}
            onPress={onPress}
            style={({ pressed }) =>
              StyleSheet.flatten([styles.item, pressed && !disabled ? styles.itemPressed : undefined]) ??
              styles.item
            }
          >
            {content}
          </Pressable>
        </View>
      );
    }

    return (
      <View {...hostProps} pointerEvents="none">
        <View style={styles.item}>{content}</View>
      </View>
    );
  }

  return (
    <View style={StyleSheet.flatten([styles.itemHost, style])} onLayout={onLayout}>
      <Pressable
        testID={testID ?? 'tab-bar-item'}
        accessibilityRole="tab"
        accessibilityState={{ selected, disabled }}
        accessibilityLabel={accessibilityLabel ?? label}
        disabled={disabled}
        onPress={onPress}
        style={({ pressed }) =>
          StyleSheet.flatten([
            styles.item,
            showItemSelectionBg
              ? { backgroundColor: resolveColor(colors, 'event-focus') }
              : undefined,
            pressed && !disabled ? styles.itemPressed : undefined,
          ]) ?? styles.item
        }
      >
        {content}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  itemHost: {
    flex: 1,
    minWidth: 0,
    zIndex: 1,
  },
  item: {
    flex: 1,
    minWidth: 0,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    borderRadius: TAB_BAR_PILL_RADIUS,
    paddingHorizontal: mobileTheme.spacing['spacing-2'] as number,
    paddingVertical: TAB_BAR_ITEM_PADDING_VERTICAL,
    gap: TAB_BAR_ITEM_GAP,
  },
  itemPressed: {
    opacity: 0.92,
  },
  iconSlot: {
    width: TAB_BAR_ICON_SLOT,
    height: TAB_BAR_ICON_SLOT,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
