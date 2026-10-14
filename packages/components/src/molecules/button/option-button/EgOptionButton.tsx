import type { EgSceneButtonProps } from '../../_shared/props.js';
import { EgButtonBase } from '../_shared/EgButtonBase.js';

export type EgOptionButtonProps = EgSceneButtonProps;

export function EgOptionButton(props: EgOptionButtonProps) {
  return (
    <EgButtonBase
      {...props}
      tone="subtle"
      figmaType={props.figmaType ?? 'primary'}
      testID={props.testID ?? 'button-option'}
    />
  );
}
