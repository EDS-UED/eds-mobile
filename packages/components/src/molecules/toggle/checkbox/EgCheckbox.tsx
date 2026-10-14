import { Pressable, Text, type ViewStyle } from 'react-native';
import { getThemeColors } from '../../../theme/index.js';
import { resolveColor } from '../../../shared/resolveColor.js';
import { edsFontStyle } from '../../../shared/fontFamily.js';
import { toggleMarkTypography } from '../../../shared/typographyStyles.js';
import type { EgCommonProps, ToggleSize } from '../../../shared/types.js';
import type { ThemeMode } from '../../../theme/index.js';
import { checkboxStyle } from '../_shared/toggleStyles.js';

export type EgCheckboxProps = EgCommonProps & {
  size?: ToggleSize;
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  style?: ViewStyle;
  mode?: ThemeMode;
};

export function EgCheckbox({
  size = 'md',
  checked,
  defaultChecked = false,
  disabled = false,
  onCheckedChange,
  testID,
  mode = 'light',
  style,
  accessibilityLabel = 'Checkbox',
}: EgCheckboxProps) {
  const isChecked = checked ?? defaultChecked;
  const colors = getThemeColors(mode);

  return (
    <Pressable
      testID={testID ?? 'toggle-checkbox'}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: isChecked, disabled }}
      disabled={disabled}
      onPress={() => onCheckedChange?.(!isChecked)}
      style={[checkboxStyle(mode, isChecked, disabled, size), style]}
    >
      {isChecked ? (
        <Text
          style={{
            color: resolveColor(colors, 'text-same-white'),
            ...toggleMarkTypography(size),
            ...edsFontStyle('700'),
          }}
        >
          ✓
        </Text>
      ) : null}
    </Pressable>
  );
}
