import { EgButtonGlass } from '@eds/mobile-components';
import type { ThemeMode } from '@eds/mobile-components';
import { StyleSheet, View, type ViewStyle } from 'react-native';

import { useShowcaseColors } from '@/hooks/useShowcaseColors';
import { GlassBoxPreviewBackdropGradient } from '@/views/tokens/glassBoxPreviewBackdrop';

type ShowcaseGlassButtonPreviewProps = Record<string, unknown> & {
  mode?: ThemeMode;
  kind?: 'text' | 'icon';
  size?: 'lg' | 'md' | 'sm' | 'xs';
  label?: string;
  icon?: string;
  iconCount?: 1 | 2;
  iconAlt?: string;
  disabled?: boolean;
  forceRnImplementation?: boolean;
  style?: ViewStyle;
};

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
    disabled = false,
    forceRnImplementation = false,
    style,
  } = props;

  const colors = useShowcaseColors();
  const resolvedIconCount: 1 | 2 = Number(iconCount) === 2 ? 2 : 1;
  const isIcon = kind === 'icon';

  return (
    <View style={[styles.host, style]}>
      <View pointerEvents="none" style={styles.backdrop}>
        <GlassBoxPreviewBackdropGradient colors={colors} />
      </View>
      {isIcon ? (
        <EgButtonGlass
          kind="icon"
          icon={icon}
          iconCount={resolvedIconCount}
          iconAlt={iconAlt}
          mode={mode}
          disabled={disabled}
          forceRnImplementation={forceRnImplementation}
        />
      ) : (
        <EgButtonGlass
          kind="text"
          size={size}
          label={label}
          mode={mode}
          disabled={disabled}
          forceRnImplementation={forceRnImplementation}
        />
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
  /** 玻璃须有背衬才看得出折射 / 高光（纯色底上原生 clear glass 近似白片）。 */
  backdrop: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
