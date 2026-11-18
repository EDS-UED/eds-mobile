import { EgSymbol } from '../../../atoms/_shared/symbol/EgSymbol.js';
import { edsScalePx } from '../../../shared/edsScale.js';
import type { ThemeMode } from '../../../theme/index.js';

/** Checkbox · Decide 选中勾 — `oval-tick-mini` · `scale-5`（20px）。 */
export function ToggleOvalTickMark({ mode }: { mode: ThemeMode }) {
  return (
    <EgSymbol
      name="oval-tick-mini"
      displayPx={edsScalePx('scale-5')}
      mode={mode}
      strokeColorToken="text-same-white"
      accessibilityLabel={undefined}
    />
  );
}