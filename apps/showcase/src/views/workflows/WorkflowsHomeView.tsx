import { router, Stack } from 'expo-router';
import { View } from 'react-native';

import { workflowEntries } from '@/data/workflows/workflowNav';
import { useShowcaseTabHomeNav } from '@/hooks/useShowcaseTabHomeNav';
import { showcaseTabHomeTitles } from '@/navigation/showcaseTabHomeTitles';
import { ShowcaseCardRow } from '@/views/shared/ShowcaseCardRow';
import { ShowcasePageIntro } from '@/views/shared/ShowcasePageIntro';
import { ShowcaseStackScreen } from '@/views/shared/ShowcaseStackScreen';
import { ShowcaseTabHomeDisplayTitle } from '@/views/shared/ShowcaseTabHomeDisplayTitle';
import { useShowcaseScreenStyles } from '@/hooks/useShowcaseScreenStyles';
import { ShowcaseNavBlurBackdrop } from '@/navigation/ShowcaseNavBlurBackdrop';
import { ShowcasePageScroll } from '@/views/shared/ShowcasePageScroll';

export function WorkflowsHomeView() {
  const screenStyles = useShowcaseScreenStyles();
  const title = showcaseTabHomeTitles.workflows;
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
        <ShowcasePageScroll
          nativeStackNav={nativeStackNav}
          rnScrollPaddingTop={rnScrollPaddingTop}
          onScroll={onScroll}
          scrollEventThrottle={scrollEventThrottle}
          style={screenStyles.scrollRoot}
        >
          <ShowcaseTabHomeDisplayTitle>{title}</ShowcaseTabHomeDisplayTitle>

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
        </ShowcasePageScroll>
      </ShowcaseNavBlurBackdrop>
    </ShowcaseStackScreen>
  );
}
