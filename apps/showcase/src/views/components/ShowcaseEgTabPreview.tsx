import { EgTab } from '@eds/mobile-components';
import { useCallback, useMemo, useRef, useState, type ElementRef } from 'react';
import { ScrollView, View } from 'react-native';

import { useShowcaseColors } from '@/hooks/useShowcaseColors';
import {
  mockTabBlockBodyFields,
  tabBlockPreviewStyles as styles,
} from '@/views/components/tabBlockPreviewMock';

type ShowcaseEgTabPreviewProps = Record<string, unknown>;

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

  const body = useMemo(() => mockTabBlockBodyFields(selectedId, colors), [colors, selectedId]);

  const onContentSwitchStart = useCallback(() => {
    scrollRef.current?.scrollTo({ y: 0, animated: false });
  }, []);

  return (
    <View style={styles.root} testID={testID}>
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