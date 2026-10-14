import { router } from 'expo-router';
import { ScrollView, View } from 'react-native';

import { workflowEntries } from '@/data/workflows/workflowNav';
import { ShowcaseCardRow } from '@/views/shared/ShowcaseCardRow';
import { ShowcaseLargeTitle } from '@/views/shared/ShowcaseLargeTitle';
import { ShowcasePageIntro } from '@/views/shared/ShowcasePageIntro';
import { ShowcaseStackScreen } from '@/views/shared/ShowcaseStackScreen';
import { useShowcaseScreenStyles } from '@/hooks/useShowcaseScreenStyles';

export function WorkflowsHomeView() {
  const screenStyles = useShowcaseScreenStyles();
  return (
    <ShowcaseStackScreen>
      <ScrollView
        style={screenStyles.scrollRoot}
        contentContainerStyle={screenStyles.scrollContent}
        contentInsetAdjustmentBehavior="automatic"
      >
        <ShowcaseLargeTitle>业务流</ShowcaseLargeTitle>

        <ShowcasePageIntro
          homeLargeTitle
          subtitle
          lead="跨页面的完整业务流程：登录、核验、交易等。在 workflows 包一次性封装，consumer 按场景接入即可。"
        />

        <View style={screenStyles.cardList}>
          {workflowEntries.map((entry) => (
            <ShowcaseCardRow
              key={entry.id}
              title={entry.label}
              hint={
                entry.status === 'planned'
                  ? `${entry.lead} · 规划中`
                  : `${entry.lead} · 开发工具，可进入`
              }
              disabled={entry.status === 'planned'}
              onPress={() => {
                if (entry.devRoute === 'Parity') {
                  router.push('/(workflows)/parity');
                }
              }}
            />
          ))}
        </View>
      </ScrollView>
    </ShowcaseStackScreen>
  );
}
