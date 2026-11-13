import SegmentedControl from '@react-native-segmented-control/segmented-control';
import { Stack } from 'expo-router';
import type { ComponentType, PropsWithChildren } from 'react';
import { ScrollView, StyleSheet, View, type NativeSyntheticEvent } from 'react-native';

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

type TokenSegmentScrollLayoutProps = PropsWithChildren<{
  title: string;
  segmentLabels: readonly string[];
  segmentIndex: number;
  onSegmentIndexChange: (index: number) => void;
}>;

/** Token category inner page — sticky segment bar + scroll body (Typography pattern). */
export function TokenSegmentScrollLayout({
  title,
  segmentLabels,
  segmentIndex,
  onSegmentIndexChange,
  children,
}: TokenSegmentScrollLayoutProps) {
  const screenStyles = useShowcaseScreenStyles();
  const colors = useShowcaseColors();

  return (
    <>
      <ScrollView
        style={screenStyles.scrollRoot}
        contentContainerStyle={styles.content}
        contentInsetAdjustmentBehavior="automatic"
        stickyHeaderIndices={[0]}
      >
        <View style={[styles.segmentBar, { backgroundColor: colors['box-page'] as string }]}>
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
      </ScrollView>
      <Stack.Title>{title}</Stack.Title>
    </>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: theme.layout.scrollBottom,
  },
  segmentBar: {
    paddingBottom: theme.spacing['spacing-6'] as number,
    paddingHorizontal: theme.layout.pageInset,
    paddingTop: theme.layout.navContentGapInner,
  },
  segmentControl: {
    height: edsScale('scale-8'),
  },
});
