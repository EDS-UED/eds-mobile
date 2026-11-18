import type { ReactNode } from 'react';
import { StyleSheet, type ViewStyle } from 'react-native';
import type { GlassControlShape } from '../../../../atoms/glass/types.js';
import type { ControlSize } from '../../../../shared/types.js';
import type { EgGlassCapsuleIconCount, EgGlassCapsuleKind } from '../EgGlassCapsule.types.js';
import {
  resolveEgGlassCapsuleNativeContainerStyle,
  resolveEgGlassCapsuleNativePressableStyle,
} from './resolveEgGlassCapsuleShellStyle.js';
import { resolveEgGlassCapsuleSlots } from './resolveEgGlassCapsuleSlots.js';

export type EgGlassCapsuleNativeLayout = {
  shape: GlassControlShape;
  containerStyle: ViewStyle;
  contentStyle: ViewStyle;
};

export function resolveEgGlassCapsuleNativeLayout(input: {
  kind: EgGlassCapsuleKind;
  size: ControlSize;
  iconCount: EgGlassCapsuleIconCount;
  iconSlot?: ReactNode;
  iconSlotEnd?: ReactNode;
  avatarSlot?: ReactNode;
  style?: ViewStyle;
}): EgGlassCapsuleNativeLayout {
  const { kind, size, iconCount, iconSlot, iconSlotEnd, avatarSlot, style } = input;
  const slots = resolveEgGlassCapsuleSlots({ kind, iconCount, iconSlot, iconSlotEnd, avatarSlot });
  const rightIsAvatar = Boolean(slots.secondaryReplacement);

  const container = resolveEgGlassCapsuleNativeContainerStyle(
    kind,
    size,
    iconCount,
    rightIsAvatar,
  );

  const shape: GlassControlShape =
    kind === 'icon' && iconCount === 1 ? 'circle' : 'capsule';

  const contentStyle = resolveEgGlassCapsuleNativePressableStyle(
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
