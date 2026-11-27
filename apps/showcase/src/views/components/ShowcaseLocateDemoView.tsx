import { EG_LOCATE_DEFAULT_KEYS, EgLocate } from '@eds/mobile-components';
import { Stack } from 'expo-router';
import { useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useShowcaseColors } from '@/hooks/useShowcaseColors';
import { useShowcaseStackNav } from '@/hooks/useShowcaseStackNav';
import { ShowcaseNavBlurBackdrop } from '@/navigation/ShowcaseNavBlurBackdrop';
import { ShowcaseStackScreen } from '@/views/shared/ShowcaseStackScreen';
import { edsSpacing, edsTokenFont } from '@/views/shared/resolveEdsTheme';
import { showcaseDetailScreenBackgroundColor } from '@/views/shared/showcaseTheme';

const DEMO_TITLE = '定位';

/** 全屏：分组列表 + 右侧 EgLocate。按住索引跳到对应分组，气泡只在滑动时出现。 */
export function ShowcaseLocateDemoView() {
  const colors = useShowcaseColors();
  const insets = useSafeAreaInsets();
  const background = showcaseDetailScreenBackgroundColor(colors);
  const { stackScreenOptions, rnNavBar, rnScrollPaddingTop } = useShowcaseStackNav(DEMO_TITLE);
  const scrollRef = useRef<{ scrollTo: (options: { y: number; animated?: boolean }) => void } | null>(null);
  const offsets = useRef<Record<string, number>>({});
  const [activeKey, setActiveKey] = useState<string>(EG_LOCATE_DEFAULT_KEYS[0]);
  const edge = edsSpacing('spacing-5');
  const rowInk = colors['text-base-primary'] as string;
  const headerInk = colors['text-base-tertiary'] as string;
  const line = colors['stroke-divider-shallow'] as string;

  return (
    <ShowcaseStackScreen>
      <Stack.Screen options={stackScreenOptions} />
      {rnNavBar}
      <ShowcaseNavBlurBackdrop>
        <View style={[styles.screen, { backgroundColor: background }]}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            ref={(node) => {
              scrollRef.current = node as unknown as typeof scrollRef.current;
            }}
            contentContainerStyle={{
              paddingTop: rnScrollPaddingTop,
              paddingBottom: Math.max(insets.bottom, edge),
            }}
          >
            {EG_LOCATE_DEFAULT_KEYS.map((key) => (
              <View
                key={key}
                onLayout={(event) => {
                  offsets.current[key] = event.nativeEvent.layout.y;
                }}
              >
                <Text style={[styles.header, { color: headerInk }]}>{key}</Text>
                <View style={[styles.row, { borderBottomColor: line }]}>
                  <Text style={[styles.rowLabel, { color: rowInk }]}>示例</Text>
                </View>
              </View>
            ))}
          </ScrollView>
          <EgLocate
            style={{
              top: rnScrollPaddingTop,
              bottom: Math.max(insets.bottom, edge),
            }}
              activeKey={activeKey}
              onActiveKeyChange={(key) => {
                setActiveKey(key);
                scrollRef.current?.scrollTo({ y: offsets.current[key] ?? 0, animated: false });
              }}
            />
        </View>
      </ShowcaseNavBlurBackdrop>
    </ShowcaseStackScreen>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  header: {
    paddingHorizontal: edsSpacing('spacing-5'),
    paddingTop: edsSpacing('spacing-4'),
    paddingBottom: edsSpacing('spacing-2'),
    ...edsTokenFont('footnote', '600'),
  },
  row: {
    marginLeft: edsSpacing('spacing-5'),
    paddingVertical: edsSpacing('spacing-4'),
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  rowLabel: {
    ...edsTokenFont('body-medium', '400'),
  },
});
