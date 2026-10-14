import type { EgFieldProps } from '../../_shared/props.js';
import type { EgCommonProps } from '../../../shared/types.js';
import type { ViewStyle } from 'react-native';

export type EgComboTextInputProps = EgCommonProps & {
  leading?: EgFieldProps;
  main?: EgFieldProps;
  style?: ViewStyle;
};
