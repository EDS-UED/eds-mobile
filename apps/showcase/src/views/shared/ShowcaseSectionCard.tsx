import type { PropsWithChildren, ReactElement } from 'react';
import { Children, cloneElement, isValidElement } from 'react';
import { StyleSheet, Text, View, type ViewStyle } from 'react-native';

import { ShowcaseSansText } from '@/components/ShowcaseSansText';
import { useShowcaseColors } from '@/hooks/useShowcaseColors';

import { EG_ITEM_GROUP_INSET } from '@eds/mobile-components';

import {
  showcaseDocSectionCardStyle,
  showcaseDocSectionLayout,
  showcaseDocSectionTitleStyle,
} from './showcaseDocSectionLayout';
import { edsTokenFont } from './resolveEdsTheme';
import { showcaseTheme as theme } from './showcaseTheme';

export type ShowcaseSectionInsetRowProps = {
  variant?: 'card' | 'plain' | 'inset';
  showDivider?: boolean;
};

type ShowcaseSectionCardProps = PropsWithChildren<{
  title?: string;
  style?: ViewStyle;
  empty?: boolean;
  emptyText?: string;
  /** 族页场景分组 — 行间 `EgDivider` module（对齐 EgItem）。 */
  insetDividers?: boolean;
  /** 空态主文案 — 默认 `body-medium`（17px）；极少场景可回落 `hint`。 */
  emptyTypography?: 'hint' | 'body-medium';
}>;

/** 列表页分组 — 与 `DocSection` / `ShowcaseListGroup` 同构：标题 + 单张浅底卡，多行 inset。 */
export function ShowcaseSectionCard({
  title,
  style,
  empty,
  emptyText = '等待添加',
  insetDividers = false,
  emptyTypography = 'body-medium',
  children,
}: ShowcaseSectionCardProps) {
  const colors = useShowcaseColors();
  const childArray = Children.toArray(children).filter(
    (node): node is ReactElement => isValidElement(node),
  );

  const cardShell = showcaseDocSectionCardStyle(colors);

  let body: React.ReactNode;
  if (empty && childArray.length === 0) {
    body = (
      <View style={[cardShell, styles.insetGroup]}>
        <View style={showcaseDocSectionLayout.insetRow}>
          <ShowcaseSansText
            weight="400"
            style={[
              emptyTypography === 'body-medium'
                ? edsTokenFont('body-medium', '400')
                : styles.empty,
              { color: colors['text-base-tertiary'] as string },
            ]}
          >
            {emptyText}
          </ShowcaseSansText>
        </View>
      </View>
    );
  } else {
    body = (
      <View style={[cardShell, styles.insetGroup]}>
        {childArray.map((child, index) =>
          cloneElement(child as ReactElement<ShowcaseSectionInsetRowProps>, {
            variant: 'inset',
            showDivider: insetDividers && index < childArray.length - 1,
          }),
        )}
      </View>
    );
  }

  return (
    <View style={[styles.wrap, style]}>
      {title ? <Text style={showcaseDocSectionTitleStyle(colors)}>{title}</Text> : null}
      {body}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
  },
  empty: {
    ...theme.font.rowHint,
  },
  /** 组内圆角行 — 与定制 `EgItemGroup` 同 `EG_ITEM_GROUP_INSET`。 */
  insetGroup: {
    padding: EG_ITEM_GROUP_INSET,
    gap: 0,
  },
});
