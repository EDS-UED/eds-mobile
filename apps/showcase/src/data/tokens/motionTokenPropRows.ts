import type { DocPropRow } from '@/data/components';
import type { TokenEntry } from '@/data/tokens/tokenCatalogTypes';
import {
  formatMotionBaseThemeAccessLine,
  motionBaseThemeAccess,
  motionRecipeIdForTokenEntry,
  motionSemanticScenarioIdForTokenEntry,
} from '@/data/tokens/motionNativeDisplay';

type MotionScenario = 'press' | 'slide' | 'layout-content' | 'menu' | 'sheets' | 'page' | 'page-shot';

const RECIPE_SCENARIO: Record<string, MotionScenario> = {
  press: 'press',
  'press-scale-out': 'press',
  slide: 'slide',
  drag: 'slide',
  'layout-content': 'layout-content',
  menu: 'menu',
  'menu-dismiss': 'menu',
  sheets: 'sheets',
  'sheets-detent': 'sheets',
  'sheets-dismiss': 'sheets',
  page: 'page',
  'page-back': 'page',
  'page-shot': 'page-shot',
  'page-shot-dismiss': 'page-shot',
};

const row = (name: string, type: string, defaultValue: string, description: string): DocPropRow => ({
  name,
  type,
  defaultValue,
  description,
});

/** 场景 RN 入口（`@eds/mobile-components`）的 props · 与 showcase「定制」参数一致。 */
const SCENARIO_PROPS: Record<MotionScenario, DocPropRow[]> = {
  press: [
    row('EgEdsAnimaPress', '组件', '—', '点按回弹容器，包住任意可点内容'),
    row('pressIntensity', "'xs' | 'sm' | 'md' | 'lg'", "'sm'", '点按强度：按下时缩放幅度'),
    row('pressScaleDirection', "'up' | 'down'", "'up'", '缩放方向：放大或缩小'),
    row('pressRecipe', "'tap' | 'glass'", "'tap'", '按压曲线：普通控件 / 玻璃控件'),
    row('onPress', '() => void', '—', '点击回调'),
    row('disabled', 'boolean', 'false', '禁用后不响应点按、不回弹'),
    row('children', 'ReactNode | ({ pressed }) => ReactNode', '—', '被包裹的内容，可按按下状态渲染'),
    row('style', 'StyleProp<ViewStyle> | ({ pressed }) => …', '—', '容器样式'),
  ],
  slide: [
    row('EgEdsAnimaSlide', '组件', '—', '滑选条：滑块在分段间弹簧滑动'),
    row('items', '{ id: string; label: string }[]', '—', '分段列表'),
    row('selectedId', 'string', '—', '当前选中分段（受控）'),
    row('onSelect', '(id: string) => void', '—', '滑块落位到新分段后回调'),
    row('pressScale', 'boolean', 'true', '点按缩放：按下时整条轻微缩放'),
    row('followDrag', 'boolean', 'true', '胶囊跟手：拖动时滑块跟随手指'),
    row('mode', "'light' | 'dark'", '—', '主题模式'),
    row('disabled', 'boolean', 'false', '禁用交互'),
    row('haptic', 'boolean', 'true', '切换时触感反馈'),
  ],
  'layout-content': [
    row('EgEdsAnimaLayoutContent', '组件', '—', '同一容器内切换正文时淡出淡入 + 轻微位移'),
    row('contentKey', 'string', '—', '内容标识，变化即播放切换动效'),
    row('children', 'ReactNode', '—', '当前正文'),
    row('onSwitchStart', '() => void', '—', '切换开始时回调（如滚回顶部）'),
    row('swapMs', 'number', '120', '新旧内容替换的时间点（毫秒）'),
    row('reduceMotion', 'boolean', '跟随系统', '减少动态效果时直接切换'),
  ],
  menu: [
    row('EgMenu', '组件', '—', '下拉菜单，动效内置：自触发点倒出、收回'),
    row('sections / items', 'EgMenuSection[] / EgMenuItem[]', '—', '菜单分组或选项'),
    row('onSelect', '(id, item) => void', '—', '选中选项回调'),
    row('trigger', 'ReactNode | (ctx) => ReactNode', '默认图标按钮', '自定义触发元素'),
    row('placement', "'bottom' | 'top'", "'bottom'", '浮层在触发元素下方或上方'),
    row('align', "'start' | 'center' | 'end'", "'start'", '浮层水平对齐'),
    row('menuWidth', 'number', '268', '浮层宽度'),
  ],
  sheets: [
    row('EgSheets', '组件', '—', '底部弹层，动效内置：滑入、档位吸附、下拉收起'),
    row('visible', 'boolean', '—', '是否显示'),
    row('onDismiss', '() => void', '—', '收起动画结束后回调'),
    row('detents', "('small' | 'medium' | 'large' | 'adaptive')[]", "['medium', 'large']", '可停靠的高度档位'),
    row('initialDetent', 'EgSheetsDetent', "'medium'", '打开时的档位'),
    row('dismissible', 'boolean', 'true', '允许点遮罩 / 下拉 / 系统返回收起'),
    row('title', 'string', '—', '顶栏标题'),
    row('children', 'ReactNode', '—', '内容区'),
  ],
  page: [
    row('createEgEdsAnimaPageNavigator()', '函数 → Stack', '—', '创建页面栈：iOS 26+ 系统原生栈（系统 NavBar · 转场），其余 EDS 栈'),
    row('EgEdsAnimaPage(options)', '函数 → screenOptions', '—', '页面切换动效 + NavBar，传给 Stack.Navigator 的 screenOptions'),
    row('direction', "'horizontal' | 'horizontal-reverse' | 'vertical'", "'horizontal'", '方向：左右（自右推入）/ 右左（自左推入）/ 上下（自底推入）'),
    row('dragDismiss', 'boolean', 'true', '拖拽关闭：按住页面拖动返回（iOS 26+ 为系统全屏侧滑）'),
    row('scrollEdgeEffect', "'automatic' | 'soft' | 'hard' | 'hidden'", '—', "iOS 26+ 系统栏 scroll edge 固定值（如 'automatic' 交系统决定）；缺省同 EgNavBar：静止 hidden · 滚入栏下 soft"),
    row('mode', "'light' | 'dark'", "'light'", 'NavBar 主题模式'),
    row('options.title', 'string', '—', 'NavBar 标题，写在各 Stack.Screen 的 options'),
  ],
  'page-shot': [
    row('EgEdsAnimaPageShot', '组件', '—', '弹层页面容器：包住页面，管理展开与收回；下拉 / 根页左缘侧滑 / 滚动到顶时长按拖拽均可关闭（滚动区接 useEgNavBarScroll().onScroll）'),
    row('renderRoot', '(api) => ReactNode', '—', '弹层根页内容；api 含 close / push / bodyStyle / topInset'),
    row('renderPage', '(api) => ReactNode', '—', '弹层内左右切换的页面；api 含 pageKey / back / topInset'),
    row('title', '(source, pageKey) => string', '—', 'NavBar 标题（iOS 26+ 系统栏，其余 EgNavBar）；pageKey 为 null 即根页'),
    row('scrollEdgeEffect', "'automatic' | 'soft' | 'hard' | 'hidden'", '—', "iOS 26+ 系统栏 scroll edge 固定值（如 'automatic' 交系统决定）；缺省同 EgNavBar：静止 hidden · 滚入栏下 soft"),
    row('api.topInset', 'number', '—', '顶栏底边距弹层顶，不滚动内容的 paddingTop'),
    row('api.scrollTopInset', 'number', '—', '滚动内容 contentContainerStyle 的 paddingTop（iOS 26+ 为 0）'),
    row('api.contentInsetAdjustmentBehavior', "'automatic' | 'never'", '—', '传给 ScrollView：iOS 26+ 由系统避让顶栏'),
    row('background', 'string | (source) => string', "colors.page", '弹层底色，可按触发元素取色'),
    row('mode', "'light' | 'dark'", '—', '主题模式'),
    row('EgEdsAnimaPageShotTrigger', '组件', '—', '触发元素：点击后从它的位置展开整页'),
    row('id', 'string', '—', '触发元素标识，同一容器内唯一'),
    row('radius', "number | 'capsule'", '—', '触发元素圆角，收回时对齐'),
    row('morph', 'boolean', 'false', '按钮 / 列表行等外观与页面不同时开启，收回时变回触发元素样子'),
    row('stretch', 'boolean', 'false', '触发元素撑满宽度'),
  ],
};

function baseRow(entry: TokenEntry): DocPropRow {
  const access = motionBaseThemeAccess(entry.name);
  const value = entry.detailLines[0]?.split(':').slice(1).join(':').replace(/;\s*$/, '').trim() || '—';
  return row(
    formatMotionBaseThemeAccessLine(access),
    "import mobileTheme from '@eds/mobile-tokens/theme'",
    value,
    'Base 底层参数，已由场景组件内部使用；业务一般无需直接读取',
  );
}

/** 动效 token PROPS / API · 列实际开发用到的 RN 入口（非 CSS）。 */
export function motionTokenPropRows(entry: TokenEntry): DocPropRow[] {
  if (entry.layer === 'base') {
    return [baseRow(entry)];
  }
  const scenario =
    entry.layer === 'recipe'
      ? RECIPE_SCENARIO[motionRecipeIdForTokenEntry(entry) ?? '']
      : (motionSemanticScenarioIdForTokenEntry(entry) as MotionScenario | undefined);
  if (scenario && SCENARIO_PROPS[scenario]) {
    return SCENARIO_PROPS[scenario];
  }
  return [row(entry.name, '—', '—', 'RN 无需调用：各场景组件已内置，系统开启减少动态效果时自动生效')];
}
