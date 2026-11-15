import { EgItem, EgItemGroup, EG_ITEM_PAD_V } from '@eds/mobile-components';
import { ScrollView, StyleSheet, Text } from 'react-native';

import { GLASS_MASK_BASICS_ROWS, SCROLL_EDGE_EFFECT_ROWS } from '@/data/basics/scrollEdgeBasics';
import { useShowcaseColors } from '@/hooks/useShowcaseColors';
import { useShowcaseScreenStyles } from '@/hooks/useShowcaseScreenStyles';
import { useShowcaseThemeContext } from '@/theme/ShowcaseThemeProvider';
import { edsSpacing } from '@/views/shared/resolveEdsTheme';
import { ShowcasePageIntro } from '@/views/shared/ShowcasePageIntro';
import { ShowcaseStackScreen } from '@/views/shared/ShowcaseStackScreen';
import { showcaseTheme as theme } from '@/views/shared/showcaseTheme';

export function ScrollEdgeEffectBasicsView() {
  const screenStyles = useShowcaseScreenStyles();
  const colors = useShowcaseColors();
  const { colorTheme } = useShowcaseThemeContext();
  const mode = colorTheme === 'dark' ? 'dark' : 'light';

  return (
    <ShowcaseStackScreen>
      <ScrollView
        style={screenStyles.scrollRoot}
        contentContainerStyle={[screenStyles.scrollContent, styles.content]}
        contentInsetAdjustmentBehavior="automatic"
      >
        <ShowcasePageIntro lead="遮罩与 Scroll Edge Effect：iOS 26+ 顶栏滚动缘 · EgNavBar · EgSheets · glass-mask-box。" />

        <Text style={[styles.categoryTitle, styles.categoryTitleFirst, { color: colors['text-base-primary'] as string }]}>
          顶栏 scroll edge
        </Text>
        <EgItemGroup mode={mode} testID="basics-scroll-edge-effects">
          {SCROLL_EDGE_EFFECT_ROWS.map((row, index) => (
            <EgItem
              key={row.id}
              label={row.label}
              value={row.detail}
              trailingEnabled={false}
              showPressFeedback
              showDivider={index < SCROLL_EDGE_EFFECT_ROWS.length - 1}
              mode={mode}
              testID={`scroll-edge-${row.id}`}
            />
          ))}
        </EgItemGroup>

        <Text
          style={[
            styles.categoryTitle,
            styles.categoryTitleGap,
            { color: colors['text-base-primary'] as string },
          ]}
        >
          遮罩 · glass-mask-box
        </Text>
        <EgItemGroup mode={mode} testID="basics-glass-mask">
          {GLASS_MASK_BASICS_ROWS.map((row, index) => (
            <EgItem
              key={row.id}
              label={row.label}
              value={row.detail}
              trailingEnabled={false}
              showPressFeedback
              showDivider={index < GLASS_MASK_BASICS_ROWS.length - 1}
              mode={mode}
              testID={`glass-mask-${row.id}`}
            />
          ))}
        </EgItemGroup>
      </ScrollView>
    </ShowcaseStackScreen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 0,
  },
  categoryTitle: {
    ...theme.font.customizeSlotCategoryTitle,
    paddingHorizontal: edsSpacing('spacing-4'),
    paddingBottom: edsSpacing('spacing-1'),
  },
  categoryTitleFirst: {
    paddingTop: EG_ITEM_PAD_V,
  },
  categoryTitleGap: {
    marginTop: edsSpacing('spacing-6'),
  },
});