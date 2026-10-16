import { useState, type ReactNode } from 'react';
import { ScrollView, StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { GlassBlurBackdrop, GlassBlurScope } from '../atoms/glass/GlassBlurScope.js';
import { EgTabBarRn } from '../organisms/tab-bar/tab-bar/EgTabBarRn.js';
import { GlassContainer, GlassInteraction, GlassSurface } from '../atoms/glass/index.js';
import { GlassToolbarDemo } from './GlassToolbarDemo.js';
import { edsFontStyle } from '../shared/fontFamily.js';
import { motionGlassPressScale } from '../shared/themeScalars.js';
import { getThemeColors, mobileTheme, type ThemeMode } from '../theme/index.js';
import type { GlassVariant } from '../atoms/glass/types.js';

const VARIANTS: GlassVariant[] = ['regular', 'prominent', 'clear'];
const BACKDROP_HEIGHT = 2200;

type LiquidGlassDemoProps = {
  mode?: ThemeMode;
  style?: ViewStyle;
  /** Showcase 等可在滚动区顶部插入内容（避免外层 Fragment 破坏 stack flex）。 */
  prepend?: ReactNode;
};

type BlobSpec = {
  color: string;
  top: number;
  left: number;
  size: number;
  opacity?: number;
};

function DemoBackdrop({ mode }: { mode: ThemeMode }) {
  const colors = getThemeColors(mode);
  const blobs: BlobSpec[] = [
    { color: colors.brand as string, top: 40, left: 8, size: 160 },
    { color: '#5f2243', top: 120, left: 190, size: 130 },
    { color: '#2d6cdf', top: 280, left: 24, size: 120 },
    { color: '#e85d75', top: 360, left: 210, size: 140 },
    { color: '#3bb273', top: 520, left: 100, size: 150 },
    { color: '#f5a623', top: 680, left: 16, size: 110 },
    { color: colors.brand as string, top: 820, left: 180, size: 170 },
    { color: '#2d6cdf', top: 980, left: 40, size: 130 },
    { color: '#e85d75', top: 1140, left: 150, size: 160 },
    { color: '#3bb273', top: 1320, left: 20, size: 120 },
    { color: '#5f2243', top: 1480, left: 200, size: 140 },
    { color: '#f5a623', top: 1660, left: 80, size: 150 },
    { color: '#2d6cdf', top: 1840, left: 12, size: 130 },
    { color: colors.brand as string, top: 2000, left: 160, size: 160 },
  ];

  return (
    <View pointerEvents="none" style={styles.backdropLayer}>
      <View
        style={[
          styles.backdropBase,
          { backgroundColor: mode === 'dark' ? (colors.page as string) : '#f4f0f2' },
        ]}
      />
      {blobs.map((blob, index) => (
        <View
          key={index}
          style={{
            position: 'absolute',
            top: blob.top,
            left: blob.left,
            width: blob.size,
            height: blob.size,
            borderRadius: blob.size / 2,
            backgroundColor: blob.color,
            opacity: blob.opacity ?? (mode === 'dark' ? 0.55 : 0.88),
          }}
        />
      ))}
      {[120, 520, 920, 1320, 1720].map((top) => (
        <View
          key={`stripe-${top}`}
          style={[
            styles.backdropStripe,
            {
              top,
              left: top % 240 === 120 ? -32 : 64,
              backgroundColor: top % 480 === 120 ? (colors.brand as string) : '#2d6cdf',
              transform: [{ rotate: top % 480 === 120 ? '-16deg' : '14deg' }],
            },
          ]}
        />
      ))}
    </View>
  );
}

function VariantCard({
  variant,
  mode,
  label,
}: {
  variant: GlassVariant;
  mode: ThemeMode;
  label: string;
}) {
  const colors = getThemeColors(mode);

  return (
    <View style={styles.variantCardWrap}>
      <Text style={[styles.sectionHint, { color: colors['text-base-secondary'] as string }]}>{label}</Text>
      <GlassSurface
        variant={variant}
        shape="medium"
        mode={mode}
        enhancedRefraction
        style={styles.variantCard}
      >
        <View style={styles.variantCardInner}>
          <Text style={[styles.variantTitle, { color: colors['text-base-primary'] as string }]}>
            {variant}
          </Text>
          <Text style={[styles.variantBody, { color: colors['text-base-secondary'] as string }]}>
            blur · edge highlight · SVG refraction
          </Text>
        </View>
      </GlassSurface>
    </View>
  );
}

export function LiquidGlassDemo({ mode = 'light', style, prepend }: LiquidGlassDemoProps) {
  const colors = getThemeColors(mode);
  const [pressCount, setPressCount] = useState(0);
  const radiusFull = mobileTheme.spacing['radius-full'] as number;

  return (
    <GlassBlurScope>
      <ScrollView
        style={[styles.scroll, style]}
        contentContainerStyle={styles.scrollContent}
        nestedScrollEnabled
      >
        <GlassBlurBackdrop style={styles.backdropHost}>
          <DemoBackdrop mode={mode} />
        </GlassBlurBackdrop>

        <View style={styles.foreground}>
          {prepend}
          <Text style={[styles.title, { color: colors['text-base-primary'] as string }]}>
          Liquid Glass Demo
        </Text>
        <Text style={[styles.subtitle, { color: colors['text-base-secondary'] as string }]}>
          Scroll — 背景色块应随页面移动；玻璃边缘应有轻微折射弯折
        </Text>

        <Text style={[styles.sectionTitle, { color: colors['text-base-primary'] as string }]}>
          iOS 27 · Liquid Glass Toolbar
        </Text>
        <Text style={[styles.sectionHint, { color: colors['text-base-secondary'] as string }]}>
          Community 5829:18700 / 5829:18720 — iOS 系统液态玻璃；其它平台 token + blur
        </Text>
        <GlassToolbarDemo mode={mode} />

        {VARIANTS.map((variant) => (
          <VariantCard
            key={variant}
            variant={variant}
            mode={mode}
            label={`glass.surface.${variant}`}
          />
        ))}

        <Text style={[styles.sectionTitle, { color: colors['text-base-primary'] as string }]}>
          Interactive
        </Text>
        <GlassInteraction press onPress={() => setPressCount((count) => count + 1)}>
          <GlassSurface
            variant="regular"
            shape="capsule"
            mode={mode}
            enhancedRefraction
            style={styles.interactivePill}
          >
            <Text style={[styles.interactiveLabel, { color: colors['text-base-primary'] as string }]}>
              Press · scale {motionGlassPressScale()} · {pressCount}
            </Text>
          </GlassSurface>
        </GlassInteraction>

        <Text style={[styles.sectionTitle, { color: colors['text-base-primary'] as string }]}>
          Glass Container
        </Text>
        <GlassContainer style={styles.containerRow}>
          {(['A', 'B', 'C'] as const).map((label) => (
            <GlassSurface
              key={label}
              variant="clear"
              shape="capsule"
              mode={mode}
              enhancedRefraction
              style={{ ...styles.containerPill, borderRadius: radiusFull }}
            >
              <Text style={[styles.containerLabel, { color: colors['text-base-primary'] as string }]}>
                {label}
              </Text>
            </GlassSurface>
          ))}
        </GlassContainer>

        <Text style={[styles.sectionTitle, { color: colors['text-base-primary'] as string }]}>
          EgTabBar
        </Text>
        <EgTabBarRn mode={mode} edgeToEdge style={styles.tabBarGlass} />

        <Text style={[styles.sectionTitle, { color: colors['text-base-primary'] as string }]}>
          Scroll checkpoint
        </Text>
        <GlassSurface variant="prominent" shape="large" mode={mode} enhancedRefraction style={styles.footerCard}>
          <Text style={[styles.footerTitle, { color: colors['text-base-primary'] as string }]}>
            滚到这里说明页面可滚动
          </Text>
          <Text style={[styles.footerBody, { color: colors['text-base-secondary'] as string }]}>
            观察背景 blob 在玻璃后的弯折与饱和度
          </Text>
        </GlassSurface>
      </View>
      </ScrollView>
    </GlassBlurScope>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    width: '100%',
  },
  scrollContent: {
    minHeight: BACKDROP_HEIGHT,
    paddingBottom: 120,
  },
  backdropHost: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: BACKDROP_HEIGHT,
    zIndex: 0,
  },
  backdropLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: BACKDROP_HEIGHT,
    zIndex: 0,
  },
  backdropBase: {
    ...StyleSheet.absoluteFill,
  },
  backdropStripe: {
    position: 'absolute',
    width: 280,
    height: 56,
    opacity: 0.32,
    borderRadius: 28,
  },
  foreground: {
    position: 'relative',
    zIndex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
    gap: 12,
  },
  title: {
    fontSize: 22,
    lineHeight: 28,
    ...edsFontStyle('600'),
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 8,
    ...edsFontStyle('400'),
  },
  sectionTitle: {
    marginTop: 8,
    fontSize: 15,
    lineHeight: 20,
    ...edsFontStyle('600'),
  },
  sectionHint: {
    marginBottom: 6,
    fontSize: 11,
    lineHeight: 14,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    ...edsFontStyle('600'),
  },
  variantCardWrap: {
    gap: 6,
  },
  variantCard: {
    minHeight: 96,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  variantCardInner: {
    gap: 4,
  },
  variantTitle: {
    fontSize: 17,
    lineHeight: 22,
    textTransform: 'capitalize',
    ...edsFontStyle('600'),
  },
  variantBody: {
    fontSize: 13,
    lineHeight: 18,
    ...edsFontStyle('400'),
  },
  interactivePill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  interactiveLabel: {
    fontSize: 15,
    lineHeight: 20,
    ...edsFontStyle('600'),
  },
  containerRow: {
    flexWrap: 'wrap',
  },
  containerPill: {
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  containerLabel: {
    fontSize: 14,
    lineHeight: 18,
    ...edsFontStyle('600'),
  },
  tabBarGlass: {
    width: '100%',
    height: 56,
    marginTop: 4,
  },
  footerCard: {
    minHeight: 120,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginTop: 480,
  },
  footerTitle: {
    fontSize: 16,
    lineHeight: 22,
    ...edsFontStyle('600'),
  },
  footerBody: {
    marginTop: 6,
    fontSize: 13,
    lineHeight: 18,
    ...edsFontStyle('400'),
  },
});
