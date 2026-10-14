import type { ViewProps } from 'react-native';
import { EgSymbol } from '../../_shared/symbol/EgSymbol.js';
import type { EgIconListEditorProps } from './EgIconListEditor.types.js';

/** RN icon — eds-list-editor */
export function EgIconListEditor(props: EgIconListEditorProps & Pick<ViewProps, 'style'>) {
  const { testID, mode, size, fillTone, style, accessibilityLabel } = props;
  return (
    <EgSymbol
      name="eds-list-editor"
      testID={testID ?? 'icon-eds-list-editor'}
      mode={mode}
      size={size}
      fillTone={fillTone}
      style={style}
      accessibilityLabel={accessibilityLabel ?? "eds-list-editor"}
    />
  );
}
