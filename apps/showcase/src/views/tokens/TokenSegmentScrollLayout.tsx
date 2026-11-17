import SegmentedControl from '@react-native-segmented-control/segmented-control';
import { Stack } from 'expo-router';

import { useShowcaseStackNav } from '@/hooks/useShowcaseStackNav';
import type { ComponentType, PropsWithChildren } from 'react';
import { StyleSheet, View, type NativeSyntheticEvent } from 'react-native';

type SegmentedControlChangeEvent = NativeSyntheticEvent<{ selectedSegmentIndex: number }>;

const TokenSegmentedControl = SegmentedControl as ComponentType<{
  values: string[];
  selectedIndex: number;
  onChange: (event: SegmentedControlChangeEvent) => void;
  style?: object;
}>;

import { useShowcaseColors } from '@/hooks/useShowcaseColors';
import { useShowcaseScreenStyles } from '@/hooks/useShowcaseScreenStyles';
import { edsScale } from '@/views/shared/resolveEdsTheme';
import { showcaseTheme as theme } from '@/views/shared/showcaseTheme';
import { ShowcaseNavBlurBackdrop } from '@/navigation/ShowcaseNavBlurBackdrop';
import { ShowcasePageScroll } from '@/views/shared/ShowcasePageScroll';
import { ShowcaseStackScreen } from '@/views/shared/ShowcaseStackScreen';

type TokenSegmentScrollLayoutProps = PropsWithChildren<{
  title: string;
  segmentLabels: readonly string[];
  segmentIndex: number;
  onSegmentIndexChange: (index: number) => void;
}>;

/** Token category inner page — sticky segment bar + scroll body（EgPage 水平 spacing-5）。 */
export function TokenSegmentScrollLayout({
  title,
  segmentLabels,
  segmentIndex,
  onSegmentIndexChange,
  children,
}: TokenSegmentScrollLayoutProps) {
  const screenStyles = useShowcaseScreenStyles();
  const colors = useShowcaseColors();
  const {
    onScroll,
    scrollEventThrottle,
    stackScreenOptions,
    nativeStackNav,
    rnNavBar,
    rnScrollPaddingTop,
  } = useShowcaseStackNav(title);

  return (
    <ShowcaseStackScreen>
      <Stack.Screen options={stackScreenOptions} />
      {rnNavBar}
      <ShowcaseNavBlurBackdrop>
        <ShowcasePageScroll
          nativeStackNav={nativeStackNav}
          rnScrollPaddingTop={rnScrollPaddingTop}
          contentPaddingTop={0}
          onScroll={onScroll}
          scrollEventThrottle={scrollEventThrottle}
          withTabBarInset={false}
          sectionGap={false}
          stickyHeaderIndices={[0]}
          style={screenStyles.scrollRoot}
        >
          <View style={[styles.segmentBar, { backgroundColor: colors['box-page-card'] as string }]}>
            <TokenSegmentedControl
              values={[...segmentLabels]}
              selectedIndex={segmentIndex}
              onChange={(event: SegmentedControlChangeEvent) =>
                onSegmentIndexChange(event.nativeEvent.selectedSegmentIndex)
              }
              style={styles.segmentControl}
            />
          </View>
          {children}
        </ShowcasePageScroll>
      </ShowcaseNavBlurBackdrop>
    </ShowcaseStackScreen>
  );
}

const styles = StyleSheet.create({
  segmentBar: {
    paddingBottom: theme.spacing['spacing-6'] as number,
    paddingTop: theme.layout.navContentGapInner,
  },
  segmentControl: {
    height: edsScale('scale-8'),
  },
});