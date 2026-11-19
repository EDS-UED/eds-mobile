import type { EgSymbolSize } from '../../../atoms/_shared/symbol/EgSymbol.js';
import type { ControlSize } from '../../../shared/types.js';
import { edsScalePx } from '../../../shared/edsScale.js';

const CONTAINER_SCALE: Record<ControlSize, string> = {
  xl: 'scale-14',
  lg: 'scale-13',
  md: 'scale-11',
  sm: 'scale-9',
  xs: 'scale-7',
};

const SYMBOL_SIZE: Record<ControlSize, EgSymbolSize> = {
  xl: 'md',
  lg: 'md',
  md: 'md',
  sm: 'sm',
  xs: 'xs',
};

export function resolveEgSymbolActionContainerPx(size: ControlSize): number {
  return edsScalePx(CONTAINER_SCALE[size]);
}

export function resolveEgSymbolActionSymbolSize(size: ControlSize): EgSymbolSize {
  return SYMBOL_SIZE[size];
}