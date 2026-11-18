import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { EgSymbol } from '../../../atoms/_shared/symbol/EgSymbol.js';
import { mobileTheme, type ThemeMode } from '../../../theme/index.js';
import {
  egButtonGlassInsetPx,
  resolveEgGlassCapsuleDualCapsuleHorizontalPadding,
} from './_shared/resolveEgGlassCapsuleShellStyle.js';

type EgGlassCapsuleNavAvatarFrameProps = {
  children: ReactNode;
};

/** 系统 NavBar custom 项 — 几何对齐 RN `EgGlassCapsule` 头像槽（壳内边距 `spacing-1`）。 */
export function EgGlassCapsuleNavAvatarFrame({ children }: EgGlassCapsuleNavAvatarFrameProps) {
  return <View style={{ padding: egButtonGlassInsetPx() }}>{children}</View>;
}

type EgGlassCapsuleNavIconPlusSlotContentProps = {
  icon: string;
  iconSlotEnd: ReactNode;
  mode?: ThemeMode;
};

/** 系统 NavBar 右栏 — icon + 头像行（玻璃由 `UINavigationBar` 提供）。 */
export function EgGlassCapsuleNavIconPlusSlotContent({
  icon,
  iconSlotEnd,
  mode = 'light',
}: EgGlassCapsuleNavIconPlusSlotContentProps) {
  const spacing = mobileTheme.spacing;
  const { paddingLeft, paddingRight } = resolveEgGlassCapsuleDualCapsuleHorizontalPadding(true);
  const inset = egButtonGlassInsetPx();
  const gap = spacing['spacing-4'] as number;

  return (
    <View style={[styles.row, { paddingLeft, paddingRight, paddingVertical: inset, gap }]}>
      <EgSymbol name={icon} size="md" mode={mode} fillTone="primary" />
      {iconSlotEnd}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
