import { StyleSheet, Text, View } from 'react-native';

import { useShowcaseColors } from '@/hooks/useShowcaseColors';

import { showcaseTheme as theme } from './showcaseTheme';

type ShowcasePageIntroProps = {
  /** Omit when the screen uses native Stack.Title. */
  title?: string;
  lead: string;
  meta?: string;
  /** body-medium (17px) + text-base-primary (100%). */
  subtitle?: boolean;
  /** Tab home with native large title — applies navContentGapHome. */
  homeLargeTitle?: boolean;
};

export function ShowcasePageIntro({
  title,
  lead,
  meta,
  subtitle = false,
  homeLargeTitle = false,
}: ShowcasePageIntroProps) {
  const colors = useShowcaseColors();
  const leadColor = subtitle
    ? (colors['text-base-primary'] as string)
    : (colors['text-base-secondary'] as string);

  return (
    <View
      style={[
        styles.wrap,
        homeLargeTitle && subtitle && !title
          ? { paddingTop: theme.layout.navContentGapHome }
          : null,
      ]}
    >
      {title ? (
        <Text style={[styles.title, { color: colors['text-base-primary'] as string }]}>{title}</Text>
      ) : null}
      <Text
        style={[
          subtitle ? styles.subtitle : styles.lead,
          { color: leadColor },
        ]}
      >
        {lead}
      </Text>
      {!subtitle && meta ? (
        <Text style={[styles.meta, { color: colors['text-base-tertiary'] as string }]}>{meta}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: theme.layout.pageInset,
    paddingBottom: theme.spacing['spacing-3'] as number,
    gap: theme.layout.pageSubtitleGap,
  },
  title: {
    ...theme.font.pageTitle,
  },
  lead: {
    ...theme.font.pageLead,
  },
  subtitle: {
    ...theme.font.pageSubtitle,
  },
  meta: {
    fontSize: 12,
    lineHeight: 18,
  },
});
