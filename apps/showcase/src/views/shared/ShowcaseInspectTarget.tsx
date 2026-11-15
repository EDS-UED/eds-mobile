import type { PropsWithChildren } from 'react';
import { useMemo, useRef } from 'react';
import {
  LayoutChangeEvent,
  Pressable,
  StyleSheet,
  View,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useShowcaseDev } from '@/hooks/useShowcaseDev';
import { useShowcaseColors } from '@/hooks/useShowcaseColors';
import type { ShowcaseInspectSelection } from '@/hooks/showcaseDevTypes';

type ShowcaseInspectTargetProps = PropsWithChildren<
  PressableProps & {
    inspect: Omit<ShowcaseInspectSelection, 'layoutLines'> & {
      layoutLines?: string[];
    };
    onMeasuredLayout?: (lines: string[]) => void;
  }
>;

export function ShowcaseInspectTarget({
  inspect,
  children,
  onPress,
  onMeasuredLayout,
  style,
  ...rest
}: ShowcaseInspectTargetProps) {
  const { mode, pinSelection } = useShowcaseDev();
  const inspectEnabled = mode === 'inspect';
  const colors = useShowcaseColors();
  const measuredLayoutRef = useRef<string[]>([]);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        inspectable: {
          borderWidth: 1,
          borderColor: colors['stroke-color-brand'] as string,
          borderRadius: 8,
        },
      }),
    [colors],
  );

  const handleLayout = (event: LayoutChangeEvent) => {
    const { x, y, width, height } = event.nativeEvent.layout;
    const lines = [
      `width: ${width.toFixed(1)}`,
      `height: ${height.toFixed(1)}`,
      `x: ${x.toFixed(1)}`,
      `y: ${y.toFixed(1)}`,
    ];
    measuredLayoutRef.current = lines;
    onMeasuredLayout?.(lines);
  };

  const handlePress: PressableProps['onPress'] = (event) => {
    if (inspectEnabled) {
      pinSelection({
        label: inspect.label,
        layoutLines:
          measuredLayoutRef.current.length > 0
            ? measuredLayoutRef.current
            : (inspect.layoutLines ?? ['layout: pending onLayout']),
        styleLines: inspect.styleLines,
        motionLines: inspect.motionLines,
      });
      return;
    }
    onPress?.(event);
  };

  const flattenedStyle: StyleProp<ViewStyle> = [
    typeof style === 'function' ? undefined : style,
    inspectEnabled ? styles.inspectable : null,
  ];

  /** 非 Inspect 且无业务 onPress — 勿包 Pressable，避免挡住预览内嵌 ScrollView。 */
  if (!inspectEnabled && onPress == null) {
    return (
      <View {...rest} onLayout={handleLayout} style={flattenedStyle}>
        {children}
      </View>
    );
  }

  return (
    <Pressable {...rest} onPress={handlePress} onLayout={handleLayout} style={flattenedStyle}>
      {children}
    </Pressable>
  );
}
