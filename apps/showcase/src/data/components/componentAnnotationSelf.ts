import type { ShowcaseCatalogEntry } from '@/data/components/showcaseCatalog';

import type { ComponentSelfAnnotationSpec } from './componentAnnotationAssemble';

function iconAssetSelf(exportName: string): ComponentSelfAnnotationSpec {
  return {
    style: [
      `\`${exportName}\` 为 \`EgSymbol\` 固定 \`name\` 的 SVG 描边/填充资产。`,
      '着色由 `color` / `mode` 解析（常见 `text-base-primary` · `text-brand`）。',
    ],
    layout: [
      '正方形容器；边长由 `size` 映射 `symbol-xs` … `symbol-xl`（默认 `symbol-md`）。',
    ],
  };
}

function cryptoAssetSelf(exportName: string): ComponentSelfAnnotationSpec {
  return {
    style: [
      `\`${exportName}\` 为 \`EgSymbol\` 加密资产 SVG；保留资产自带配色，可选 \`color\` 覆盖。`,
    ],
    layout: ['正方形容器；边长 `symbol-*` 与 Icon 族同一套 `size` 映射。'],
  };
}

function scaffoldSelf(exportName: string): ComponentSelfAnnotationSpec {
  return {
    style: [`\`${exportName}\` 色票与字阶将按 Figma 组件 token 锁定（当前为占位 View）。`],
    layout: ['几何将按 Figma Scale（control 高度 · spacing · radius）锁定。'],
    platform: ['默认 RN：`StyleSheet` + `mobileTheme`；无声明时不分叉 `Platform.OS`。'],
  };
}

const SELF_BY_SLUG: Record<string, ComponentSelfAnnotationSpec | ((exportName: string) => ComponentSelfAnnotationSpec)> = {
  divider: {
    style: ['分割线颜色 `stroke-divider-shallow` 或 `stroke-divider-deep`（module 场景）。'],
    layout: ['线高 1px；水平 inset 由宿主传入（本组件不自带页边距）。'],
  },
  'avatar-body': {
    style: ['头像槽底 `material-card-shallow`；占位字 `typography-body-medium` · `text-base-primary`。'],
    layout: ['尺寸档 `symbol-*` / 头像 circle；与列表行对齐由宿主 `spacing` 决定。'],
  },
  'toggle-switch': {
    style: [
      '轨 off `material-card-deep` · on `material-brand`（禁用 on 轨 `status-disable-brand`）。',
      '拇指 Android `material-same-white`；iOS 系统拇指随 `UISwitch`。',
    ],
    layout: [
      '轨宽 `scale-8` / `scale-11` / `scale-13`（sm / md / lg）· 轨高 `switch-sm|md|lg`。',
      '轨内边距 `spacing-05`；拇指宽 `scale-4` / `scale-5-5` / `scale-7` · 高等于轨内高（胶囊）。',
      '默认尺寸 `lg`。',
    ],
    motion: ['RN：拇指横向 Reanimated spring（轨内 translate）。', 'iOS 26+ 系统 `UISwitch` 切换动画。'],
    platform: [
      'iOS 26+：`EgSwitchNative` 系统固有尺寸（不缩放）；尺寸档见 `EgSwitchRn`。',
      'Android · iOS ≤25：`EgSwitchRn` token 轨 52/44/32×24/20/16。',
    ],
  },
  'toggle-checkbox': {
    style: [
      '方壳描边未选 `stroke-toggle`；选中底/描边 `material-brand`。',
      '勾标 `oval-tick-mini` · 色 `material-same-white`。',
    ],
    layout: ['壳边长 `toggle-mark-sm|md|lg`；勾标固定 20px（`scale-5`）。默认 `md`。'],
    motion: ['勾与选中叠层 `motion-fade`（`getEgNavBarChromeFade` · ~180ms ease-in-out）。'],
  },
  'toggle-radio': {
    style: [
      '外圈未选 `stroke-toggle`；选中描边/内点 `material-brand`。',
      '内点填充 `material-same-white`。',
    ],
    layout: ['外径 `toggle-mark-sm|md|lg`；内点直径随档缩小。默认 `md`。'],
    motion: ['内点显隐 `motion-fade`（同 Checkbox fade recipe）。'],
  },
  'toggle-decide': {
    style: [
      '方壳同 Checkbox 描边语义；否决态可用语义色档（按 props）。',
      '勾标 `oval-tick-mini`。',
    ],
    layout: ['壳边长 `toggle-mark-sm|md|lg`；未决不绘制默认横线。默认 `md`。'],
    motion: ['选中/否决勾 `motion-fade`。'],
  },
  'tab-segmented-control': {
    style: [
      '段未选 `text-base-secondary` · 选中 `text-face-primary`。',
      '指示器底 `material-brand` / 胶囊底 `material-card-shallow`。',
    ],
    layout: ['段内边距 `spacing-1` · 外框 `radius-full`；项间 `spacing-1`。'],
    motion: ['选中指示 `EdsSemanticAnima(\'layout-content\')` 横移。'],
  },
  'tab-tabs': {
    style: ['标签未选 `text-base-secondary` · 选中 `text-face-primary` · `typography-body-medium`。'],
    layout: ['下划线/间距 `spacing-4`；与正文区顶距 `spacing-4`。'],
    motion: ['切换 `EdsSemanticAnima(\'layout-content\')`。'],
  },
  'feedback-reddot': {
    style: ['点色 `text-semantic-danger` / 品牌强调底（档内 token）。'],
    layout: ['直径 `scale-2` 档；相对宿主图标/文案角标定位（`position` 由父级）。'],
  },
  'feedback-message': {
    style: [
      '字 `typography-footnote-strong`；色调 material-brand / decor / status-danger / material-card-deep。',
    ],
    layout: ['最小宽 18px；内边距 `spacing-025` × `spacing-1-5`；胶囊 `radius-full`；高度随内容。'],
  },
  'tag-color': {
    style: ['色块底 semantic 彩色 · 字 `typography-body-small-heavy` · `text-base-primary`。'],
    layout: ['水平内边距 `spacing-2` · `spacing-3`；胶囊 `radius-full`。'],
  },
  'tag-system': {
    style: ['浅底 `material-card-shallow` · 字 `typography-body-small-heavy` · 状态色 `text-semantic-*`。'],
    layout: ['水平内边距 `spacing-2` · `spacing-3`；胶囊 `radius-full`。'],
  },
  'button-glass': {
    style: [
      '液态玻璃 preset（`liquid-glass/surface` tint · 高光 · 描边）。',
      '文案 `typography-body-medium` · `text-base-primary`。',
    ],
    layout: ['高度 `button-*` 档；内容水平 `spacing-4`；圆角 `radius-full`。'],
    motion: ['按压 `EdsSemanticAnima(\'press\')` · recipe `glass-press` / `glass-shimmer`。'],
    platform: ['iOS 26+ `EgGlassCapsuleNative`；其余 `EgGlassCapsuleRn` + expo-blur。'],
  },
  'input-input': {
    style: [
      '输入字 `typography-body-medium` · `text-base-primary`。',
      '占位 `text-base-tertiary` · 描边 `stroke-input` · focus `event-focus-brand`。',
    ],
    layout: ['高度 `input-md` 等档；水平内边距 `spacing-4` · `spacing-5`。'],
    motion: ['focus / blur 走 `event-focus` token（无整页 semantic）。'],
  },
  'input-search': {
    style: [
      '搜索框底 `material-card-shallow` · 字 `typography-body-medium`。',
      '占位 `text-base-tertiary` · 搜索图标槽 `symbol-sm`。',
    ],
    layout: ['高度 `input-md`；左右 `spacing-4`；圆角 `radius-lg` + smoothRadius。'],
  },
  'input-textarea': {
    style: ['多行字 `typography-body-medium` · 描边/占位同 Input 族。'],
    layout: ['最小高度 `input-*` 高档；内边距 `spacing-4` · 顶底 `spacing-3`。'],
  },
};

function buttonSceneSelf(slug: string, exportName: string): ComponentSelfAnnotationSpec {
  const base: ComponentSelfAnnotationSpec = {
    style: [],
    layout: ['高度 `button-xl` … `button-xs`；水平内边距 `spacing-5` 起。'],
    motion: ['按压 `EdsSemanticAnima(\'press\')`。'],
  };

  switch (slug) {
    case 'button-brand':
      return {
        ...base,
        style: [
          `${exportName} 底 material-brand · 字 typography-body-medium-heavy · on-brand 色票。`,
        ],
      };
    case 'button-danger':
      return {
        ...base,
        style: [`${exportName} 底语义 danger · 字 typography-body-medium-heavy。`],
      };
    case 'button-decor':
      return {
        ...base,
        style: [`${exportName} 浅底 material-card-shallow · 字 text-base-primary。`],
        motion: undefined,
      };
    case 'button-link':
      return {
        style: [`${exportName} 字 typography-body-medium · text-brand · 无底。`],
        layout: ['行内宽度随文案；最小点按区域 `spacing-4`。'],
        motion: ['按压 `EdsSemanticAnima(\'press\')`。'],
      };
    case 'button-option':
      return {
        style: [`${exportName} 描边/底随选中档 · 字 typography-body-medium。`],
        layout: ['高度 `button-md`；左右 `spacing-4`。'],
        motion: ['选中态 `EdsSemanticAnima(\'press\')`。'],
      };
    case 'button-combo-action':
    case 'button-combo-action-alt':
      return {
        style: [`${exportName} 主/次按钮组合色票同 Brand/Decor 档。`],
        layout: ['并排间距 `spacing-3`；各子钮独立 `button-*` 高。'],
      };
    case 'button-icon-container':
      return {
        style: [
          `${exportName} 色调：品牌/装饰/危险底 + stroke-same-white；浅 material-card-deep + stroke-base-primary；无背景 material-hide + stroke-base-primary · 点按 event-tap。`,
        ],
        layout: ['圆形容器 scale-14…7；图标 symbol-md/sm/xs；点按 motion-scale-press-down-lg。'],
      };
    default:
      return {
        style: [`${exportName} 色/字走 Button 族 semantic token。`],
        layout: base.layout,
        motion: base.motion,
      };
  }
}

function tabBarSceneSelf(slug: string, exportName: string): ComponentSelfAnnotationSpec {
  if (slug === 'tab-bar-glass-bg') {
    return {
      style: ['栏底玻璃 preset · `glass-mask-box` / blur 强度 token。'],
      layout: ['宽同屏；高含 safe area · 由 `tab-bar-*` token 定义。'],
    };
  }
  if (slug === 'tab-bar-item' || slug === 'tab-bar-text') {
    return {
      style: [`${exportName} 文案 typography-body-small / small-heavy · 选中 text-face-primary。`],
      layout: ['项水平 `spacing-4` · 图标槽 `symbol-sm`（若有）。'],
      motion: ['点按 `EdsSemanticAnima(\'press\')`；选中指示 spring。'],
    };
  }
  return {
    style: [`${exportName} 项字色/选中态 token。`],
    layout: ['栏高 token · 项均分或横滚由场景 preset 决定。'],
    motion: ['点按 `EdsSemanticAnima(\'press\')`。'],
    platform: slug === 'tab-bar-cregis'
      ? ['场景 preset 锁定 Cregis Tab 项间距与角标。']
      : undefined,
  };
}

function inputSceneSelf(slug: string, exportName: string): ComponentSelfAnnotationSpec {
  if (slug in SELF_BY_SLUG) {
    const spec = SELF_BY_SLUG[slug];
    return typeof spec === 'function' ? spec(exportName) : spec;
  }
  return {
    style: [`${exportName} 字 typography-body-medium · 描边/占位同 Input 族。`],
    layout: ['高度 `input-*` 档；内边距 `spacing-4` · `spacing-5`。'],
    motion: ['focus `event-focus` token。'],
  };
}

/** slug / export 模式 → 仅描述当前组件本体的注释条。 */
export function resolveSelfAnnotation(
  entry: Pick<ShowcaseCatalogEntry, 'slug' | 'exportName' | 'family'>,
): ComponentSelfAnnotationSpec | undefined {
  const { slug, exportName } = entry;

  const exact = SELF_BY_SLUG[slug];
  if (exact) {
    return typeof exact === 'function' ? exact(exportName) : exact;
  }

  if (slug.startsWith('icon-')) {
    return iconAssetSelf(exportName);
  }
  if (slug.startsWith('crypto-')) {
    return cryptoAssetSelf(exportName);
  }
  if (slug.startsWith('button-')) {
    return buttonSceneSelf(slug, exportName);
  }
  if (slug.startsWith('input-')) {
    return inputSceneSelf(slug, exportName);
  }
  if (slug.startsWith('tag-')) {
    const alt = slug.endsWith('-alt');
    return slug.includes('system')
      ? {
          style: [
            `${exportName} 浅底 material-card-shallow · 状态字色 text-semantic-*${alt ? '（Alt 场景）' : ''}。`,
          ],
          layout: ['内边距 `spacing-2` · `spacing-3` · 胶囊 `radius-full`。'],
        }
      : {
          style: [`${exportName} 色块 semantic · 字 typography-body-small-heavy${alt ? '（Alt）' : ''}。`],
          layout: ['内边距 `spacing-2` · `spacing-3` · 胶囊 `radius-full`。'],
        };
  }
  if (slug.startsWith('tab-bar-')) {
    return tabBarSceneSelf(slug, exportName);
  }
  if (slug.startsWith('avatar-preset-')) {
    return {
      style: [`${exportName} 预设图/底色 token。`],
      layout: ['圆形裁剪 `radius-full` · 边长 `symbol-lg` 档。'],
    };
  }

  return undefined;
}

export function scaffoldAnnotation(exportName: string): ComponentSelfAnnotationSpec {
  return scaffoldSelf(exportName);
}