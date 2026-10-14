import type { EgFieldProps } from '../../_shared/props.js';
import type { EgCommonProps } from '../../../shared/types.js';
import type { ViewStyle } from 'react-native';

export type EgComboTextareaInputProps = EgCommonProps & {
  header?: EgFieldProps;
  body?: EgFieldProps;
  style?: ViewStyle;
};
