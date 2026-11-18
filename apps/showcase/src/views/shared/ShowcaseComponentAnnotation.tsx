import { StyleSheet, View } from 'react-native';

import { ShowcaseSansText } from '@/components/ShowcaseSansText';
import type { ShowcaseComponentAnnotationDoc } from '@/data/components/componentAnnotationTypes';
import { flattenAnnotationLines } from '@/data/components/flattenAnnotationLines';
import { useShowcaseColors } from '@/hooks/useShowcaseColors';

import { showcaseDocPageSectionsContainerStyle } from './showcaseDocSectionLayout';
import { showcaseTheme as theme } from './showcaseTheme';

const BULLET = '·';

type ShowcaseComponentAnnotationProps = {
  doc: ShowcaseComponentAnnotationDoc;
};

/** 详情「注释」— 小标题 17/600；条目项目符 + 15/400/60%，一行一条。 */
export function ShowcaseComponentAnnotation({ doc }: ShowcaseComponentAnnotationProps) {
  const colors = useShowcaseColors();
  const primary = colors['text-base-primary'] as string;
  const secondary = colors['text-base-secondary'] as string;

  return (
    <View style={styles.root}>
      {doc.sections.map((section) => {
        const bullets = flattenAnnotationLines(section.lines);
        if (bullets.length === 0) {
          return null;
        }
        return (
          <View key={section.title} style={styles.section}>
            <ShowcaseSansText
              weight="600"
              style={[styles.sectionTitle, { color: primary }]}
            >
              {section.title}
            </ShowcaseSansText>
            <View style={styles.list}>
              {bullets.map((line, lineIndex) => (
                <View key={`${section.title}-${lineIndex}`} style={styles.bulletRow}>
                  <ShowcaseSansText
                    weight="400"
                    style={[styles.bullet, { color: secondary }]}
                  >
                    {BULLET}
                  </ShowcaseSansText>
                  <ShowcaseSansText
                    weight="400"
                    style={[styles.line, { color: secondary }]}
                  >
                    {line}
                  </ShowcaseSansText>
                </View>
              ))}
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  root: showcaseDocPageSectionsContainerStyle,
  section: {
    gap: theme.layout.docSectionTitleCardGap,
  },
  sectionTitle: {
    ...theme.font.annotationSectionTitle,
  },
  list: {
    gap: theme.spacing['spacing-2'] as number,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing['spacing-2'] as number,
  },
  bullet: {
    ...theme.font.annotationBody,
    lineHeight: (theme.font.annotationBody.lineHeight as number) ?? 20,
    width: theme.spacing['spacing-3'] as number,
    textAlign: 'center',
  },
  line: {
    flex: 1,
    ...theme.font.annotationBody,
  },
});