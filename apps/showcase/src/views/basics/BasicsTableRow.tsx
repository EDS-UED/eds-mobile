import {
  EgDivider,
  EG_ITEM_PAD_H,
  EG_ITEM_PAD_V,
  getEgItemDividerInset,
  type ThemeMode,
} from '@eds/mobile-components';
import { StyleSheet, View } from 'react-native';

import { ShowcaseSansText } from '@/components/ShowcaseSansText';
import { useShowcaseColors } from '@/hooks/useShowcaseColors';
import { edsTokenFont } from '@/views/shared/resolveEdsTheme';

type BasicsTableRowProps = {
  title: string;
  /** 主标题下副文本 · typography-body-small */
  subtitle?: string;
  /** 右侧列（如手势「支持方向」）*/
  trailing?: string;
  showDivider?: boolean;
  mode?: ThemeMode;
};

/** 基础 Tab 对照行 — 左主/副文案 · 右说明列；分割线与 EgItem 同 `module` 线。 */
export function BasicsTableRow({
  title,
  subtitle,
  trailing,
  showDivider = true,
  mode = 'light',
}: BasicsTableRowProps) {
  const colors = useShowcaseColors();
  const primary = colors['text-base-primary'] as string;
  const secondary = colors['text-base-secondary'] as string;
  const dividerInset = getEgItemDividerInset(false);

  return (
    <>
      <View style={styles.row}>
        <View style={styles.leading}>
          <ShowcaseSansText weight="600" style={[styles.title, { color: primary }]}>
            {title}
          </ShowcaseSansText>
          {subtitle ? (
            <ShowcaseSansText weight="400" style={[styles.subtitle, { color: secondary }]}>
              {subtitle}
            </ShowcaseSansText>
          ) : null}
        </View>
        {trailing ? (
          <ShowcaseSansText
            weight="400"
            style={[styles.trailing, { color: secondary }]}
          >
            {trailing}
          </ShowcaseSansText>
        ) : null}
      </View>
      {showDivider ? (
        <View style={[styles.dividerWrap, { paddingLeft: dividerInset, paddingRight: EG_ITEM_PAD_H }]}>
          <EgDivider variant="module" mode={mode} orientation="horizontal" />
        </View>
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: EG_ITEM_PAD_H,
    paddingVertical: EG_ITEM_PAD_V,
    gap: 12,
  },
  leading: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  title: edsTokenFont('body-medium-heavy', '600'),
  subtitle: edsTokenFont('body-small', '400'),
  trailing: {
    ...edsTokenFont('body-small', '400'),
    flexShrink: 0,
    maxWidth: '42%',
    textAlign: 'right',
  },
  dividerWrap: {
    alignSelf: 'stretch',
  },
});