import {
  EgDivider,
  EG_ITEM_MIN_HEIGHT,
  EG_ITEM_PAD_H,
  EG_ITEM_PAD_V,
  EG_ITEM_TAP_RADIUS,
  getEgItemDividerInset,
  useMotionPressScale,
} from '@eds/mobile-components';
import {
  Pressable,
  StyleSheet,
  View,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import Animated from 'react-native-reanimated';

import { ShowcaseSansText } from '@/components/ShowcaseSansText';
import { useShowcaseColors } from '@/hooks/useShowcaseColors';
import { useShowcaseThemeContext } from '@/theme/ShowcaseThemeProvider';

import { showcaseDocSectionLayout } from './showcaseDocSectionLayout';
import { edsTokenFont } from './resolveEdsTheme';
import { showcaseCardChromeStyle, showcaseTheme as theme } from './showcaseTheme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

/** 与 `EgDataListRowPressable` 一致 — Scroll 跟手时延迟进入按下态。 */
const ROW_PRESS_IN_DELAY_MS = 130;

type ShowcaseCardRowProps = {
  title: string;
  hint?: string;
  onPress?: () => void;
  disabled?: boolean;
  monoTitle?: boolean;
  /** 族页 · 本体 600 · 场景 400。 */
  titleWeight?: '400' | '600';
  /** `inset` — 组内一行（`ShowcaseSectionCard`）；`card` — 独立卡片。 */
  variant?: 'card' | 'plain' | 'inset';
  showDivider?: boolean;
};

export function ShowcaseCardRow({
  title,
  hint,
  onPress,
  disabled = false,
  monoTitle = false,
  titleWeight = '600',
  variant = 'card',
  showDivider = false,
}: ShowcaseCardRowProps) {
  const colors = useShowcaseColors();
  const { colorTheme } = useShowcaseThemeContext();
  const inactiveOpacity = 0.5;
  const isPlain = variant === 'plain';
  const isInset = variant === 'inset';
  const interactive = !disabled && Boolean(onPress);

  const titleStyle: TextStyle = monoTitle
    ? { ...styles.title, ...styles.monoTitle, ...edsTokenFont('body-medium', titleWeight) }
    : titleWeight === '400'
      ? { ...styles.title, ...edsTokenFont('body-medium', '400') }
      : styles.title;

  const { animatedStyle, onPressIn, onPressOut, pressing } = useMotionPressScale({
    pressRecipe: 'tap',
    pressIntensity: 'xs',
    pressScaleDirection: 'down',
    enabled: interactive && isInset,
  });

  const rowShell = (pressed: boolean): StyleProp<ViewStyle> => [
    isInset ? styles.insetRow : isPlain ? styles.plainRow : styles.card,
    !isInset && !isPlain ? showcaseCardChromeStyle(colors) : null,
    isInset && pressed ? { backgroundColor: colors['event-tap'] as string } : null,
    { opacity: disabled ? inactiveOpacity : 1 },
  ];

  const copy = (
    <View style={isInset ? showcaseDocSectionLayout.insetRowCopy : styles.copy}>
      <ShowcaseSansText
        weight={titleWeight}
        style={[titleStyle, { color: colors['text-base-primary'] as string }]}
      >
        {title}
      </ShowcaseSansText>
      {hint ? (
        <ShowcaseSansText
          weight="400"
          style={[styles.hint, { color: colors['text-base-secondary'] as string }]}
        >
          {hint}
        </ShowcaseSansText>
      ) : null}
    </View>
  );

  if (isInset) {
    return (
      <>
        <AnimatedPressable
          accessibilityRole="button"
          accessibilityState={{ disabled }}
          disabled={!interactive}
          onPress={onPress}
          unstable_pressDelay={ROW_PRESS_IN_DELAY_MS}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
          style={[rowShell(pressing), animatedStyle]}
        >
          {copy}
        </AnimatedPressable>
        {showDivider ? (
          <View
            style={[
              styles.dividerWrap,
              { paddingLeft: getEgItemDividerInset(false), paddingRight: EG_ITEM_PAD_H },
            ]}
          >
            <EgDivider variant="module" mode={colorTheme} orientation="horizontal" />
          </View>
        ) : null}
      </>
    );
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={disabled ? undefined : onPress}
      style={rowShell(false)}
    >
      {copy}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 52,
    justifyContent: 'center',
    paddingHorizontal: theme.layout.cardPaddingHorizontal,
    paddingVertical: theme.layout.cardPaddingVertical,
  },
  plainRow: {
    justifyContent: 'center',
    minHeight: 52,
    paddingVertical: theme.layout.cardPaddingVertical,
  },
  insetRow: {
    justifyContent: 'center',
    minHeight: EG_ITEM_MIN_HEIGHT,
    paddingHorizontal: EG_ITEM_PAD_H,
    paddingVertical: EG_ITEM_PAD_V,
    alignSelf: 'stretch',
    width: '100%',
    borderRadius: EG_ITEM_TAP_RADIUS,
    borderCurve: 'continuous',
  },
  copy: {
    gap: theme.layout.titleHintGap,
  },
  title: {
    ...theme.font.rowTitle,
  },
  monoTitle: {
    ...theme.font.monoRowTitle,
  },
  hint: {
    ...theme.font.rowHint,
  },
  dividerWrap: {
    alignSelf: 'stretch',
    width: '100%',
  },
});