import { EgTabBarText, GlassBlurScope } from '@eds/mobile-components';
import { catalogPreviewCanvasStyle } from '@eds/mobile-components/catalog';
import { router } from 'expo-router';
import { StyleSheet, View, useWindowDimensions } from 'react-native';

import { readTabBarTextTabCount } from '@/data/components/tabBarTextCustomizeModel';

import { useShowcaseColors } from '@/hooks/useShowcaseColors';
import { ShowcaseCardRow } from '@/views/shared/ShowcaseCardRow';
import { showcaseTheme } from '@/views/shared/showcaseTheme';
import { GlassBoxPreviewBackdropGradient } from '@/views/tokens/glassBoxPreviewBackdrop';

const STAGE_HORIZONTAL_CHROME =
  2 * (showcaseTheme.layout.cardPaddingHorizontal + catalogPreviewCanvasStyle.padding);

type ShowcaseEgTabBarTextPreviewProps = Record<string, unknown>;

/** TabBar Text — 纯文案 · Body Small Heavy；定制 Tab 数量 1–6。 */
export function ShowcaseEgTabBarTextPreview(props: ShowcaseEgTabBarTextPreviewProps) {
  const mode = props.mode === 'dark' ? 'dark' : 'light';
  const testID = typeof props.testID === 'string' ? props.testID : undefined;
  const { defaultSelectedIndex, selectedIndex, disabled, items, tabCount } = props;
  const colors = useShowcaseColors();
  const { width: windowWidth } = useWindowDimensions();
  const railWidth = windowWidth - STAGE_HORIZONTAL_CHROME;

  const resolvedDefaultIndex =
    defaultSelectedIndex !== undefined && defaultSelectedIndex !== ''
      ? Number(defaultSelectedIndex)
      : 0;
  const resolvedTabCount = readTabBarTextTabCount(
    typeof tabCount === 'number' ? { tabCount: String(tabCount) } : { tabCount: props.tabCount ?? '3' },
  );
  const resolvedDisabled = Boolean(disabled);

  const openFullScreenDemo = () =>
    router.push({
      pathname: '/(components)/tab-bar-text-demo',
      params: {
        defaultSelectedIndex: String(resolvedDefaultIndex),
        disabled: resolvedDisabled ? '1' : '0',
        tabCount: String(resolvedTabCount),
      },
    });

  const previewBackdrop = (
    <View pointerEvents="none" style={styles.previewBackdrop}>
      <GlassBoxPreviewBackdropGradient colors={colors} />
    </View>
  );

  return (
    <View style={[styles.host, { width: railWidth, alignSelf: 'stretch' }]}>
      <View style={styles.stageWrap} testID={testID}>
        <GlassBlurScope>
          <EgTabBarText
            mode={mode}
            testID={testID ?? 'tab-bar-text'}
            defaultSelectedIndex={resolvedDefaultIndex}
            selectedIndex={typeof selectedIndex === 'number' ? selectedIndex : undefined}
            disabled={resolvedDisabled}
            edgeToEdge
            previewBackdrop={previewBackdrop}
            items={items as { key: string; label: string; routeName?: string }[] | undefined}
            tabCount={typeof tabCount === 'number' ? tabCount : undefined}
          />
        </GlassBlurScope>
      </View>
      <ShowcaseCardRow
        title="全屏演示"
        hint="EgNavBar + EgTabBarText + 列表滚动"
        onPress={openFullScreenDemo}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  host: {
    alignSelf: 'stretch',
    gap: showcaseTheme.layout.cardGap,
  },
  stageWrap: {
    alignItems: 'stretch',
    paddingVertical: showcaseTheme.layout.cardPaddingVertical,
    overflow: 'visible',
  },
  previewBackdrop: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
});