import { StyleSheet, Text, View } from 'react-native';

import type { DocPropRow } from '@/data/components';
import { ShowcaseSansText } from '@/components/ShowcaseSansText';
import { useShowcaseColors } from '@/hooks/useShowcaseColors';

import { showcaseDocSectionLayout } from '@/views/shared/showcaseDocSectionLayout';
import { showcaseTheme as theme } from './showcaseTheme';

type PropsDocCardListProps = {
  rows: DocPropRow[];
};

/** PROPS / API — 置于 {@link DocSection} 单卡内（`cardPadding="none"`）。 */
export function PropsDocCardList({ rows }: PropsDocCardListProps) {
  const colors = useShowcaseColors();

  if (rows.length === 0) {
    return (
      <Text
        style={[
          styles.empty,
          showcaseDocSectionLayout.insetRow,
          { color: colors['text-base-tertiary'] as string },
        ]}
      >
        无参数说明
      </Text>
    );
  }

  return (
    <View style={showcaseDocSectionLayout.insetStack}>
      {rows.map((row, index) => {
        const hintParts = [
          row.type ? `type: ${row.type}` : null,
          row.defaultValue ? `default: ${row.defaultValue}` : null,
          row.description || null,
        ].filter(Boolean);

        return (
          <View
            key={row.name}
            style={[
              showcaseDocSectionLayout.insetRow,
              index < rows.length - 1
                ? [
                    showcaseDocSectionLayout.insetDivider,
                    { borderBottomColor: colors['stroke-divider-shallow'] },
                  ]
                : null,
            ]}
          >
            <View style={showcaseDocSectionLayout.insetRowCopy}>
              <ShowcaseSansText
                weight="600"
                style={[styles.name, { color: colors['text-base-primary'] as string }]}
              >
                {row.name}
              </ShowcaseSansText>
              {hintParts.length > 0 ? (
                <ShowcaseSansText
                  weight="400"
                  style={[styles.hint, { color: colors['text-base-secondary'] as string }]}
                >
                  {hintParts.join(' · ')}
                </ShowcaseSansText>
              ) : null}
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  name: {
    fontSize: 14,
    fontFamily: 'Menlo',
  },
  hint: {
    fontSize: 12,
    lineHeight: 18,
  },
  empty: {
    ...theme.font.rowHint,
  },
});