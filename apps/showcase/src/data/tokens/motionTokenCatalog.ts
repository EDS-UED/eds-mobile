import motionBaseSpec from '../../../../../packages/tokens/spec/motion/base.json';
import motionRecipeSpec from '../../../../../packages/tokens/spec/motion/recipe.json';
import motionSemanticSpec from '../../../../../packages/tokens/spec/motion/semantic.json';

import { distClassDetailLines, distVarLines } from './distCssManifest';
import type { TokenEntry, TokenGroup } from './tokenCatalogTypes';
import { cssValueLine } from './tokenCatalogUtils';

function buildVarEntry(name: string, layer: TokenEntry['layer']): TokenEntry {
  return {
    name,
    layer,
    cssVar: `--${name}`,
    detailLines: distVarLines('motion', name),
  };
}

function flattenMotionBaseGroups(): TokenGroup[] {
  return motionBaseSpec.groups.flatMap((group) => {
    if ('tokens' in group && group.tokens) {
      return [
        {
          comment: group.comment,
          tokens: Object.keys(group.tokens).map((name) => buildVarEntry(name, 'base')),
        },
      ];
    }

    if ('tokenList' in group && group.tokenList) {
      return [
        {
          comment: group.comment,
          tokens: group.tokenList.map((token) => buildVarEntry(token.name, 'base')),
        },
      ];
    }

    return [];
  });
}

function flattenMotionRecipeGroups(): TokenGroup[] {
  const namedRecipeGroup: TokenGroup = {
    comment: 'Named Recipes',
    tokens: motionRecipeSpec.namedRecipes
      .filter((recipe) => recipe.cssRecipe)
      .map((recipe) => ({
        name: recipe.id,
        layer: 'recipe' as const,
        cssVar: `--${recipe.cssRecipe}`,
        detailLines: distVarLines('motion', recipe.cssRecipe!),
      })),
  };

  const tokenGroups = motionRecipeSpec.groups.map((group) => ({
    comment: group.comment,
    tokens: group.tokenList.map((token) => ({
      name: token.name,
      layer: 'recipe' as const,
      cssVar: `--${token.name}`,
      detailLines: distVarLines('motion', token.name).length
        ? distVarLines('motion', token.name)
        : [cssValueLine(token.value)],
    })),
  }));

  return [namedRecipeGroup, ...tokenGroups];
}

function flattenMotionSemanticGroups(): TokenGroup[] {
  const styleGroups = motionSemanticSpec.groups.map((group) => ({
    comment: group.comment,
    tokens: group.styles.map((style) => ({
      name: style.className,
      layer: 'semantic' as const,
      cssVar: `.${style.className}`,
      detailLines: distClassDetailLines('motion', style.className),
    })),
  }));

  const utilityGroup: TokenGroup = {
    comment: 'Utilities',
    tokens: (motionSemanticSpec.utilityClasses ?? []).map((utility) => ({
      name: utility.className,
      layer: 'semantic' as const,
      cssVar: `.${utility.className}`,
      detailLines: distClassDetailLines('motion', utility.className),
    })),
  };

  return [...styleGroups, utilityGroup];
}

export function getMotionBaseGroups(): TokenGroup[] {
  return flattenMotionBaseGroups();
}

export function getMotionBaseEntries(): TokenEntry[] {
  return getMotionBaseGroups().flatMap((group) => group.tokens);
}

export function getMotionRecipeGroups(): TokenGroup[] {
  return flattenMotionRecipeGroups();
}

export function getMotionSemanticGroups(): TokenGroup[] {
  return flattenMotionSemanticGroups();
}

export function getMotionTokenByName(name: string): TokenEntry | undefined {
  for (const groups of [getMotionBaseGroups(), getMotionRecipeGroups(), getMotionSemanticGroups()]) {
    for (const group of groups) {
      const token = group.tokens.find((entry) => entry.name === name);
      if (token) {
        return token;
      }
    }
  }

  return undefined;
}
