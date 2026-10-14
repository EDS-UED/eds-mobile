import { StyleSheet, View } from 'react-native';
import { getThemeColors, mobileTheme, type ThemeMode } from '../../../theme/index.js';
import { resolveColor } from '../../../shared/resolveColor.js';

/** Figma Input/Pointer (149:2515) — brand caret bar in Tap state. */
export function EgInputPointer({ mode = 'light' }: { mode?: ThemeMode }) {
  const colors = getThemeColors(mode);
  const pointerWidth = 2;
  const pointerHeight = 22;

  return (
    <View
      style={[
        styles.pointer,
        {
          width: pointerWidth,
          minWidth: pointerWidth,
          height: pointerHeight,
          backgroundColor: resolveColor(colors, 'material-brand'),
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  pointer: {
    flexShrink: 0,
    borderRadius: mobileTheme.spacing['radius-full'] as number,
  },
});
