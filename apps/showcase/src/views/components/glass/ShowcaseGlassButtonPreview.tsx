import { EgAvatar, EgButtonGlass } from '@eds/mobile-components';
import { EgButtonGlassRn } from '@eds/mobile-components/preview/rn';
import { StyleSheet, View, type ViewStyle } from 'react-native';

import { useShowcaseColors } from '@/hooks/useShowcaseColors';
import { GlassBoxPreviewBackdropGradient } from '@/views/tokens/glassBoxPreviewBackdrop';

type ShowcaseGlassButtonPreviewProps = Record<string, unknown> & {
  mode?: 'light' | 'dark';
  kind?: 'text' | 'icon';
  size?: 'lg' | 'md' | 'sm' | 'xs';
  label?: string;
  icon?: string;
  iconCount?: 1 | 2;
  iconAlt?: string;
  showAvatarSlot?: boolean;
  disabled?: boolean;
  forceRnImplementation?: boolean;
  style?: ViewStyle;
};

function DemoAvatar() {
  return <EgAvatar initials="A" size="lg" colorIndex={3} accessibilityLabel="Avatar" />;
}

/** 组件详情 — 仅预览当前 kind（文本 / icon 分开，不拼导航栏）。 */
export function ShowcaseGlassButtonPreview(props: ShowcaseGlassButtonPreviewProps) {
  const {
    mode = 'light',
    kind = 'text',
    size = 'md',
    label = '编辑',
    icon = 'eds-list-lattice-mobile',
    iconCount = 1,
    iconAlt = 'eds-add',
    showAvatarSlot = false,
    disabled = false,
    forceRnImplementation = false,
    style,
  } = props;

  const colors = useShowcaseColors();
  const resolvedIconCount: 1 | 2 = Number(iconCount) === 2 ? 2 : 1;
  const isIcon = kind === 'icon';
  const Button = forceRnImplementation ? EgButtonGlassRn : EgButtonGlass;
  const avatarSlot = showAvatarSlot ? <DemoAvatar /> : undefined;
  const iconName = String(icon ?? '').trim() || undefined;

  return (
    <View style={[styles.host, style]}>
      <View pointerEvents="none" style={styles.backdrop}>
        <GlassBoxPreviewBackdropGradient colors={colors} />
      </View>
      {isIcon ? (
        <Button
          kind="icon"
          icon={iconName}
          iconCount={resolvedIconCount}
          iconAlt={iconAlt}
          avatarSlot={avatarSlot}
          mode={mode}
          disabled={disabled}
        />
      ) : (
        <Button kind="text" size={size} label={label} mode={mode} disabled={disabled} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  host: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
