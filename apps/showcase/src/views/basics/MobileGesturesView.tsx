import { EgItem, EgItemGroup } from '@eds/mobile-components';
import { ScrollView, StyleSheet } from 'react-native';

import { MOBILE_GESTURE_ROWS } from '@/data/basics/mobileGestures';
import { useShowcaseScreenStyles } from '@/hooks/useShowcaseScreenStyles';
import { useShowcaseThemeContext } from '@/theme/ShowcaseThemeProvider';
import { ShowcasePageIntro } from '@/views/shared/ShowcasePageIntro';
import { ShowcaseStackScreen } from '@/views/shared/ShowcaseStackScreen';

export function MobileGesturesView() {
  const screenStyles = useShowcaseScreenStyles();
  const { colorTheme } = useShowcaseThemeContext();
  const mode = colorTheme === 'dark' ? 'dark' : 'light';

  return (
    <ShowcaseStackScreen>
      <ScrollView
        style={screenStyles.scrollRoot}
        contentContainerStyle={[screenStyles.scrollContent, styles.content]}
        contentInsetAdjustmentBehavior="automatic"
      >
        <ShowcasePageIntro
          lead="Mobile 基础交互手势：中文名、英文实现名、支持方向与常见用途。EDS 点按语义走 motion event-tap*；列表行长按 / 拖动见 EgDataList。"
        />

        <EgItemGroup mode={mode} testID="basics-mobile-gestures">
          {MOBILE_GESTURE_ROWS.map((row, index) => (
            <EgItem
              key={row.id}
              label={`${row.label}（${row.en}）`}
              value={`${row.direction} — ${row.usage}`}
              trailingEnabled={false}
              showPressFeedback
              showDivider={index < MOBILE_GESTURE_ROWS.length - 1}
              mode={mode}
              testID={`gesture-${row.id}`}
              accessibilityLabel={`${row.label} ${row.usage}`}
            />
          ))}
        </EgItemGroup>
      </ScrollView>
    </ShowcaseStackScreen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 16,
  },
});