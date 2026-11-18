import type { ReactNode } from 'react';
import { View } from 'react-native';

import { ShowcasePageIntro } from '@/views/shared/ShowcasePageIntro';
import { showcaseTheme as theme } from '@/views/shared/showcaseTheme';

type ShowcaseTabHomeIntroProps = {
  lead: string;
  /** 大标题与副文案之间有其它内容时关紧贴，并沿用同档 `tabHomeTitleSubtitleGap`。 */
  tightUnderTabHomeTitle?: boolean;
  /** 副文案下扩展区（如动效页分段）。 */
  children?: ReactNode;
  /** 下挂区左缘对齐屏幕 `spacing-5`（动效页分段）。 */
  trailingFlushPageInset?: boolean;
};

/** 五个 Tab 一级页 — 副文案与「设计令牌」同构：`homeLargeTitle` + `subtitle`。 */
export function ShowcaseTabHomeIntro({
  lead,
  tightUnderTabHomeTitle = true,
  children,
  trailingFlushPageInset = false,
}: ShowcaseTabHomeIntroProps) {
  return (
    <View
      style={
        tightUnderTabHomeTitle
          ? undefined
          : { marginTop: theme.layout.tabHomeTitleSubtitleGap as number }
      }
    >
      <ShowcasePageIntro
        homeLargeTitle
        subtitle
        lead={lead}
        tightUnderTabHomeTitle={tightUnderTabHomeTitle}
        trailingFlushPageInset={trailingFlushPageInset}
      >
        {children}
      </ShowcasePageIntro>
    </View>
  );
}