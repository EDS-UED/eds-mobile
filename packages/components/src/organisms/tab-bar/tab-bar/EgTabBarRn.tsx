import { StyleSheet, View, type ViewProps } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';

import { EgGlass } from '../../../atoms/glass/EgGlass.js';
import { EgTabBarBottomChrome } from '../_shared/EgTabBarBottomChrome.js';
import { egTabBarStyles } from '../_shared/egTabBarStyles.js';
import { useEgTabBarShellLayout } from '../_shared/useEgTabBarShellLayout.js';
import { useEgTabBarController } from '../_shared/useEgTabBarController.js';
import { EgTabBarItem } from '../tab-bar-item/EgTabBarItem.js';
import type { EgTabBarProps } from './EgTabBar.types.js';

/** Android / iOS ≤25（及文档卡片 `/mobile-components/preview/rn`）— RN + `EgGlass`（`glass-tabbar-box`）。 */
export function EgTabBarRn(props: EgTabBarProps & Pick<ViewProps, 'style'>) {
  const {
    testID,
    edgeToEdge = false,
    style,
    previewBackdrop,
    selectionAccent = 'brand',
  } = props;

  const {
    mode,
    items,
    visualSelectedIndex,
    disabled,
    selectionFill,
    indicatorStyle,
    barAnimatedStyle,
    gesture,
    onItemLayout,
  } = useEgTabBarController(props);

  const shellPad = !edgeToEdge;
  const { rootMinHeight, shellPaddingBottom } = useEgTabBarShellLayout();

  return (
    <View
      style={StyleSheet.flatten([
        shellPad ? [styles.root, { minHeight: rootMinHeight }] : undefined,
        style,
      ])}
    >
      {shellPad ? (
        <EgTabBarBottomChrome
          mode={mode}
          previewBackdrop={previewBackdrop}
          testID={testID ? `${testID}-chrome` : undefined}
        />
      ) : null}
      <View
        testID={testID ?? 'tab-bar-base'}
        style={
          shellPad
            ? StyleSheet.flatten([
                egTabBarStyles.shell,
                { paddingBottom: shellPaddingBottom },
              ])
            : undefined
        }
        accessibilityRole="tablist"
        accessibilityLabel="TabBar"
      >
        <Animated.View style={[egTabBarStyles.interaction, barAnimatedStyle, styles.pillLayer]}>
          <EgGlass
            box="glass-tabbar-box"
            mode={mode}
            previewBackdrop={previewBackdrop}
            testID={testID ? `${testID}-glass` : undefined}
            style={egTabBarStyles.glass}
          >
            <GestureDetector gesture={gesture}>
              <Animated.View style={egTabBarStyles.track} collapsable={false}>
                <Animated.View
                  pointerEvents="none"
                  style={[
                    egTabBarStyles.selectionPill,
                    { backgroundColor: selectionFill },
                    indicatorStyle,
                  ]}
                />
                {items.map((item, index) => (
                  <EgTabBarItem
                    key={item.key}
                    testID={`${testID ?? 'tab-bar-base'}-item-${item.key}`}
                    mode={mode}
                    label={item.label}
                    icon={item.icon}
                    symbolName={item.symbolName}
                    symbolNameSelected={item.symbolNameSelected}
                    selected={index === visualSelectedIndex}
                    embedded
                    disabled={disabled}
                    accessibilityLabel={item.accessibilityLabel}
                    onLayout={onItemLayout(index)}
                    selectionAccent={selectionAccent}
                    style={index < items.length - 1 ? egTabBarStyles.itemOverlap : undefined}
                  />
                ))}
              </Animated.View>
            </GestureDetector>
          </EgGlass>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    alignSelf: 'stretch',
    position: 'relative',
  },
  pillLayer: {
    zIndex: 1,
  },
});
