import { View, type ViewProps } from 'react-native';
import type { EgIconEditorProps } from './EgIconEditor.types';

/** RN implementation — eds-editor (component) */
export function EgIconEditor(props: EgIconEditorProps & Pick<ViewProps, 'style'>) {
  const { testID, style } = props;
  return <View testID={testID ?? 'icon-eds-editor' } style={style} accessibilityLabel="eds-editor" />;
}
