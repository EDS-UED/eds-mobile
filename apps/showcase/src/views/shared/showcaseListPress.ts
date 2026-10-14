import { resolveMotionRecipe } from '@eds/mobile-animations';

import colorSemanticSpec from '../../../../../packages/tokens/spec/color/semantic.json';

const pressRecipe = resolveMotionRecipe('press');

function resolveEventTapBaseAlpha() {
  const token = colorSemanticSpec.tokens.find((entry) => entry.name === 'event-tap-base');
  const match = String(token?.light ?? '').match(/\/\s*([0-9.]+)\)/);
  return match ? Number(match[1]) : 0.6;
}

/** List row press — event-tap-base α (60%) + press spring. */
export const showcaseListPress = {
  recipe: pressRecipe,
  opacity: resolveEventTapBaseAlpha(),
};
