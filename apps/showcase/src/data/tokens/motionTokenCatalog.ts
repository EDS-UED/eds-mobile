import motionBaseSpec from '../../../../../packages/tokens/spec/motion/base.json';
import motionRecipeSpec from '../../../../../packages/tokens/spec/motion/recipe.json';
import motionSemanticSpec from '../../../../../packages/tokens/spec/motion/semantic.json';

import { distClassDetailLines, distVarLines } from './distCssManifest';
import { motionShowcaseGroupComment } from './showcaseTokenGroupComments.js';
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
  const fromGroups = motionBaseSpec.groups.flatMap((group) => {
    if ('tokens' in group && group.tokens) {
      return [
        {
          comment: motionShowcaseGroupComment(group.comment),
          tokens: Object.keys(group.tokens).map((name) => buildVarEntry(name, 'base')),
        },
      ];
    }

    if ('tokenList' in group && group.tokenList) {
      return [
        {
          comment: motionShowcaseGroupComment(group.comment),
          tokens: group.tokenList.map((token) => buildVarEntry(token.name, 'base')),
        },
      ];
    }

    return [];
  });

  const springGroups: TokenGroup[] = [];
  const springs = motionBaseSpec.springs ?? {};
  for (const [name, spring] of Object.entries(springs)) {
    const tokens: TokenEntry[] = [
      buildVarEntry(`motion-spring-${name}-response`, 'base'),
      buildVarEntry(`motion-spring-${name}-damping-fraction`, 'base'),
      buildVarEntry(`motion-spring-${name}-blend-duration`, 'base'),
    ];
    if (spring.reanimated) {
      tokens.push(
        buildVarEntry(`motion-spring-${name}-damping`, 'base'),
        buildVarEntry(`motion-spring-${name}-stiffness`, 'base'),
        buildVarEntry(`motion-spring-${name}-mass`, 'base'),
      );
    }
    springGroups.push({
      comment: motionShowcaseGroupComment(`Spring · ${name}`),
      tokens,
    });
  }

  const haptics = motionBaseSpec.haptics ?? {};
  const hapticGroup: TokenGroup | null =
    Object.keys(haptics).length > 0
      ? {
          comment: motionShowcaseGroupComment('Haptic'),
          tokens: Object.keys(haptics).map((name) => buildVarEntry(`motion-haptic-${name}`, 'base')),
        }
      : null;

  const interaction = motionBaseSpec.interaction ?? {};
  const interactionGroup: TokenGroup | null =
    Object.keys(interaction).length > 0
      ? {
          comment: motionShowcaseGroupComment('Interaction defaults'),
          tokens: Object.keys(interaction).map((name) => {
            const cssName = name.replace(/([A-Z])/g, '-$1').toLowerCase();
            return buildVarEntry(`motion-interaction-${cssName}`, 'base');
          }),
        }
      : null;

  return [
    ...fromGroups,
    ...springGroups,
    ...(hapticGroup ? [hapticGroup] : []),
    ...(interactionGroup ? [interactionGroup] : []),
  ];
}

function flattenMotionRecipeGroups(): TokenGroup[] {
  const namedRecipeGroup: TokenGroup = {
    comment: motionShowcaseGroupComment('Named Recipes'),
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
    comment: motionShowcaseGroupComment(group.comment),
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
    comment: motionShowcaseGroupComment(group.comment),
    tokens: group.styles.map((style) => ({
      name: style.className,
      layer: 'semantic' as const,
      cssVar: `.${style.className}`,
      detailLines: distClassDetailLines('motion', style.className),
    })),
  }));

  const utilityGroup: TokenGroup = {
    comment: motionShowcaseGroupComment('Utilities'),
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
