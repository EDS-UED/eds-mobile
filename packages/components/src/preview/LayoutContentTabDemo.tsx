import { EgTab } from '../molecules/tab/tab/EgTab.js';
import { edsFontStyle } from '../shared/fontFamily.js';
import { getThemeColors, mobileTheme, type ThemeMode } from '../theme/index.js';
import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

const TAB_ITEMS = [
  { id: 'a', label: 'Tab A' },
  { id: 'b', label: 'Tab B' },
  { id: 'c', label: 'Tab C' },
] as const;

/**
 * motion-layout-content · EdsSemanticAnima('layout-content')
 * 同壳 Tab 换正文 · 120ms swap · opacity 180ms / translateY 350ms。
 */
export function LayoutContentTabDemo({ mode }: { mode: ThemeMode }) {
  const colors = getThemeColors(mode);
  const [selectedId, setSelectedId] = useState<string>('a');

  const lines = useMemo(() => {
    const prefix =
      selectedId === 'a' ? '订单信息' : selectedId === 'b' ? '回调记录' : '操作日志';
    return [
      `${prefix} · 字段 1`,
      `${prefix} · 字段 2`,
      `${prefix} · 字段 3`,
    ];
  }, [selectedId]);

  return (
    <View style={styles.root}>
      <EgTab
        items={[...TAB_ITEMS]}
        selectedId={selectedId}
        onSelect={(id) => setSelectedId(id)}
        mode={mode}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {lines.map((line) => (
            <Text
              key={line}
              style={[styles.line, { color: colors['text-base-primary'] as string }]}
            >
              {line}
            </Text>
          ))}
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
  scrollContent: {
    gap: spacing['spacing-3'] as number,
  },
  line: {
    ...edsFontStyle('500'),
    fontSize: 15,
  },
});
