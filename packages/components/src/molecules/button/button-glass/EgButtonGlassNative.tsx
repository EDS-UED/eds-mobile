import type { ViewProps, ViewStyle } from 'react-native';
import { GlassControlShell } from '../../../atoms/glass/GlassControlShell.js';
import { EgButtonGlassContent } from './_shared/EgButtonGlassContent.js';
import { resolveEgButtonGlassShellStyle } from './_shared/resolveEgButtonGlassShellStyle.js';
import type { EgButtonGlassProps } from './EgButtonGlass.types.js';

/**
 * iOS 26+ — 系统 Liquid Glass（`GlassView isInteractive`）承担容器、按压缩放 / 高光与回弹。
 * 容器不裁切（`overflow` 会截掉原生按压形变与边缘高光）；边距落在内部 Pressable，整颗胶囊可点。
 */
export function EgButtonGlassNative(props: EgButtonGlassProps & Pick<ViewProps, 'style'>) {
  const {
    kind,
    label,
    icon,
    iconCount = 1,
    iconAlt,
    size = 'md',
    mode = 'light',
    variant = 'clear',
    disabled,
    onPress,
    testID,
    accessibilityLabel,
    style,
  } = props;

  const resolvedIconCount: 1 | 2 = iconCount === 2 ? 2 : 1;
  const {
    borderRadius,
    overflow: _overflow,
    alignSelf,
    flexShrink,
    ...contentStyle
  } = resolveEgButtonGlassShellStyle(kind, size, resolvedIconCount);

  const containerStyle: ViewStyle = {
    borderRadius,
    alignSelf: alignSelf ?? 'flex-start',
    flexShrink,
    minHeight: 0,
    paddingHorizontal: 0,
    paddingVertical: 0,
    ...(style as ViewStyle | undefined),
  };

  const a11y = accessibilityLabel ?? (kind === 'text' ? label ?? '编辑' : icon ?? 'Menu');

  return (
    <GlassControlShell
      shape="capsule"
      mode={mode}
      variant={variant}
      haptic={false}
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
        mode={mode}
      />
    </GlassControlShell>
  );
}
