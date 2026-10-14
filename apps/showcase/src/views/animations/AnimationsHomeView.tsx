import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

import {
  animationDemos,
  formatMotionCatalogHint,
  motionCatalogEntries,
} from '@/data/animations/animationNav';
import { useShowcaseTabBarInset } from '@/hooks/useShowcaseTabBarInset';
import { ShowcaseCardRow } from '@/views/shared/ShowcaseCardRow';
import { ShowcaseLargeTitle } from '@/views/shared/ShowcaseLargeTitle';
import { ShowcasePageIntro } from '@/views/shared/ShowcasePageIntro';
import { ShowcaseSearchBar } from '@/views/shared/ShowcaseSearchBar';
import { ShowcaseStackScreen } from '@/views/shared/ShowcaseStackScreen';
import { useShowcaseColors } from '@/hooks/useShowcaseColors';
import { useShowcaseScreenStyles } from '@/hooks/useShowcaseScreenStyles';
import { showcaseTheme as theme } from '@/views/shared/showcaseTheme';

function TabBarBackdropTestBalls() {
  const colors = useShowcaseColors();
  const tabBarInset = useShowcaseTabBarInset();
  const ballColors = useMemo(
    () =>
      [
        colors['material-brand'],
        colors['status-danger'],
        colors['status-warning'],
        colors['material-match'],
        colors['material-brand-weaken'],
        colors['material-base-primary'],
        colors['material-same-black'],
        colors['material-face-primary'],
      ] as string[],
    [colors],
  );
  const stripPad = theme.spacing['spacing-16'] as number;
  const overlapLift = theme.spacing['spacing-4'] as number;

  return (
    <View
      style={[
        ballStyles.strip,
        {
          minHeight: tabBarInset + stripPad,
          marginBottom: tabBarInset > 0 ? -tabBarInset + overlapLift : 0,
        },
      ]}
      pointerEvents="none"
    >
      {ballColors.map((color, index) => {
        const size =
          (theme.spacing['symbol-lg'] as number) +
          (index % 4) * (theme.spacing['spacing-2'] as number);
        return (
          <View
            key={`${color}-${index}`}
            style={[
              ballStyles.ball,
              {
                width: size,
                height: size,
                borderRadius: theme.spacing['radius-full'] as number,
                backgroundColor: color,
                marginTop: (index % 3) * (theme.spacing['spacing-2'] as number),
              },
            ]}
          />
        );
      })}
    </View>
  );
}

const ballStyles = StyleSheet.create({
  strip: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'flex-end',
    gap: theme.spacing['spacing-3'] as number,
    paddingHorizontal: theme.layout.pageInset,
    paddingTop: theme.layout.cardGap,
  },
  ball: {},
});

export function AnimationsHomeView() {
  const screenStyles = useShowcaseScreenStyles();
  const [query, setQuery] = useState('');

  const entries = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return motionCatalogEntries;
    return motionCatalogEntries.filter(
      (entry) =>
        entry.id.includes(q) ||
        (entry.recipe?.includes(q) ?? false) ||
        (entry.cssRecipe?.includes(q) ?? false),
    );
  }, [query]);

  return (
    <ShowcaseStackScreen>
      <FlatList
        style={screenStyles.scrollRoot}
        data={entries}
        keyExtractor={(item) => item.id}
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={screenStyles.scrollContent}
        ItemSeparatorComponent={() => <View style={{ height: theme.layout.cardGap }} />}
        ListHeaderComponent={
          <>
            <ShowcaseLargeTitle>动画</ShowcaseLargeTitle>

            <ShowcasePageIntro
              homeLargeTitle
              subtitle
              lead={`动效规格来自 token spec（Base → Recipe → Semantic）。运行时请用 resolveMotionRecipe，共 ${motionCatalogEntries.length} 条语义 class。`}
            />

            <View style={screenStyles.cardList}>
              {animationDemos.map((demo) => (
                <ShowcaseCardRow
                  key={demo.id}
                  title={demo.label}
                  hint={demo.lead}
                  onPress={() => {
                    if (demo.route === 'MotionDemo') {
                      router.push('/(animations)/motion-demo');
                      return;
                    }
                    router.push('/(animations)/glass-demo');
                  }}
                />
              ))}
            </View>

            <ShowcaseSearchBar
              value={query}
              onChangeText={setQuery}
              placeholder="搜索 motion class、recipe…"
              accessibilityLabel="Search motion catalog"
            />

            <View style={{ height: theme.layout.cardGap }} />
          </>
        }
        renderItem={({ item }) => (
          <View style={{ paddingHorizontal: theme.layout.pageInset }}>
            <ShowcaseCardRow
              monoTitle
              title={item.id}
              hint={formatMotionCatalogHint(item)}
              onPress={() => router.push(`/(animations)/motion/${item.id}`)}
            />
          </View>
        )}
        ListEmptyComponent={
          <View style={screenStyles.cardList}>
            <ShowcaseCardRow
              disabled
              title="无匹配结果"
              hint="换个关键词试试，例如 tap、modal、glass"
            />
          </View>
        }
        ListFooterComponent={TabBarBackdropTestBalls}
      />
    </ShowcaseStackScreen>
  );
}
