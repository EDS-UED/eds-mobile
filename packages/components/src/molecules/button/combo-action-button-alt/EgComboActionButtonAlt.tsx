import type { EgComboActionButtonProps } from '../combo-action-button/EgComboActionButton.js';
import { EgComboActionButton } from '../combo-action-button/EgComboActionButton.js';

export type EgComboActionButtonAltProps = EgComboActionButtonProps;

export function EgComboActionButtonAlt({
  layout = 'horizontal',
  ...props
}: EgComboActionButtonAltProps) {
  return <EgComboActionButton {...props} layout={layout} testID={props.testID ?? 'button-combo-action-alt'} />;
}
