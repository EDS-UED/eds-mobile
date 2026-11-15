import { EgSymbol } from '@eds/mobile-components/catalog';
import { Pressable, View } from 'react-native';

import { ShowcaseSansText } from '@/components/ShowcaseSansText';
import { useShowcaseColors } from '@/hooks/useShowcaseColors';

import { showcaseDocSectionLayout } from '@/views/shared/showcaseDocSectionLayout';
import { showcaseTheme as theme } from '@/views/shared/showcaseTheme';

type DocSectionLinkRowProps = {
  title: string;
  hint?: string;
  onPress: () => void;
};

/** DocSection 卡内单行跳转 — 与令牌列表 inset 行对齐。 */
export function DocSectionLinkRow({ title, hint, onPress }: DocSectionLinkRowProps) {
  const colors = useShowcaseColors();

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={showcaseDocSectionLayout.insetRow}
    >
      <View style={showcaseDocSectionLayout.insetRowCopy}>
        <ShowcaseSansText weight="600" style={{ color: colors['text-base-primary'] as string }}>
          {title}
        </ShowcaseSansText>
        {hint ? (
          <ShowcaseSansText weight="400" style={[theme.font.rowHint, { color: colors['text-base-secondary'] as string }]}>
            {hint}
          </ShowcaseSansText>
        ) : null}
      </View>
      <EgSymbol name="eds-arrow-right-mini-ios" size="xs" strokeColorToken="text-base-tertiary" />
    </Pressable>
  );
}