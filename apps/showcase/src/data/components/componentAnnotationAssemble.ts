import type {
  ShowcaseComponentAnnotationDoc,
  ShowcaseComponentAnnotationSection,
} from './componentAnnotationTypes';

/** 单组件「注释」契约 — 样式 / 布局 / 动效仅写本组件；平台与其它分栏承载。 */
export type ComponentSelfAnnotationSpec = {
  style: string[];
  layout: string[];
  motion?: string[];
  platform?: string[];
  other?: string[];
};

const SCAFFOLD_OTHER = [
  'Figma 对齐脚手架（generator）',
  '真实现后以 packages/components 为准，可在 `componentAnnotationRegistry` 按 slug 细化',
];

const IMPLEMENTED_OTHER = [
  'Customize / Inspect 与 Live 使用同一组 props',
  '实现见 packages/components 对应目录',
];

export function assembleComponentAnnotationDoc(
  spec: ComponentSelfAnnotationSpec,
  implemented: boolean,
): ShowcaseComponentAnnotationDoc {
  const sections: ShowcaseComponentAnnotationSection[] = [
    { title: '样式', lines: spec.style.filter((line) => line.trim().length > 0) },
    { title: '布局', lines: spec.layout.filter((line) => line.trim().length > 0) },
  ];

  if (spec.motion && spec.motion.length > 0) {
    sections.push({ title: '动效', lines: spec.motion });
  }

  if (spec.platform && spec.platform.length > 0) {
    sections.push({ title: '多系统差异', lines: spec.platform });
  }

  sections.push({
    title: '其他',
    lines:
      spec.other ??
      (implemented ? IMPLEMENTED_OTHER : SCAFFOLD_OTHER),
  });

  return { sections };
}