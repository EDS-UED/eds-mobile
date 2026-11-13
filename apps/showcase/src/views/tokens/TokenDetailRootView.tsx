import { Stack } from 'expo-router';
import type { ReactNode } from 'react';
import { useState } from 'react';
import { Platform, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useThemedStyles } from '@/hooks/useThemedStyles';
import type { ShowcaseColorMap } from '@/hooks/useShowcaseColors';
import {
  ComponentDetailDocActions,
  type ComponentDetailDocPanel,
} from '@/views/components/ComponentDetailDocActions';
import { DocContentSheet } from '@/views/shared/DocContentSheet';
import { DocSection } from '@/views/shared/DocSection';
import { showcaseTheme as theme } from '@/views/shared/showcaseTheme';

const STACK_HEADER_BAR = Platform.select({ ios: 44, android: 56, default: 44 }) as number;

function createTokenDetailStyles(colors: ShowcaseColorMap) {
  return StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.page as string,
    },
    root: {
      flex: 1,
    },
    scrollContent: {
      paddingBottom: theme.layout.scrollBottom,
    },
    previewStage: {
      width: '100%',
      alignSelf: 'stretch',
      backgroundColor: colors['material-card-shallow'] as string,
      paddingHorizontal: theme.layout.cardPaddingHorizontal,
      paddingBottom: theme.layout.cardPaddingVertical,
    },
    canvas: {
      minHeight: 160,
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
}

export type TokenDetailRootViewProps = {
  title: string;
  preview: ReactNode;
  customize: ReactNode;
  usageContent: ReactNode;
  propsContent: ReactNode;
  previewMinHeight?: number;
};

export function TokenDetailRootView({
  title,
  preview,
  customize,
  usageContent,
  propsContent,
  previewMinHeight = 160,
}: TokenDetailRootViewProps) {
  const styles = useThemedStyles(createTokenDetailStyles);
  const insets = useSafeAreaInsets();
  const previewTopInset = insets.top + STACK_HEADER_BAR + theme.layout.cardPaddingVertical;
  const [docPanel, setDocPanel] = useState<ComponentDetailDocPanel | null>(null);

  const docSheetTitle =
    docPanel === 'usage' ? 'USAGE' : docPanel === 'props' ? 'PROPS / API' : '';

  return (
    <View style={styles.screen}>
      <ScrollView
        style={styles.root}
        keyboardShouldPersistTaps="handled"
        contentInsetAdjustmentBehavior="never"
        contentContainerStyle={styles.scrollContent}
      >
        <View style={[styles.previewStage, { paddingTop: previewTopInset }]}>
          <View style={[styles.canvas, { minHeight: previewMinHeight }]}>{preview}</View>
        </View>

        <ComponentDetailDocActions onOpen={setDocPanel} />

        <DocSection title="定制">{customize}</DocSection>
      </ScrollView>

      <DocContentSheet
        visible={docPanel != null}
        title={docSheetTitle}
        onClose={() => setDocPanel(null)}
      >
        {docPanel === 'usage' ? usageContent : null}
        {docPanel === 'props' ? propsContent : null}
      </DocContentSheet>

      <Stack.Title>{title}</Stack.Title>
    </View>
  );
}
