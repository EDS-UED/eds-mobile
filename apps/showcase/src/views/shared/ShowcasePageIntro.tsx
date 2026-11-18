import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useShowcaseColors } from '@/hooks/useShowcaseColors';

import { showcasePageHeadingInsetLeft } from './showcaseDocSectionLayout';
import { showcaseTheme as theme } from './showcaseTheme';

type ShowcasePageIntroProps = {
  title?: string;
  lead: string;
  meta?: string;
  /** body-medium (17px) + text-base-primary (100%). */
  subtitle?: boolean;
  /** Tab home with native large title — applies navContentGapHome. */
  homeLargeTitle?: boolean;
  /** 副文案紧贴 Tab 首页大标题（`tabHomeTitleSubtitleGap`）；大标题与副文案之间有其它内容时关。 */
  tightUnderTabHomeTitle?: boolean;
  /** 副文案下扩展区（如分段控制器）— 与文案同组，不叠滚动 `cardGap`。 */
  children?: ReactNode;
  /** 下挂区左缘对齐屏幕 `spacing-5`（20px），取消 Tab 副文案 28px 内缩。 */
  trailingFlushPageInset?: boolean;
};

export function ShowcasePageIntro({
  title,
  lead,
  meta,
  subtitle = false,
  homeLargeTitle = false,
  tightUnderTabHomeTitle = true,
  children,
  trailingFlushPageInset = false,
}: ShowcasePageIntroProps) {
  const colors = useShowcaseColors();
  const leadColor = colors['text-base-secondary'] as string;

  return (
    <View
      style={[
        styles.wrap,
        children ? styles.wrapWithTrailing : null,
        homeLargeTitle ? { paddingLeft: showcasePageHeadingInsetLeft } : null,
        homeLargeTitle && subtitle && !title && tightUnderTabHomeTitle
          ? { marginTop: theme.layout.tabHomeTitleSubtitleGap }
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
      {children ? (
        <View
          style={[
            styles.trailing,
            trailingFlushPageInset ? styles.trailingFlushPageInset : null,
          ]}
        >
          {children}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingBottom: theme.spacing['spacing-3'] as number,
    gap: theme.layout.pageSubtitleGap,
  },
  wrapWithTrailing: {
    paddingBottom: 0,
    gap: 0,
  },
  trailing: {
    width: '100%',
    marginTop: theme.layout.tabHomeSubtitleTrailingGap,
  },
  trailingFlushPageInset: {
    marginLeft: -showcasePageHeadingInsetLeft,
    alignSelf: 'flex-start',
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
