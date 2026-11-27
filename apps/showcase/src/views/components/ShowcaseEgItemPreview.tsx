import type { EgMenuItem } from '@eds/mobile-components';
import { EgItem, EgItemGroup, EgSymbol } from '@eds/mobile-components';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import {
  ITEM_DEMO_MENU_ITEMS,
  readItemIconName,
  readItemPadSize,
  readItemPreviewRowCount,
  readItemSubLabel,
  readItemTrailingDisplay,
  readItemTrailingValue,
} from '@/data/components/itemCustomizeModel';

type ShowcaseEgItemPreviewProps = Record<string, unknown>;

type PressIntensity = 'xs' | 'sm' | 'md' | 'lg';

const DEMO_MENU_ITEMS: EgMenuItem[] = ITEM_DEMO_MENU_ITEMS.map((item) => ({
  id: item.value,
  label: item.label,
}));

function DemoIcon({ name, mode }: { name: string; mode: 'light' | 'dark' }) {
  if (!name) return null;
  return (
    <EgSymbol
      name={name}
      mode={mode}
      size="md"
      strokeScaleToken="stroke-lg"
      accessibilityLabel=""
    />
  );
}

export function ShowcaseEgItemPreview(props: ShowcaseEgItemPreviewProps) {
  const mode = props.mode === 'dark' ? 'dark' : 'light';
  const label = String(props.label ?? '修改昵称');
  const subLabel = readItemSubLabel(props);
  const padSize = readItemPadSize(props);
  const widgetEnabled = props.widgetEnabled !== false;
  const trailingDisplay = readItemTrailingDisplay(props);
  const trailingValue = readItemTrailingValue(props);
  const iconName = readItemIconName(props);
  const showDivider = props.showDivider !== false;
  const rowCount = readItemPreviewRowCount(props);
  const interactive = props.interactive !== false;
  const pressIntensity = (props.pressIntensity as PressIntensity | undefined) ?? 'xs';
  const testID = props.testID as string | undefined;

  const customizeMenuId = String(props.menuSelectedId ?? 'default');
  const [menuSelectedId, setMenuSelectedId] = useState(customizeMenuId);

  const customizeSwitchOn = props.trailingSwitchOn === true;
  const [switchOn, setSwitchOn] = useState(customizeSwitchOn);

  useEffect(() => {
    setMenuSelectedId(customizeMenuId);
  }, [customizeMenuId]);

  useEffect(() => {
    setSwitchOn(customizeSwitchOn);
  }, [customizeSwitchOn]);

  const icon = useMemo(
    () => (iconName ? <DemoIcon name={iconName} mode={mode} /> : null),
    [iconName, mode],
  );

  const onMenuSelect = useCallback((id: string) => {
    setMenuSelectedId(id);
  }, []);

  const customTrailing = useMemo(
    () => (
      <EgSymbol
        name="eds-editor"
        mode={mode}
        size="sm"
        strokeScaleToken="stroke-lg"
        accessibilityLabel=""
      />
    ),
    [mode],
  );

  const rows = useMemo(
    () =>
      Array.from({ length: rowCount }, (_, index) => {
        const isPrimaryRow = index === 0;
        const rowDisplay = isPrimaryRow ? trailingDisplay : 'icon';
        const rowTrailingValue = isPrimaryRow ? trailingValue : undefined;

        return (
          <EgItem
            key={index}
            testID={index === 0 ? testID : `${testID ?? 'eg-item'}-${index}`}
            label={index === 0 ? label : `${label} ${index + 1}`}
            subLabel={index === 0 ? subLabel : undefined}
            padSize={padSize}
            value={rowTrailingValue}
            icon={icon}
            trailingEnabled={widgetEnabled}
            trailingDisplay={rowDisplay}
            showChevron
            menuItems={DEMO_MENU_ITEMS}
            selectedMenuId={isPrimaryRow ? menuSelectedId : 'default'}
            onMenuSelect={isPrimaryRow ? onMenuSelect : undefined}
            switchValue={isPrimaryRow && rowDisplay === 'switch' ? switchOn : undefined}
            onSwitchValueChange={isPrimaryRow && rowDisplay === 'switch' ? setSwitchOn : undefined}
            trailing={isPrimaryRow && rowDisplay === 'custom' ? customTrailing : undefined}
            showDivider={showDivider && index < rowCount - 1}
            mode={mode}
            pressIntensity={pressIntensity}
            onPress={
              interactive && rowDisplay === 'icon' ? () => undefined : undefined
            }
          />
        );
      }),
    [
      customTrailing,
      icon,
      interactive,
      label,
      subLabel,
      padSize,
      menuSelectedId,
      mode,
      onMenuSelect,
      pressIntensity,
      rowCount,
      showDivider,
      switchOn,
      testID,
      trailingDisplay,
      trailingValue,
      widgetEnabled,
    ],
  );

  return (
    <View style={styles.root} testID={testID}>
      <EgItemGroup mode={mode}>{rows}</EgItemGroup>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    alignSelf: 'stretch',
    width: '100%',
  },
});