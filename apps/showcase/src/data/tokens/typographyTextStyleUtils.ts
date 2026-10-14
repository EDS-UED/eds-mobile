import type { TextStyle } from 'react-native';

import { edsFontFamily } from '@/lib/edsFontFamily';
import { edsTypographyRole, type TypographyRole } from '@/views/shared/resolveEdsTheme';

const TEXT_STYLE_PREFIX = 'typography-';

export { TOKEN_DEMO_TEXT as TYPOGRAPHY_DEMO_TEXT } from '@/data/tokens/tokenDemoText';

export function isTypographyTextStyleClassName(className: string): boolean {
  return className.startsWith(TEXT_STYLE_PREFIX);
}

export function textStyleRoleFromClassName(className: string): TypographyRole {
  return className.slice(TEXT_STYLE_PREFIX.length) as TypographyRole;
}

/** List label — strip `.typography-`, hyphens → spaces, capitalize first letter. */
export function textStyleListLabel(className: string): string {
  const slug = className.slice(TEXT_STYLE_PREFIX.length).replace(/-/g, ' ');
  return slug.charAt(0).toUpperCase() + slug.slice(1);
}

export function textStyleSampleStyle(role: TypographyRole): TextStyle {
  const roleStyle = edsTypographyRole(role);
  return {
    ...roleStyle,
    fontFamily: edsFontFamily(roleStyle.fontWeight),
  };
}

/** Resolved size / weight / line-height — e.g. `17/400/24`. */
export function textStyleMetricsLabel(role: TypographyRole): string {
  const { fontSize, fontWeight, lineHeight } = edsTypographyRole(role);
  return `${fontSize}/${fontWeight}/${lineHeight}`;
}
