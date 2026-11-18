import { Platform, StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { EdsSansText } from '../../../shared/EdsSansText.js';
import {
  isAndroidSmoothCornerAvailable,
  SmoothCornerView,
} from '../../../shared/smoothCorner/SmoothCornerView.js';
import type {
  ColorTagType,
  EgCommonProps,
  EgLabelProps,
  EgTagVariant,
  SystemTagType,
  TagShape,
  TagSize,
} from '../../../shared/types.js';
import type { TagStatus } from '../../../shared/tagPalette.js';
import type { ThemeMode } from '../../../theme/index.js';
import { createTagStyles } from './tagStyles.js';

export type EgTagBaseProps = EgCommonProps &
  EgLabelProps & {
    size?: TagSize;
    variant?: EgTagVariant;
    shape?: TagShape;
    colorType?: ColorTagType;
    systemType?: SystemTagType;
    status?: TagStatus;
    alt?: boolean;
    style?: ViewStyle;
    mode?: ThemeMode;
  };

export function EgTagBase({
  size = 'md',
  variant,
  shape,
  colorType,
  systemType,
  status,
  alt = false,
  label,
  children,
  testID,
  mode = 'light',
  style,
  accessibilityLabel,
}: EgTagBaseProps) {
  const content = children ?? label ?? 'Label';
  const resolvedShape = shape ?? 'round';
  const visual = createTagStyles({
    mode,
    size,
    variant,
    shape: resolvedShape,
    colorType,
    systemType,
    status,
    alt,
  });

  const a11y = accessibilityLabel ?? (typeof content === 'string' ? content : 'Tag');
  const labelNode =
    typeof content === 'string' ? (
      <EdsSansText style={visual.label}>{content}</EdsSansText>
    ) : (
      <Text style={visual.label}>{content}</Text>
    );

  if (resolvedShape === 'square') {
    const radius = visual.container.borderRadius as number;
    const borderWidth = (visual.container.borderWidth as number) ?? 0;
    const borderColor = visual.container.borderColor;
    const useNativeStroke = isAndroidSmoothCornerAvailable() && borderWidth > 0;
    const shellStyle = StyleSheet.flatten([
      visual.container,
      useNativeStroke ? { borderWidth: 0, borderColor: 'transparent' } : null,
      Platform.OS === 'android' ? { overflow: 'hidden' as const } : null,
      style,
    ]) as ViewStyle;

    return (
      <SmoothCornerView
        testID={testID}
        accessibilityLabel={a11y}
        radius={radius}
        strokeWidth={useNativeStroke ? borderWidth : undefined}
        strokeColor={useNativeStroke && borderColor ? String(borderColor) : undefined}
        style={shellStyle}
      >
        {labelNode}
      </SmoothCornerView>
    );
  }

  return (
    <View testID={testID} accessibilityLabel={a11y} style={[visual.container, style]}>
      {labelNode}
    </View>
  );
}
