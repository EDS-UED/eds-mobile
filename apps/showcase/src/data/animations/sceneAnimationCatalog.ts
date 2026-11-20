export type SceneAnimationSlug =
  | 'verification-ring-dots'
  | 'business-success'
  | 'business-processing'
  | 'ripple-pulse'
  | 'odometer'
  | 'mnemonic-verification';

export type SceneAnimationEntry = {
  slug: SceneAnimationSlug;
  name: string;
  lead: string;
  importName:
    | 'EgVerifyRingDots'
    | 'EgDoneTick'
    | 'EgMotionProcessing'
    | 'EgRipplePulse'
    | 'EgOdometer'
    | 'EgMnemonicVerify';
};

export const sceneAnimationCatalog: SceneAnimationEntry[] = [
  {
    slug: 'verification-ring-dots',
    name: 'EgVerifyRingDots',
    lead: '验证外圈点阵 · 36 点追光',
    importName: 'EgVerifyRingDots',
  },
  {
    slug: 'business-success',
    name: 'EgDoneTick',
    lead: '业务成功 · SVG 描边勾选',
    importName: 'EgDoneTick',
  },
  {
    slug: 'business-processing',
    name: 'EgMotionProcessing',
    lead: '处理中 · 双轴指针',
    importName: 'EgMotionProcessing',
  },
  {
    slug: 'ripple-pulse',
    name: 'EgRipplePulse',
    lead: '三环波纹脉冲',
    importName: 'EgRipplePulse',
  },
  {
    slug: 'odometer',
    name: 'EgOdometer',
    lead: '数字滚轮 · Display 逐位整圈',
    importName: 'EgOdometer',
  },
  {
    slug: 'mnemonic-verification',
    name: 'EgMnemonicVerify',
    lead: '助记词校验 · 4×4 对角线缩放波',
    importName: 'EgMnemonicVerify',
  },
];

export function findSceneAnimation(slug: string): SceneAnimationEntry | undefined {
  return sceneAnimationCatalog.find((entry) => entry.slug === slug);
}