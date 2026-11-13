import { StyleSheet, Text, View } from 'react-native';

import {
  EDS_GLASS_OPEN_ISSUES,
  EDS_GLASS_RENDER_STACK,
  EDS_GLASS_TOP_LEVEL_PRINCIPLES,
} from '@/content/edsGlassPrinciples';
import { useShowcaseColors } from '@/hooks/useShowcaseColors';
import { edsFontStyle } from '@/lib/edsFontFamily';
import { showcaseShallowBlockSurface, showcaseTheme } from '@/views/shared/showcaseTheme';

/** 真机 demo — §6.0 顶层原则 + 渲染栈 + 对话待办（暂放液态玻璃页顶）。 */
export function EdsMobileRnPrincipleCallout() {
  const colors = useShowcaseColors();

  return (
    <View
      style={[
        styles.card,
        showcaseShallowBlockSurface(colors['material-card-shallow'] as string),
        { borderColor: colors['stroke-divider-shallow'] as string },
      ]}
    >
      <Text style={[styles.title, { color: colors['text-base-primary'] as string }]}>
        EDSGlassView · 顶层原则（§6.0）
      </Text>

      {EDS_GLASS_TOP_LEVEL_PRINCIPLES.map((line, index) => (
        <Text
          key={`p-${index}`}
          style={[styles.bullet, { color: colors['text-base-secondary'] as string }]}
        >
          {index + 1}. {line}
        </Text>
      ))}

      <Text style={[styles.subhead, { color: colors['text-base-primary'] as string }]}>渲染栈</Text>
      {EDS_GLASS_RENDER_STACK.map((line, index) => (
        <Text
          key={`s-${index}`}
          style={[styles.mono, { color: colors['text-base-secondary'] as string }]}
        >
          {line}
        </Text>
      ))}

      <Text style={[styles.subhead, { color: colors['text-base-primary'] as string }]}>
        待处理（对话清单）
      </Text>
      {EDS_GLASS_OPEN_ISSUES.map((line, index) => (
        <Text
          key={`i-${index}`}
          style={[styles.issue, { color: colors['text-base-secondary'] as string }]}
        >
          · {line}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: StyleSheet.hairlineWidth,
    gap: 6,
    paddingHorizontal: showcaseTheme.layout.cardPaddingHorizontal,
    paddingVertical: showcaseTheme.layout.cardPaddingVertical,
    width: '100%',
  },
  title: {
    fontSize: 15,
    lineHeight: 20,
    marginBottom: 4,
    ...edsFontStyle('600'),
  },
  subhead: {
    fontSize: 13,
    lineHeight: 18,
    marginTop: 8,
    ...edsFontStyle('600'),
  },
  bullet: {
    fontSize: 12,
    lineHeight: 17,
    ...edsFontStyle('400'),
  },
  mono: {
    fontSize: 11,
    lineHeight: 15,
    ...edsFontStyle('400'),
  },
  issue: {
    fontSize: 11,
    lineHeight: 15,
    ...edsFontStyle('400'),
  },
});
