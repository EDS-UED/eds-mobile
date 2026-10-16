import { EgSymbol } from '../../../atoms/_shared/symbol/EgSymbol.js';
import type { ThemeMode } from '../../../theme/index.js';
import { TAB_BAR_ICON_SIZE } from './tabBarMetrics.js';
import type { EgTabBarSelectionAccent } from './tabBarSelectionAccent.js';
import {
  egTabBarSelectionFillTone,
  egTabBarSelectionStrokeToken,
} from './tabBarSelectionAccent.js';

function isFillSymbolName(name: string): boolean {
  return name.endsWith('-fill');
}

/** TabBar 默认 icon 槽 — 未传 `icon` 时用 `symbolName` / 选中 `symbolNameSelected`。 */
export function renderTabBarItemSymbol(options: {
  symbolName: string;
  symbolNameSelected?: string;
  selected: boolean;
  mode: ThemeMode;
  selectionAccent?: EgTabBarSelectionAccent;
}) {
  const { symbolName, symbolNameSelected, selected, mode, selectionAccent = 'brand' } = options;
  const name =
    selected && symbolNameSelected ? symbolNameSelected : symbolName;
  const isFill = isFillSymbolName(name);

  return (
    <EgSymbol
      name={name}
      mode={mode}
      size={TAB_BAR_ICON_SIZE}
      strokeColorToken={
        selected ? egTabBarSelectionStrokeToken(selectionAccent) : 'stroke-base-primary'
      }
      fillTone={isFill && selected ? egTabBarSelectionFillTone(selectionAccent) : undefined}
    />
  );
}
