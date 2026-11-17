import { EgItemGroup } from '@eds/mobile-components';

import { MOBILE_GESTURE_ROWS } from '@/data/basics/mobileGestures';
import { useShowcaseThemeContext } from '@/theme/ShowcaseThemeProvider';
import { BasicsInnerPage } from '@/views/basics/BasicsInnerPage';
import { BasicsTableRow } from '@/views/basics/BasicsTableRow';
import { ShowcaseListGroup } from '@/views/shared/ShowcaseListGroup';

export function MobileGesturesView() {
  const { colorTheme } = useShowcaseThemeContext();
  const mode = colorTheme === 'dark' ? 'dark' : 'light';

  return (
    <BasicsInnerPage title="手势">
      <ShowcaseListGroup label="手势">
        <EgItemGroup mode={mode} testID="basics-mobile-gestures">
          {MOBILE_GESTURE_ROWS.map((row, index) => (
            <BasicsTableRow
              key={row.id}
              title={`${row.label} · ${row.en}`}
              subtitle={row.usage}
              trailing={row.direction}
              showDivider={index < MOBILE_GESTURE_ROWS.length - 1}
              mode={mode}
            />
          ))}
        </EgItemGroup>
      </ShowcaseListGroup>
    </BasicsInnerPage>
  );
}