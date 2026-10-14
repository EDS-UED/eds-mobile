export type WorkflowEntry = {
  id: string;
  label: string;
  lead: string;
  packagePath: string;
  devRoute?: 'Parity';
  status: 'planned' | 'dev';
};

/** 业务流 — 对应 packages/workflows，跨页流程真封装。 */
export const workflowEntries: WorkflowEntry[] = [
  {
    id: 'auth',
    label: 'Auth 登录注册',
    lead: '验证码、生物识别、会话恢复',
    packagePath: 'packages/workflows/src',
    status: 'planned',
  },
  {
    id: 'verification',
    label: 'Verification 核验',
    lead: 'KYC、二次确认、风控提示',
    packagePath: 'packages/workflows/src',
    status: 'planned',
  },
  {
    id: 'transaction',
    label: 'Transaction 交易',
    lead: '发起、确认、结果页',
    packagePath: 'packages/workflows/src',
    status: 'planned',
  },
  {
    id: 'parity',
    label: 'Layout Parity Probe',
    lead: '开发对照 · native layout 采集',
    packagePath: 'packages/components/src/preview/ParityHarness.tsx',
    devRoute: 'Parity',
    status: 'dev',
  },
];
