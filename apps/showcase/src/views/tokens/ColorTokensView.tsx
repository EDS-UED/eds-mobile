import { useColorScheme } from 'react-native';
import { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import {
  getColorBaseEntries,
  getColorSemanticGroups,
  resolveColorTheme,
} from '@/data/tokens/colorTokenCatalog';
import { useShowcaseColors } from '@/hooks/useShowcaseColors';
import { ColorTokenBaseTile } from '@/views/tokens/ColorTokenBaseTile';
import { TokenListRow } from '@/views/tokens/TokenListRow';
import { TokenSegmentScrollLayout } from '@/views/tokens/TokenSegmentScrollLayout';
import { showcaseTheme as theme } from '@/views/shared/showcaseTheme';

const SEGMENTS = ['Base', 'Semantic'] as const;

type ColorTokensViewProps = {
  title: string;
};

export function ColorTokensView({ title }: ColorTokensViewProps) {
  const colorTheme = resolveColorTheme(useColorScheme());
  const colors = useShowcaseColors();
  const [segmentIndex, setSegmentIndex] = useState(0);
  const baseEntries = useMemo(() => getColorBaseEntries(colorTheme), [colorTheme]);
  const semanticGroups = useMemo(() => getColorSemanticGroups(colorTheme), [colorTheme]);

  return (
    <TokenSegmentScrollLayout
      title={title}
      segmentLabels={SEGMENTS}
      segmentIndex={segmentIndex}
      onSegmentIndexChange={setSegmentIndex}
    >
      <View style={styles.groupList}>
        {segmentIndex === 0 ? (
          <View style={styles.baseList}>
            {baseEntries.map((entry) => (
              <ColorTokenBaseTile key={entry.cssVar} entry={entry} colors={colors} />
            ))}
          </View>
        ) : (
          semanticGroups.map((group) => (
            <View key={group.comment} style={styles.group}>
              <Text style={[styles.groupTitle, { color: colors['text-base-tertiary'] as string }]}>
                {group.comment}
              </Text>
              <View style={styles.list}>
                {group.tokens.map((entry) => (
                  <TokenListRow key={entry.cssVar} categoryId="color" entry={entry} colors={colors} />
                ))}
              </View>
            </View>
          ))
        )}
      </View>
    </TokenSegmentScrollLayout>
  );
}

const styles = StyleSheet.create({
  groupList: {
    gap: theme.layout.tokenBlockGap,
    paddingHorizontal: theme.layout.pageInset,
  },
  group: {
    gap: theme.layout.tokenItemGap,
  },
  groupTitle: {
    ...theme.font.tokenGroupTitle,
  },
  list: {
    gap: theme.layout.tokenSemanticRowGap,
  },
  baseList: {
    gap: theme.spacing['spacing-3'] as number,
  },
});
