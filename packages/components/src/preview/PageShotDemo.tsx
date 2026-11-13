import { useCallback, useState, type ReactNode } from 'react';
import { Dimensions, Pressable, StyleSheet, Text, View, type LayoutChangeEvent } from 'react-native';
import Animated from 'react-native-reanimated';

import { EgButtonGlass } from '../molecules/button/button-glass/EgButtonGlass.js';
import { edsFontStyle } from '../shared/fontFamily.js';
import { EgEdsAnimaPageShot, EgEdsAnimaPageShotTrigger, type EgEdsAnimaPageShotRootApi } from '../shared/motion/EgEdsAnimaPageShot.js';
import { getThemeColors, mobileTheme, type ThemeMode } from '../theme/index.js';
import { PageStackDemoPage } from './PageStack.js';

/** 整页坐标系下 Hero 高度（卡片 = Hero 按卡片宽等比缩小）。 */
const HERO_HEIGHT = 420;
const SHOT_ROWS = ['相关文章', '开发者信息'];

const spacing = mobileTheme.spacing as Record<string, number>;
const CARD_RADIUS = spacing['radius-xl'] ?? 20;

function Hero({ mode }: { mode: ThemeMode }) {
  const colors = getThemeColors(mode);
  const white = colors['text-same-white'] as string;
  return (
    <View style={[styles.hero, { backgroundColor: colors.brand as string }]}>
      <Text style={[styles.heroEyebrow, { color: white }]}>TODAY</Text>
      <Text style={[styles.heroTitle, { color: white }]}>卡片展开{'\n'}整页</Text>
    </View>
  );
}

/** 按整页宽排版、等比缩放到 `scale` 并左上对齐。 */
function ScaledPage({
  pageWidth,
  pageHeight,
  scale,
  children,
}: {
  pageWidth: number;
  pageHeight: number;
  scale: number;
  children: ReactNode;
}) {
  return (
    <View
      style={{
        width: pageWidth,
        height: pageHeight,
        transform: [
          { translateX: (-pageWidth * (1 - scale)) / 2 },
          { translateY: (-pageHeight * (1 - scale)) / 2 },
          { scale },
        ],
      }}
    >
      {children}
    </View>
  );
}

/** 卡片触发的整页根内容 · Hero + 后段淡入正文 + 可推入的行。 */
function CardShotRoot({ mode, api }: { mode: ThemeMode; api: EgEdsAnimaPageShotRootApi }) {
  const colors = getThemeColors(mode);
  const primary = colors['text-base-primary'] as string;
  const secondary = colors['text-base-secondary'] as string;
  return (
    <>
      <Hero mode={mode} />
      <Animated.View style={[styles.body, api.bodyStyle]}>
        <Text style={[styles.bodyTitle, { color: primary }]}>EdsSemanticAnima('page-shot')</Text>
        <Text style={[styles.bodyText, { color: secondary }]}>
          自触发元素展开铺满整页，正文在展开后段淡入。弹层内可继续左右切换页面（page）；关闭、下拉或根页左缘侧滑飞回触发元素。
        </Text>
        {SHOT_ROWS.map((row) => (
          <Pressable
            key={row}
            accessibilityRole="button"
            onPress={() => api.push(row)}
            style={[styles.row, { backgroundColor: colors['box-page-card'] as string }]}
          >
            <Text style={[styles.rowLabel, { color: primary }]}>{row}</Text>
            <Text style={[styles.rowLabel, { color: secondary }]}>›</Text>
          </Pressable>
        ))}
      </Animated.View>
    </>
  );
}

type TriggerKind = 'button' | 'text' | 'capsule';

const TRIGGER_SLOTS = [
  { slot: 'left', label: '左' },
  { slot: 'center', label: '中' },
  { slot: 'right', label: '右' },
] as const;

const TRIGGER_GROUPS: { kind: TriggerKind; title: string }[] = [
  { kind: 'button', title: '按钮' },
  { kind: 'text', title: '文字按钮' },
  { kind: 'capsule', title: '胶囊按钮' },
];

const DATA_ROWS = [
  { id: 'row-order', label: '订单 #20261111', value: '已完成' },
  { id: 'row-wallet', label: '钱包地址', value: 'TRC20' },
  { id: 'row-callback', label: '回调记录', value: '12 条' },
];

/** 胶囊按钮 · EgButtonGlass `kind="icon"` 单 icon（左 / 中 / 右）。 */
const CAPSULE_ICONS: Record<(typeof TRIGGER_SLOTS)[number]['slot'], string> = {
  left: 'eds-search',
  center: 'eds-share',
  right: 'eds-scan-code',
};

const BUTTON_RADIUS = spacing['radius-md'] ?? 16;
const TEXT_BUTTON_RADIUS = spacing['radius-sm'] ?? 12;
const ROW_RADIUS = spacing['radius-lg'] ?? 16;

function shotTitle(id: string): string {
  const row = DATA_ROWS.find((item) => item.id === id);
  if (row) return row.label;
  const [kind, slot] = id.split('-');
  const group = TRIGGER_GROUPS.find((item) => item.kind === kind);
  const label = TRIGGER_SLOTS.find((item) => item.slot === slot)?.label;
  return group && label ? `${group.title} · ${label}` : '弹层页面';
}

function GroupTitle({ mode, children }: { mode: ThemeMode; children: string }) {
  const colors = getThemeColors(mode);
  return (
    <Text style={[styles.groupTitle, { color: colors['text-base-tertiary'] as string }]}>{children}</Text>
  );
}

function TriggerFace({
  mode,
  kind,
  slot,
  label,
}: {
  mode: ThemeMode;
  kind: TriggerKind;
  slot: (typeof TRIGGER_SLOTS)[number]['slot'];
  label: string;
}) {
  const colors = getThemeColors(mode);
  if (kind === 'capsule') {
    return (
      <View pointerEvents="none">
        <EgButtonGlass kind="icon" iconCount={1} icon={CAPSULE_ICONS[slot]} mode={mode} accessibilityLabel={label} />
      </View>
    );
  }
  if (kind === 'text') {
    return (
      <View style={styles.textButton}>
        <Text style={[styles.triggerLabel, { color: colors['text-brand'] as string }]}>{label}</Text>
      </View>
    );
  }
  return (
    <View style={[styles.button, { backgroundColor: colors.brand as string }]}>
      <Text style={[styles.triggerLabel, { color: colors['text-same-white'] as string }]}>{label}</Text>
    </View>
  );
}

/**
 * motion-page-shot · EdsSemanticAnima('page-shot')
 * 卡片 / 按钮 / 文字按钮 / 胶囊按钮 / 数据列等触发元素 · 同一动效：自触发元素展开整页、弹层内可左右切换（page）、收起飞回触发元素。
 */
export function PageShotDemo({ mode }: { mode: ThemeMode }) {
  const colors = getThemeColors(mode);
  const { width: pageWidth } = Dimensions.get('window');
  const [cardWidth, setCardWidth] = useState(0);

  const cardScale = cardWidth > 0 ? cardWidth / pageWidth : 0;

  const onCardLayout = useCallback((event: LayoutChangeEvent) => {
    setCardWidth(event.nativeEvent.layout.width);
  }, []);

  return (
    <EgEdsAnimaPageShot
      mode={mode}
      background={(shot) => (shot.id === 'card' ? colors['box-flotation'] : colors.page) as string}
      title={(shot, pageKey) => pageKey ?? (shot.id === 'card' ? undefined : shotTitle(shot.id))}
      renderRoot={(api) =>
        api.source.id === 'card' ? (
          <CardShotRoot mode={mode} api={api} />
        ) : (
          <PageStackDemoPage
            mode={mode}
            title={shotTitle(api.source.id)}
            backLabel="关闭"
            topInset={api.scrollTopInset}
            showHeader={false}
            rows={SHOT_ROWS}
            onBack={api.close}
            onPush={api.push}
          />
        )
      }
      renderPage={(api) => (
        <PageStackDemoPage
          mode={mode}
          title={api.pageKey}
          backLabel="‹ 返回"
          topInset={api.scrollTopInset}
          showHeader={false}
          rows={api.canPush ? [`${api.pageKey} · 下一层`] : []}
          onBack={api.back}
          onPush={api.push}
        />
      )}
    >
      <View style={styles.root}>
        <GroupTitle mode={mode}>卡片</GroupTitle>
        <EgEdsAnimaPageShotTrigger id="card" radius={CARD_RADIUS} stretch>
          <View
            onLayout={onCardLayout}
            style={[
              styles.card,
              {
                height: HERO_HEIGHT * cardScale || undefined,
                backgroundColor: colors['box-flotation'] as string,
              },
            ]}
          >
            {cardScale > 0 ? (
              <ScaledPage pageWidth={pageWidth} pageHeight={HERO_HEIGHT} scale={cardScale}>
                <Hero mode={mode} />
              </ScaledPage>
            ) : null}
          </View>
        </EgEdsAnimaPageShotTrigger>

        {TRIGGER_GROUPS.map((group) => (
          <View key={group.kind} style={styles.group}>
            <GroupTitle mode={mode}>{group.title}</GroupTitle>
            <View style={styles.slots}>
              {TRIGGER_SLOTS.map(({ slot, label }) => {
                const id = `${group.kind}-${slot}`;
                return (
                  <EgEdsAnimaPageShotTrigger
                    key={id}
                    id={id}
                    radius={
                      group.kind === 'capsule'
                        ? 'capsule'
                        : group.kind === 'text'
                          ? TEXT_BUTTON_RADIUS
                          : BUTTON_RADIUS
                    }
                    morph
                  >
                    <TriggerFace mode={mode} kind={group.kind} slot={slot} label={`${group.title}${label}`} />
                  </EgEdsAnimaPageShotTrigger>
                );
              })}
            </View>
          </View>
        ))}

        <View style={styles.group}>
          <GroupTitle mode={mode}>数据列</GroupTitle>
          {DATA_ROWS.map((row) => (
            <EgEdsAnimaPageShotTrigger key={row.id} id={row.id} radius={ROW_RADIUS} morph stretch>
              <View style={[styles.row, { backgroundColor: colors['box-page-card'] as string }]}>
                <Text style={[styles.rowLabel, { color: colors['text-base-primary'] as string }]}>
                  {row.label}
                </Text>
                <Text style={[styles.rowValue, { color: colors['text-base-secondary'] as string }]}>
                  {row.value} ›
                </Text>
              </View>
            </EgEdsAnimaPageShotTrigger>
          ))}
        </View>
      </View>
    </EgEdsAnimaPageShot>
  );
}

const styles = StyleSheet.create({
  root: {
    alignSelf: 'stretch',
    alignItems: 'center',
    gap: spacing['spacing-4'] ?? 16,
  },
  card: {
    alignSelf: 'stretch',
    overflow: 'hidden',
    borderRadius: CARD_RADIUS,
    borderCurve: 'continuous',
  },
  group: {
    alignSelf: 'stretch',
    gap: spacing['spacing-2'] ?? 8,
  },
  groupTitle: {
    alignSelf: 'stretch',
    fontSize: 13,
    lineHeight: 18,
    ...edsFontStyle('500'),
  },
  slots: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  button: {
    paddingHorizontal: spacing['spacing-4'] ?? 16,
    paddingVertical: spacing['spacing-3'] ?? 12,
    borderRadius: BUTTON_RADIUS,
    borderCurve: 'continuous',
  },
  textButton: {
    paddingHorizontal: spacing['spacing-2'] ?? 8,
    paddingVertical: spacing['spacing-2'] ?? 8,
  },
  triggerLabel: {
    fontSize: 15,
    lineHeight: 20,
    ...edsFontStyle('600'),
  },
  rowValue: {
    fontSize: 15,
    lineHeight: 20,
    ...edsFontStyle('400'),
  },
  hero: {
    height: HERO_HEIGHT,
    paddingHorizontal: spacing['spacing-5'] ?? 20,
    paddingTop: 64,
    gap: spacing['spacing-2'] ?? 8,
  },
  heroEyebrow: {
    fontSize: 15,
    lineHeight: 20,
    opacity: 0.8,
    ...edsFontStyle('600'),
  },
  heroTitle: {
    fontSize: 34,
    lineHeight: 40,
    ...edsFontStyle('700'),
  },
  body: {
    paddingHorizontal: spacing['spacing-5'] ?? 20,
    paddingTop: spacing['spacing-5'] ?? 20,
    gap: spacing['spacing-3'] ?? 12,
  },
  bodyTitle: {
    fontSize: 17,
    lineHeight: 22,
    ...edsFontStyle('600'),
  },
  bodyText: {
    fontSize: 15,
    lineHeight: 22,
    ...edsFontStyle('400'),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing['spacing-4'] ?? 16,
    paddingVertical: spacing['spacing-4'] ?? 16,
    borderRadius: spacing['radius-lg'] ?? 16,
    borderCurve: 'continuous',
  },
  rowLabel: {
    fontSize: 17,
    lineHeight: 22,
    ...edsFontStyle('500'),
  },
});
