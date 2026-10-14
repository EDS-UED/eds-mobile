import { Text, View, type ViewStyle } from 'react-native';
import type { ColorTagType, EgCommonProps, EgLabelProps, SystemTagType, TagSize } from '../../../shared/types.js';
import type { TagStatus } from '../../../shared/tagPalette.js';
import type { ThemeMode } from '../../../theme/index.js';
import { createTagStyles } from './tagStyles.js';

export type EgTagBaseProps = EgCommonProps &
  EgLabelProps & {
    size?: TagSize;
    colorType?: ColorTagType;
    systemType?: SystemTagType;
    status?: TagStatus;
    alt?: boolean;
    style?: ViewStyle;
    mode?: ThemeMode;
  };

export function EgTagBase({
  size = 'md',
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
  const visual = createTagStyles({
    mode,
    size,
    colorType,
    systemType,
    status,
    alt,
  });

  return (
    <View
      testID={testID}
      accessibilityLabel={accessibilityLabel ?? (typeof content === 'string' ? content : 'Tag')}
      style={[visual.container, style]}
    >
      <Text style={visual.label}>{content}</Text>
    </View>
  );
}
