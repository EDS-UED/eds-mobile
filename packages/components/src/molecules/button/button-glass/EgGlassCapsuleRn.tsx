import { StyleSheet, type ViewProps, type ViewStyle } from 'react-native';
import { EgGlass } from '../../../atoms/glass/EgGlass.js';
import { GlassInteraction } from '../../../atoms/glass/GlassInteraction.js';
import { EgGlassCapsuleContent } from './_shared/EgGlassCapsuleContent.js';
import { resolveEgGlassCapsuleShellStyle } from './_shared/resolveEgGlassCapsuleShellStyle.js';
import { resolveEgGlassCapsuleSlots } from './_shared/resolveEgGlassCapsuleSlots.js';
import type { EgGlassCapsuleProps } from './EgGlassCapsule.types.js';
import { resolveEgGlassCapsulePressIntensity } from './_shared/resolveEgGlassCapsulePressIntensity.js';

/** Android / iOS ≤25 — RN 栈 · `EgGlass` + `glass-button-box`（模糊 · 竖向高光 · vulvar 内/外阴影 · iOS 27 液态玻璃近似）。 */
export function EgGlassCapsuleRn(props: EgGlassCapsuleProps & Pick<ViewProps, 'style'>) {
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

  const shellStyle = StyleSheet.flatten([
    resolveEgGlassCapsuleShellStyle(
      kind,
      size,
      resolvedIconCount,
      Boolean(slots.secondaryReplacement),
    ),
    style,
  ]) as ViewStyle;

  const a11y =
    accessibilityLabel ??
    (kind === 'text'
      ? label ?? '编辑'
      : slots.primaryReplacement || slots.secondaryReplacement
        ? 'Menu'
        : icon ?? 'Menu');

  const pressIntensity = resolveEgGlassCapsulePressIntensity(kind, resolvedIconCount);

  return (
    <GlassInteraction
      press
      pressIntensity={pressIntensity}
      haptic
      disabled={disabled}
      onPress={onPress}
      testID={testID ?? (kind === 'icon' ? 'button-glass-icon' : 'button-glass-text')}
      accessibilityLabel={a11y}
      style={styles.hitTarget}
    >
      <EgGlass box="glass-button-box" mode={mode} style={shellStyle}>
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
      </EgGlass>
    </GlassInteraction>
  );
}

const styles = StyleSheet.create({
  /** `auto` — 尊重父级 `alignItems`（RN 预览圆心居中）；行内左对齐由业务容器控制。 */
  hitTarget: {
    alignSelf: 'auto',
  },
});
