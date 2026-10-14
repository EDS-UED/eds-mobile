import { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import type { TokenGroup } from '@/data/tokens/tokenCatalogTypes';
import { useShowcaseColors } from '@/hooks/useShowcaseColors';
import type { ShowcaseColorMap } from '@/hooks/useShowcaseColors';
import { showcaseTheme as theme } from '@/views/shared/showcaseTheme';
import { TokenBaseTile } from '@/views/tokens/TokenBaseTile';
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
  return (
    <View style={styles.group}>
      <Text style={[styles.groupTitle, { color: colors['text-base-tertiary'] as string }]}>{group.comment}</Text>
      <View style={variant === 'tiles' ? styles.baseList : styles.list}>
        {group.tokens.map((entry) =>
          variant === 'tiles' ? (
            <TokenBaseTile key={entry.name} categoryId={categoryId} entry={entry} colors={colors} />
          ) : (
            <TokenListRow key={entry.name} categoryId={categoryId} entry={entry} colors={colors} />
          ),
        )}
      </View>
    </View>
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
        <View style={styles.groupList}>
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
