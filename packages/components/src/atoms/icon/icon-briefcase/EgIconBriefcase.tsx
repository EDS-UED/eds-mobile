import type { ViewProps } from 'react-native';
import { EgSymbol } from '../../_shared/symbol/EgSymbol.js';
import type { EgIconBriefcaseProps } from './EgIconBriefcase.types.js';

/** RN icon — eds-briefcase */
export function EgIconBriefcase(props: EgIconBriefcaseProps & Pick<ViewProps, 'style'>) {
  const { testID, mode, size, fillTone, style, accessibilityLabel } = props;
  return (
    <EgSymbol
      name="eds-briefcase"
      testID={testID ?? 'icon-eds-briefcase'}
      mode={mode}
      size={size}
      fillTone={fillTone}
      style={style}
      accessibilityLabel={accessibilityLabel ?? "eds-briefcase"}
    />
  );
}
