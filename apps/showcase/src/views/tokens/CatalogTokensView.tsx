import { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import type { TokenGroup } from '@/data/tokens/tokenCatalogTypes';
import { useShowcaseColors } from '@/hooks/useShowcaseColors';
import type { ShowcaseColorMap } from '@/hooks/useShowcaseColors';
import { ShowcaseListGroup } from '@/views/shared/ShowcaseListGroup';
import { showcaseTheme as theme } from '@/views/shared/showcaseTheme';
import { TokenBaseTile } from '@/views/tokens/TokenBaseTile';
import { TokenCatalogListGroup } from '@/views/tokens/TokenCatalogListGroup';
import { TokenListRow } from '@/views/tokens/TokenListRow';
import { TokenSegmentScrollLayout } from '@/views/tokens/TokenSegmentScrollLayout';

export type CatalogTokensSection = {
  title: string;
  groups: TokenGroup[];
  /** Base-style full-width tiles; default semantic rows. */
  variant?: 'tiles' | 'rows';
};

type CatalogTokensViewProps = {
  categoryId: string;
  title: string;
  sections: CatalogTokensSection[];
};

function TokenGroupBlock({
  categoryId,
  colors,
  group,
  variant = 'rows',
}: {
  categoryId: string;
  colors: ShowcaseColorMap;
  group: TokenGroup;
  variant?: 'tiles' | 'rows';
}) {
  if (variant === 'tiles') {
    return (
      <ShowcaseListGroup label={group.comment} labelVariant="token">
        <View style={styles.tileStack}>
          {group.tokens.map((entry) => (
            <TokenBaseTile key={entry.name} categoryId={categoryId} entry={entry} colors={colors} />
          ))}
        </View>
      </ShowcaseListGroup>
    );
  }

  return (
    <TokenCatalogListGroup title={group.comment}>
      {group.tokens.map((entry) => (
        <TokenListRow key={entry.name} categoryId={categoryId} entry={entry} colors={colors} />
      ))}
    </TokenCatalogListGroup>
  );
}

export function CatalogTokensView({ categoryId, title, sections }: CatalogTokensViewProps) {
  const colors = useShowcaseColors();
  const [segmentIndex, setSegmentIndex] = useState(0);
  const segmentLabels = useMemo(() => sections.map((section) => section.title), [sections]);
  const section = sections[segmentIndex];

  return (
    <TokenSegmentScrollLayout
      title={title}
      segmentLabels={segmentLabels}
      segmentIndex={segmentIndex}
      onSegmentIndexChange={setSegmentIndex}
    >
      {section ? (
        <View>
          {section.groups.map((group) => (
            <TokenGroupBlock
              key={`${section.title}-${group.comment}`}
              categoryId={categoryId}
              colors={colors}
              group={group}
              variant={section.variant}
            />
          ))}
        </View>
      ) : null}
    </TokenSegmentScrollLayout>
  );
}

const styles = StyleSheet.create({
  tileStack: {
    gap: theme.spacing['spacing-3'] as number,
    padding: theme.layout.cardPaddingVertical,
    paddingHorizontal: theme.layout.cardPaddingHorizontal,
  },
});
