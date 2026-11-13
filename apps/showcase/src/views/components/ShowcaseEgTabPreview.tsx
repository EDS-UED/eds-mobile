import { EgTab } from '@eds/mobile-components';
import mobileTheme from '@eds/mobile-tokens/theme';
import { useCallback, useMemo, useRef, useState, type ElementRef } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { useShowcaseColors } from '@/hooks/useShowcaseColors';
import type { ShowcaseColorMap } from '@/hooks/useShowcaseColors';
import { edsTokenFont } from '@/views/shared/resolveEdsTheme';

type ShowcaseEgTabPreviewProps = Record<string, unknown>;

function mockFieldsForTab(tabId: string, colors: ShowcaseColorMap) {
  const lines = [
    `订单号 · ORD-${tabId}92841`,
    '状态 · 已完成',
    '金额 · ¥ 1,280.00',
    '创建时间 · 2026-03-12 14:20',
  ];
  return lines.map((line) => (
    <View key={line} style={styles.fieldRow}>
      <Text style={[styles.fieldText, { color: colors['text-base-primary'] as string }]}>{line}</Text>
    </View>
  ));
}

/** EgTab 详情预览 · Tab 条 + layout-content 正文 crossfade。 */
export function ShowcaseEgTabPreview(props: ShowcaseEgTabPreviewProps) {
  const colors = useShowcaseColors();
  const items =
    (props.items as { id: string; label: string }[] | undefined) ??
    [
      { id: '1', label: 'Label' },
      { id: '2', label: 'Label' },
      { id: '3', label: 'Label' },
    ];
  const defaultSelectedId = (props.defaultSelectedId as string | undefined) ?? '1';
  const mode = props.mode === 'dark' ? 'dark' : 'light';
  const testID = props.testID as string | undefined;

  const [selectedId, setSelectedId] = useState(defaultSelectedId);
  const scrollRef = useRef<ElementRef<typeof ScrollView>>(null);

  const body = useMemo(() => mockFieldsForTab(selectedId, colors), [colors, selectedId]);

  const onContentSwitchStart = useCallback(() => {
    scrollRef.current?.scrollTo({ y: 0, animated: false });
  }, []);

  return (
    <View style={styles.root} testID={testID}>
      <Text style={[styles.eyebrow, { color: colors['text-base-secondary'] as string }]}>订单详情</Text>
      <EgTab
        items={items}
        selectedId={selectedId}
        onSelect={(id) => setSelectedId(id)}
        mode={mode}
        onContentSwitchStart={onContentSwitchStart}
      >
        <ScrollView ref={scrollRef} style={styles.scroll} contentContainerStyle={styles.scrollContent}>
          {body}
        </ScrollView>
      </EgTab>
    </View>
  );
}

const spacing = mobileTheme.spacing;

const styles = StyleSheet.create({
  root: {
    alignSelf: 'stretch',
    width: '100%',
  },
  eyebrow: {
    ...edsTokenFont('body-medium', '600'),
    marginBottom: spacing['spacing-2'] as number,
  },
  scroll: {
    maxHeight: 200,
  },
  scrollContent: {
    paddingBottom: spacing['spacing-4'] as number,
    gap: spacing['spacing-3'] as number,
  },
  fieldRow: {
    paddingVertical: spacing['spacing-2'] as number,
  },
  fieldText: {
    ...edsTokenFont('body-medium', '400'),
  },
});
