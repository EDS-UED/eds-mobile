import type { DocCustomizeControl } from '@/data/components/types';

export type SceneAnimationTone = 'brand' | 'success' | 'warning';

export type SceneAnimationCustomizeState = {
  active: boolean;
  tone: SceneAnimationTone;
};

export function defaultSceneAnimationCustomizeState(): SceneAnimationCustomizeState {
  return { active: true, tone: 'brand' };
}

export function sceneAnimationCustomizeControls(
  slug: string,
): DocCustomizeControl[] {
  const controls: DocCustomizeControl[] = [
    {
      kind: 'boolean',
      key: 'active',
      label: '播放',
    },
    {
      kind: 'select',
      key: 'tone',
      label: '色调',
      options: [
        { value: 'brand', label: '品牌' },
        { value: 'success', label: '成功' },
        { value: 'warning', label: '进行中' },
      ],
    },
  ];

  if (slug === 'business-success') {
    return controls.filter((control) => control.key !== 'active');
  }
  if (slug === 'mnemonic-verification') {
    return controls.map((control) =>
      control.key === 'tone'
        ? {
            ...control,
            options: [
              { value: 'brand', label: '品牌' },
              { value: 'success', label: '成功' },
            ],
          }
        : control,
    );
  }
  if (slug === 'odometer') {
    return [{ kind: 'boolean', key: 'active', label: '播放' }];
  }
  if (slug === 'business-processing') {
    return controls.map((control) =>
      control.key === 'tone'
        ? {
            ...control,
            options: [
              { value: 'warning', label: '进行中' },
              { value: 'brand', label: '品牌' },
            ],
          }
        : control,
    );
  }
  if (slug === 'ripple-pulse') {
    return controls.map((control) =>
      control.key === 'tone'
        ? {
            ...control,
            options: [
              { value: 'brand', label: '品牌' },
              { value: 'success', label: '成功' },
            ],
          }
        : control,
    );
  }

  return controls;
}
