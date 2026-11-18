import type { ViewProps } from 'react-native';
import { getNativeGlassView } from '../../../atoms/glass/nativeLiquidGlass.js';
import { GlassControlShell } from '../../../atoms/glass/GlassControlShell.js';
import { EgGlassCapsuleContent } from './_shared/EgGlassCapsuleContent.js';
import { resolveEgGlassCapsuleNativeLayout } from './_shared/resolveEgGlassCapsuleNativeLayout.js';
import {
  resolveEgGlassCapsuleRenderStack,
  shouldUseEgGlassCapsuleNativeStack,
} from './_shared/resolveEgGlassCapsuleStack.js';
import { resolveEgGlassCapsuleSlots } from './_shared/resolveEgGlassCapsuleSlots.js';
import { EgGlassCapsuleRn } from './EgGlassCapsuleRn.js';
import type { EgGlassCapsuleProps } from './EgGlassCapsule.types.js';

/** iOS 26+ — 系统 Liquid Glass（`GlassView`）；运行时不可用则回退 {@link EgGlassCapsuleRn}。 */
export function EgGlassCapsuleNative(props: EgGlassCapsuleProps & Pick<ViewProps, 'style'>) {
  if (resolveEgGlassCapsuleRenderStack() !== 'native' || !shouldUseEgGlassCapsuleNativeStack() || !getNativeGlassView()) {
    return <EgGlassCapsuleRn {...props} />;
  }

  const {
    kind,
    label,
    icon,
    iconCount = 1,
    iconAlt,
    iconSlot,
    iconSlotEnd,
    avatarSlot,
    size = 'md',
    mode = 'light',
    variant = 'regular',
    disabled,
    onPress,
    testID,
    accessibilityLabel,
    style,
  } = props;

  const resolvedIconCount: 1 | 2 = iconCount === 2 ? 2 : 1;
  const slots = resolveEgGlassCapsuleSlots({
    kind,
    iconCount: resolvedIconCount,
    iconSlot,
    iconSlotEnd,
    avatarSlot,
  });
  const { shape, containerStyle, contentStyle } = resolveEgGlassCapsuleNativeLayout({
    kind,
    size,
    iconCount: resolvedIconCount,
    iconSlot,
    iconSlotEnd,
    avatarSlot,
    style,
  });
  const a11y =
    accessibilityLabel ??
    (kind === 'text'
      ? label ?? '编辑'
      : slots.primaryReplacement || slots.secondaryReplacement
        ? 'Menu'
        : icon ?? 'Menu');

  return (
    <GlassControlShell
      shape={shape}
      shellLayout="component"
      mode={mode}
      variant={variant}
      haptic
      disabled={disabled}
      onPress={onPress}
      testID={testID ?? (kind === 'icon' ? 'button-glass-icon' : 'button-glass-text')}
      accessibilityLabel={a11y}
      style={containerStyle}
      contentStyle={contentStyle}
    >
      <EgGlassCapsuleContent
        kind={kind}
        size={size}
        label={label}
        icon={icon}
        iconCount={resolvedIconCount}
        iconAlt={iconAlt}
        primaryReplacement={slots.primaryReplacement}
        secondaryReplacement={slots.secondaryReplacement}
        mode={mode}
      />
    </GlassControlShell>
  );
}
