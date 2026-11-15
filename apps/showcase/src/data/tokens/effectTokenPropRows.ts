import type { DocPropRow } from '@/data/components';
import type { TokenEntry } from '@/data/tokens/tokenCatalogTypes';
import { tokenDetailPropRows } from '@/data/tokens/tokenDetailPropRows';
import { isGlassBoxPreviewClass } from '@/views/tokens/effectTokenPreviewStyle';

import { SHOWCASE_GLASS_EG_SLUG, SHOWCASE_SCROLL_EDGE_EG_SLUG } from '@/data/components/showcaseInfraCatalog';

function row(
  name: string,
  type: string,
  defaultValue: string,
  description: string,
): DocPropRow {
  return { name, type, defaultValue, description };
}

/** Effect 令牌详情 — CSS/变量行 + 指向 RN 组件文档（参数真源，非定制）。 */
export function effectTokenPropRows(entry: TokenEntry): DocPropRow[] {
  const base = tokenDetailPropRows(entry);

  if (entry.name === 'eds-blur-glass') {
    return [
      ...base,
      row(
        'EgGlass',
        '组件',
        '—',
        `遮罩深 BlurGlass · Showcase → glass-eg（/${SHOWCASE_GLASS_EG_SLUG}）· mask 浅不可用时 glass-mask-box 兜底`,
      ),
    ];
  }

  if (entry.name === 'eds-scroll-edge-effect' || entry.name === 'eds-scroll-edge-blur') {
    return [
      ...base,
      row(
        'EgScrollEdgeEffect',
        '组件',
        '—',
        `遮罩浅 ScrollEdgeEffect · Showcase → glass-scroll-edge（/${SHOWCASE_SCROLL_EDGE_EG_SLUG}）`,
      ),
      row('GlassMaskBackdrop', '组件', '—', '原生（iOS26+）→ 浅（iOS26-）→ 深 EgGlass mask（Android 强制 · iOS 浅不可用兜底）· EgNavBar 内置'),
      row('glass-mask-box', 'GlassBoxClassName', "'glass-mask-box'", '置顶遮罩 · Effect Semantic mask'),
    ];
  }

  if (isGlassBoxPreviewClass(entry.name)) {
    const rows = [
      ...base,
      row('box', 'GlassBoxClassName', `'${entry.name}'`, 'Effect Glass Box class · token 名即 box 值'),
      row(
        'EgGlass',
        '组件',
        '—',
        `遮罩深 BlurGlass 盒 · Showcase → glass-eg（/${SHOWCASE_GLASS_EG_SLUG}）`,
      ),
    ];

    if (entry.name === 'glass-mask-box') {
      rows.push(
        row(
          'EgScrollEdgeEffect',
          '组件',
          '—',
          '遮罩浅 · 与 glass-mask-box 同叠色；宿主 GlassMaskBackdrop · 浅失败见 EgGlass Props「兜底逻辑」',
        ),
        row(
          'resolveEgScrollEdgeEffect',
          '函数',
          '—',
          "automatic 按 container 解析：page → soft · sheet → hard",
        ),
      );
    }

    return rows;
  }

  return base;
}