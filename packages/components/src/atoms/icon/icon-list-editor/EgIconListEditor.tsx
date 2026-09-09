import { View, type ViewProps } from 'react-native';
import type { EgIconListEditorProps } from './EgIconListEditor.types';

/** RN implementation — eds-list-editor (component) */
export function EgIconListEditor(props: EgIconListEditorProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'icon-eds-list-editor' } style={style} accessibilityLabel="eds-list-editor" />;
}
