import { useColorScheme } from 'react-native';
import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import {
  getColorBaseEntries,
  getColorSemanticGroups,
  resolveColorTheme,
} from '@/data/tokens/colorTokenCatalog';
import { useShowcaseColors } from '@/hooks/useShowcaseColors';
import { ColorTokenBaseTile } from '@/views/tokens/ColorTokenBaseTile';
import { TokenCatalogListGroup } from '@/views/tokens/TokenCatalogListGroup';
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
      <View>
        {segmentIndex === 0 ? (
          <View style={styles.baseList}>
            {baseEntries.map((entry) => (
              <ColorTokenBaseTile key={entry.cssVar} entry={entry} colors={colors} />
            ))}
          </View>
        ) : (
          semanticGroups.map((group) => (
            <TokenCatalogListGroup key={group.comment} title={group.comment}>
              {group.tokens.map((entry) => (
                <TokenListRow key={entry.cssVar} categoryId="color" entry={entry} colors={colors} />
              ))}
            </TokenCatalogListGroup>
          ))
        )}
      </View>
    </TokenSegmentScrollLayout>
  );
}

const styles = StyleSheet.create({
  /** Base — 每项自铺色圆角块，无分组卡片（§4.3 特例）。 */
  baseList: {
    gap: theme.layout.cardGap,
  },
});
