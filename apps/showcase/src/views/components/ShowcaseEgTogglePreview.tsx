import { EgToggle } from '@eds/mobile-components';
import { useCallback, useMemo, useRef, useState, type ElementRef } from 'react';
import { ScrollView, View } from 'react-native';

import { useShowcaseColors } from '@/hooks/useShowcaseColors';
import {
  mockTabBlockBodyFields,
  tabBlockPreviewStyles as styles,
} from '@/views/components/tabBlockPreviewMock';

type ShowcaseEgTogglePreviewProps = Record<string, unknown>;

/** EgToggle 详情预览 · 胶囊条 + layout-content 正文（与 EgTab 同套测试数据）。 */
export function ShowcaseEgTogglePreview(props: ShowcaseEgTogglePreviewProps) {
  const colors = useShowcaseColors();
  const items =
    (props.items as { id: string; label: string; count?: number }[] | undefined) ?? [
      { id: '1', label: 'Label' },
      { id: '2', label: 'Label', count: 12 },
      { id: '3', label: 'Label' },
    ];
  const initialId = (props.selectedId as string | undefined) ?? items[0]?.id ?? '1';
  const mode = props.mode === 'dark' ? 'dark' : 'light';
  const testID = props.testID as string | undefined;

  const [selectedId, setSelectedId] = useState(initialId);
  const scrollRef = useRef<ElementRef<typeof ScrollView>>(null);

  const body = useMemo(() => mockTabBlockBodyFields(selectedId, colors), [colors, selectedId]);

  const onContentSwitchStart = useCallback(() => {
    scrollRef.current?.scrollTo({ y: 0, animated: false });
  }, []);

  return (
    <View style={styles.root} testID={testID}>
      <EgToggle
        items={items}
        selectedId={selectedId}
        onSelect={(id) => setSelectedId(id)}
        mode={mode}
        onContentSwitchStart={onContentSwitchStart}
      >
        <ScrollView ref={scrollRef} style={styles.scroll} contentContainerStyle={styles.scrollContent}>
          {body}
        </ScrollView>
      </EgToggle>
    </View>
  );
}