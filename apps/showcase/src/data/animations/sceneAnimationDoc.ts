import type { DocPropRow } from '@/data/components/types';

import type { SceneAnimationSlug } from './sceneAnimationCatalog';

export type SceneAnimationDoc = {
  importSnippet: string;
  usageSnippet: string;
  propRows: DocPropRow[];
};

const SHARED_VIEW_PROPS: DocPropRow[] = [
  {
    name: 'style',
    type: 'StyleProp<ViewStyle>',
    defaultValue: '—',
    description: '容器样式。',
  },
  {
    name: 'testID',
    type: 'string',
    defaultValue: 'eg-*',
    description: '测试标识。',
  },
];

const SCENE_ANIMATION_DOC: Record<SceneAnimationSlug, SceneAnimationDoc> = {
  'verification-ring-dots': {
    importSnippet: "import { EgVerifyRingDots } from '@eds/mobile-animations';",
    usageSnippet: `<EgVerifyRingDots active ringSize={74} color={brandPrimary} idleColor={brandTertiary} />`,
    propRows: [
      {
        name: 'active',
        type: 'boolean',
        defaultValue: 'false',
        description:
          '为 true 时 36 点追光（primary）；false 时静止（tertiary · opacity 0.48）。',
      },
      {
        name: 'ringSize',
        type: 'number',
        defaultValue: '74',
        description: '外环直径（px）。',
      },
      {
        name: 'color',
        type: 'string',
        defaultValue: 'material-brand',
        description: '追光激活色 · Desktop `--material-brand-primary`。',
      },
      {
        name: 'idleColor',
        type: 'string',
        defaultValue: 'color',
        description: '静止态点色 · Desktop `--material-brand-tertiary`。',
      },
      ...SHARED_VIEW_PROPS,
    ],
  },
  'business-success': {
    importSnippet: "import { EgDoneTick } from '@eds/mobile-animations';",
    usageSnippet: `<EgDoneTick color={successColor} />`,
    propRows: [
      {
        name: 'color',
        type: 'string',
        defaultValue: 'status-success',
        description: '勾号描边色 · Desktop `--done-tick-color`。',
      },
      {
        name: 'delayMs',
        type: 'number',
        defaultValue: '0',
        description: '描边动画延迟（ms）· Desktop `--done-tick-delay`。',
      },
      {
        name: 'size',
        type: 'number',
        defaultValue: '30',
        description: '渲染边长（px）。',
      },
      ...SHARED_VIEW_PROPS,
    ],
  },
  'business-processing': {
    importSnippet: "import { EgMotionProcessing } from '@eds/mobile-animations';",
    usageSnippet: `<EgMotionProcessing active size={26} color={warningColor} />`,
    propRows: [
      {
        name: 'active',
        type: 'boolean',
        defaultValue: 'true',
        description: '为 true 时长轴 1.2s / 短轴 20s 匀速旋转（短轴 +45°）；false 静止。',
      },
      {
        name: 'size',
        type: 'number',
        defaultValue: '26',
        description: '图形边长（px）· Desktop `--motion-processing-size`。',
      },
      {
        name: 'stroke',
        type: 'number',
        defaultValue: '2',
        description: '指针线宽（px）· 不随 size 缩放。',
      },
      {
        name: 'color',
        type: 'string',
        defaultValue: 'status-warning',
        description: '指针与中心点颜色 · `--motion-processing-color`。',
      },
      ...SHARED_VIEW_PROPS,
    ],
  },
  'ripple-pulse': {
    importSnippet: "import { EgRipplePulse } from '@eds/mobile-animations';",
    usageSnippet: `<EgRipplePulse active size={80} color={brandColor} />`,
    propRows: [
      {
        name: 'active',
        type: 'boolean',
        defaultValue: 'true',
        description: '为 true 时三环 ripple（1.5s ease-out · stagger 500ms · scale 0.1→1.2）。',
      },
      {
        name: 'size',
        type: 'number',
        defaultValue: '80',
        description: '容器边长（px）· `--ripple-pulse-size`。',
      },
      {
        name: 'stroke',
        type: 'number',
        defaultValue: '0.5',
        description: '环描边宽度（px）· `--ripple-pulse-stroke`。',
      },
      {
        name: 'color',
        type: 'string',
        defaultValue: 'material-brand',
        description: '描边颜色 · `--ripple-pulse-color`。',
      },
      ...SHARED_VIEW_PROPS,
    ],
  },
  odometer: {
    importSnippet: "import { EgOdometer } from '@eds/mobile-animations';",
    usageSnippet: `<EgOdometer\n  value="$ 8,000.23"\n  animateIntro\n  textStyle={displayAmountTextStyle}\n/>`,
    propRows: [
      {
        name: 'value',
        type: 'number | string',
        defaultValue: '0',
        description: '显示值；字符串可带格式，仅数字参与首次 intro 滚动。',
      },
      {
        name: 'animateIntro',
        type: 'boolean',
        defaultValue: 'true',
        description: '首次挂载每位滚一整圈回到真值；之后 value 变更不再动画。',
      },
      {
        name: 'textStyle',
        type: 'StyleProp<TextStyle>',
        defaultValue: '—',
        description:
          '业务 Text 样式（字号 · 行高 · 字体 · 颜色）；组件只提供滚动感，不自建 typography / color。',
      },
      ...SHARED_VIEW_PROPS,
    ],
  },
  'mnemonic-verification': {
    importSnippet: "import { EgMnemonicVerify } from '@eds/mobile-animations';",
    usageSnippet: `<EgMnemonicVerify active size={32} color={brandColor} />`,
    propRows: [
      {
        name: 'active',
        type: 'boolean',
        defaultValue: 'true',
        description: '为 true 时 4×4 沿对角线 scale 0→1→0（1533ms · stagger 100ms）。',
      },
      {
        name: 'size',
        type: 'number',
        defaultValue: '32',
        description: '画布边长（px，含 spacing-1 内边距）· `--mnemonic-verify-size`。',
      },
      {
        name: 'color',
        type: 'string',
        defaultValue: 'material-brand',
        description: '方块颜色 · `--mnemonic-verify-color`。',
      },
      ...SHARED_VIEW_PROPS,
    ],
  },
};

export function sceneAnimationDoc(slug: SceneAnimationSlug): SceneAnimationDoc {
  return SCENE_ANIMATION_DOC[slug];
}

export const SCENE_ANIMATION_BARREL_IMPORT =
  "import {\n  EgVerifyRingDots,\n  EgDoneTick,\n  EgMotionProcessing,\n  EgRipplePulse,\n  EgOdometer,\n  EgMnemonicVerify,\n} from '@eds/mobile-animations';";