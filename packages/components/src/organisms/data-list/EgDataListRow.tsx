import { StyleSheet, View, type ViewStyle } from 'react-native';

import { getThemeColors } from '../../theme/index.js';
import { EgDataListRowPressable } from './egDataListRowPressable.js';
import { getEgDataListRowLayout } from './egDataListMetrics.js';
import type { EgDataListRowProps } from './EgDataListRow.types.js';

export function EgDataListRow({
  children,
  accessibilityLabel,
  onPress,
  onLongPress,
  onForcePress,
  testID,
  mode = 'light',
  axis = 'row',
  gap,
  contentStyle,
  layout: layoutOverride,
  interactive: interactiveProp,
  pressIntensity = 'xs',
  forceTouchEnabled = false,
}: EgDataListRowProps) {
  const colors = getThemeColors(mode);
  const layout = layoutOverride ?? getEgDataListRowLayout();
  const resolvedGap = gap ?? (axis === 'row' ? layout.contentGap : undefined);
  const interactive =
    interactiveProp ??
    (onPress != null ||
      onLongPress != null ||
      (forceTouchEnabled && onForcePress != null));

  const rowShell: ViewStyle = {
    flexDirection: axis,
    alignItems: axis === 'row' ? 'center' : 'stretch',
    alignSelf: 'stretch',
    gap: resolvedGap,
    paddingVertical: layout.padV,
    paddingHorizontal: layout.padH,
    borderRadius: layout.borderRadius,
    borderCurve: 'continuous',
    overflow: 'visible',
    flexGrow: 0,
    flexShrink: 0,
  };

  const outerWrap = {
    marginHorizontal: layout.marginH,
    alignSelf: 'stretch' as const,
    overflow: 'visible' as const,
    paddingVertical: layout.slack,
  };

  const rowInner = (pressed: boolean) => (
    <View
      style={StyleSheet.flatten([
        rowShell,
        interactive
          ? {
              backgroundColor: pressed
                ? (colors['event-tap'] as string)
                : (colors['material-hide'] as string),
            }
          : { backgroundColor: 'transparent' },
        contentStyle,
      ])}
      accessibilityLabel={interactive ? undefined : accessibilityLabel}
    >
      {children}
    </View>
  );

  if (!interactive) {
    return (
      <View style={outerWrap}>
        {rowInner(false)}
      </View>
    );
  }

  return (
    <EgDataListRowPressable
      testID={testID}
      accessibilityLabel={accessibilityLabel}
      disabled={!onPress && !onLongPress && !(forceTouchEnabled && onForcePress)}
      onPress={onPress}
      onLongPress={onLongPress}
      onForcePress={onForcePress}
      forceTouchEnabled={forceTouchEnabled}
      pressIntensity={pressIntensity}
      style={({ pressed }) => [
        outerWrap,
        {
          zIndex: pressed ? 1 : 0,
        },
      ]}
    >
      {({ pressed }) => rowInner(pressed)}
    </EgDataListRowPressable>
  );
}