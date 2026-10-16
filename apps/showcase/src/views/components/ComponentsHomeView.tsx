import { router } from 'expo-router';
import { ScrollView, View } from 'react-native';

import { componentCatalogNav } from '@/data/components/buildComponentCatalogNav';
import { COMPONENTS_SHOWCASE_LEAD } from '@/data/components/componentsShowcaseCopy';
import { tierPageSubtitle } from '@/data/components/tierIntroCopy';
import { ShowcaseCardRow } from '@/views/shared/ShowcaseCardRow';
import { ShowcaseLargeTitle } from '@/views/shared/ShowcaseLargeTitle';
import { ShowcasePageIntro } from '@/views/shared/ShowcasePageIntro';
import { ShowcaseStackScreen } from '@/views/shared/ShowcaseStackScreen';
import { useShowcaseScreenStyles } from '@/hooks/useShowcaseScreenStyles';

export function ComponentsHomeView() {
  const screenStyles = useShowcaseScreenStyles();

  return (
    <ShowcaseStackScreen>
      <ScrollView
        style={screenStyles.scrollRoot}
        contentContainerStyle={screenStyles.scrollContent}
        contentInsetAdjustmentBehavior="automatic"
      >
        <ShowcaseLargeTitle>Components</ShowcaseLargeTitle>

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
    </ShowcaseStackScreen>
  );
}
