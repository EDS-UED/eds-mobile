import { Platform, StyleSheet, View, type ViewStyle } from 'react-native';

import { SmoothCornerView } from '../../shared/smoothCorner/SmoothCornerView.js';
import { getThemeColors } from '../../theme/index.js';
import { EgDataListRowPressable } from './egDataListRowPressable.js';
import { getEgDataListRowLayout } from './egDataListMetrics.js';
import type { EgDataListRowProps } from './EgDataListRow.types.js';

export function EgDataListRow({
  children,
  accessibilityLabel,
  onPress,
  onLongPress,
  testID,
  mode = 'light',
  axis = 'row',
  gap,
  contentStyle,
  layout: layoutOverride,
  interactive: interactiveProp,
  pressIntensity = 'xs',
  pressHapticEnabled = false,
  touchGestureEnabled = false,
}: EgDataListRowProps) {
  const colors = getThemeColors(mode);
  const layout = layoutOverride ?? getEgDataListRowLayout();
  const resolvedGap = gap ?? (axis === 'row' ? layout.contentGap : undefined);
  const longPressActive = touchGestureEnabled && onLongPress != null;
  const interactive =
    interactiveProp ?? (onPress != null || longPressActive);

  const rowShell: ViewStyle = {
    flexDirection: axis,
    alignItems: axis === 'row' ? 'center' : 'stretch',
    alignSelf: 'stretch',
    gap: resolvedGap,
    paddingVertical: layout.padV,
    paddingHorizontal: layout.padH,
    borderRadius: layout.borderRadius,
    borderCurve: 'continuous',
    // Android RN 点按底须裁切圆角；iOS 保持 visible 以与其它 organism 一致。
    overflow: Platform.OS === 'android' ? 'hidden' : 'visible',
    flexGrow: 0,
    flexShrink: 0,
  };

  const outerWrap = {
    marginHorizontal: layout.marginH,
    alignSelf: 'stretch' as const,
    overflow: 'visible' as const,
    paddingVertical: layout.slack,
  };

  const rowSurfaceStyle = (pressed: boolean): ViewStyle =>
    StyleSheet.flatten([
      rowShell,
      interactive
        ? {
            backgroundColor: pressed
              ? (colors['event-tap'] as string)
              : (colors['material-hide'] as string),
          }
        : { backgroundColor: 'transparent' },
      contentStyle,
    ]) as ViewStyle;

  const rowSurface = (pressed: boolean) => (
    <SmoothCornerView
      radius={layout.borderRadius}
      style={rowSurfaceStyle(pressed)}
      accessibilityLabel={interactive ? undefined : accessibilityLabel}
    >
      {children}
    </SmoothCornerView>
  );

  if (!interactive) {
    return (
      <View style={outerWrap}>
        {rowSurface(false)}
      </View>
    );
  }

  return (
    <EgDataListRowPressable
      testID={testID}
      accessibilityLabel={accessibilityLabel}
      disabled={!onPress && !longPressActive}
      onPress={onPress}
      onLongPress={longPressActive ? onLongPress : undefined}
      pressHapticEnabled={pressHapticEnabled}
      touchGestureEnabled={touchGestureEnabled}
      pressIntensity={pressIntensity}
      style={({ pressed }) => [
        outerWrap,
        {
          zIndex: pressed ? 1 : 0,
        },
      ]}
    >
      {({ pressed }) => rowSurface(pressed)}
    </EgDataListRowPressable>
  );
}