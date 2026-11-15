import type { PropsWithChildren, ReactElement, ReactNode } from 'react';
import { Children, isValidElement } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';

import { ShowcaseSansText } from '@/components/ShowcaseSansText';
import { useShowcaseColors } from '@/hooks/useShowcaseColors';

import { showcaseCardChromeStyle, showcaseTheme as theme } from './showcaseTheme';

type ShowcaseSectionCardProps = PropsWithChildren<{
  title?: string;
  style?: ViewStyle;
  empty?: boolean;
  emptyText?: string;
}>;

/** 列表页分组 — 标题外置 · 每条目各自一张 `box-page` 卡片（子节点用 `ShowcaseCardRow` 等）。 */
export function ShowcaseSectionCard({
  title,
  style,
  empty,
  emptyText = '等待添加',
  children,
}: ShowcaseSectionCardProps) {
  const colors = useShowcaseColors();
  const childArray = Children.toArray(children).filter(
    (node): node is ReactElement => isValidElement(node),
  );

  let body: ReactNode;
  if (empty && childArray.length === 0) {
    body = (
      <View style={[styles.emptyCard, showcaseCardChromeStyle(colors)]}>
        <ShowcaseSansText
          weight="400"
          style={[styles.empty, { color: colors['text-base-tertiary'] as string }]}
        >
          {emptyText}
        </ShowcaseSansText>
      </View>
    );
  } else {
    body = <View style={styles.stack}>{childArray}</View>;
  }

  return (
    <View style={[styles.wrap, style]}>
      {title ? (
        <ShowcaseSansText
          weight="600"
          style={[styles.title, { color: colors['text-base-tertiary'] as string }]}
        >
          {title}
        </ShowcaseSansText>
      ) : null}
      {body}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: theme.layout.pageInset,
    gap: theme.layout.cardGap,
  },
  title: {
    ...theme.font.tokenGroupTitle,
  },
  stack: {
    gap: theme.layout.cardGap,
  },
  emptyCard: {
    paddingHorizontal: theme.layout.cardPaddingHorizontal,
    paddingVertical: theme.layout.cardPaddingVertical,
  },
  empty: {
    ...theme.font.rowHint,
  },
});