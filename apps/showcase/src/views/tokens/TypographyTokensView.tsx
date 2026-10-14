import { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import {
  getTypographyFamilyGroups,
  getTypographyPrimitiveBaseGroups,
  getTypographyTextStyleGroups,
} from '@/data/tokens/typographyTokenCatalog';
import type { TokenGroup } from '@/data/tokens/tokenCatalogTypes';
import { useShowcaseColors } from '@/hooks/useShowcaseColors';
import { showcaseTheme as theme } from '@/views/shared/showcaseTheme';
import { TokenListRow } from '@/views/tokens/TokenListRow';
import { TokenSegmentScrollLayout } from '@/views/tokens/TokenSegmentScrollLayout';
import { TypographyTextStyleRow } from '@/views/tokens/TypographyTextStyleRow';

const SEGMENTS = ['TextStyle', 'Family', 'Base'] as const;

type TypographyTokensViewProps = {
  title: string;
};

type SegmentLayout = {
  groups: TokenGroup[];
  mode: 'textStyle' | 'token';
};

function segmentLayout(index: number): SegmentLayout {
  switch (index) {
    case 0:
      return { groups: getTypographyTextStyleGroups(), mode: 'textStyle' };
    case 1:
      return { groups: getTypographyFamilyGroups(), mode: 'token' };
    default:
      return { groups: getTypographyPrimitiveBaseGroups(), mode: 'token' };
  }
}

export function TypographyTokensView({ title }: TypographyTokensViewProps) {
  const colors = useShowcaseColors();
  const [segmentIndex, setSegmentIndex] = useState(0);
  const { groups, mode } = useMemo(() => segmentLayout(segmentIndex), [segmentIndex]);

  return (
    <TokenSegmentScrollLayout
      title={title}
      segmentLabels={SEGMENTS}
      segmentIndex={segmentIndex}
      onSegmentIndexChange={setSegmentIndex}
    >
      <View style={styles.groupList}>
        {groups.map((group) => (
          <View key={group.comment} style={styles.group}>
            {segmentIndex !== 0 ? (
              <Text style={[styles.groupTitle, { color: colors['text-base-tertiary'] as string }]}>
                {group.comment}
              </Text>
            ) : null}
            <View style={mode === 'textStyle' ? styles.textStyleList : styles.tokenList}>
              {group.tokens.map((entry) =>
                mode === 'textStyle' ? (
                  <TypographyTextStyleRow key={entry.name} className={entry.name} colors={colors} />
                ) : (
                  <TokenListRow key={entry.name} categoryId="typography" entry={entry} colors={colors} />
                ),
              )}
            </View>
          </View>
        ))}
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
  textStyleList: {
    gap: theme.spacing['spacing-5'] as number,
  },
  tokenList: {
    gap: theme.layout.tokenSemanticRowGap,
  },
});
