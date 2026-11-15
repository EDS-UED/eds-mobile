import { router, Stack } from 'expo-router';
import { ScrollView, View } from 'react-native';

import { componentCatalogNav } from '@/data/components/buildComponentCatalogNav';
import { COMPONENTS_SHOWCASE_LEAD } from '@/data/components/componentsShowcaseCopy';
import { tierPageSubtitle } from '@/data/components/tierIntroCopy';
import { useShowcaseTabHomeNav } from '@/hooks/useShowcaseTabHomeNav';
import { showcaseNavScrollContentStyle, showcaseNavScrollInset } from '@/navigation/showcaseNavScrollShell';
import { showcaseTabHomeTitles } from '@/navigation/showcaseTabHomeTitles';
import { ShowcaseCardRow } from '@/views/shared/ShowcaseCardRow';
import { ShowcasePageIntro } from '@/views/shared/ShowcasePageIntro';
import { ShowcaseStackScreen } from '@/views/shared/ShowcaseStackScreen';
import { ShowcaseTabHomeDisplayTitle } from '@/views/shared/ShowcaseTabHomeDisplayTitle';
import { useShowcaseScreenStyles } from '@/hooks/useShowcaseScreenStyles';
import { ShowcaseNavBlurBackdrop } from '@/navigation/ShowcaseNavBlurBackdrop';

export function ComponentsHomeView() {
  const screenStyles = useShowcaseScreenStyles();
  const title = showcaseTabHomeTitles.components;
  const {
    onScroll,
    scrollEventThrottle,
    stackScreenOptions,
    nativeStackNav,
    rnNavBar,
    rnScrollPaddingTop,
  } = useShowcaseTabHomeNav(title);

  return (
    <ShowcaseStackScreen>
      <Stack.Screen options={stackScreenOptions} />
      {rnNavBar}
      <ShowcaseNavBlurBackdrop>
        <ScrollView
          style={screenStyles.scrollRoot}
          contentContainerStyle={showcaseNavScrollContentStyle(
            nativeStackNav,
            rnScrollPaddingTop,
            screenStyles.scrollContent,
          )}
          contentInsetAdjustmentBehavior={showcaseNavScrollInset(nativeStackNav)}
          onScroll={onScroll}
          scrollEventThrottle={scrollEventThrottle}
        >
          <ShowcaseTabHomeDisplayTitle>{title}</ShowcaseTabHomeDisplayTitle>

          <ShowcasePageIntro homeLargeTitle subtitle lead={COMPONENTS_SHOWCASE_LEAD} />

          <View style={screenStyles.cardList}>
            {componentCatalogNav.map((tier) => (
              <ShowcaseCardRow
                key={tier.tier}
                title={tier.label}
                hint={tierPageSubtitle(tier.tier)}
                onPress={() => router.push(`/(components)/tier/${tier.tier}`)}
              />
            ))}
          </View>
        </ScrollView>
      </ShowcaseNavBlurBackdrop>
    </ShowcaseStackScreen>
  );
}
