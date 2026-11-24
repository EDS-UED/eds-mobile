import type { ReactNode } from 'react';
import { Modal, Platform, StyleSheet } from 'react-native';
import { ScreenStack, ScreenStackItem } from 'react-native-screens';

import { shouldUseEgNavBarNativeStack } from '../../organisms/tab-bar/nav-bar/EgNavBar.js';

/** RN ≥0.77 Modal 属性 · 包内类型声明滞后；须与 `statusBarTranslucent` 同开，弹层才铺到导航栏下。 */
const androidNavigationBarTranslucent = (
  Platform.OS === 'android' ? { navigationBarTranslucent: true } : {}
) as object;

/**
 * 全屏透明浮层（page-shot 弹层 / 页面栈演示）。
 * iOS 26+ 内含原生栈（系统 NavBar）— 须由 react-native-screens `transparentModal` 承载：RN `Modal` 不在 React 根下，
 * 其内每个 `RNSScreen` 另挂 touch handler 与 Modal 自带的重复，点按全部失效。Android · iOS ≤25 → RN `Modal`。
 */
export function EgEdsAnimaOverlayModal({
  visible,
  presentationKey = 0,
  onRequestClose,
  onShow,
  children,
}: {
  visible: boolean;
  /**
   * iOS 26+ `ScreenStackItem` 每次呈现的唯一段（默认 0）· page-shot 每次打开递增，
   * 避免复用 `transparentModal` 导致浮层内液态玻璃钮二次失效。
   */
  presentationKey?: number;
  onRequestClose?: () => void;
  onShow?: () => void;
  children: ReactNode;
}) {
  if (!shouldUseEgNavBarNativeStack()) {
    return (
      <Modal
        visible={visible}
        transparent
        animationType="none"
        onRequestClose={onRequestClose}
        onShow={onShow}
        statusBarTranslucent={Platform.OS === 'android'}
        {...androidNavigationBarTranslucent}
      >
        {children}
      </Modal>
    );
  }

  return (
    <ScreenStack style={styles.host}>
      <ScreenStackItem
        screenId="eg-overlay-base"
        activityState={2}
        style={StyleSheet.absoluteFill}
        contentStyle={styles.transparent}
        headerConfig={{ hidden: true }}
      >
        {null}
      </ScreenStackItem>
      {visible ? (
        <ScreenStackItem
          key={`eg-overlay-${presentationKey}`}
          screenId={`eg-overlay-${presentationKey}`}
          activityState={2}
          stackPresentation="transparentModal"
          stackAnimation="none"
          gestureEnabled={false}
          style={StyleSheet.absoluteFill}
          contentStyle={styles.transparent}
          headerConfig={{ hidden: true }}
          onAppear={onShow}
          onDismissed={onRequestClose}
        >
          {children}
        </ScreenStackItem>
      ) : null}
    </ScreenStack>
  );
}

const styles = StyleSheet.create({
  host: {
    position: 'absolute',
    width: 0,
    height: 0,
  },
  transparent: {
    backgroundColor: 'transparent',
  },
});