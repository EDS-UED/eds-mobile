import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

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
          timing: recipe?.timingRef ? baseSpec.timings?.[recipe.timingRef] ?? null : null,
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
    note: 'Semantic 沿用现有 class（motion-tap 等），不采用文档 8 场景分组。',
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

  const timings = baseSpec.timings ?? {};
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
