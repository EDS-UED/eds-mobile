import type { ShowcaseI18nPartialText } from './types';
import { defineComponentName, defineShowcaseI18nText } from './showcaseI18nText';

type ShowcaseI18nOverride =
  | ShowcaseI18nPartialText
  | { name: ShowcaseI18nPartialText; description?: ShowcaseI18nPartialText };

/** 按注册键覆盖 name / description（未列出的条目从 catalog 英文自动补全简繁）。 */
export const showcaseI18nOverrides: Record<string, ShowcaseI18nOverride> = {
  'nav:tokens': defineShowcaseI18nText('Tokens', '设计令牌', '設計令牌'),
  'nav:animations': defineShowcaseI18nText('Animations', '动画', '動畫'),
  'nav:components': defineShowcaseI18nText('Components', '组件', '組件'),
  'nav:patterns': defineShowcaseI18nText('Patterns', '模式', '模式'),
  'nav:workflows': defineShowcaseI18nText('Workflows', '工作流', '工作流'),

  'shell:theme-dark': defineShowcaseI18nText('Dark', '深色', '深色'),
  'shell:theme-light': defineShowcaseI18nText('Light', '浅色', '淺色'),
  'shell:language': defineShowcaseI18nText('Language', '语言', '語言'),

  'components:section:atoms': defineShowcaseI18nText('Atoms', '原子', '原子'),
  'components:section:molecules': defineShowcaseI18nText('Molecules', '分子', '分子'),
  'components:section:organisms': defineShowcaseI18nText('Organisms', '有机体', '有機體'),
  'components:section:templates': defineShowcaseI18nText('Templates', '模板', '範本'),

  'components:group:navigation': defineShowcaseI18nText('Navigation', '导航', '導航'),
  'components:group:data': defineShowcaseI18nText('Data', '数据表', '資料表'),
  'components:group:verify': defineShowcaseI18nText('Verify', '安全', '安全'),
  'components:group:detail': defineShowcaseI18nText('Detail', '详情', '詳情'),

  'nav:scenes': defineShowcaseI18nText('Scenes', '场景化', '場景化'),
  'nav:variants': defineShowcaseI18nText('Variants', '变体', '變體'),
  'nav:combo': defineShowcaseI18nText('Combo', '组合', '組合'),
  'nav:trigger': defineShowcaseI18nText('Trigger', '触发器', '觸發器'),
  'nav:box': defineShowcaseI18nText('Box', '面板', '面板'),
  'nav:slot': defineShowcaseI18nText('Slot', '插槽', '插槽'),

  'sidebar:输入': defineShowcaseI18nText('Input', '输入', '輸入'),
  'sidebar:输出': defineShowcaseI18nText('Output', '输出', '輸出'),
  'sidebar:切换': defineShowcaseI18nText('Switching', '切换', '切換'),
  'sidebar:浮层': defineShowcaseI18nText('Overlays', '浮层', '浮層'),
  'sidebar:反馈': defineShowcaseI18nText('Feedback', '反馈', '回饋'),
  'sidebar:触发': defineShowcaseI18nText('Trigger', '触发', '觸發'),
  'sidebar:标记': defineShowcaseI18nText('Tags', '标记', '標記'),
  'sidebar:浮层提示': defineShowcaseI18nText('Overlays', '浮层提示', '浮層提示'),
  'sidebar:通知': defineShowcaseI18nText('Notifications', '通知', '通知'),
  'sidebar:状态反馈': defineShowcaseI18nText('Status feedback', '状态反馈', '狀態回饋'),

  'components:family:icons': {
    name: defineComponentName('Icons', '图标'),
    description: defineShowcaseI18nText(
      'SVG icon set for Desktop applications.',
      'Desktop 应用 SVG 图标集。',
      'Desktop 應用 SVG 圖標集。',
    ),
  },
  'components:family:crypto': {
    name: defineComponentName('Crypto', '加密货币'),
    description: defineShowcaseI18nText(
      'Cryptocurrency icons and asset marks.',
      '加密货币图标与资产标识。',
      '加密貨幣圖標與資產標識。',
    ),
  },
  'components:family:avatar': {
    name: defineComponentName('Avatar', '头像'),
    description: defineShowcaseI18nText(
      'User avatar with initials or robot fallback.',
      '用户头像，支持首字母或机器人占位。',
      '使用者頭像，支援首字母或機器人佔位。',
    ),
  },
  'components:family:divider': {
    name: defineComponentName('Divider', '分割线'),
    description: defineShowcaseI18nText(
      'Horizontal and vertical content dividers.',
      '水平与垂直内容分割线。',
      '水平與垂直內容分割線。',
    ),
  },
  'components:family:input': {
    name: defineComponentName('Input', '输入框'),
    description: defineShowcaseI18nText(
      'Text and amount input with clear, unit, and Max actions.',
      '文本与金额输入框，支持清空、单位与 Max 操作。',
      '文字與金額輸入框，支援清空、單位與 Max 操作。',
    ),
  },
  'components:family:textarea': {
    name: defineComponentName('Textarea', '多行输入'),
    description: defineShowcaseI18nText(
      'Multiline text input with paste and clear.',
      '多行文本输入，支持粘贴与清空。',
      '多行文字輸入，支援貼上與清空。',
    ),
  },
  'components:family:button': {
    name: defineComponentName('Button', '按钮'),
    description: defineShowcaseI18nText(
      'Label, icon, link, and pagination button variants.',
      '文本、图标、链接与分页按钮变体。',
      '文字、圖標、連結與分頁按鈕變體。',
    ),
  },
  'components:family:tooltip': {
    name: defineComponentName('Tooltip', '工具提示'),
    description: defineShowcaseI18nText(
      'Frosted floating panel; adaptive or fixed width.',
      '点击打开的磨砂浮层面板；支持自适应/固定宽度。',
      '點擊打開的磨砂浮層面板；支援自適應/固定寬度。',
    ),
  },
  'components:family:popover': {
    name: defineComponentName('Popover', '弹出层'),
    description: defineShowcaseI18nText(
      'Anchored overlays for menus and lightweight panels.',
      '锚定菜单与轻量面板的浮层。',
      '錨定選單與輕量面板的浮層。',
    ),
  },
  'components:family:flotation': {
    name: defineComponentName('Flotation', '浮层下拉'),
    description: defineShowcaseI18nText(
      'Floating dropdown with Trigger / Box / Combo slots.',
      '浮层下拉：Trigger / Box / Combo 插槽组合。',
      '浮層下拉：Trigger / Box / Combo 插槽組合。',
    ),
  },
  'components:family:tag': {
    name: defineComponentName('Tag', '标签'),
    description: defineShowcaseI18nText(
      'Compact labels for status and metadata.',
      '状态与元数据的紧凑标签。',
      '狀態與中繼資料的緊湊標籤。',
    ),
  },
  'components:family:checkbox': defineComponentName('Checkbox', '复选框'),
  'components:family:radio': defineComponentName('Radio', '单选框'),
  'components:family:switch': defineComponentName('Switch', '开关'),
  'components:family:decide': defineComponentName('Decide', '决定控件'),
  'components:family:tab': defineComponentName('Tab', '标签页'),
  'components:family:segmented': defineComponentName('Segmented', '分段控件'),
  'components:family:toast': defineComponentName('Toast', '轻提示'),
  'components:family:message': defineComponentName('Message', '消息条'),
  'components:family:reddot': defineComponentName('Reddot', '红点'),
  'components:family:end-feedback-card': defineComponentName('EndFeedbackCard', '结束反馈卡'),
  'components:family:form-submission': defineComponentName('FormSubmission', '表单提交反馈'),
  'components:family:streamer': defineComponentName('Streamer', '流式状态'),
  'components:family:dialog': defineComponentName('Dialog', '对话框'),
  'components:family:countdown': defineComponentName('Countdown', '倒计时'),
  'components:family:progress': defineComponentName('Progress', '进度条'),
  'components:family:loading': defineComponentName('Loading', '加载'),
  'components:family:upload': defineComponentName('Upload', '上传'),
  'components:family:nav-bar': defineComponentName('NavBar', '导航栏'),
  'components:family:module-menu': defineComponentName('ModuleMenu', '模块菜单'),
  'components:family:tool-bar': defineComponentName('ToolBar', '工具栏'),
  'components:family:batch-bar': defineComponentName('BatchBar', '批处理栏'),
  'components:family:data-grid': defineComponentName('DataGrid', '数据表格'),
  'components:family:data-list': defineComponentName('DataList', '数据列表'),
  'components:family:pagination': defineComponentName('Pagination', '分页器'),
  'components:family:filter': defineComponentName('Filter', '筛选器'),
  'components:family:verify-email': defineComponentName('Email', '邮箱验证'),
  'components:family:verify-google': defineComponentName('Google', 'Google 验证'),
  'components:family:verify-login-password': defineComponentName('LoginPassword', '登录密码'),
  'components:family:verify-transaction-password': defineComponentName('TransactionPassword', '交易密码'),
  'components:family:verify-passkey': defineComponentName('PassKey', '通行密钥'),
  'components:family:verify-locked': defineComponentName('Locked', '账户锁定'),
  'components:family:detail': defineComponentName('Detail', '详情页'),
  'components:family:container': defineComponentName('Container', '容器'),
  'components:family:layout': defineComponentName('Layout', '布局'),
  'components:family:popup': defineComponentName('Popup', '弹窗'),
  'components:family:skid': defineComponentName('Skid', '滑层'),

  'animations:section:animations': defineShowcaseI18nText('Animations', '动画', '動畫'),
  'animations:family:verification-ring-dots': defineComponentName('VerificationRingDots', '验证环点阵'),
  'animations:family:business-success': defineComponentName('BusinessSuccess', '业务成功'),
  'animations:family:business-processing': defineComponentName('BusinessProcessing', '业务处理中'),
  'animations:family:ripple-pulse': defineComponentName('RipplePulse', '波纹脉冲'),
  'animations:family:mnemonic-verification': defineComponentName('MnemonicVerification', '助记词校验'),

  'patterns:section:data': defineShowcaseI18nText('Data', '数据', '資料'),
  'patterns:section:forms': defineShowcaseI18nText('Forms', '表单', '表單'),
  'patterns:section:dashboard': defineShowcaseI18nText('Dashboard', '仪表板', '儀表板'),
  'patterns:section:search': defineShowcaseI18nText('Search', '搜索', '搜尋'),
  'patterns:section:consistency': defineShowcaseI18nText('Consistency', '一致性', '一致性'),
};
