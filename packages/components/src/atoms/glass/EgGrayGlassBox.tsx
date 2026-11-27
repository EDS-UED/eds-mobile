import type { ReactNode } from 'react';
import { Platform, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';

import { isIos26OrLater } from '../../shared/iosVersion.js';
import type { ThemeMode } from '../../theme/index.js';
import { EgGlass } from './EgGlass.js';
import { GlassControlShell } from './GlassControlShell.js';
import { GlassInteraction } from './GlassInteraction.js';
import { getNativeGlassView } from './nativeLiquidGlass.js';
import { shouldUseIosNativeGlassMaterial } from './resolveNativeGlassEnhancement.js';
import type { GlassBoxClassName } from './resolveGlassBox.js';
import type { GlassControlShape } from './types.js';

/** Effect Gray Box · 填色 `material-card-deep` + 毛玻璃（spec `glass-gray-box`）。 */
export const EG_GLASS_GRAY_BOX = 'glass-gray-box' as const satisfies GlassBoxClassName;

type EgGrayGlassBoxProps = {
  mode?: ThemeMode;
  style?: StyleProp<ViewStyle>;
  children: ReactNode;
  /** 与 Button Box 同栈 · `GlassControlShell` / `GlassInteraction` + press。 */
  interactive?: boolean;
  shape?: GlassControlShape;
  disabled?: boolean;
  onPress?: () => void;
  testID?: string;
  accessibilityLabel?: string;
};

function useGrayGlassNativeStack() {
  const GlassView = getNativeGlassView();
  return (
    Platform.OS === 'ios' &&
    isIos26OrLater() &&
    shouldUseIosNativeGlassMaterial() &&
    Boolean(GlassView)
  );
}

/**
 * Gray Box — iOS 26+ 与 Button Box 同原生/回退栈（仅 `glass-gray-box` 材质不同）；
 * Android · iOS ≤25 · `EgGlass` + gray。
 */
export function EgGrayGlassBox({
  mode = 'light',
  style,
  children,
  interactive = false,
  shape = 'capsule',
  disabled = false,
  onPress,
  testID,
  accessibilityLabel,
}: EgGrayGlassBoxProps) {
  const useNative = useGrayGlassNativeStack();
  const shellStyle = StyleSheet.flatten(
    [useNative ? styles.nativeShell : styles.shell, style],
  ) as ViewStyle;

  if (useNative && interactive) {
    return (
      <GlassControlShell
        shape={shape}
        shellLayout="component"
        mode={mode}
        variant="regular"
        disabled={disabled}
        onPress={onPress}
        testID={testID}
        accessibilityLabel={accessibilityLabel}
        haptic
        style={shellStyle}
        contentStyle={styles.interactiveHit}
      >
        {children}
      </GlassControlShell>
    );
  }

  if (useNative) {
    const GlassView = getNativeGlassView();
    if (!GlassView) {
      return (
        <EgGlass box={EG_GLASS_GRAY_BOX} mode={mode} style={shellStyle}>
          {children}
        </EgGlass>
      );
    }
    return (
      <GlassView
        isInteractive={false}
        glassEffectStyle="regular"
        colorScheme={mode === 'dark' ? 'dark' : 'light'}
        style={[styles.nativeShell, shellStyle]}
      >
        {children}
      </GlassView>
    );
  }

  if (interactive) {
    return (
      <GlassInteraction
        press
        pressIntensity="sm"
        haptic
        disabled={disabled}
        onPress={onPress}
        testID={testID}
        accessibilityLabel={accessibilityLabel}
        style={styles.rnHit}
      >
        <EgGlass box={EG_GLASS_GRAY_BOX} mode={mode} style={shellStyle}>
          {children}
        </EgGlass>
      </GlassInteraction>
    );
  }

  return (
    <EgGlass box={EG_GLASS_GRAY_BOX} mode={mode} style={shellStyle}>
      {children}
    </EgGlass>
  );
}

const styles = StyleSheet.create({
  shell: {
    overflow: 'hidden',
  },
  /** 对齐 `GlassControlShell` 原生壳 — 勿裁切 `isInteractive` 形变。 */
  nativeShell: {
    overflow: 'visible',
  },
  interactiveHit: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
  },
  rnHit: {
    alignSelf: 'stretch',
  },
});