export type MobileGestureRow = {
  id: string;
  /** 中文名 */
  label: string;
  en: string;
  direction: string;
  usage: string;
};

/** Mobile 基础交互手势 — 与 RN / 系统手势命名对照。 */
export const MOBILE_GESTURE_ROWS: MobileGestureRow[] = [
  { id: 'tap', label: '点击 / 轻触', en: 'Tap', direction: '无方向', usage: '按钮、链接、选中' },
  { id: 'double-tap', label: '双击', en: 'Double Tap', direction: '无方向', usage: '双击缩放、点赞' },
  { id: 'long-press', label: '长按', en: 'Long Press', direction: '无方向', usage: '菜单、预览、拖拽排序、删除确认' },
  {
    id: 'drag',
    label: '拖动',
    en: 'Drag',
    direction: '任意方向，常受控件限制为上下 / 左右 / 二维',
    usage: '拖动列表项、滑块、地图',
  },
  { id: 'pan', label: '平移', en: 'Pan', direction: '二维任意方向', usage: '地图移动、画布移动' },
  {
    id: 'swipe',
    label: '轻扫 / 滑动',
    en: 'Swipe',
    direction: '任意方向，常见左右、上下；通常识别主轴',
    usage: '左右滑切换、滑动删除、返回',
  },
  {
    id: 'fling',
    label: '快速滑动',
    en: 'Fling',
    direction: '任意方向，常见上下 / 左右；带速度与惯性',
    usage: '快速滚动、惯性滑动',
  },
  { id: 'pinch', label: '捏合', en: 'Pinch', direction: '双指相向、距离缩小', usage: '双指缩小' },
  { id: 'spread', label: '张开', en: 'Spread', direction: '双指相背、距离增大', usage: '双指放大' },
  { id: 'rotate', label: '旋转', en: 'Rotate', direction: '双指绕中心顺时针 / 逆时针', usage: '图片旋转、地图旋转' },
  { id: 'two-finger-tap', label: '双指点击', en: 'Two-finger Tap', direction: '无方向', usage: '辅助功能、快捷操作' },
  {
    id: 'three-finger-swipe',
    label: '三指滑动',
    en: 'Three-finger Swipe',
    direction: '可上 / 下 / 左 / 右，具体由系统或应用定义',
    usage: '系统快捷、撤销等',
  },
  {
    id: 'force-touch',
    label: '压感操作',
    en: 'Force Touch / 3D Touch',
    direction: '无方向，按压力度分层',
    usage: '预览、快捷菜单，部分设备支持',
  },
  {
    id: 'gesture-path',
    label: '画手势',
    en: 'Gesture Path',
    direction: '自定义路径与方向顺序',
    usage: '手势密码、快捷启动',
  },
];