import { StyleSheet, type ViewProps, type ViewStyle } from 'react-native';
import { EgGlass } from '../../../atoms/glass/EgGlass.js';
import { GlassInteraction } from '../../../atoms/glass/GlassInteraction.js';
import { EgButtonGlassContent } from './_shared/EgButtonGlassContent.js';
import { resolveEgButtonGlassShellStyle } from './_shared/resolveEgButtonGlassShellStyle.js';
import { resolveEgButtonGlassSlots } from './_shared/resolveEgButtonGlassSlots.js';
import type { EgButtonGlassProps } from './EgButtonGlass.types.js';
import { resolveEgButtonGlassPressIntensity } from './_shared/resolveEgButtonGlassPressIntensity.js';

/** Android / iOS ≤25 — RN 栈 · `EgGlass` + `glass-button-box`（模糊 · 竖向高光 · vulvar 内/外阴影 · iOS 27 液态玻璃近似）。 */
export function EgButtonGlassRn(props: EgButtonGlassProps & Pick<ViewProps, 'style'>) {
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
  const slots = resolveEgButtonGlassSlots({
    kind,
    iconCount: resolvedIconCount,
    iconSlot,
    iconSlotEnd,
    avatarSlot,
  });

  const shellStyle = StyleSheet.flatten([
    resolveEgButtonGlassShellStyle(
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

  const pressIntensity = resolveEgButtonGlassPressIntensity(kind, resolvedIconCount);

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
      </EgGlass>
    </GlassInteraction>
  );
}

const styles = StyleSheet.create({
  hitTarget: {
    alignSelf: 'flex-start',
  },
});
