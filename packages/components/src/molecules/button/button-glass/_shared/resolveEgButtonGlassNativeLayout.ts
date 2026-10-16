import type { ReactNode } from 'react';
import { StyleSheet, type ViewStyle } from 'react-native';
import type { GlassControlShape } from '../../../../atoms/glass/types.js';
import type { ControlSize } from '../../../../shared/types.js';
import type { EgButtonGlassIconCount, EgButtonGlassKind } from '../EgButtonGlass.types.js';
import {
  resolveEgButtonGlassNativeContainerStyle,
  resolveEgButtonGlassNativePressableStyle,
} from './resolveEgButtonGlassShellStyle.js';
import { resolveEgButtonGlassSlots } from './resolveEgButtonGlassSlots.js';

export type EgButtonGlassNativeLayout = {
  shape: GlassControlShape;
  containerStyle: ViewStyle;
  contentStyle: ViewStyle;
};

export function resolveEgButtonGlassNativeLayout(input: {
  kind: EgButtonGlassKind;
  size: ControlSize;
  iconCount: EgButtonGlassIconCount;
  iconSlot?: ReactNode;
  iconSlotEnd?: ReactNode;
  avatarSlot?: ReactNode;
  style?: ViewStyle;
}): EgButtonGlassNativeLayout {
  const { kind, size, iconCount, iconSlot, iconSlotEnd, avatarSlot, style } = input;
  const slots = resolveEgButtonGlassSlots({ kind, iconCount, iconSlot, iconSlotEnd, avatarSlot });
  const rightIsAvatar = Boolean(slots.secondaryReplacement);

  const container = resolveEgButtonGlassNativeContainerStyle(
    kind,
    size,
    iconCount,
    rightIsAvatar,
  );

  const shape: GlassControlShape =
    kind === 'icon' && iconCount === 1 ? 'circle' : 'capsule';

  const contentStyle = resolveEgButtonGlassNativePressableStyle(
    kind,
    size,
    iconCount,
    rightIsAvatar,
  );

  return {
    shape,
    containerStyle: StyleSheet.flatten([container, style]) as ViewStyle,
    contentStyle,
  };
}
