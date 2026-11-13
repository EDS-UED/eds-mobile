import { EgMenu, EgEdsAnimaPress } from '@eds/mobile-components';
import { PageShotDemo, SlideSelectionDemo } from '@eds/mobile-components/preview/motion';
import { LayoutContentTabDemo } from '@eds/mobile-components/preview/layout-content';
import mobileTheme from '@eds/mobile-tokens/theme';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import type { TokenEntry } from '@/data/tokens/tokenCatalogTypes';
import {
  isMotionMenuPreviewToken,
  isMotionSheetsPreviewToken,
  isMotionPagePreviewToken,
  isMotionPageShotPreviewToken,
  isMotionPressPreviewToken,
  isMotionSlidePreviewToken,
  isMotionLayoutContentPreviewToken,
  pageDirectionOf,
  type TokenDetailCustomizeState,
} from '@/data/tokens/tokenDetailCustomize';
import {
  formatEdsSemanticAnimaCall,
  motionRecipeIdForTokenEntry,
  motionSemanticScenarioIdForTokenEntry,
} from '@/data/tokens/motionNativeDisplay';
import type { ShowcaseColorMap } from '@/hooks/useShowcaseColors';
import { ShowcaseSheetsPreview } from '@/views/components/ShowcaseSheetsPreview';
import { ShowcasePageNavigationDemo } from '@/views/tokens/ShowcasePageNavigationDemo';
import { edsTokenFont } from '@/views/shared/resolveEdsTheme';
import { showcaseTheme as theme } from '@/views/shared/showcaseTheme';

type AnimasTokenDetailPreviewProps = {
  entry: TokenEntry;
  colors: ShowcaseColorMap;
  customize: TokenDetailCustomizeState;
};

function PressPreview({
  colors,
  pressIntensity,
  pressScaleDirection,
  caption,
}: {
  colors: ShowcaseColorMap;
  pressIntensity: TokenDetailCustomizeState['pressIntensity'];
  pressScaleDirection: TokenDetailCustomizeState['pressScaleDirection'];
  caption: string;
}) {
  const [count, setCount] = useState(0);
  const scaleKey =
    pressScaleDirection === 'down'
      ? (`scale-press-down-${pressIntensity}` as const)
      : (`scale-press-${pressIntensity}` as const);
  const scaleValue =
    (mobileTheme.motion.scale[scaleKey] as number | undefined) ??
    (mobileTheme.motion.scale[
      pressScaleDirection === 'down' ? 'scale-press-down-sm' : 'scale-press-sm'
    ] as number);

  return (
    <View style={styles.previewBlock}>
      <EgEdsAnimaPress
        pressIntensity={pressIntensity}
        pressScaleDirection={pressScaleDirection}
        onPress={() => setCount((value) => value + 1)}
        style={[styles.tapButton, { backgroundColor: colors.brand as string }]}
      >
        <Text style={[styles.tapLabel, { color: colors['text-same-white'] as string }]}>
          Press · {scaleValue} · {count}
        </Text>
      </EgEdsAnimaPress>
      <Text style={[styles.caption, { color: colors['text-base-tertiary'] as string }]}>{caption}</Text>
    </View>
  );
}

function FallbackPreview({
  entry,
  colors,
}: {
  entry: TokenEntry;
  colors: ShowcaseColorMap;
}) {
  const scenarioId = motionSemanticScenarioIdForTokenEntry(entry);
  const recipeId = motionRecipeIdForTokenEntry(entry);

  return (
    <View style={styles.previewBlock}>
      <Text style={[styles.fallbackTitle, { color: colors['text-base-primary'] as string }]}>
        {entry.name}
      </Text>
      {scenarioId ? (
        <Text style={[styles.caption, { color: colors['text-base-tertiary'] as string }]}>
          scenario · {scenarioId}
        </Text>
      ) : null}
      {recipeId ? (
        <Text style={[styles.caption, { color: colors['text-base-tertiary'] as string }]}>
          recipe · {recipeId}
        </Text>
      ) : null}
      <Text style={[styles.caption, { color: colors['text-base-tertiary'] as string }]}>
        在 USAGE 中查看 RN / CSS 引用
      </Text>
    </View>
  );
}

export function AnimasTokenDetailPreview({ entry, colors, customize }: AnimasTokenDetailPreviewProps) {
  if (isMotionSlidePreviewToken('motion', entry)) {
    return (
      <View style={styles.previewBlock}>
        <SlideSelectionDemo
          mode="light"
          pressScale={customize.slidePressScale}
          followDrag={customize.slideFollowDrag}
        />
        <Text style={[styles.caption, { color: colors['text-base-tertiary'] as string }]}>
          点按 / 拖动切换 · 滑块弹簧滑入 · EgEdsAnimaSlide · EdsSemanticAnima('slide')
        </Text>
      </View>
    );
  }

  if (isMotionSheetsPreviewToken('motion', entry)) {
    return (
      <View style={styles.previewBlock}>
        <ShowcaseSheetsPreview mode="light" />
        <Text style={[styles.caption, { color: colors['text-base-tertiary'] as string }]}>
          EgSheets · 悬浮档 ↔ 大尺寸贴边 · 拖拽吸附 / 下拉收起 · EdsSemanticAnima('sheets')
        </Text>
      </View>
    );
  }

  if (isMotionPagePreviewToken('motion', entry)) {
    return (
      <View style={styles.previewBlock}>
        <ShowcasePageNavigationDemo
          direction={pageDirectionOf(customize)}
          dragDismiss={customize.pageDragDismiss}
        />
        <Text style={[styles.caption, { color: colors['text-base-tertiary'] as string }]}>
          createEgEdsAnimaPageNavigator + EgEdsAnimaPage · iOS 26+ 系统 NavBar / 转场，其余 EDS 弹簧 + EgNavBar · 每页可嵌套 page-shot · EdsSemanticAnima('page')
        </Text>
      </View>
    );
  }

  if (isMotionPageShotPreviewToken('motion', entry)) {
    return (
      <View style={styles.previewBlock}>
        <PageShotDemo mode="light" />
        <Text style={[styles.caption, { color: colors['text-base-tertiary'] as string }]}>
          EgEdsAnimaPageShot · 卡片 / 按钮等触发元素同一动效展开整页 · 内可左右切换（page）· 关闭 / 下拉 / 侧滑 / 滚动到顶长按拖拽飞回 · EdsSemanticAnima('page-shot')
        </Text>
      </View>
    );
  }

  if (isMotionMenuPreviewToken('motion', entry)) {
    return (
      <View style={styles.previewBlock}>
        <EgMenu mode="light" align="center" forceRnImplementation />
        <Text style={[styles.caption, { color: colors['text-base-tertiary'] as string }]}>
          EgMenu · 容器缩放展开 + 回弹 · EdsSemanticAnima('menu')
        </Text>
      </View>
    );
  }

  if (isMotionLayoutContentPreviewToken('motion', entry)) {
    return (
      <View style={styles.previewBlock}>
        <LayoutContentTabDemo mode="light" />
        <Text style={[styles.caption, { color: colors['text-base-tertiary'] as string }]}>
          EgEdsAnimaLayoutContent（EgTab 正文内置）· crossfade + 10px nudge · EdsSemanticAnima('layout-content')
        </Text>
      </View>
    );
  }

  if (isMotionPressPreviewToken('motion', entry)) {
    const scenarioId =
      entry.layer === 'semantic' ? motionSemanticScenarioIdForTokenEntry(entry) : undefined;
    const caption = scenarioId
      ? `Live · ${formatEdsSemanticAnimaCall(scenarioId)} · USAGE 见 EgEdsAnimaPress`
      : 'Live · USAGE 见 EgEdsAnimaPress · EdsRecipeAnima(\'press\')';

    return (
      <PressPreview
        colors={colors}
        pressIntensity={customize.pressIntensity}
        pressScaleDirection={customize.pressScaleDirection}
        caption={caption}
      />
    );
  }

  return <FallbackPreview entry={entry} colors={colors} />;
}

const styles = StyleSheet.create({
  previewBlock: {
    width: '100%',
    alignItems: 'center',
    gap: theme.layout.cardGap,
    paddingVertical: theme.layout.cardPaddingVertical,
  },
  tapButton: {
    minWidth: 200,
    paddingHorizontal: theme.layout.cardPaddingHorizontal,
    paddingVertical: theme.layout.cardPaddingVertical,
    borderRadius: theme.radius.full,
    alignItems: 'center',
  },
  tapLabel: {
    ...edsTokenFont('body-large', '600'),
  },
  focusField: {
    width: '100%',
    maxWidth: 320,
    paddingHorizontal: theme.layout.cardPaddingHorizontal,
    paddingVertical: theme.layout.cardPaddingVertical,
    ...theme.blockRadius,
  },
  focusLabel: {
    ...edsTokenFont('body-large', '400'),
    textAlign: 'center',
  },
  fallbackTitle: {
    ...edsTokenFont('display', '700'),
    textAlign: 'center',
  },
  caption: {
    ...theme.font.rowHint,
    textAlign: 'center',
  },
});
