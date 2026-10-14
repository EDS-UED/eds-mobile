import { router } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';

import { tokenCategories } from '@/data/tokens/tokenNav';
import { showcaseTabHomeTitles } from '@/navigation/showcaseTabHomeTitles';
import { ShowcaseCardRow } from '@/views/shared/ShowcaseCardRow';
import { ShowcaseLargeTitle } from '@/views/shared/ShowcaseLargeTitle';
import { ShowcasePageIntro } from '@/views/shared/ShowcasePageIntro';
import { ShowcaseStackScreen } from '@/views/shared/ShowcaseStackScreen';
import { useShowcaseScreenStyles } from '@/hooks/useShowcaseScreenStyles';

export function TokensHomeView() {
  const screenStyles = useShowcaseScreenStyles();
  return (
    <ShowcaseStackScreen>
      <ScrollView
        style={screenStyles.scrollRoot}
        contentContainerStyle={screenStyles.scrollContent}
        contentInsetAdjustmentBehavior="automatic"
      >
        <ShowcaseLargeTitle>{showcaseTabHomeTitles.tokens}</ShowcaseLargeTitle>

        <ShowcasePageIntro
          homeLargeTitle
          subtitle
          lead="EDS设计系统的全局资产，非特殊申明，业务侧禁止硬编码"
        />

        <View style={screenStyles.cardList}>
          {tokenCategories.map((category) => (
            <ShowcaseCardRow
              key={category.id}
              title={category.label}
              hint={category.lead}
              onPress={() => router.push(`/(tokens)/category/${category.id}`)}
            />
          ))}
        </View>
      </ScrollView>
    </ShowcaseStackScreen>
  );
}
