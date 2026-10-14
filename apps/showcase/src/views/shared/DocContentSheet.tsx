import type { PropsWithChildren } from 'react';
import { useEffect } from 'react';
import {
  BackHandler,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useThemedStyles } from '@/hooks/useThemedStyles';
import type { ShowcaseColorMap } from '@/hooks/useShowcaseColors';
import { showcaseTheme as theme } from '@/views/shared/showcaseTheme';

type DocContentSheetProps = PropsWithChildren<{
  visible: boolean;
  title: string;
  onClose: () => void;
}>;

function createDocContentSheetStyles(colors: ShowcaseColorMap) {
  const topRadius = theme.smoothRadius.xl;
  return StyleSheet.create({
    overlay: {
      ...StyleSheet.absoluteFill,
      zIndex: 200,
      justifyContent: 'flex-end',
    },
    backdrop: {
      ...StyleSheet.absoluteFill,
      backgroundColor: colors['effect-overlay-deep'] as string,
    },
    sheet: {
      maxHeight: '78%',
      backgroundColor: colors.page as string,
      borderTopLeftRadius: topRadius.borderRadius,
      borderTopRightRadius: topRadius.borderRadius,
      borderCurve: topRadius.borderCurve,
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
    close: {
      fontSize: 14,
      color: colors['text-base-secondary'] as string,
    },
    content: {
      padding: theme.layout.pageInset,
      paddingBottom: theme.layout.scrollBottom,
    },
  });
}

/** 组件详情 — Usage / Props 等内容浮层。 */
export function DocContentSheet({ visible, title, onClose, children }: DocContentSheetProps) {
  const styles = useThemedStyles(createDocContentSheetStyles);

  useEffect(() => {
    if (!visible) {
      return;
    }

    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      onClose();
      return true;
    });

    return () => subscription.remove();
  }, [onClose, visible]);

  if (!visible) {
    return null;
  }

  return (
    <View style={styles.overlay} pointerEvents="box-none">
      <Pressable
        style={styles.backdrop}
        accessibilityRole="button"
        accessibilityLabel="关闭"
        onPress={onClose}
      />
      <View style={styles.sheet} pointerEvents="auto">
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          <Pressable accessibilityRole="button" onPress={onClose} hitSlop={8}>
            <Text style={styles.close}>完成</Text>
          </Pressable>
        </View>
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.content}>
          {children}
        </ScrollView>
      </View>
    </View>
  );
}
