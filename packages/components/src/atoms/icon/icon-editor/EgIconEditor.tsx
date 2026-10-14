import type { ViewProps } from 'react-native';
import { EgSymbol } from '../../_shared/symbol/EgSymbol.js';
import type { EgIconEditorProps } from './EgIconEditor.types.js';

/** RN icon — eds-editor */
export function EgIconEditor(props: EgIconEditorProps & Pick<ViewProps, 'style'>) {
  const { testID, mode, size, fillTone, style, accessibilityLabel } = props;
  return (
    <EgSymbol
      name="eds-editor"
      testID={testID ?? 'icon-eds-editor'}
      mode={mode}
      size={size}
      fillTone={fillTone}
      style={style}
      accessibilityLabel={accessibilityLabel ?? "eds-editor"}
    />
  );
}
