import { useEffect, useState } from 'react';
import { View, type ViewProps, type ViewStyle } from 'react-native';
import type { EgCommonProps } from '../../../shared/types.js';
import { resolveColor } from '../../../shared/resolveColor.js';
import { getThemeColors, mobileTheme } from '../../../theme/index.js';
import {
  colorizeTokenIconMarkup,
  resolveIconFillTone,
  type IconStrokeScaleToken,
} from '../icon/colorizeIconMarkup.js';
import { loadIconAsset } from '../icon/iconAssetLoader.js';
import type { IconFillTone } from '../icon/processSvg.js';
import { sizeIconMarkup } from '../icon/sizeIconMarkup.js';
import { loadCryptoAsset } from '../crypto/cryptoAssetLoader.js';
import { resolveCryptoAssetFileName } from '../crypto/cryptoAssetNames.generated.js';
import { EgAtomSvg } from '../icon/EgAtomSvg';

export type EgSymbolSize = 'xs' | 'sm' | 'md' | 'lg';

export type EgSymbolProps = EgCommonProps & {
  /** Canonical SVG asset name, e.g. `eds-add` or `eds-btc-bitcoin`. */
  name: string;
  size?: EgSymbolSize;
  /**
   * RN — render SVG markup at this pixel size (`sizeIconMarkup` / `colorizeTokenIconMarkup`).
   * Use spacing tokens such as `avatar-xl` instead of scaling the view.
   */
  displayPx?: number;
  /** Token icon coloring only; ignored for crypto assets. */
  fillTone?: IconFillTone;
  /** Semantic color token for stroke icons — default `text-base-primary`. */
  strokeColorToken?: string;
  /** 描边粗细 token · 默认 `stroke-xl`（其余场景不变）。 */
  strokeScaleToken?: IconStrokeScaleToken;
};

const SYMBOL_PX: Record<EgSymbolSize, number> = {
  xs: mobileTheme.spacing['symbol-xs'] as number,
  sm: mobileTheme.spacing['symbol-sm'] as number,
  md: mobileTheme.spacing['symbol-md'] as number,
  lg: mobileTheme.spacing['symbol-lg'] as number,
};

export function EgSymbol({
  name,
  size = 'md',
  displayPx,
  fillTone,
  strokeColorToken = 'text-base-primary',
  strokeScaleToken,
  mode = 'light',
  testID,
  style,
  accessibilityLabel,
}: EgSymbolProps & Pick<ViewProps, 'style'>) {
  const px = displayPx ?? SYMBOL_PX[size];
  const [xml, setXml] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const colors = getThemeColors(mode);

    async function load() {
      setXml(null);
      const iconAsset = await loadIconAsset(name);
      if (cancelled) return;

      if (iconAsset) {
        const resolvedFillTone = resolveIconFillTone(iconAsset, fillTone);
        const strokeColor = resolveColor(colors, strokeColorToken);
        const fillColor =
          resolvedFillTone === 'brand'
            ? resolveColor(colors, 'material-brand')
            : resolvedFillTone === 'decor'
              ? resolveColor(colors, 'material-decor')
              : strokeColor;

        const nextXml =
          iconAsset.colorMode === 'token'
            ? colorizeTokenIconMarkup(iconAsset, {
                strokeColor,
                fillColor,
                displayPx: px,
                strokeScaleToken,
              })
            : sizeIconMarkup(iconAsset.markup, px);

        setXml(nextXml);
        return;
      }

      const cryptoFileName = resolveCryptoAssetFileName(name);
      if (!cryptoFileName) return;

      const cryptoAsset = await loadCryptoAsset(cryptoFileName);
      if (cancelled || !cryptoAsset) return;

      setXml(sizeIconMarkup(cryptoAsset.markup, px));
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [name, px, fillTone, strokeColorToken, strokeScaleToken, mode]);

  return (
    <View
      testID={testID}
      style={[{ width: px, height: px }, style as ViewStyle]}
      accessibilityRole={xml ? 'image' : undefined}
      accessibilityLabel={accessibilityLabel ?? name}
    >
      {xml ? <EgAtomSvg xml={xml} width={px} height={px} /> : null}
    </View>
  );
}
