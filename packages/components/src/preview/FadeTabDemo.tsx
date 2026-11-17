import SegmentedControl from '@react-native-segmented-control/segmented-control';
import { useMemo, useState, type ComponentType } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { EgEdsAnimaFade } from '../shared/motion/EgEdsAnimaFade.js';
import { edsFontStyle } from '../shared/fontFamily.js';
import { getThemeColors, mobileTheme, type ThemeMode } from '../theme/index.js';

const TAB_LABELS = ['Alpha', 'Beta', 'Gamma'] as const;

const TokenSegmentedControl = SegmentedControl as ComponentType<{
  values: string[];
  selectedIndex: number;
  onChange: (event: { nativeEvent: { selectedSegmentIndex: number } }) => void;
  style?: object;
}>;

/**
 * motion-fade · EdsSemanticAnima('fade')
 * Segment 切换 · 纯 opacity crossfade。
 */
export function FadeTabDemo({ mode }: { mode: ThemeMode }) {
  const colors = getThemeColors(mode);
  const [index, setIndex] = useState(0);
  const id = TAB_LABELS[index] ?? TAB_LABELS[0];

  const lines = useMemo(
    () => [`${id} · 文案行 1`, `${id} · 文案行 2`, `${id} · 文案行 3`],
    [id],
  );

  return (
    <View style={styles.root}>
      <TokenSegmentedControl
        values={[...TAB_LABELS]}
        selectedIndex={index}
        onChange={(event) => setIndex(event.nativeEvent.selectedSegmentIndex)}
        style={styles.segment}
      />
      <EgEdsAnimaFade contentKey={id}>
        <View style={styles.body}>
          {lines.map((line) => (
            <Text key={line} style={[styles.line, { color: colors['text-base-primary'] as string }]}>
              {line}
            </Text>
          ))}
        </View>
      </EgEdsAnimaFade>
    </View>
  );
}

const spacing = mobileTheme.spacing;

const styles = StyleSheet.create({
  root: {
    alignSelf: 'stretch',
    width: '100%',
    gap: spacing['spacing-4'] as number,
  },
  segment: {
    height: 32,
  },
  body: {
    gap: spacing['spacing-3'] as number,
    alignItems: 'center',
  },
  line: {
    ...edsFontStyle('500'),
    fontSize: 15,
  },
});