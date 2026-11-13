import motionSemanticSpec from '../../../../../packages/tokens/spec/motion/semantic.json';

import type { TokenEntry } from './tokenCatalogTypes';

const classNameToScenarioId = new Map<string, string>();

for (const group of motionSemanticSpec.groups) {
  for (const style of group.styles) {
    const scenarioId =
      'scenarioId' in style && typeof style.scenarioId === 'string' && style.scenarioId.trim()
        ? style.scenarioId
        : style.className.replace(/^motion-/, '');
    classNameToScenarioId.set(style.className, scenarioId);
  }
}

/**
 * Motion Token RN 展示约定（Showcase 列表/导航标题）：
 * - Base → `mobileTheme.motion.*` · 展示名去掉 `motion-` 前缀（时长 ladder 为 `time-*`）
 * - Recipe → `EdsRecipeAnima('xxx')`
 * - Semantic → `EdsSemanticAnima('xxx')`
 */

/** Base 列表标签 — spec/CSS 仍为 `--motion-*`；Native 列表不套 `base-` 前缀。 */
export function motionBaseDisplayName(tokenName: string): string {
  if (/^motion-[0-9]+$/.test(tokenName)) {
    return tokenName.replace(/^motion-/, 'time-');
  }
  if (tokenName.startsWith('motion-')) {
    return tokenName.replace(/^motion-/, '');
  }
  return tokenName;
}

export type MotionBaseThemeAccess = {
  bucket: 'scale' | 'opacity' | 'offset' | 'radius' | 'ratio' | 'duration' | 'springByName' | 'springs' | 'haptic' | 'interaction';
  key: string;
  springProp?: 'damping' | 'stiffness' | 'mass';
};

/** Base token → `mobileTheme.motion` 路径（与 theme 生成一致）。 */
export function motionBaseThemeAccess(tokenName: string): MotionBaseThemeAccess {
  const springScalar = /^motion-spring-(.+)-(damping|stiffness|mass)$/.exec(tokenName);
  if (springScalar) {
    return {
      bucket: 'springByName',
      key: springScalar[1]!,
      springProp: springScalar[2] as 'damping' | 'stiffness' | 'mass',
    };
  }

  if (tokenName.startsWith('motion-haptic-')) {
    return { bucket: 'haptic', key: tokenName.replace(/^motion-haptic-/, '') };
  }

  if (tokenName.startsWith('motion-interaction-')) {
    return { bucket: 'interaction', key: tokenName.replace(/^motion-interaction-/, '') };
  }

  const key = tokenName.replace(/^motion-/, '');
  if (tokenName.startsWith('motion-opacity-')) {
    return { bucket: 'opacity', key };
  }
  if (tokenName.startsWith('motion-offset-')) {
    return { bucket: 'offset', key };
  }
  if (tokenName.startsWith('motion-radius-')) {
    return { bucket: 'radius', key };
  }
  if (tokenName.startsWith('motion-ratio-')) {
    return { bucket: 'ratio', key };
  }
  if (
    tokenName.startsWith('motion-scale-') ||
    tokenName.startsWith('motion-glass-scale-') ||
    tokenName === 'motion-scale-press'
  ) {
    return { bucket: 'scale', key };
  }
  if (/^motion-[0-9]+$/.test(tokenName)) {
    return { bucket: 'duration', key: tokenName };
  }
  if (/^motion-spring-.+-(response|damping-fraction|blend-duration)$/.test(tokenName)) {
    return { bucket: 'duration', key: tokenName };
  }
  return { bucket: 'duration', key: tokenName };
}

/** Semantic — spec `scenarioId`（默认 `motion-*` 去前缀）。 */
export function motionSemanticScenarioId(className: string): string | undefined {
  if (!className.startsWith('motion-')) {
    return undefined;
  }
  return classNameToScenarioId.get(className);
}

export function motionSemanticScenarioIdForTokenEntry(
  entry: Pick<TokenEntry, 'name'> & { layer?: TokenEntry['layer'] },
): string | undefined {
  if (entry.layer !== 'semantic') {
    return undefined;
  }
  return motionSemanticScenarioId(entry.name);
}

export function formatEdsRecipeAnimaCall(recipeId: string): string {
  return `EdsRecipeAnima('${recipeId}')`;
}

export function formatEdsSemanticAnimaCall(scenarioId: string): string {
  return `EdsSemanticAnima('${scenarioId}')`;
}

/** Recipe 层 token — id 即 `namedRecipes[].id`。 */
export function motionRecipeIdForTokenEntry(
  entry: Pick<TokenEntry, 'name'> & { layer?: TokenEntry['layer'] },
): string | undefined {
  if (entry.layer === 'recipe') {
    return entry.name;
  }
  return undefined;
}

/** Semantic 场景是否在 spec 中绑定 Recipe（utility 如 motion-none 除外）。 */
export function motionSemanticHasRecipe(className: string): boolean {
  for (const group of motionSemanticSpec.groups) {
    for (const style of group.styles) {
      if (style.className === className && 'recipe' in style && style.recipe) {
        return true;
      }
    }
  }
  return false;
}

export function formatMotionBaseThemeAccessLine(access: MotionBaseThemeAccess): string {
  switch (access.bucket) {
    case 'springByName':
      if (access.springProp) {
        return `mobileTheme.motion.springByName[${quote(access.key)}].${access.springProp}`;
      }
      return `mobileTheme.motion.springByName[${quote(access.key)}]`;
    case 'springs':
      return `mobileTheme.motion.springs[${quote(access.key)}]`;
    case 'haptic':
      return `mobileTheme.motion.haptic[${quote(access.key)}]`;
    case 'interaction':
      return `mobileTheme.motion.interaction[${quote(access.key)}]`;
    default:
      return `mobileTheme.motion.${access.bucket}[${quote(access.key)}]`;
  }
}

const PRESS_SNIPPET = [
  "import { EgEdsAnimaPress } from '@eds/mobile-components';",
  '',
  '// 定制：点按强度 pressIntensity（xs / sm / md / lg）· 缩放方向 pressScaleDirection（up 放大 / down 缩小）',
  '<EgEdsAnimaPress pressIntensity="md" pressScaleDirection="up" onPress={…}>',
  '  {children}',
  '</EgEdsAnimaPress>',
].join('\n');

const SLIDE_SNIPPET = [
  "import { EgEdsAnimaSlide } from '@eds/mobile-components';",
  '',
  '// 定制：点按缩放 pressScale · 胶囊跟手 followDrag（默认均开启）',
  '<EgEdsAnimaSlide',
  '  mode="light"',
  "  items={[{ id: 'a', label: 'A' }, { id: 'b', label: 'B' }]}",
  '  selectedId={selected}',
  '  onSelect={setSelected}',
  '  pressScale',
  '  followDrag',
  '/>',
].join('\n');

const LAYOUT_CONTENT_SNIPPET = [
  "import { EgEdsAnimaLayoutContent } from '@eds/mobile-components';",
  '',
  '// contentKey 变化即播同壳正文切换（crossfade + nudge）',
  '<EgEdsAnimaLayoutContent contentKey={tabId}>',
  '  {content}',
  '</EgEdsAnimaLayoutContent>',
].join('\n');

const MENU_SNIPPET = [
  "import { EgMenu } from '@eds/mobile-components';",
  '',
  '// 动效已内置：容器自触发点倒出 + 回弹，收回同路径',
  '<EgMenu sections={sections} onSelect={…} />',
].join('\n');

const SHEETS_SNIPPET = [
  "import { EgSheets } from '@eds/mobile-components';",
  '',
  '// 动效已内置：呈现 / 档位吸附 / 下拉收起',
  '<EgSheets visible={open} onDismiss={() => setOpen(false)} title="标题">',
  '  {children}',
  '</EgSheets>',
].join('\n');

const PAGE_SNIPPET = [
  "import { createEgEdsAnimaPageNavigator, EgEdsAnimaPage } from '@eds/mobile-components';",
  '',
  '// iOS 26+ 系统 NavBar + 系统转场；Android · iOS ≤25 EDS page 弹簧 + EgNavBar',
  '// 定制：方向 direction（horizontal 左右 / horizontal-reverse 右左 / vertical 上下）· 拖拽关闭 dragDismiss（默认开启）',
  'const Stack = createEgEdsAnimaPageNavigator<ParamList>();',
  '',
  "<Stack.Navigator screenOptions={EgEdsAnimaPage({ direction: 'horizontal', dragDismiss: true })}>",
  '  <Stack.Screen name="Detail" component={Detail} options={{ title: \'订单详情\' }} />',
  '</Stack.Navigator>',
].join('\n');

const PAGE_SHOT_SNIPPET = [
  "import { EgEdsAnimaPageShot, EgEdsAnimaPageShotTrigger } from '@eds/mobile-components';",
  '',
  '// 卡片 / 按钮 / 列表行等触发元素 · 同一动效展开整页；弹层内 api.push 左右切换（page）',
  '<EgEdsAnimaPageShot',
  '  mode="light"',
  '  // NavBar 标题（iOS 26+ 系统栏 · 其余 EgNavBar）；pageKey 为 null 即根页',
  '  title={(source, pageKey) => pageKey ?? \'订单详情\'}',
  '  // 滚动内容：<ScrollView contentInsetAdjustmentBehavior={api.contentInsetAdjustmentBehavior}',
  '  //   contentContainerStyle={{ paddingTop: api.scrollTopInset }}>',
  '  renderRoot={(api) => <Detail api={api} onOpen={api.push} />}',
  '  renderPage={(api) => <SubPage api={api} />}',
  '>',
  '  <EgEdsAnimaPageShotTrigger id="order" radius={16} morph>',
  '    <OrderRow />',
  '  </EgEdsAnimaPageShotTrigger>',
  '</EgEdsAnimaPageShot>',
].join('\n');

function quote(value: string) {
  return `'${value}'`;
}

/** USAGE — 与动效 API 配套的 consumer RN（非 preview/* Demo）。 */
export function resolveMotionTokenLiveNativeSnippet(
  entry: Pick<TokenEntry, 'name'> & { layer?: TokenEntry['layer'] },
): string | undefined {
  if (entry.layer === 'recipe') {
    const recipeId = motionRecipeIdForTokenEntry(entry);
    if (!recipeId) {
      return undefined;
    }
    switch (recipeId) {
      case 'press':
      case 'press-scale-out':
        return PRESS_SNIPPET;
      case 'drag':
        return [
          '// 跟手位移 · 不单独 spring 落位（EgEdsAnimaSlide followDrag / EgMenu / EgTabBar 内置）',
        ].join('\n');
      case 'slide':
        return SLIDE_SNIPPET;
      case 'layout-content':
        return LAYOUT_CONTENT_SNIPPET;
      case 'menu':
      case 'menu-dismiss':
        return MENU_SNIPPET;
      case 'sheets':
      case 'sheets-detent':
      case 'sheets-dismiss':
        return SHEETS_SNIPPET;
      case 'page':
      case 'page-back':
        return PAGE_SNIPPET;
      case 'page-shot':
      case 'page-shot-dismiss':
        return PAGE_SHOT_SNIPPET;
      default:
        return undefined;
    }
  }

  if (entry.layer === 'semantic') {
    const scenario = motionSemanticScenarioIdForTokenEntry(entry);
    if (!scenario || !motionSemanticHasRecipe(entry.name)) {
      return undefined;
    }
    switch (scenario) {
      case 'press':
        return PRESS_SNIPPET;
      case 'slide':
        return SLIDE_SNIPPET;
      case 'layout-content':
        return LAYOUT_CONTENT_SNIPPET;
      case 'menu':
        return MENU_SNIPPET;
      case 'sheets':
        return SHEETS_SNIPPET;
      case 'page':
        return PAGE_SNIPPET;
      case 'page-shot':
        return PAGE_SHOT_SNIPPET;
      default:
        return undefined;
    }
  }

  if (entry.layer === 'base' && entry.name.startsWith('motion-scale-press')) {
    return PRESS_SNIPPET;
  }

  if (entry.layer === 'base' && entry.name === 'motion-spring-slide-commit-damping') {
    return [
      '// slideCommitSpringConfig 等同 springByName[slide-commit] · 见 packages/components slideMotion.ts',
    ].join('\n');
  }

  return undefined;
}
