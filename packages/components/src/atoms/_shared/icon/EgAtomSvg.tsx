import { SvgXml } from 'react-native-svg';

/** Native — SvgXml from react-native-svg. */
export function EgAtomSvg({ xml, width, height }: { xml: string; width: number; height: number }) {
  return <SvgXml xml={xml} width={width} height={height} />;
}
