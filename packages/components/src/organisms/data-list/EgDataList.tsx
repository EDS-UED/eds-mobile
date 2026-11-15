import { View } from 'react-native';

import {
  EG_DATA_LIST_ROW_GAP,
  EG_DATA_LIST_SCENE_CONTENT_INSET,
  egDataListSectionStyle,
} from './egDataListMetrics.js';
import type { EgDataListProps } from './EgDataList.types.js';

/** 数据列表区 · DL-bleed · 行间距 {@link EG_DATA_LIST_ROW_GAP}；行见 `EgDataListRow`。 */
export function EgDataList({
  children,
  testID,
  accessibilityLabel = 'Data list',
  sceneContentInset = EG_DATA_LIST_SCENE_CONTENT_INSET,
  rowGap = EG_DATA_LIST_ROW_GAP,
  style,
}: EgDataListProps) {
  return (
    <View
      testID={testID ?? 'data-list'}
      accessibilityLabel={accessibilityLabel}
      style={[egDataListSectionStyle(sceneContentInset, rowGap), style]}
    >
      {children}
    </View>
  );
}