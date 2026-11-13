import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { normalizeMotionTimings, resolveMotionTimingMs } from './motion-ladder.mjs';

function readCssSpec(specDir, name) {
  return JSON.parse(readFileSync(join(specDir, 'motion', name), 'utf-8'));
}

function readBaseSpec(specDir) {
  return readCssSpec(specDir, 'base.json');
}

function buildResolutionChain(baseSpec, recipeSpec, semanticSpec) {
  const recipeById = Object.fromEntries((recipeSpec.namedRecipes ?? []).map((r) => [r.id, r]));
  const chain = {};

  for (const group of semanticSpec.groups ?? []) {
    for (const style of group.styles ?? []) {
      const recipe = recipeById[style.recipe];
      chain[style.className] = {
        recipe: style.recipe,
        cssRecipe: recipe?.cssRecipe ?? null,
        springRef: recipe?.springRef ?? null,
        timingRef: recipe?.timingRef ?? null,
        hapticRef: recipe?.hapticRef ?? null,
        base: {
          spring: recipe?.springRef ? baseSpec.springs?.[recipe.springRef] ?? null : null,
          timing: recipe?.timingRef
            ? (() => {
                const raw = baseSpec.timings?.[recipe.timingRef] ?? null;
                if (!raw) return null;
                return { ...raw, duration: resolveMotionTimingMs(baseSpec, raw) };
              })()
            : null,
          haptic: recipe?.hapticRef ? baseSpec.haptics?.[recipe.hapticRef] ?? null : null,
        },
      };
    }
  }

  return chain;
}

export function writeMotionCatalogJson(specDir, distDir) {
  const baseSpec = readBaseSpec(specDir);
  const recipeSpec = readCssSpec(specDir, 'recipe.json');
  const semanticSpec = readCssSpec(specDir, 'semantic.json');

  const catalog = {
    architecture: 'Base → Recipe → Semantic',
    note: 'Semantic class = motion-{scenarioId}，与 EdsSemanticAnima 同名。',
    resolution: buildResolutionChain(baseSpec, recipeSpec, semanticSpec),
    css: {
      base: baseSpec,
      recipe: recipeSpec,
      semantic: semanticSpec,
    },
  };

  mkdirSync(join(distDir, 'json/motion'), { recursive: true });
  writeFileSync(join(distDir, 'json/motion/catalog.json'), JSON.stringify(catalog, null, 2));
}

export function generateMobileMotionRuntime(specDir, animationsSrcDir) {
  const baseSpec = readBaseSpec(specDir);
  const recipeSpec = readCssSpec(specDir, 'recipe.json');
  const semanticSpec = readCssSpec(specDir, 'semantic.json');

  const springs = {};
  for (const [name, spring] of Object.entries(baseSpec.springs ?? {})) {
    if (spring.reanimated) {
      springs[name] = spring.reanimated;
    }
  }

  const timings = normalizeMotionTimings(baseSpec);
  const haptics = baseSpec.haptics ?? {};
  const interaction = baseSpec.interaction ?? {};

  const recipeMap = {};
  const semanticMap = {};
  for (const recipe of recipeSpec.namedRecipes ?? []) {
    recipeMap[recipe.id] = {
      label: recipe.label ?? recipe.id,
      spring: recipe.springRef ?? null,
      timing: recipe.timingRef ?? null,
      haptic: recipe.hapticRef ?? null,
      semanticClass: recipe.semanticClass ?? null,
      velocityAware: recipe.velocityAware ?? false,
      interruptible: recipe.interruptible ?? false,
    };
    if (recipe.semanticClass && !semanticMap[recipe.semanticClass]) {
      semanticMap[recipe.semanticClass] = {
        recipe: recipe.id,
        spring: recipe.springRef ?? null,
        timing: recipe.timingRef ?? null,
      };
    }
  }

  for (const group of semanticSpec.groups ?? []) {
    for (const style of group.styles ?? []) {
      if (!semanticMap[style.className]) {
        const recipe = recipeMap[style.recipe];
        semanticMap[style.className] = {
          recipe: style.recipe,
          spring: recipe?.spring ?? null,
          timing: recipe?.timing ?? null,
        };
      }
    }
  }

  const compositionMap = {};
  for (const composition of semanticSpec.compositions ?? []) {
    compositionMap[composition.id] = composition;
  }

  /** RN `EdsSemanticAnima('<scenarioId>')` → `.motion-*` class（默认 class 去 `motion-` 前缀；可含空格）。 */
  const scenarioById = {};
  for (const group of semanticSpec.groups ?? []) {
    for (const style of group.styles ?? []) {
      const scenarioId =
        style.scenarioId ??
        String(style.className ?? '').replace(/^motion-/, '');
      if (scenarioId && style.className) {
        scenarioById[scenarioId] = style.className;
      }
    }
  }

  const springWithSnappy = { ...springs, snappy: springs.press };

  const lines = [
    '/** Auto-generated from packages/tokens/spec/motion — Base → Recipe → Semantic */',
    '',
    `export const mobileMotionSprings = ${JSON.stringify(springWithSnappy, null, 2)} as const;`,
    '',
    `export const mobileMotionTimings = ${JSON.stringify(timings, null, 2)} as const;`,
    '',
    `export const mobileMotionHaptics = ${JSON.stringify(haptics, null, 2)} as const;`,
    '',
    `export const mobileMotionInteraction = ${JSON.stringify(interaction, null, 2)} as const;`,
    '',
    `export const mobileMotionRecipes = ${JSON.stringify(recipeMap, null, 2)} as const;`,
    '',
    `export const mobileMotionCompositions = ${JSON.stringify(compositionMap, null, 2)} as const;`,
    '',
    `export const mobileMotionSemanticMap = ${JSON.stringify(semanticMap, null, 2)} as const;`,
    '',
    `export const mobileMotionScenarioById = ${JSON.stringify(scenarioById, null, 2)} as const;`,
    '',
    'export const mobileMotion = {',
    '  spring: mobileMotionSprings,',
    '  timing: mobileMotionTimings,',
    '  haptic: mobileMotionHaptics,',
    '  interaction: mobileMotionInteraction,',
    '} as const;',
    '',
    'export default mobileMotion;',
    '',
  ];

  const genDir = join(animationsSrcDir, 'generated');
  mkdirSync(genDir, { recursive: true });
  writeFileSync(join(genDir, 'mobileMotion.generated.ts'), lines.join('\n'));
}
