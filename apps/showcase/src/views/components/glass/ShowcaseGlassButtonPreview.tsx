import {
  EgAvatar,
  EgButtonGlass,
  egButtonGlassSplitPairGapPx,
  readEgButtonGlassStackDiagnostics,
  shouldUseEgButtonGlassNativeStack,
} from '@eds/mobile-components';
import { Platform, StyleSheet, Text, View, type ViewStyle } from 'react-native';

import { useShowcaseColors } from '@/hooks/useShowcaseColors';
import { GlassBoxPreviewBackdropGradient } from '@/views/tokens/glassBoxPreviewBackdrop';
import { GLASS_BOX_BACKDROP_ORB_PX } from '@/views/tokens/glassBoxPreviewMetrics';
import { showcaseTheme } from '@/views/shared/showcaseTheme';

type ShowcaseGlassButtonPreviewProps = Record<string, unknown> & {
  mode?: 'light' | 'dark';
  kind?: 'text' | 'icon';
  size?: 'lg' | 'md' | 'sm' | 'xs';
  label?: string;
  icon?: string;
  iconCount?: 1 | 2 | 3 | '2-split' | string;
  iconAlt?: string;
  iconThird?: string;
  showAvatarSlot?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
};

function DemoAvatar() {
  return <EgAvatar initials="A" size="lg" colorIndex={3} accessibilityLabel="Avatar" />;
}

function resolveSplitIconCount(mode: string): number {
  if (mode === '3') {
    return 3;
  }
  if (mode === '2' || mode === '2-split') {
    return 2;
  }
  return 0;
}

/** 组件详情 — Live 用业务 `EgButtonGlass`（iOS 26+ 原生 / 其它 RN）。 */
export function ShowcaseGlassButtonPreview(props: ShowcaseGlassButtonPreviewProps) {
  const {
    mode = 'light',
    kind = 'text',
    size = 'md',
    label = '编辑',
    icon = 'eds-list-lattice-mobile',
    iconCount = '1',
    iconAlt = 'eds-add',
    iconThird = 'eds-more-ios',
    showAvatarSlot = false,
    disabled = false,
    style,
  } = props;

  const colors = useShowcaseColors();
  const iconCountMode = String(iconCount ?? '1');
  const splitCount = resolveSplitIconCount(iconCountMode);
  const isSplitRow = splitCount >= 2;
  const isIcon = kind === 'icon';
  const avatarSlot = showAvatarSlot ? <DemoAvatar /> : undefined;
  const iconName = String(icon ?? '').trim() || undefined;
  const iconAltName = String(iconAlt ?? '').trim() || undefined;
  const iconThirdName = String(iconThird ?? '').trim() || undefined;
  const splitGap = egButtonGlassSplitPairGapPx();
  const previewButtonStyle = styles.previewButtonAlign;
  const stackHint =
    __DEV__ && Platform.OS === 'ios'
      ? typeof readEgButtonGlassStackDiagnostics === 'function'
        ? readEgButtonGlassStackDiagnostics().hint
        : shouldUseEgButtonGlassNativeStack()
          ? 'EgButtonGlass → GlassView（系统液态玻璃）'
          : 'EgButtonGlass → glass-button-box（RN）'
      : null;

  const sharedIconButtonProps = {
    kind: 'icon' as const,
    mode,
    disabled,
    style: previewButtonStyle,
  };

  const previewBody = isIcon ? (
    isSplitRow ? (
      <View style={[styles.splitRow, { gap: splitGap }]}>
        {[iconName, iconAltName, splitCount === 3 ? iconThirdName : undefined]
          .filter((name): name is string => Boolean(name))
          .map((name, index) => (
            <EgButtonGlass
              key={`${name}-${index}`}
              {...sharedIconButtonProps}
              icon={name}
              iconCount={1}
            />
          ))}
      </View>
    ) : (
      <EgButtonGlass
        {...sharedIconButtonProps}
        icon={iconName}
        iconCount={1}
        avatarSlot={avatarSlot}
      />
    )
  ) : (
    <EgButtonGlass
      kind="text"
      size={size}
      label={label}
      mode={mode}
      disabled={disabled}
      style={previewButtonStyle}
    />
  );

  return (
    <View style={[styles.host, style]}>
      <View style={styles.stage}>
        <View pointerEvents="none" style={styles.backdropHost}>
          <GlassBoxPreviewBackdropGradient colors={colors} />
        </View>
        <View style={styles.contentLayer}>{previewBody}</View>
      </View>
      {stackHint ? (
        <Text
          style={[
            styles.stackHint,
            {
              color: colors['text-base-secondary'] as string,
              marginTop: showcaseTheme.layout.cardPaddingVertical,
            },
          ]}
        >
          {stackHint}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  host: {
    width: '100%',
    alignItems: 'center',
  },
  /** 与 `GLASS_BOX_BACKDROP_ORB_PX` 同边长 — 橙球与按钮共用坐标系。 */
  stage: {
    width: GLASS_BOX_BACKDROP_ORB_PX,
    height: GLASS_BOX_BACKDROP_ORB_PX,
    position: 'relative',
    overflow: 'visible',
  },
  backdropHost: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 0,
  },
  contentLayer: {
    ...StyleSheet.absoluteFill,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  previewButtonAlign: {
    alignSelf: 'center',
  },
  splitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stackHint: {
    fontSize: 12,
    lineHeight: 16,
    textAlign: 'center',
    paddingHorizontal: showcaseTheme.layout.cardPaddingHorizontal,
  },
});
