import { EgItemGroup } from '@eds/mobile-components';

import { GLASS_MASK_BASICS_ROWS, SCROLL_EDGE_EFFECT_ROWS } from '@/data/basics/scrollEdgeBasics';
import { useShowcaseThemeContext } from '@/theme/ShowcaseThemeProvider';
import { BasicsInnerPage } from '@/views/basics/BasicsInnerPage';
import { BasicsTableRow } from '@/views/basics/BasicsTableRow';
import { ShowcaseListGroup } from '@/views/shared/ShowcaseListGroup';

export function ScrollEdgeEffectBasicsView() {
  const { colorTheme } = useShowcaseThemeContext();
  const mode = colorTheme === 'dark' ? 'dark' : 'light';

  return (
    <BasicsInnerPage title="遮罩">
      <ShowcaseListGroup label="顶栏 scroll edge">
        <EgItemGroup mode={mode} testID="basics-scroll-edge-effects">
          {SCROLL_EDGE_EFFECT_ROWS.map((row, index) => (
            <BasicsTableRow
              key={row.id}
              title={row.label}
              subtitle={row.detail}
              showDivider={index < SCROLL_EDGE_EFFECT_ROWS.length - 1}
              mode={mode}
            />
          ))}
        </EgItemGroup>
      </ShowcaseListGroup>

      <ShowcaseListGroup label="遮罩 · glass-mask-box">
        <EgItemGroup mode={mode} testID="basics-glass-mask">
          {GLASS_MASK_BASICS_ROWS.map((row, index) => (
            <BasicsTableRow
              key={row.id}
              title={row.label}
              subtitle={row.detail}
              showDivider={index < GLASS_MASK_BASICS_ROWS.length - 1}
              mode={mode}
            />
          ))}
        </EgItemGroup>
      </ShowcaseListGroup>
    </BasicsInnerPage>
  );
}