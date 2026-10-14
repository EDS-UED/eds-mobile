import { ActivityIndicator, type ActivityIndicatorProps } from 'react-native';

export type EgSpinnerProps = Pick<ActivityIndicatorProps, 'color' | 'size' | 'testID'>;

export function EgSpinner({ color, size = 'small', testID }: EgSpinnerProps) {
  return <ActivityIndicator testID={testID} color={color} size={size} />;
}
