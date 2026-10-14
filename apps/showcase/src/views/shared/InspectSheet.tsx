import { useEffect } from 'react';
import { BackHandler, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { useShowcaseDev } from '@/hooks/useShowcaseDev';
import { useThemedStyles } from '@/hooks/useThemedStyles';
import type { ShowcaseColorMap } from '@/hooks/useShowcaseColors';
import { showcaseTheme as theme } from '@/views/shared/showcaseTheme';

function createInspectSheetStyles(colors: ShowcaseColorMap) {
  return StyleSheet.create({
    overlay: {
      ...StyleSheet.absoluteFill,
      justifyContent: 'flex-end',
    },
    sheet: {
      maxHeight: '52%',
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      backgroundColor: colors.page as string,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: -2 },
      shadowOpacity: 0.12,
      shadowRadius: 8,
      elevation: 8,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: theme.layout.pageInset,
      paddingVertical: 12,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors['stroke-divider-page'] as string,
    },
    title: {
      fontSize: 16,
      fontWeight: '700',
      color: colors['text-base-primary'] as string,
    },
    headerActions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 16,
    },
    action: {
      fontSize: 14,
      color: colors['text-base-secondary'] as string,
    },
    content: {
      padding: theme.layout.pageInset,
      gap: 12,
    },
    hint: {
      fontSize: 14,
      lineHeight: 20,
      color: colors['text-base-secondary'] as string,
    },
    nodeLabel: {
      fontSize: 15,
      fontWeight: '600',
      color: colors['text-base-primary'] as string,
    },
    section: {
      gap: 4,
    },
    sectionTitle: {
      fontSize: 12,
      fontWeight: '700',
      letterSpacing: 0.2,
      color: colors['text-base-secondary'] as string,
      textTransform: 'uppercase',
    },
    line: {
      fontSize: 13,
      lineHeight: 18,
      fontFamily: 'Menlo',
      color: colors['text-base-primary'] as string,
    },
  });
}

function Section({
  title,
  lines,
  styles,
}: {
  title: string;
  lines: string[];
  styles: ReturnType<typeof createInspectSheetStyles>;
}) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {lines.length > 0 ? (
        lines.map((line) => (
          <Text key={line} style={styles.line}>
            {line}
          </Text>
        ))
      ) : (
        <Text style={styles.line}>—</Text>
      )}
    </View>
  );
}

export function InspectSheet() {
  const { mode, setMode, pinned, clearPinned } = useShowcaseDev();
  const styles = useThemedStyles(createInspectSheetStyles);
  const visible = mode === 'inspect';

  useEffect(() => {
    if (!visible) {
      return;
    }

    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      setMode('preview');
      clearPinned();
      return true;
    });

    return () => subscription.remove();
  }, [clearPinned, setMode, visible]);

  if (!visible) {
    return null;
  }

  const exitInspect = () => {
    setMode('preview');
    clearPinned();
  };

  return (
    <View style={styles.overlay} pointerEvents="box-none">
      <View style={styles.sheet} pointerEvents="auto">
        <View style={styles.header}>
          <Text style={styles.title}>Inspect</Text>
          <View style={styles.headerActions}>
            {pinned ? (
              <Pressable accessibilityRole="button" onPress={clearPinned} hitSlop={8}>
                <Text style={styles.action}>清除</Text>
              </Pressable>
            ) : null}
            <Pressable accessibilityRole="button" onPress={exitInspect} hitSlop={8}>
              <Text style={styles.action}>完成</Text>
            </Pressable>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          {!pinned ? (
            <Text style={styles.hint}>点选 preview 区域中的节点查看 Layout / Styles / Motion。</Text>
          ) : (
            <>
              <Text style={styles.nodeLabel}>{pinned.label}</Text>
              <Section title="Layout" lines={pinned.layoutLines} styles={styles} />
              <Section title="Styles" lines={pinned.styleLines} styles={styles} />
              <Section title="Motion" lines={pinned.motionLines ?? []} styles={styles} />
            </>
          )}
        </ScrollView>
      </View>
    </View>
  );
}
