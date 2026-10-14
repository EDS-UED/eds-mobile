export type PatternEntry = {
  id: string;
  label: string;
  lead: string;
  packagePath: string;
  status: 'planned' | 'preview';
};

/** 数据 / 页面模式 — 对应 packages/patterns，按场景目录扩展。 */
export const patternEntries: PatternEntry[] = [
  {
    id: 'list-field',
    label: 'List · Field 列表字段',
    lead: '表单列表、只读字段、分组标题',
    packagePath: 'packages/patterns/src',
    status: 'planned',
  },
  {
    id: 'form-flow',
    label: 'Form Flow 表单流',
    lead: '多步输入、校验、提交反馈',
    packagePath: 'packages/patterns/src',
    status: 'planned',
  },
  {
    id: 'dashboard',
    label: 'Dashboard 概览',
    lead: '指标卡、趋势、快捷入口',
    packagePath: 'packages/patterns/src',
    status: 'planned',
  },
];
