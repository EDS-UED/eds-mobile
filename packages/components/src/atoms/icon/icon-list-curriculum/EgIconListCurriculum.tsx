import type { ViewProps } from 'react-native';
import { EgSymbol } from '../../_shared/symbol/EgSymbol.js';
import type { EgIconListCurriculumProps } from './EgIconListCurriculum.types.js';

/** RN icon — eds-list-curriculum */
export function EgIconListCurriculum(props: EgIconListCurriculumProps & Pick<ViewProps, 'style'>) {
  const { testID, mode, size, fillTone, style, accessibilityLabel } = props;
  return (
    <EgSymbol
      name="eds-list-curriculum"
      testID={testID ?? 'icon-eds-list-curriculum'}
      mode={mode}
      size={size}
      fillTone={fillTone}
      style={style}
      accessibilityLabel={accessibilityLabel ?? "eds-list-curriculum"}
    />
  );
}
