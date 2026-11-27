import type { EgPopoversEdge } from '../popovers/EgPopovers.types.js';
import type { PopoverAlign, PopoverPlacement } from './popoverShape.js';

function crossAlign(suffix: string): PopoverAlign {
  if (suffix === 'center' || suffix === 'middle') return 'center';
  if (suffix === 'trailing' || suffix === 'bottom' || suffix === 'end') return 'end';
  return 'start';
}

/** EgPopovers `edge` → Desktop Popover `placement` + `align`。 */
export function resolveEgPopoversPlacement(edge: EgPopoversEdge): {
  placement: PopoverPlacement;
  align: PopoverAlign;
} {
  if (edge.startsWith('top-')) {
    return { placement: 'bottom', align: crossAlign(edge.slice('top-'.length)) };
  }
  if (edge.startsWith('bottom-')) {
    return { placement: 'top', align: crossAlign(edge.slice('bottom-'.length)) };
  }
  if (edge.startsWith('leading-')) {
    return { placement: 'right', align: crossAlign(edge.slice('leading-'.length)) };
  }
  return { placement: 'left', align: crossAlign(edge.slice('trailing-'.length)) };
}