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
import { createBusinessTagStyles, createTagStyles } from './tagStyles.js';
import type { TagFamily, TagColorfulStyle, TagCustomStyle } from '../../../shared/tagFamilyTypes.js';

export type EgTagBaseProps = EgCommonProps &
  EgLabelProps & {
    size?: TagSize;
    variant?: EgTagVariant;
    shape?: TagShape;
    colorType?: ColorTagType;
    systemType?: SystemTagType;
    status?: TagStatus;
    family?: TagFamily;
    colorfulStyle?: TagColorfulStyle;
    customStyle?: TagCustomStyle;
    alt?: boolean;
    rowAlign?: boolean;
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
  family,
  colorfulStyle,
  customStyle,
  alt = false,
  rowAlign = false,
  label,
  children,
  testID,
  mode = 'light',
  style,
  accessibilityLabel,
}: EgTagBaseProps) {
  const content = children ?? label ?? 'Label';
  const resolvedShape = shape ?? 'round';

  if (family === 'custom') {
    const business = createBusinessTagStyles({
      mode,
      size,
      family,
      customStyle,
      shape: resolvedShape,
      rowAlign,
    });
    const a11y = accessibilityLabel ?? (typeof content === 'string' ? content : 'Tag');
    const labelNode =
      typeof content === 'string' ? (
        <EdsSansText style={business.label}>{content}</EdsSansText>
      ) : (
        <Text style={business.label}>{content}</Text>
      );
    return (
      <View testID={testID} accessibilityLabel={a11y} style={business.outer}>
        <View style={business.bar} />
        <View style={business.content}>{labelNode}</View>
      </View>
    );
  }

  const visual = createTagStyles({
    mode,
    size,
    family,
    variant,
    shape: resolvedShape,
    colorType,
    systemType,
    status,
    colorfulStyle,
    customStyle,
    alt,
    rowAlign,
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
