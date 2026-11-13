import type { ViewProps } from 'react-native';
import { getNativeGlassView } from '../../../atoms/glass/nativeLiquidGlass.js';
import { GlassControlShell } from '../../../atoms/glass/GlassControlShell.js';
import { EgButtonGlassContent } from './_shared/EgButtonGlassContent.js';
import { resolveEgButtonGlassNativeLayout } from './_shared/resolveEgButtonGlassNativeLayout.js';
import {
  resolveEgButtonGlassRenderStack,
  shouldUseEgButtonGlassNativeStack,
} from './_shared/resolveEgButtonGlassStack.js';
import { resolveEgButtonGlassSlots } from './_shared/resolveEgButtonGlassSlots.js';
import { EgButtonGlassRn } from './EgButtonGlassRn.js';
import type { EgButtonGlassProps } from './EgButtonGlass.types.js';

/** iOS 26+ — 系统 Liquid Glass（`GlassView`）；运行时不可用则回退 {@link EgButtonGlassRn}。 */
export function EgButtonGlassNative(props: EgButtonGlassProps & Pick<ViewProps, 'style'>) {
  if (resolveEgButtonGlassRenderStack() !== 'native' || !shouldUseEgButtonGlassNativeStack() || !getNativeGlassView()) {
    return <EgButtonGlassRn {...props} />;
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
  const slots = resolveEgButtonGlassSlots({
    kind,
    iconCount: resolvedIconCount,
    iconSlot,
    iconSlotEnd,
    avatarSlot,
  });
  const { shape, containerStyle, contentStyle } = resolveEgButtonGlassNativeLayout({
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
      <EgButtonGlassContent
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
