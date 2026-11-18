export type ShowcaseComponentAnnotationSection = {
  title: string;
  lines: string[];
};

/**
 * 详情页「注释」分栏契约：
 * - **样式**：仅当前组件可见的色/字/描边/材质（不写 Showcase 卡片、不写宿主页）。
 * - **布局**：仅当前组件盒模型与内外边距/尺寸档（不写父级列表/页面边距，除非 prop 属于本组件）。
 * - **动效**：仅本组件使用的 motion semantic / recipe（不写 Navigator、不写兄弟组件）。
 * - **多系统差异** / **其他**：平台分流、组合方式、文档指针。
 */
export type ShowcaseComponentAnnotationDoc = {
  sections: ShowcaseComponentAnnotationSection[];
};