import type { EgSceneButtonProps } from '../../_shared/props.js';
import { EgBrandButton } from '../brand-button/EgBrandButton.js';
import { EgDangerButton } from '../danger-button/EgDangerButton.js';
import { EgDecorButton } from '../decor-button/EgDecorButton.js';
import { EgOptionButton } from '../option-button/EgOptionButton.js';
import type { EgButtonProps } from './EgButton.types.js';

export function EgButton({ tone = 'brand', testID, ...props }: EgButtonProps) {
  const common: EgSceneButtonProps = {
    ...props,
    testID: testID ?? 'button-brand',
  };

  switch (tone) {
    case 'decor':
      return <EgDecorButton {...common} testID={testID ?? 'button-decor'} />;
    case 'danger':
      return <EgDangerButton {...common} testID={testID ?? 'button-danger'} />;
    case 'option':
      return <EgOptionButton {...common} testID={testID ?? 'button-option'} />;
    case 'brand':
    default:
      return <EgBrandButton {...common} />;
  }
}