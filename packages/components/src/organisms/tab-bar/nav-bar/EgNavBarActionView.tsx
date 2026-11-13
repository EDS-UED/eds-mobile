import { View, StyleSheet } from 'react-native';

import { EgButtonGlass } from '../../../molecules/button/button-glass/EgButtonGlass.js';
import { egButtonGlassSplitPairGapPx } from '../../../molecules/button/button-glass/_shared/resolveEgButtonGlassShellStyle.js';
import type { EgNavBarProps } from './EgNavBar.types.js';
import type { EgNavBarAction } from './EgNavBar.types.js';

function resolveNavBarDualIconLayout(action: EgNavBarAction): 'combined' | 'split' {
  if (action.iconLayout === 'combined' || action.iconLayout === 'split') {
    return action.iconLayout;
  }
  return action.iconCount === 2 ? 'split' : 'combined';
}

/** 左 / 右槽 — 单钮或双 icon 拆分（间距 `egButtonGlassSplitPairGapPx`）。 */
export function EgNavBarActionView({
  action,
  mode,
  testID,
}: {
  action: EgNavBarAction;
  mode: EgNavBarProps['mode'];
  testID?: string;
}) {
  const kind = action.kind ?? 'icon';
  const iconCount = action.iconCount === 2 ? 2 : 1;
  const layout = resolveNavBarDualIconLayout(action);

  if (kind === 'icon' && iconCount === 2 && layout === 'split') {
    const gap = egButtonGlassSplitPairGapPx();
    return (
      <View style={[styles.splitRow, { gap }]} testID={testID}>
        <EgButtonGlass
          kind="icon"
          icon={action.icon}
          iconCount={1}
          size={action.size ?? 'md'}
          mode={mode}
          disabled={action.disabled}
          onPress={action.onPress}
          accessibilityLabel={action.accessibilityLabel}
        />
        <EgButtonGlass
          kind="icon"
          icon={action.iconAlt}
          iconCount={1}
          size={action.size ?? 'md'}
          mode={mode}
          disabled={action.disabled}
          onPress={action.onPress}
          accessibilityLabel={action.accessibilityLabel}
        />
      </View>
    );
  }

  return (
    <EgButtonGlass
      kind={kind}
      icon={action.icon}
      iconCount={iconCount}
      iconAlt={action.iconAlt}
      label={action.label}
      size={action.size ?? 'md'}
      disabled={action.disabled}
      onPress={action.onPress}
      accessibilityLabel={action.accessibilityLabel}
      mode={mode}
      testID={testID}
    />
  );
}

const styles = StyleSheet.create({
  splitRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
