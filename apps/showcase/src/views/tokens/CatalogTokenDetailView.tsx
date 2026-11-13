import { useLocalSearchParams } from 'expo-router';
import type { ReactNode } from 'react';
import { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { ShowcaseColorMap } from '@/hooks/useShowcaseColors';

import {
  defaultTokenDetailCustomizeState,
  mergePageDirection,
  resolveTokenDetailCustomizeControls,
  type TokenDetailCustomizeState,
} from '@/data/tokens/tokenDetailCustomize';
import type { TokenEntry } from '@/data/tokens/tokenCatalogTypes';
import { motionTokenPropRows } from '@/data/tokens/motionTokenPropRows';
import { tokenDetailPropRows } from '@/data/tokens/tokenDetailPropRows';
import { resolveTokenListPrimaryLabel } from '@/data/tokens/tokenListDisplayName';
import { useShowcaseColors } from '@/hooks/useShowcaseColors';
import { CustomizePanel } from '@/views/shared/CustomizePanel';
import { PropsDocTable } from '@/views/shared/PropsDocTable';
import { TokenDetailCodeSnippet } from '@/views/shared/TokenDetailCodeSnippet';
import { showcaseTheme as theme } from '@/views/shared/showcaseTheme';
import { TokenDetailPreview } from '@/views/tokens/TokenDetailPreview';
import { TokenDetailRootView } from '@/views/tokens/TokenDetailRootView';
import { isGlassBoxPreviewClass } from '@/views/tokens/effectTokenPreviewStyle';

type CatalogTokenDetailViewProps = {
  categoryId: string;
  resolveEntry: (name: string) => TokenEntry | undefined;
  renderPreview?: (entry: TokenEntry, colors: ShowcaseColorMap) => ReactNode;
};

export function CatalogTokenDetailView({
  categoryId,
  resolveEntry,
  renderPreview,
}: CatalogTokenDetailViewProps) {
  const { tokenName } = useLocalSearchParams<{ tokenName: string }>();
  const colors = useShowcaseColors();
  const entry = tokenName ? resolveEntry(tokenName) : undefined;
  const [customize, setCustomize] = useState(defaultTokenDetailCustomizeState);

  const controls = useMemo(
    () => (entry ? resolveTokenDetailCustomizeControls(categoryId, entry) : []),
    [categoryId, entry],
  );

  if (!entry) {
    return (
      <View style={styles.missing}>
        <Text style={[styles.missingText, { color: colors['text-base-secondary'] as string }]}>
          未找到 {tokenName}
        </Text>
      </View>
    );
  }

  const title = resolveTokenListPrimaryLabel(categoryId, entry);
  const previewMinHeight =
    categoryId === 'effect' && isGlassBoxPreviewClass(entry.name) ? 220 : 160;

  return (
    <TokenDetailRootView
      title={title}
      previewMinHeight={previewMinHeight}
      preview={
        <TokenDetailPreview
          categoryId={categoryId}
          entry={entry}
          colors={colors}
          customize={customize}
          renderPreview={renderPreview}
        />
      }
      customize={
        <CustomizePanel
          controls={controls}
          state={customize}
          onChange={(next) =>
            setCustomize((prev) => ({
              ...prev,
              pressIntensity:
                (next.pressIntensity as TokenDetailCustomizeState['pressIntensity']) ??
                prev.pressIntensity,
              pressScaleDirection:
                (next.pressScaleDirection as TokenDetailCustomizeState['pressScaleDirection']) ??
                prev.pressScaleDirection,
              slidePressScale:
                typeof next.slidePressScale === 'boolean' ? next.slidePressScale : prev.slidePressScale,
              slideFollowDrag:
                typeof next.slideFollowDrag === 'boolean' ? next.slideFollowDrag : prev.slideFollowDrag,
              ...mergePageDirection(prev, next),
              pageDragDismiss:
                typeof next.pageDragDismiss === 'boolean' ? next.pageDragDismiss : prev.pageDragDismiss,
            }))
          }
        />
      }
      usageContent={<TokenDetailCodeSnippet categoryId={categoryId} entry={entry} />}
      propsContent={
        <PropsDocTable
          rows={categoryId === 'motion' ? motionTokenPropRows(entry) : tokenDetailPropRows(entry)}
        />
      }
    />
  );
}

const styles = StyleSheet.create({
  missing: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.layout.pageInset,
  },
  missingText: {
    ...theme.font.rowHint,
  },
});
