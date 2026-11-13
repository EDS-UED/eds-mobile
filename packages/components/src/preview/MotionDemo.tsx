import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { SlideSelectionDemo } from './SlideSelectionDemo.js';
import { EgEdsAnimaPress } from '../shared/motion/EgEdsAnimaPress.js';
import { edsFontStyle } from '../shared/fontFamily.js';
import { motionPressScale, type MotionPressIntensity } from '../shared/themeScalars.js';
import { getThemeColors, type ThemeMode } from '../theme/index.js';

type MotionDemoProps = {
  mode?: ThemeMode;
  style?: ViewStyle;
};

const SEMANTIC_SECTIONS = [
  {
    className: 'motion-press',
    title: 'Press · 点按反馈',
    hint: 'EdsSemanticAnima(\'press\') · recipe press',
  },
  {
    className: 'motion-slide',
    title: 'Slide · 滑选',
    hint: 'EdsSemanticAnima(\'slide\') · recipe slide · drag 跟手',
  },
] as const;

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
          borderColor: colors['stroke-divider-shallow'] as string,
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
                  borderColor: colors['stroke-divider-shallow'] as string,
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
      <EgEdsAnimaPress
        pressIntensity={pressIntensity}
        onPress={() => setCount((value) => value + 1)}
        style={[styles.tapButton, { backgroundColor: colors.brand as string }]}
      >
        <Text style={[styles.tapButtonLabel, { color: colors['text-same-white'] as string }]}>
          Press me · scale {activeScale} · {count}
        </Text>
      </EgEdsAnimaPress>
      <Text style={[styles.meta, { color: colors['text-base-tertiary'] as string }]}>
        motion-press · motion-scale-press-{pressIntensity}
      </Text>
    </DemoCard>
  );
}

function SlideDemo({ mode }: { mode: ThemeMode }) {
  const colors = getThemeColors(mode);

  return (
    <DemoCard mode={mode}>
      <SlideSelectionDemo mode={mode} />
      <Text style={[styles.meta, { color: colors['text-base-tertiary'] as string }]}>
        点击切换 · motion-slide · EdsSemanticAnima('slide')
      </Text>
    </DemoCard>
  );
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
        当前 spec：press · slide
      </Text>

      {SEMANTIC_SECTIONS.map((section) => (
        <View key={section.className} style={styles.section}>
          <SectionHeader
            className={section.className}
            title={section.title}
            hint={section.hint}
            mode={mode}
          />
          {section.className === 'motion-press' ? (
            <TapDemo mode={mode} />
          ) : (
            <SlideDemo mode={mode} />
          )}
        </View>
      ))}
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
  meta: {
    fontSize: 11,
    lineHeight: 14,
    ...edsFontStyle('400'),
  },
});

export { SlideSelectionDemo } from './SlideSelectionDemo.js';
export { PageShotDemo } from './PageShotDemo.js';
export { PageStackDemoPage } from './PageStack.js';
export { EgEdsAnimaOverlayModal } from '../shared/motion/overlayModal.js';