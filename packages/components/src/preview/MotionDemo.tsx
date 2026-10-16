import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, type ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { resolveMotionRecipe } from '@eds/mobile-animations';
import { EgSwitch } from '../molecules/toggle/switch/EgSwitch.js';
import { MotionPressable } from '../shared/MotionPressable.js';
import { edsFontStyle } from '../shared/fontFamily.js';
import { motionPressScale, type MotionPressIntensity } from '../shared/themeScalars.js';
import { getThemeColors, mobileTheme, type ThemeMode } from '../theme/index.js';

type MotionDemoProps = {
  mode?: ThemeMode;
  style?: ViewStyle;
};

type DemoSection = {
  className: string;
  title: string;
  recipeId: string;
  hint: string;
};

type CompositionEntry = {
  id: string;
  label: string;
  semanticClass?: string;
};

const SEMANTIC_SECTIONS: DemoSection[] = [
  {
    className: 'motion-tap',
    title: 'Tap · 点按反馈',
    recipeId: 'press',
    hint: 'Button / List Item · spring.press · haptic.light',
  },
  {
    className: 'motion-deform',
    title: 'Deform · 控件形变',
    recipeId: 'control',
    hint: 'Switch / Tab indicator · spring.control',
  },
  {
    className: 'motion-focus',
    title: 'Focus · 聚焦态',
    recipeId: 'enter',
    hint: 'Input border · timing.easeIn',
  },
  {
    className: 'motion-layout',
    title: 'Layout · 大位移进出场',
    recipeId: 'enter',
    hint: 'Drawer / Panel · translateY + opacity',
  },
  {
    className: 'motion-flotation',
    title: 'Flotation · 浮层进出场',
    recipeId: 'sheet',
    hint: 'Sheet / Modal · spring.sheet',
  },
  {
    className: 'motion-page',
    title: 'Page · 页面转场',
    recipeId: 'navigation',
    hint: 'Stack push · spring.navigation',
  },
  {
    className: 'motion-layout-deform',
    title: 'Layout Deform · 容器 morph',
    recipeId: 'layout-deform',
    hint: 'Shell resize · spring.gentle',
  },
];

const FEATURED_COMPOSITIONS: CompositionEntry[] = [
  { id: 'ios-navigation', label: 'iOS Navigation', semanticClass: 'motion-page' },
  { id: 'ios-sheet', label: 'iOS Sheet', semanticClass: 'motion-flotation' },
  { id: 'ios-modal', label: 'iOS Modal', semanticClass: 'motion-flotation' },
  { id: 'transaction', label: 'Crypto Transaction' },
  { id: 'wallet-connect', label: 'Wallet Connect' },
  { id: 'security-signing', label: 'Security Signing' },
];

function recipeTimingConfig(recipeId: string) {
  const recipe = resolveMotionRecipe(recipeId);
  return { duration: recipe.timingConfig?.duration ?? 250 };
}

function SectionHeader({
  className,
  title,
  hint,
  mode,
}: {
  className: string;
  title: string;
  hint: string;
  mode: ThemeMode;
}) {
  const colors = getThemeColors(mode);
  return (
    <View style={styles.sectionHeader}>
      <Text style={[styles.classTag, { color: colors.brand as string }]}>{className}</Text>
      <Text style={[styles.sectionTitle, { color: colors['text-base-primary'] as string }]}>
        {title}
      </Text>
      <Text style={[styles.sectionHint, { color: colors['text-base-secondary'] as string }]}>
        {hint}
      </Text>
    </View>
  );
}

function DemoCard({
  mode,
  children,
}: {
  mode: ThemeMode;
  children: React.ReactNode;
}) {
  const colors = getThemeColors(mode);
  return (
    <View
      style={[
        styles.demoCard,
        {
          backgroundColor: colors['material-card-shallow'] as string,
          borderColor: colors['stroke-divider-page'] as string,
        },
      ]}
    >
      {children}
    </View>
  );
}

const PRESS_INTENSITY_OPTIONS: { id: MotionPressIntensity }[] = [
  { id: 'xs' },
  { id: 'sm' },
  { id: 'md' },
  { id: 'lg' },
];

function TapDemo({ mode }: { mode: ThemeMode }) {
  const colors = getThemeColors(mode);
  const [count, setCount] = useState(0);
  const [pressIntensity, setPressIntensity] = useState<MotionPressIntensity>('sm');
  const activeScale = motionPressScale(pressIntensity);

  return (
    <DemoCard mode={mode}>
      <View style={styles.intensityRow}>
        {PRESS_INTENSITY_OPTIONS.map((option) => {
          const active = pressIntensity === option.id;
          return (
            <Pressable
              key={option.id}
              accessibilityRole="button"
              onPress={() => setPressIntensity(option.id)}
              style={[
                styles.intensityChip,
                {
                  borderColor: colors['stroke-divider-page'] as string,
                  backgroundColor: active
                    ? (colors['event-focus'] as string)
                    : (colors['material-card-moderate'] as string),
                },
              ]}
            >
              <Text
                style={{
                  color: colors['text-base-primary'] as string,
                  ...styles.intensityChipLabel,
                }}
              >
                {option.id} · {motionPressScale(option.id)}
              </Text>
            </Pressable>
          );
        })}
      </View>
      <MotionPressable
        pressIntensity={pressIntensity}
        onPress={() => setCount((value) => value + 1)}
        style={[
          styles.tapButton,
          { backgroundColor: colors.brand as string },
        ]}
      >
        <Text style={[styles.tapButtonLabel, { color: colors['text-same-white'] as string }]}>
          Press me · scale {activeScale} · {count}
        </Text>
      </MotionPressable>
      <Text style={[styles.meta, { color: colors['text-base-tertiary'] as string }]}>
        recipe: press · semantic: motion-tap · token: motion-scale-press-{pressIntensity}
      </Text>
    </DemoCard>
  );
}

function DeformDemo({ mode }: { mode: ThemeMode }) {
  const colors = getThemeColors(mode);
  const [on, setOn] = useState(true);

  return (
    <DemoCard mode={mode}>
      <EgSwitch mode={mode} value={on} onValueChange={setOn} accessibilityLabel="Motion deform switch" />
      <Text style={[styles.meta, { color: colors['text-base-tertiary'] as string }]}>
        recipe: control · thumb uses spring.control
      </Text>
    </DemoCard>
  );
}

function FocusDemo({ mode }: { mode: ThemeMode }) {
  const colors = getThemeColors(mode);
  const [focused, setFocused] = useState(false);
  const focus = useSharedValue(0);

  useEffect(() => {
    focus.value = withTiming(focused ? 1 : 0, recipeTimingConfig('enter'));
  }, [focus, focused]);

  const animatedStyle = useAnimatedStyle(() => ({
    borderWidth: 1 + focus.value,
  }));

  return (
    <DemoCard mode={mode}>
      <MotionPressable
        accessibilityRole="none"
        onPress={() => setFocused((value) => !value)}
        style={[
          styles.focusField,
          {
            backgroundColor: colors['material-card-moderate'] as string,
            borderColor: focused
              ? (colors.brand as string)
              : (colors['stroke-input'] as string),
          },
          animatedStyle,
        ]}
      >
        <Text style={[styles.focusLabel, { color: colors['text-base-secondary'] as string }]}>
          {focused ? 'Focused · timing.easeIn' : 'Tap to focus input'}
        </Text>
      </MotionPressable>
    </DemoCard>
  );
}

function LayoutDemo({ mode }: { mode: ThemeMode }) {
  const colors = getThemeColors(mode);
  const [visible, setVisible] = useState(false);
  const progress = useSharedValue(0);
  const distance = (mobileTheme.spacing['spacing-1'] as number) ?? 8;
  const hiddenOpacity = mobileTheme.motion.opacity['opacity-hidden'] as number;
  const visibleOpacity = mobileTheme.motion.opacity['opacity-visible'] as number;

  useEffect(() => {
    progress.value = withTiming(visible ? 1 : 0, recipeTimingConfig('enter'));
  }, [progress, visible]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: hiddenOpacity + (visibleOpacity - hiddenOpacity) * progress.value,
    transform: [{ translateY: (1 - progress.value) * distance }],
  }));

  return (
    <DemoCard mode={mode}>
      <MotionPressable
        onPress={() => setVisible((value) => !value)}
        style={[styles.secondaryButton, { backgroundColor: colors['material-card-moderate'] as string }]}
      >
        <Text style={[styles.secondaryButtonLabel, { color: colors['text-base-primary'] as string }]}>
          {visible ? 'Hide panel' : 'Show panel'}
        </Text>
      </MotionPressable>
      <Animated.View
        style={[
          styles.layoutPanel,
          { backgroundColor: colors.brand as string },
          animatedStyle,
        ]}
      >
        <Text style={[styles.layoutPanelLabel, { color: colors['text-same-white'] as string }]}>
          motion-layout
        </Text>
      </Animated.View>
    </DemoCard>
  );
}

function FlotationDemo({ mode }: { mode: ThemeMode }) {
  const colors = getThemeColors(mode);
  const [open, setOpen] = useState(false);
  const sheet = resolveMotionRecipe('sheet');
  const progress = useSharedValue(0);
  const presentScale = mobileTheme.motion.scale['scale-present'] as number;
  const offsetY = -((mobileTheme.spacing['spacing-2-5'] as number) ?? 10);

  useEffect(() => {
    progress.value = withSpring(open ? 1 : 0, sheet.springConfig);
  }, [open, progress, sheet.springConfig]);

  const sheetStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [
      { translateY: (1 - progress.value) * offsetY },
      { scale: presentScale + (1 - presentScale) * progress.value },
    ],
  }));

  return (
    <DemoCard mode={mode}>
      <MotionPressable
        onPress={() => setOpen((value) => !value)}
        style={[styles.secondaryButton, { backgroundColor: colors['material-card-moderate'] as string }]}
      >
        <Text style={[styles.secondaryButtonLabel, { color: colors['text-base-primary'] as string }]}>
          {open ? 'Dismiss sheet' : 'Present sheet'}
        </Text>
      </MotionPressable>
      <View style={styles.sheetStage}>
        <Animated.View
          style={[
            styles.sheet,
            { backgroundColor: colors['material-card-moderate'] as string },
            sheetStyle,
          ]}
          pointerEvents={open ? 'auto' : 'none'}
        >
          <Text style={[styles.sheetTitle, { color: colors['text-base-primary'] as string }]}>
            motion-flotation
          </Text>
          <Text style={[styles.meta, { color: colors['text-base-secondary'] as string }]}>
            spring.sheet · scale-present
          </Text>
        </Animated.View>
      </View>
    </DemoCard>
  );
}

function PageDemo({ mode }: { mode: ThemeMode }) {
  const colors = getThemeColors(mode);
  const [pushed, setPushed] = useState(false);
  const navigation = resolveMotionRecipe('navigation');
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withSpring(pushed ? 1 : 0, navigation.springConfig);
  }, [navigation.springConfig, progress, pushed]);

  const pageStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: (1 - progress.value) * 120 }],
    opacity: 0.35 + progress.value * 0.65,
  }));

  return (
    <DemoCard mode={mode}>
      <View style={[styles.pageStage, { backgroundColor: colors['material-card-moderate'] as string }]}>
        <MotionPressable
          onPress={() => setPushed((value) => !value)}
          style={[styles.pageBase, { backgroundColor: colors.page as string }]}
        >
          <Text style={[styles.pageLabel, { color: colors['text-base-primary'] as string }]}>
            Root · tap to {pushed ? 'pop' : 'push'}
          </Text>
        </MotionPressable>
        <Animated.View
          style={[
            styles.pageOverlay,
            { backgroundColor: colors['material-card-shallow'] as string },
            pageStyle,
          ]}
        >
          <Text style={[styles.pageLabel, { color: colors['text-base-primary'] as string }]}>
            motion-page
          </Text>
        </Animated.View>
      </View>
    </DemoCard>
  );
}

function LayoutDeformDemo({ mode }: { mode: ThemeMode }) {
  const colors = getThemeColors(mode);
  const [expanded, setExpanded] = useState(false);
  const morph = resolveMotionRecipe('layout-deform');
  const height = useSharedValue(56);

  useEffect(() => {
    height.value = withSpring(expanded ? 132 : 56, morph.springConfig);
  }, [expanded, height, morph.springConfig]);

  const shellStyle = useAnimatedStyle(() => ({
    height: height.value,
  }));

  return (
    <DemoCard mode={mode}>
      <MotionPressable
        onPress={() => setExpanded((value) => !value)}
        style={[styles.secondaryButton, { backgroundColor: colors['material-card-moderate'] as string }]}
      >
        <Text style={[styles.secondaryButtonLabel, { color: colors['text-base-primary'] as string }]}>
          {expanded ? 'Collapse shell' : 'Expand shell'}
        </Text>
      </MotionPressable>
      <Animated.View
        style={[
          styles.morphShell,
          { backgroundColor: colors.brand as string },
          shellStyle,
        ]}
      >
        <Text style={[styles.morphLabel, { color: colors['text-same-white'] as string }]}>
          motion-layout-deform
        </Text>
        {expanded ? (
          <Text style={[styles.morphBody, { color: colors['text-same-white'] as string }]}>
            Height morph via spring.gentle
          </Text>
        ) : null}
      </Animated.View>
    </DemoCard>
  );
}

function CompositionList({ mode }: { mode: ThemeMode }) {
  const colors = getThemeColors(mode);

  return (
    <View style={styles.compositionList}>
      {FEATURED_COMPOSITIONS.map((entry) => (
        <View
          key={entry.id}
          style={[
            styles.compositionRow,
            {
              backgroundColor: colors['material-card-shallow'] as string,
              borderColor: colors['stroke-divider-page'] as string,
            },
          ]}
        >
          <Text style={[styles.compositionId, { color: colors['text-base-primary'] as string }]}>
            {entry.id}
          </Text>
          <Text style={[styles.compositionMeta, { color: colors['text-base-secondary'] as string }]}>
            {entry.label}
            {entry.semanticClass ? ` · ${entry.semanticClass}` : ''}
          </Text>
        </View>
      ))}
      <Text style={[styles.meta, { color: colors['text-base-tertiary'] as string }]}>
        完整解析链见 @eds/mobile-tokens/motion/catalog
      </Text>
    </View>
  );
}

function renderSectionBody(section: DemoSection, mode: ThemeMode) {
  switch (section.className) {
    case 'motion-tap':
      return <TapDemo mode={mode} />;
    case 'motion-deform':
      return <DeformDemo mode={mode} />;
    case 'motion-focus':
      return <FocusDemo mode={mode} />;
    case 'motion-layout':
      return <LayoutDemo mode={mode} />;
    case 'motion-flotation':
      return <FlotationDemo mode={mode} />;
    case 'motion-page':
      return <PageDemo mode={mode} />;
    case 'motion-layout-deform':
      return <LayoutDeformDemo mode={mode} />;
    default:
      return null;
  }
}

export function MotionDemo({ mode = 'light', style }: MotionDemoProps) {
  const colors = getThemeColors(mode);

  return (
    <ScrollView
      style={[styles.scroll, style, { backgroundColor: colors.page as string }]}
      contentContainerStyle={styles.scrollContent}
      nestedScrollEnabled
    >
      <Text style={[styles.title, { color: colors['text-base-primary'] as string }]}>
        Motion Demo
      </Text>
      <Text style={[styles.subtitle, { color: colors['text-base-secondary'] as string }]}>
        Base → Recipe → Semantic · 全部 spring / timing 来自 @eds/mobile-animations
      </Text>

      {SEMANTIC_SECTIONS.map((section) => (
        <View key={section.className} style={styles.section}>
          <SectionHeader
            className={section.className}
            title={section.title}
            hint={section.hint}
            mode={mode}
          />
          {renderSectionBody(section, mode)}
        </View>
      ))}

      <View style={styles.section}>
        <SectionHeader
          className="compositions[]"
          title="Compositions · 多步编排"
          hint="ios-sheet / ios-navigation / transaction …"
          mode={mode}
        />
        <CompositionList mode={mode} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    width: '100%',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 48,
    gap: 20,
  },
  title: {
    fontSize: 22,
    lineHeight: 28,
    ...edsFontStyle('600'),
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 4,
    ...edsFontStyle('400'),
  },
  section: {
    gap: 10,
  },
  sectionHeader: {
    gap: 4,
  },
  classTag: {
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 0.4,
    textTransform: 'lowercase',
    ...edsFontStyle('600'),
  },
  sectionTitle: {
    fontSize: 16,
    lineHeight: 22,
    ...edsFontStyle('600'),
  },
  sectionHint: {
    fontSize: 12,
    lineHeight: 16,
    ...edsFontStyle('400'),
  },
  demoCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
    gap: 12,
    overflow: 'hidden',
  },
  intensityRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  intensityChip: {
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  intensityChipLabel: {
    fontSize: 13,
    lineHeight: 18,
    ...edsFontStyle('500'),
  },
  tapButton: {
    alignSelf: 'flex-start',
    borderRadius: 10,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  tapButtonLabel: {
    fontSize: 15,
    lineHeight: 20,
    ...edsFontStyle('600'),
  },
  secondaryButton: {
    alignSelf: 'flex-start',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  secondaryButtonLabel: {
    fontSize: 14,
    lineHeight: 18,
    ...edsFontStyle('600'),
  },
  meta: {
    fontSize: 11,
    lineHeight: 14,
    ...edsFontStyle('400'),
  },
  focusField: {
    minHeight: 44,
    borderRadius: 10,
    paddingHorizontal: 14,
    justifyContent: 'center',
  },
  focusLabel: {
    fontSize: 14,
    lineHeight: 18,
    ...edsFontStyle('400'),
  },
  layoutPanel: {
    minHeight: 56,
    borderRadius: 10,
    paddingHorizontal: 14,
    justifyContent: 'center',
  },
  layoutPanelLabel: {
    fontSize: 14,
    lineHeight: 18,
    ...edsFontStyle('600'),
  },
  sheetStage: {
    minHeight: 120,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  sheet: {
    borderRadius: 12,
    padding: 14,
    gap: 6,
    minHeight: 88,
  },
  sheetTitle: {
    fontSize: 16,
    lineHeight: 22,
    ...edsFontStyle('600'),
  },
  pageStage: {
    minHeight: 120,
    borderRadius: 10,
    overflow: 'hidden',
  },
  pageBase: {
    flex: 1,
    minHeight: 120,
    padding: 14,
    justifyContent: 'center',
  },
  pageOverlay: {
    ...StyleSheet.absoluteFill,
    padding: 14,
    justifyContent: 'center',
    borderLeftWidth: StyleSheet.hairlineWidth,
    borderLeftColor: 'rgba(0,0,0,0.08)',
  },
  pageLabel: {
    fontSize: 14,
    lineHeight: 18,
    ...edsFontStyle('600'),
  },
  morphShell: {
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    overflow: 'hidden',
    justifyContent: 'center',
    gap: 6,
  },
  morphLabel: {
    fontSize: 14,
    lineHeight: 18,
    ...edsFontStyle('600'),
  },
  morphBody: {
    fontSize: 12,
    lineHeight: 16,
    opacity: 0.9,
    ...edsFontStyle('400'),
  },
  compositionList: {
    gap: 8,
  },
  compositionRow: {
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 2,
  },
  compositionId: {
    fontSize: 13,
    lineHeight: 18,
    ...edsFontStyle('600'),
  },
  compositionMeta: {
    fontSize: 12,
    lineHeight: 16,
    ...edsFontStyle('400'),
  },
});
