import { StyleSheet, View, type ViewStyle } from 'react-native';
import { mobileTheme } from '../../../theme/index.js';
import type { EgCommonProps } from '../../../shared/types.js';
import type { ThemeMode } from '../../../theme/index.js';
import { EgInputPointer as InputCaretBar } from '../_shared/EgInputPointer.js';

export type EgInputPointerProps = EgCommonProps & {
  mode?: ThemeMode;
  style?: ViewStyle;
};

/** Figma Input/Pointer — brand caret bar used in Tap / Entering fields. */
export function EgInputPointer({ testID, mode = 'light', style }: EgInputPointerProps) {
  return (
    <View testID={testID ?? 'input-pointer'} style={[styles.wrap, style]} accessibilityLabel="Input pointer">
      <InputCaretBar mode={mode} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    height: mobileTheme.spacing['symbol-lg'] as number,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
});
