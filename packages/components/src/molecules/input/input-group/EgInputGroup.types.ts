import type { EgFieldProps } from '../../_shared/props.js';
import type { EgCommonProps } from '../../../shared/types.js';
import type { ViewStyle } from 'react-native';

export type EgInputGroupProps = EgCommonProps & {
  fields?: EgFieldProps[];
  style?: ViewStyle;
};
