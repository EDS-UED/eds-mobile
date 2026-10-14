import { StyleSheet, View, type ViewStyle } from 'react-native';
import { mobileTheme } from '../../../theme/index.js';
import type { EgCommonProps } from '../../../shared/types.js';
import { EgBrandButton } from '../brand-button/EgBrandButton.js';
import type { EgBrandButtonProps } from '../brand-button/EgBrandButton.types.js';

export type EgComboActionButtonProps = EgCommonProps & {
  layout?: 'vertical' | 'horizontal';
  primary?: Omit<EgBrandButtonProps, 'testID'>;
  secondary?: Omit<EgBrandButtonProps, 'testID'>;
  style?: ViewStyle;
};

export function EgComboActionButton({
  layout = 'vertical',
  primary,
  secondary,
  testID,
  style,
}: EgComboActionButtonProps) {
  return (
    <View
      testID={testID ?? 'button-combo-action'}
      style={[layout === 'vertical' ? styles.vertical : styles.horizontal, style]}
    >
      <EgBrandButton {...primary} figmaType="primary" style={styles.fill} />
      <EgBrandButton {...secondary} figmaType="secondary" style={styles.fill} />
    </View>
  );
}

const styles = StyleSheet.create({
  vertical: {
    width: '100%',
    gap: mobileTheme.spacing['spacing-3'] as number,
  },
  horizontal: {
    flexDirection: 'row',
    gap: mobileTheme.spacing['spacing-3'] as number,
  },
  fill: {
    alignSelf: 'stretch',
  },
});
