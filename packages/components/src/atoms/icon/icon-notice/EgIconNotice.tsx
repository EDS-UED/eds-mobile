import type { ViewProps } from 'react-native';
import { EgSymbol } from '../../_shared/symbol/EgSymbol.js';
import type { EgIconNoticeProps } from './EgIconNotice.types.js';

/** RN icon — eds-notice */
export function EgIconNotice(props: EgIconNoticeProps & Pick<ViewProps, 'style'>) {
  const { testID, mode, size, fillTone, style, accessibilityLabel } = props;
  return (
    <EgSymbol
      name="eds-notice"
      testID={testID ?? 'icon-eds-notice'}
      mode={mode}
      size={size}
      fillTone={fillTone}
      style={style}
      accessibilityLabel={accessibilityLabel ?? "eds-notice"}
    />
  );
}
