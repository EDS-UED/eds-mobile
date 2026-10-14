import { Pressable, View, type ViewStyle } from 'react-native';
import type { EgCommonProps, ToggleSize } from '../../../shared/types.js';
import type { ThemeMode } from '../../../theme/index.js';
import { radioDotStyle, radioStyle } from '../_shared/toggleStyles.js';

export type EgRadioProps = EgCommonProps & {
  size?: ToggleSize;
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  style?: ViewStyle;
  mode?: ThemeMode;
};

export function EgRadio({
  size = 'md',
  checked,
  defaultChecked = false,
  disabled = false,
  onCheckedChange,
  testID,
  mode = 'light',
  style,
  accessibilityLabel = 'Radio',
}: EgRadioProps) {
  const isChecked = checked ?? defaultChecked;

  return (
    <Pressable
      testID={testID ?? 'toggle-radio'}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="radio"
      accessibilityState={{ checked: isChecked, disabled }}
      disabled={disabled}
      onPress={() => onCheckedChange?.(!isChecked)}
      style={[radioStyle(mode, isChecked, disabled, size), style]}
    >
      {isChecked ? <View style={radioDotStyle(mode, size)} /> : null}
    </Pressable>
  );
}
