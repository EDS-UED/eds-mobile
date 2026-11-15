import { router, Stack } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

import {
  animationDemos,
  formatMotionCatalogHint,
  motionCatalogEntries,
} from '@/data/animations/animationNav';
import { motionScenarioDemos } from '@/data/animations/motionScenarioNav';
import { useShowcaseTabBarInset } from '@/hooks/useShowcaseTabBarInset';
import { useShowcaseTabHomeNav } from '@/hooks/useShowcaseTabHomeNav';
import { showcaseNavScrollContentStyle, showcaseNavScrollInset } from '@/navigation/showcaseNavScrollShell';
import { showcaseTabHomeTitles } from '@/navigation/showcaseTabHomeTitles';
import { ShowcaseCardRow } from '@/views/shared/ShowcaseCardRow';
import { ShowcaseSectionCard } from '@/views/shared/ShowcaseSectionCard';
import { ShowcasePageIntro } from '@/views/shared/ShowcasePageIntro';
import { ShowcaseTabHomeDisplayTitle } from '@/views/shared/ShowcaseTabHomeDisplayTitle';
import { ShowcaseSearchBar } from '@/views/shared/ShowcaseSearchBar';
import { ShowcaseStackScreen } from '@/views/shared/ShowcaseStackScreen';
import { useShowcaseColors } from '@/hooks/useShowcaseColors';
import { useShowcaseScreenStyles } from '@/hooks/useShowcaseScreenStyles';
import { showcaseTheme as theme } from '@/views/shared/showcaseTheme';
import { ShowcaseNavBlurBackdrop } from '@/navigation/ShowcaseNavBlurBackdrop';

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

const styles = StyleSheet.create({
  catalogRow: {
    paddingHorizontal: theme.layout.pageInset,
  },
});

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
  const title = showcaseTabHomeTitles.animations;
  const {
    onScroll,
    scrollEventThrottle,
    stackScreenOptions,
    nativeStackNav,
    rnNavBar,
    rnScrollPaddingTop,
  } = useShowcaseTabHomeNav(title);
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
      <Stack.Screen options={stackScreenOptions} />
      {rnNavBar}
      <ShowcaseNavBlurBackdrop>
        <FlatList
          style={screenStyles.scrollRoot}
          data={entries}
          keyExtractor={(item) => item.id}
          contentInsetAdjustmentBehavior={showcaseNavScrollInset(nativeStackNav)}
          contentContainerStyle={showcaseNavScrollContentStyle(
            nativeStackNav,
            rnScrollPaddingTop,
            screenStyles.scrollContent,
          )}
          onScroll={onScroll}
          scrollEventThrottle={scrollEventThrottle}
          ItemSeparatorComponent={() => <View style={{ height: theme.layout.cardGap }} />}
          ListHeaderComponent={
            <>
              <ShowcaseTabHomeDisplayTitle>{title}</ShowcaseTabHomeDisplayTitle>

              <ShowcasePageIntro
                homeLargeTitle
                subtitle
                lead={`Live 预览与定制在此；RN 代码片段与 motion 参数在 Tokens · Motion。Catalog 共 ${motionCatalogEntries.length} 条 class 解析链。`}
              />

              <ShowcaseSectionCard title="场景演示">
                {motionScenarioDemos.map((demo) => (
                  <ShowcaseCardRow
                    key={demo.id}
                    title={demo.label}
                    hint={demo.lead}
                    onPress={() => router.push(`/(animations)/scenario/${demo.id}`)}
                  />
                ))}
              </ShowcaseSectionCard>

              <ShowcaseSectionCard title="综合演示">
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
              </ShowcaseSectionCard>

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
      </ShowcaseNavBlurBackdrop>
    </ShowcaseStackScreen>
  );
}
