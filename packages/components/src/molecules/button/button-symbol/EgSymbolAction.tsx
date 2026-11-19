import { StyleSheet } from 'react-native';

import { EgSymbol } from '../../../atoms/_shared/symbol/EgSymbol.js';
import { EgSpinner } from '../../../shared/EgSpinner.js';
import { EgEdsAnimaPress } from '../../../shared/motion/EgEdsAnimaPress.js';
import { resolveColor } from '../../../shared/resolveColor.js';
import { disabledOpacity } from '../../../shared/themeScalars.js';
import { getThemeColors, mobileTheme } from '../../../theme/index.js';
import type { EgSymbolActionProps } from './EgSymbolAction.types.js';
import { resolveEgSymbolActionAppearance } from './resolveEgSymbolActionAppearance.js';
import {
  resolveEgSymbolActionContainerPx,
  resolveEgSymbolActionSymbolSize,
} from './resolveEgSymbolActionMetrics.js';

const DEFAULT_ICON = 'eds-add';

export function EgSymbolAction({
  size = 'md',
  tone = 'brand',
  disabled = false,
  loading = false,
  icon = DEFAULT_ICON,
  onPress,
  testID,
  mode = 'light',
  style,
  accessibilityLabel,
}: EgSymbolActionProps) {
  const colors = getThemeColors(mode);
  const dimension = resolveEgSymbolActionContainerPx(size);
  const symbolSize = resolveEgSymbolActionSymbolSize(size);
  const isDisabled = disabled || loading;

  return (
    <EgEdsAnimaPress
      testID={testID ?? 'button-icon-container'}
      accessibilityLabel={accessibilityLabel ?? 'Symbol action'}
      disabled={isDisabled}
      onPress={onPress}
      pressScaleDirection="down"
      pressIntensity="lg"
      style={({ pressed }) => {
        const appearance = resolveEgSymbolActionAppearance(colors, tone, pressed);
        return [
          styles.base,
          {
            width: dimension,
            height: dimension,
            borderRadius: mobileTheme.spacing['radius-full'] as number,
            backgroundColor: appearance.backgroundColor,
            opacity: isDisabled ? disabledOpacity() : 1,
          },
          style,
        ];
      }}
    >
      {({ pressed }) => {
        const appearance = resolveEgSymbolActionAppearance(colors, tone, pressed);
        if (loading) {
          return <EgSpinner color={resolveColor(colors, appearance.spinnerColorToken)} />;
        }
        return (
          <EgSymbol
            name={icon}
            size={symbolSize}
            mode={mode}
            strokeColorToken={appearance.strokeColorToken}
          />
        );
      }}
    </EgEdsAnimaPress>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});