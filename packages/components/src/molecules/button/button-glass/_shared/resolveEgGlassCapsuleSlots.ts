import type { ReactNode } from 'react';
import type { EgGlassCapsuleIconCount, EgGlassCapsuleKind } from '../EgGlassCapsule.types.js';

export type EgGlassCapsuleResolvedSlots = {
  /** `iconCount={1}` — 替换唯一 symbol（头像或其它）。 */
  primaryReplacement?: ReactNode;
  /** `iconCount={2}` — 替换右侧 symbol（`iconAlt`）。 */
  secondaryReplacement?: ReactNode;
};

/** `avatarSlot` / legacy `iconSlot` / `iconSlotEnd` → 替换 icon 位（非 text）。 */
export function resolveEgGlassCapsuleSlots(input: {
  kind: EgGlassCapsuleKind;
  iconCount?: EgGlassCapsuleIconCount;
  iconSlot?: ReactNode;
  iconSlotEnd?: ReactNode;
  avatarSlot?: ReactNode;
}): EgGlassCapsuleResolvedSlots {
  const { kind, iconCount = 1, iconSlot, iconSlotEnd, avatarSlot } = input;
  if (kind === 'text') {
    return {};
  }

  const count = iconCount === 2 ? 2 : 1;
  if (count === 2) {
    const right = avatarSlot ?? iconSlotEnd;
    return right ? { secondaryReplacement: right } : {};
  }

  const single = avatarSlot ?? iconSlot;
  return single ? { primaryReplacement: single } : {};
}
