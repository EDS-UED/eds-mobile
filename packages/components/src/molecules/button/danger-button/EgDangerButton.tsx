import type { EgSceneButtonProps } from '../../_shared/props.js';
import { EgButtonBase } from '../_shared/EgButtonBase.js';

export type EgDangerButtonProps = EgSceneButtonProps;

export function EgDangerButton(props: EgDangerButtonProps) {
  return <EgButtonBase {...props} tone="danger" testID={props.testID ?? 'button-danger'} />;
}
