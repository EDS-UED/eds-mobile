import type { EgSceneButtonProps } from '../../_shared/props.js';
import { EgButtonBase } from '../_shared/EgButtonBase.js';

export type EgBrandButtonProps = EgSceneButtonProps;

export function EgBrandButton(props: EgBrandButtonProps) {
  return <EgButtonBase {...props} tone="brand" testID={props.testID ?? 'button-brand'} />;
}
