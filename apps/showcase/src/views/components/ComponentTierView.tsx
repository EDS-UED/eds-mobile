import { router, useLocalSearchParams } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';
import type { FigmaComponentEntry } from '@eds/mobile-components/catalog';

import {
  componentCatalogNav,
  familyTierPressHref,
  familyTierRowHint,
  familyTierRowTitle,
} from '@/data/components/buildComponentCatalogNav';
import { tierPageSubtitle } from '@/data/components/tierIntroCopy';
import { ShowcaseCardRow } from '@/views/shared/ShowcaseCardRow';
import { ShowcaseLargeTitle } from '@/views/shared/ShowcaseLargeTitle';
import { ShowcasePageIntro } from '@/views/shared/ShowcasePageIntro';
import { ShowcaseStackScreen } from '@/views/shared/ShowcaseStackScreen';
import { useShowcaseScreenStyles } from '@/hooks/useShowcaseScreenStyles';

export function ComponentTierView() {
  const screenStyles = useShowcaseScreenStyles();
  const { tier: tierParam } = useLocalSearchParams<{ tier: string }>();
  const tier = tierParam as FigmaComponentEntry['tier'];
  const tierNav = componentCatalogNav.find((item) => item.tier === tier);

  if (!tierNav) {
    return (
      <View style={screenStyles.scrollRoot}>
        <Text style={screenStyles.missing}>未找到 tier {tier}</Text>
      </View>
    );
  }

  return (
    <ShowcaseStackScreen>
      <ScrollView
        style={screenStyles.scrollRoot}
        contentContainerStyle={screenStyles.scrollContent}
        contentInsetAdjustmentBehavior="automatic"
      >
        <ShowcaseLargeTitle>{tierNav.label}</ShowcaseLargeTitle>

        <ShowcasePageIntro homeLargeTitle subtitle lead={tierPageSubtitle(tier)} />

        <View style={screenStyles.cardList}>
          {tierNav.families.map((family) => (
            <ShowcaseCardRow
              key={family.family}
              title={familyTierRowTitle(family.family)}
              hint={familyTierRowHint(family)}
              onPress={() => router.push(familyTierPressHref(family))}
            />
          ))}
        </View>
      </ScrollView>
    </ShowcaseStackScreen>
  );
}
