import { Platform, View } from 'react-native';
import Switch from 'react-native/Libraries/Components/Switch/Switch';

import { resolveColor } from '../../../shared/resolveColor.js';
import { disabledOpacity } from '../../../shared/themeScalars.js';
import { getThemeColors } from '../../../theme/index.js';
import type { EgSwitchProps } from './EgSwitch.types.js';

/** iOS 26+ — 系统 `UISwitch`（品牌 on 轨着色 · 关态 ios_backgroundColor）。 */
export function EgSwitchNative({
  value,
  defaultValue = false,
  disabled = false,
  onValueChange,
  testID,
  mode = 'light',
  style,
  accessibilityLabel = 'Switch',
}: EgSwitchProps) {
  const colors = getThemeColors(mode);
  const on = value ?? defaultValue;

  const trackOff = resolveColor(colors, 'material-card-deep');
  const trackOn = resolveColor(colors, disabled ? 'status-disable-brand' : 'material-brand');

  return (
    <View style={[{ opacity: disabled ? disabledOpacity() : 1 }, style]}>
      <Switch
        testID={testID ?? 'toggle-switch'}
        accessibilityLabel={accessibilityLabel}
        accessibilityRole="switch"
        accessibilityState={{ checked: on, disabled }}
        value={on}
        disabled={disabled}
        onValueChange={(next: boolean) => {
          if (disabled) return;
          onValueChange?.(next);
        }}
        trackColor={{
          false: trackOff,
          true: trackOn,
        }}
        thumbColor={Platform.OS === 'android' ? resolveColor(colors, 'material-same-white') : undefined}
        ios_backgroundColor={trackOff}
      />
    </View>
  );
}