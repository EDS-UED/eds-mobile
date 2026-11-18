import type { EgSceneButtonProps } from '../../_shared/props.js';

export type EgButtonTone = 'brand' | 'decor' | 'danger' | 'option';

export type EgButtonProps = EgSceneButtonProps & {
  tone?: EgButtonTone;
};