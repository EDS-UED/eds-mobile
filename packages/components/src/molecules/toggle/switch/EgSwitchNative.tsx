import { useState } from 'react';
import { Platform, View } from 'react-native';
import Switch from 'react-native/Libraries/Components/Switch/Switch';

import { resolveColor } from '../../../shared/resolveColor.js';
import { disabledOpacity } from '../../../shared/themeScalars.js';
import { getThemeColors } from '../../../theme/index.js';
import { EG_SWITCH_DEFAULT_VALUE } from '../_shared/toggleComponentDefaults.js';
import type { EgSwitchProps } from './EgSwitch.types.js';

/**
 * iOS 26+ — 系统 `UISwitch` 固有尺寸；`size` 仅保留 API 一致（布局不缩放）。
 * LG/MD/SM token 轨见 `EgSwitchRn` · Android · iOS ≤25。
 */
export function EgSwitchNative({
  size: _size,
  value,
  defaultValue = EG_SWITCH_DEFAULT_VALUE,
  disabled = false,
  onValueChange,
  testID,
  mode = 'light',
  style,
  accessibilityLabel = 'Switch',
}: EgSwitchProps) {
  const colors = getThemeColors(mode);
  const [uncontrolledOn, setUncontrolledOn] = useState(defaultValue);
  const on = value !== undefined ? value : uncontrolledOn;

  const trackOff = resolveColor(colors, 'material-card-deep');
  const trackOn = resolveColor(colors, disabled ? 'status-disable-brand' : 'material-brand');

  return (
    <View style={[{ opacity: disabled ? disabledOpacity() : 1, alignSelf: 'center' }, style]}>
      <Switch
        testID={testID ?? 'toggle-switch'}
        accessibilityLabel={accessibilityLabel}
        accessibilityRole="switch"
        accessibilityState={{ checked: on, disabled }}
        value={on}
        disabled={disabled}
        onValueChange={(next: boolean) => {
          if (disabled) return;
          if (value === undefined) {
            setUncontrolledOn(next);
          }
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