import { StyleSheet, type ViewProps, type ViewStyle } from 'react-native';
import { EgGlass } from '../../../atoms/glass/EgGlass.js';
import { GlassInteraction } from '../../../atoms/glass/GlassInteraction.js';
import { EgButtonGlassContent } from './_shared/EgButtonGlassContent.js';
import { resolveEgButtonGlassShellStyle } from './_shared/resolveEgButtonGlassShellStyle.js';
import type { EgButtonGlassProps } from './EgButtonGlass.types.js';

/** Android / iOS ≤25 — RN 栈，`EgGlass` + `glass-button-box`。 */
export function EgButtonGlassRn(props: EgButtonGlassProps & Pick<ViewProps, 'style'>) {
  const {
    kind,
    label,
    icon,
    iconCount = 1,
    iconAlt,
    size = 'md',
    mode = 'light',
    disabled,
    onPress,
    testID,
    accessibilityLabel,
    style,
  } = props;

  const resolvedIconCount: 1 | 2 = iconCount === 2 ? 2 : 1;

  const shellStyle = StyleSheet.flatten([
    resolveEgButtonGlassShellStyle(kind, size, resolvedIconCount),
    style,
  ]) as ViewStyle;

  const a11y =
    accessibilityLabel ??
    (kind === 'text' ? label ?? '编辑' : icon ?? 'Menu');

  return (
    <GlassInteraction
      press
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
