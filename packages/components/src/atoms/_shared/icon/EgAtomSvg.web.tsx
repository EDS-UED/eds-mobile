import { unstable_createElement as createElement } from 'react-native';

/**
 * Web — inject processed SVG markup via RN-web DOM createElement.
 * Same markup pipeline as native SvgXml; avoids SvgXml hook issues in Vite.
 */
export function EgAtomSvg({ xml, width, height }: { xml: string; width: number; height: number }) {
  return createElement('div', {
    style: {
      width,
      height,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      lineHeight: 0,
    },
    dangerouslySetInnerHTML: { __html: xml },
  });
}
