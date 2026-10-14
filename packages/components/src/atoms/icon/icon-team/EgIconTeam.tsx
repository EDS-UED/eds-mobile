import type { ViewProps } from 'react-native';
import { EgSymbol } from '../../_shared/symbol/EgSymbol.js';
import type { EgIconTeamProps } from './EgIconTeam.types.js';

/** RN icon — eds-team */
export function EgIconTeam(props: EgIconTeamProps & Pick<ViewProps, 'style'>) {
  const { testID, mode, size, fillTone, style, accessibilityLabel } = props;
  return (
    <EgSymbol
      name="eds-team"
      testID={testID ?? 'icon-eds-team'}
      mode={mode}
      size={size}
      fillTone={fillTone}
      style={style}
      accessibilityLabel={accessibilityLabel ?? "eds-team"}
    />
  );
}
