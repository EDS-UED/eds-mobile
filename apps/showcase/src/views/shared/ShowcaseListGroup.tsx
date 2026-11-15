import { Text, View, type ViewStyle } from 'react-native';

import { useShowcaseColors } from '@/hooks/useShowcaseColors';

import {
  showcaseDocSectionCardStyle,
  showcaseDocSectionLayout,
  showcaseDocSectionTitleStyle,
} from './showcaseDocSectionLayout';

type ShowcaseListGroupProps = {
  label?: string;
  children: React.ReactNode;
  style?: ViewStyle;
  /** @deprecated 与 `DocSection` 标题已统一，传参忽略。 */
  labelVariant?: 'section' | 'token';
};

/** 列表页 — 标题 + 单卡（与 `DocSection` 同构，见 `showcaseDocSectionLayout`）。 */
export function ShowcaseListGroup({ label, children, style }: ShowcaseListGroupProps) {
  const colors = useShowcaseColors();

  return (
    <View style={[showcaseDocSectionLayout.block, style]}>
      {label ? <Text style={showcaseDocSectionTitleStyle(colors)}>{label}</Text> : null}
      <View style={showcaseDocSectionCardStyle(colors)}>{children}</View>
    </View>
  );
}