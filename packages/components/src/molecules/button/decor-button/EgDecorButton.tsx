import type { EgSceneButtonProps } from '../../_shared/props.js';
import { EgButtonBase } from '../_shared/EgButtonBase.js';

export type EgDecorButtonProps = EgSceneButtonProps;

export function EgDecorButton(props: EgDecorButtonProps) {
  return <EgButtonBase {...props} tone="decor" testID={props.testID ?? 'button-decor'} />;
}
