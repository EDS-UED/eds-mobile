import type { ViewProps } from 'react-native';
import { EgSymbol } from '../../_shared/symbol/EgSymbol.js';
import type { EgIconTeamFillProps } from './EgIconTeamFill.types.js';

/** RN icon — eds-team-fill */
export function EgIconTeamFill(props: EgIconTeamFillProps & Pick<ViewProps, 'style'>) {
  const { testID, mode, size, fillTone, style, accessibilityLabel } = props;
  return (
    <EgSymbol
      name="eds-team-fill"
      testID={testID ?? 'icon-eds-team-fill'}
      mode={mode}
      size={size}
      fillTone={fillTone}
      style={style}
      accessibilityLabel={accessibilityLabel ?? "eds-team-fill"}
    />
  );
}
