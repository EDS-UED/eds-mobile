import {
  ParityHarness,
  type ParityReport,
} from '@eds/mobile-components/preview/parity';
import { Stack } from 'expo-router';
import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { useShowcaseStackNav } from '@/hooks/useShowcaseStackNav';
import { showcaseNavScrollContentStyle, showcaseNavScrollInset } from '@/navigation/showcaseNavScrollShell';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import type { ShowcaseColorMap } from '@/hooks/useShowcaseColors';
import { showcaseTheme as theme } from '@/views/shared/showcaseTheme';
import { ShowcaseNavBlurBackdrop } from '@/navigation/ShowcaseNavBlurBackdrop';

/** Where `pnpm parity:native` listens. Reachable from the iOS simulator as-is. */
const COLLECTOR_URL = 'http://localhost:5181/parity';

type Status = 'measuring' | 'sent' | 'failed';

function createParityViewStyles(colors: ShowcaseColorMap) {
  return StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: colors.page as string,
    },
    content: {
      paddingHorizontal: theme.layout.pageInset,
      paddingBottom: theme.layout.pageInset,
      paddingTop: theme.layout.navContentGapInner,
      gap: 12,
    },
    status: {
      fontSize: 13,
      lineHeight: 18,
      color: colors['text-base-secondary'] as string,
    },
    harness: {
      alignItems: 'flex-start',
    },
  });
}

const PARITY_TITLE = 'Layout parity probe';

export function ParityView() {
  const styles = useThemedStyles(createParityViewStyles);
  const {
    onScroll,
    scrollEventThrottle,
    stackScreenOptions,
    nativeStackNav,
    rnNavBar,
    rnScrollPaddingTop,
  } = useShowcaseStackNav(PARITY_TITLE);
  const [status, setStatus] = useState<Status>('measuring');
  const [detail, setDetail] = useState('');

  const handleReport = useCallback((report: ParityReport) => {
    fetch(COLLECTOR_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ platform: 'native', ...report }),
    })
      .then(() => {
        setStatus('sent');
        setDetail(`${report.measurements.length} components measured`);
      })
      .catch((error: unknown) => {
        setStatus('failed');
        setDetail(String(error));
      });
  }, []);

  return (
    <View style={styles.root}>
      <Stack.Screen options={stackScreenOptions} />
      {rnNavBar}
      <ShowcaseNavBlurBackdrop>
        <ScrollView
          style={styles.root}
          contentContainerStyle={showcaseNavScrollContentStyle(
            nativeStackNav,
            rnScrollPaddingTop,
            styles.content,
          )}
          contentInsetAdjustmentBehavior={showcaseNavScrollInset(nativeStackNav)}
          onScroll={onScroll}
          scrollEventThrottle={scrollEventThrottle}
        >
          <Text style={styles.status}>
            {status === 'measuring'
              ? 'Measuring…'
              : status === 'sent'
                ? `Sent to collector — ${detail}`
                : `Collector unreachable — run pnpm parity:native first.\n${detail}`}
          </Text>
          <View style={styles.harness}>
            <ParityHarness mode="light" onReport={handleReport} />
          </View>
        </ScrollView>
      </ShowcaseNavBlurBackdrop>
    </View>
  );
}
