import { Pressable, Text, type ViewStyle } from 'react-native';
import { getThemeColors } from '../../../theme/index.js';
import { resolveColor } from '../../../shared/resolveColor.js';
import { edsFontStyle } from '../../../shared/fontFamily.js';
import { toggleMarkTypography } from '../../../shared/typographyStyles.js';
import type { EgCommonProps, ToggleSize } from '../../../shared/types.js';
import type { ThemeMode } from '../../../theme/index.js';
import { decideStyle } from '../_shared/toggleStyles.js';

export type EgDecideProps = EgCommonProps & {
  size?: ToggleSize;
  decided?: boolean;
  defaultDecided?: boolean;
  disabled?: boolean;
  onDecidedChange?: (decided: boolean) => void;
  style?: ViewStyle;
  mode?: ThemeMode;
};

export function EgDecide({
  size = 'md',
  decided,
  defaultDecided = false,
  disabled = false,
  onDecidedChange,
  testID,
  mode = 'light',
  style,
  accessibilityLabel = 'Decide',
}: EgDecideProps) {
  const isDecided = decided ?? defaultDecided;
  const colors = getThemeColors(mode);

  return (
    <Pressable
      testID={testID ?? 'toggle-decide'}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: isDecided, disabled }}
      disabled={disabled}
      onPress={() => onDecidedChange?.(!isDecided)}
      style={[decideStyle(mode, isDecided, disabled, size), style]}
    >
      {isDecided ? (
        <Text
          style={{
            color: resolveColor(colors, 'text-same-white'),
            ...toggleMarkTypography(size),
            ...edsFontStyle('700'),
          }}
        >
          ✓
        </Text>
      ) : (
        <Text
          style={{
            color: resolveColor(colors, 'text-base-tertiary'),
            ...toggleMarkTypography(size),
            ...edsFontStyle('600'),
          }}
        >
          –
        </Text>
      )}
    </Pressable>
  );
}
