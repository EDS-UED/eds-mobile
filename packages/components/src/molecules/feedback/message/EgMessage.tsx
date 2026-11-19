import { StyleSheet, Text, View, type ViewProps, type ViewStyle } from 'react-native';

import { EdsSansText } from '../../../shared/EdsSansText.js';
import { messageTypography } from '../../../shared/typographyStyles.js';
import { getThemeColors, mobileTheme } from '../../../theme/index.js';
import { resolveEgMessageAppearance } from './resolveEgMessageAppearance.js';
import type { EgMessageProps } from './EgMessage.types.js';

/** Figma Message — 胶囊计数 / 短文案 */
const MESSAGE_MIN_WIDTH_PX = 18;

const padVertical = mobileTheme.spacing['spacing-025'] as number;
const padHorizontal = mobileTheme.spacing['spacing-1-5'] as number;
const radiusFull = mobileTheme.spacing['radius-full'] as number;
const textPreset = messageTypography();

export function EgMessage(props: EgMessageProps & Pick<ViewProps, 'style'>) {
  const {
    tone = 'brand',
    label,
    children,
    mode = 'light',
    testID,
    style,
    accessibilityLabel,
  } = props;

  const content = children ?? label ?? '9';
  const colors = getThemeColors(mode);
  const appearance = resolveEgMessageAppearance(colors, tone);
  const a11y = accessibilityLabel ?? (typeof content === 'string' ? content : 'Message');

  const shellStyle: ViewStyle = {
    minWidth: MESSAGE_MIN_WIDTH_PX,
    paddingVertical: padVertical,
    paddingHorizontal: padHorizontal,
    borderRadius: radiusFull,
    backgroundColor: appearance.backgroundColor,
  };

  const labelStyle = { ...textPreset, color: appearance.textColor, textAlign: 'center' as const };

  return (
    <View
      testID={testID ?? 'feedback-message'}
      accessibilityLabel={a11y}
      style={[styles.shell, shellStyle, style]}
    >
      {typeof content === 'string' ? (
        <EdsSansText numberOfLines={1} style={labelStyle}>
          {content}
        </EdsSansText>
      ) : (
        <Text numberOfLines={1} style={labelStyle}>
          {content}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
});