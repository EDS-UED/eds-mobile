import type { ReactNode } from 'react';

import type {
  EgEdsAnimaPageShotPageApi,
  EgEdsAnimaPageShotRootApi,
} from '../../shared/motion/EgEdsAnimaPageShot.js';
import type { ThemeMode } from '../../theme/index.js';
import { EgPage } from '../page/EgPage.js';
import type { EgPageProps } from '../page/EgPage.types.js';

type EgPageShotLayoutApi = Pick<
  EgEdsAnimaPageShotRootApi,
  'scrollTopInset' | 'contentInsetAdjustmentBehavior'
>;

type EgPageShotContentProps = Omit<EgPageProps, 'scrollTopInset' | 'contentInsetAdjustmentBehavior'> & {
  mode: ThemeMode;
  api: EgPageShotLayoutApi | EgEdsAnimaPageShotPageApi;
  children: ReactNode;
};

/** `EgPageShot` 弹层内滚动区 · 边距走 `EgPage`（spacing-5 / 顶 lg / spacing-10 底）。 */
export function EgPageShotContent({ mode, api, children, ...pageProps }: EgPageShotContentProps) {
  return (
    <EgPage
      mode={mode}
      scrollTopInset={api.scrollTopInset}
      contentInsetAdjustmentBehavior={api.contentInsetAdjustmentBehavior}
      {...pageProps}
    >
      {children}
    </EgPage>
  );
}