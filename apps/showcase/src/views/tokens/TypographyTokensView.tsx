import { useMemo, useState } from 'react';
import { View } from 'react-native';

import {
  getTypographyFamilyGroups,
  getTypographyPrimitiveBaseGroups,
  getTypographyTextStyleGroups,
} from '@/data/tokens/typographyTokenCatalog';
import type { TokenGroup } from '@/data/tokens/tokenCatalogTypes';
import { useShowcaseColors } from '@/hooks/useShowcaseColors';
import { TokenCatalogListGroup } from '@/views/tokens/TokenCatalogListGroup';
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
      <View>
        {groups.map((group) => (
          <TokenCatalogListGroup
            key={group.comment}
            title={segmentIndex === 0 ? undefined : group.comment}
          >
            {group.tokens.map((entry) =>
              mode === 'textStyle' ? (
                <TypographyTextStyleRow key={entry.name} className={entry.name} colors={colors} />
              ) : (
                <TokenListRow key={entry.name} categoryId="typography" entry={entry} colors={colors} />
              ),
            )}
          </TokenCatalogListGroup>
        ))}
      </View>
    </TokenSegmentScrollLayout>
  );
}
