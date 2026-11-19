import { useRef, type ComponentProps } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';

import { EgSymbol } from '../../atoms/_shared/symbol/EgSymbol.js';
import { EgDivider } from '../../atoms/divider/divider/EgDivider.js';
import { EgMenu } from '../../molecules/dropdown/menu/EgMenu.js';
import type { EgMenuTriggerContext } from '../../molecules/dropdown/menu/EgMenu.types.js';
import { shouldUseEgMenuNativeStack } from '../../molecules/dropdown/menu/_shared/resolveEgMenuStack.js';
import { EgSwitch } from '../../molecules/toggle/switch/EgSwitch.js';
import { EdsSansText } from '../../shared/EdsSansText.js';
import { resolveColor } from '../../shared/resolveColor.js';
import { fieldTypography, presetBodyMediumHeavy } from '../../shared/typographyStyles.js';
import { getThemeColors } from '../../theme/index.js';
import { EgDataListRowPressable } from '../data-list/egDataListRowPressable.js';
import {
  EG_ITEM_ICON_GAP,
  EG_ITEM_ICON_SLOT,
  EG_ITEM_MIN_HEIGHT,
  EG_ITEM_PAD_H,
  EG_ITEM_PAD_V,
  EG_ITEM_TAP_RADIUS,
  EG_ITEM_TRAILING_GAP,
  getEgItemDividerInset,
} from './egItemMetrics.js';
import type { EgItemProps } from './EgItem.types.js';

const BODY_MEDIUM = fieldTypography('xl');
const BODY_SMALL = fieldTypography('md');

const TRAILING_ICON = 'eds-arrow-right-mini-ios';
const MENU_TRAILING_ICON = 'eds-arrow-integrated-sort-mini';

function EgItemIconTrailing({
  value,
  showChevron,
  mode,
  colors,
}: {
  value?: string;
  showChevron: boolean;
  mode: EgItemProps['mode'];
  colors: ReturnType<typeof getThemeColors>;
}) {
  const chevron =
    showChevron && value == null ? (
      <EgSymbol
        name={TRAILING_ICON}
        mode={mode}
        size="sm"
        strokeColorToken="text-base-secondary"
        accessibilityLabel=""
      />
    ) : null;

  const valueRow =
    value != null ? (
      <>
        <EdsSansText
          style={[
            BODY_SMALL,
            styles.trailingValue,
            { color: colors['text-base-secondary'] as string },
          ]}
          numberOfLines={1}
        >
          {value}
        </EdsSansText>
        {showChevron ? (
          <EgSymbol
            name={TRAILING_ICON}
            mode={mode}
            size="sm"
            strokeColorToken="text-base-secondary"
            accessibilityLabel=""
          />
        ) : null}
      </>
    ) : null;

  return <View style={styles.trailing}>{valueRow ?? chevron}</View>;
}

type EgItemMenuTrailingProps = {
  value?: string;
  mode: EgItemProps['mode'];
  colors: ReturnType<typeof getThemeColors>;
  menuProps: Omit<ComponentProps<typeof EgMenu>, 'trigger'>;
  onRegisterOpen: (open: () => void) => void;
};

function EgItemMenuTrailing({ value, mode, colors, menuProps, onRegisterOpen }: EgItemMenuTrailingProps) {
  const nativeMenu = shouldUseEgMenuNativeStack();

  const trailingVisual = (
    <View style={styles.trailing} pointerEvents={nativeMenu ? 'auto' : 'none'}>
      {value != null ? (
        <EdsSansText
          style={[
            BODY_SMALL,
            styles.trailingValue,
            { color: colors['text-base-secondary'] as string },
          ]}
          numberOfLines={1}
        >
          {value}
        </EdsSansText>
      ) : null}
      <EgSymbol
        name={MENU_TRAILING_ICON}
        mode={mode}
        size="sm"
        strokeColorToken="text-base-secondary"
        accessibilityLabel=""
      />
    </View>
  );

  return (
    <EgMenu
      {...menuProps}
      trigger={(ctx: EgMenuTriggerContext) => {
        onRegisterOpen(ctx.open);
        return trailingVisual;
      }}
    />
  );
}

function EgItemSwitchTrailing({
  value,
  mode,
  colors,
  switchValue,
  defaultSwitchValue,
  onSwitchValueChange,
  switchSize = 'md',
  testID,
  accessibilityLabel,
}: {
  value?: string;
  mode: EgItemProps['mode'];
  colors: ReturnType<typeof getThemeColors>;
  switchValue?: boolean;
  defaultSwitchValue?: boolean;
  onSwitchValueChange?: (value: boolean) => void;
  switchSize?: EgItemProps['switchSize'];
  testID?: string;
  accessibilityLabel?: string;
}) {
  return (
    <View style={styles.trailing}>
      {value != null ? (
        <EdsSansText
          style={[
            BODY_SMALL,
            styles.trailingValue,
            { color: colors['text-base-secondary'] as string },
          ]}
          numberOfLines={1}
        >
          {value}
        </EdsSansText>
      ) : null}
      <EgSwitch
        testID={testID ? `${testID}-switch` : undefined}
        mode={mode}
        size={switchSize}
        value={switchValue}
        defaultValue={defaultSwitchValue}
        onValueChange={onSwitchValueChange}
        accessibilityLabel={accessibilityLabel ?? 'Switch'}
      />
    </View>
  );
}

/** 设置 / 个人中心列表行 — 图形 · 主文案 · 右侧挂件 · module 分割线。 */
export function EgItem({
  label,
  labelHeavy = false,
  value,
  icon,
  trailingEnabled = true,
  trailingDisplay = 'icon',
  showChevron = true,
  menuItems,
  selectedMenuId,
  onMenuSelect,
  switchValue,
  defaultSwitchValue,
  onSwitchValueChange,
  switchSize = 'md',
  trailing: trailingSlot,
  showDivider = true,
  onPress,
  showPressFeedback = false,
  testID,
  mode = 'light',
  pressIntensity = 'xs',
  style,
  accessibilityLabel,
}: EgItemProps) {
  const colors = getThemeColors(mode);
  const hasIcon = icon != null;
  const dividerInset = getEgItemDividerInset(hasIcon);
  const openMenuRef = useRef<(() => void) | null>(null);

  const interactive =
    showPressFeedback ||
    trailingDisplay === 'menu' ||
    (trailingDisplay === 'icon' && onPress != null) ||
    (trailingDisplay === 'custom' && onPress != null);

  const rowShell = (pressed: boolean): ViewStyle =>
    StyleSheet.flatten([
      styles.row,
      style,
      interactive && pressed
        ? { backgroundColor: resolveColor(colors, 'event-tap') }
        : null,
    ]) as ViewStyle;

  const trailing = !trailingEnabled ? null : trailingDisplay === 'menu' ? (
    <EgItemMenuTrailing
      value={value}
      mode={mode}
      colors={colors}
      menuProps={{
        mode,
        items: menuItems,
        selectedId: selectedMenuId,
        onSelect: onMenuSelect,
        align: 'end',
        testID: testID ? `${testID}-menu` : undefined,
        accessibilityLabel: accessibilityLabel ?? label,
      }}
      onRegisterOpen={(open) => {
        openMenuRef.current = open;
      }}
    />
  ) : trailingDisplay === 'switch' ? (
    <EgItemSwitchTrailing
      value={value}
      mode={mode}
      colors={colors}
      switchValue={switchValue}
      defaultSwitchValue={defaultSwitchValue}
      onSwitchValueChange={onSwitchValueChange}
      switchSize={switchSize}
      testID={testID}
      accessibilityLabel={accessibilityLabel ?? label}
    />
  ) : trailingDisplay === 'custom' ? (
    <View style={styles.trailing}>{trailingSlot}</View>
  ) : (
    <EgItemIconTrailing value={value} showChevron={showChevron} mode={mode} colors={colors} />
  );

  const handlePress = () => {
    if (trailingDisplay === 'menu') {
      openMenuRef.current?.();
      return;
    }
    onPress?.();
  };

  const rowBody = (
    <>
      {hasIcon ? <View style={styles.iconSlot}>{icon}</View> : null}
      <View style={styles.labelWrap}>
        <EdsSansText
          style={[
            labelHeavy ? presetBodyMediumHeavy() : BODY_MEDIUM,
            { color: colors['text-base-primary'] as string },
          ]}
          numberOfLines={1}
        >
          {label}
        </EdsSansText>
      </View>
      {trailing}
    </>
  );

  const row = interactive ? (
    <EgDataListRowPressable
      testID={testID}
      accessibilityLabel={accessibilityLabel ?? label}
      onPress={handlePress}
      pressIntensity={pressIntensity}
      style={({ pressed }) => rowShell(pressed)}
    >
      {rowBody}
    </EgDataListRowPressable>
  ) : (
    <View testID={testID} accessibilityLabel={accessibilityLabel ?? label} style={rowShell(false)}>
      {rowBody}
    </View>
  );

  return (
    <>
      {row}
      {showDivider ? (
        <View style={[styles.dividerWrap, { paddingLeft: dividerInset, paddingRight: EG_ITEM_PAD_H }]}>
          <EgDivider variant="module" mode={mode} orientation="horizontal" />
        </View>
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    width: '100%',
    paddingHorizontal: EG_ITEM_PAD_H,
    paddingVertical: EG_ITEM_PAD_V,
    minHeight: EG_ITEM_MIN_HEIGHT,
    borderRadius: EG_ITEM_TAP_RADIUS,
    borderCurve: 'continuous',
  },
  iconSlot: {
    width: EG_ITEM_ICON_SLOT,
    marginRight: EG_ITEM_ICON_GAP,
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelWrap: {
    flex: 1,
    minWidth: 0,
  },
  trailing: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: EG_ITEM_TRAILING_GAP,
    flexShrink: 0,
    marginLeft: 'auto',
  },
  trailingValue: {
    textAlign: 'right',
    maxWidth: 160,
  },
  dividerWrap: {
    alignSelf: 'stretch',
  },
});