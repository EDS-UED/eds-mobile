import { ScrollView, View } from 'react-native';

import { patternEntries } from '@/data/patterns/patternNav';
import { ShowcaseCardRow } from '@/views/shared/ShowcaseCardRow';
import { ShowcaseLargeTitle } from '@/views/shared/ShowcaseLargeTitle';
import { ShowcasePageIntro } from '@/views/shared/ShowcasePageIntro';
import { ShowcaseStackScreen } from '@/views/shared/ShowcaseStackScreen';
import { useShowcaseScreenStyles } from '@/hooks/useShowcaseScreenStyles';

export function PatternsHomeView() {
  const screenStyles = useShowcaseScreenStyles();
  return (
    <ShowcaseStackScreen>
      <ScrollView
        style={screenStyles.scrollRoot}
        contentContainerStyle={screenStyles.scrollContent}
        contentInsetAdjustmentBehavior="automatic"
      >
        <ShowcaseLargeTitle>数据</ShowcaseLargeTitle>

        <ShowcasePageIntro
          homeLargeTitle
          subtitle
          lead="页面级模式：列表字段、表单流、概览看板等。在 patterns 包统一维护，业务侧用 Eg* 入口组合，不要手拼 primitives。"
        />

        <View style={screenStyles.cardList}>
          {patternEntries.map((entry) => (
            <ShowcaseCardRow
              key={entry.id}
              title={entry.label}
              hint={
                entry.status === 'planned'
                  ? `${entry.lead} · 规划中，暂不可预览`
                  : `${entry.lead} · 可预览`
              }
              disabled={entry.status === 'planned'}
            />
          ))}
        </View>
      </ScrollView>
    </ShowcaseStackScreen>
  );
}
