import { useState } from 'react';

import { EgEdsAnimaSlide } from '../shared/motion/EgEdsAnimaSlide.js';
import type { ThemeMode } from '../theme/index.js';

const SEGMENTS = [
  { id: 'a', label: 'A' },
  { id: 'b', label: 'B' },
  { id: 'c', label: 'C' },
];

type SlideSelectionDemoProps = {
  mode: ThemeMode;
  /** 按下整条缩放。默认 true。 */
  pressScale?: boolean;
  /** 拖动时滑块跟手。默认 true。 */
  followDrag?: boolean;
};

/** motion-slide · EdsSemanticAnima('slide') — `EgEdsAnimaSlide` 演示。 */
export function SlideSelectionDemo({ mode, pressScale = true, followDrag = true }: SlideSelectionDemoProps) {
  const [selected, setSelected] = useState('a');
  return (
    <EgEdsAnimaSlide
      mode={mode}
      items={SEGMENTS}
      selectedId={selected}
      onSelect={setSelected}
      pressScale={pressScale}
      followDrag={followDrag}
    />
  );
}
