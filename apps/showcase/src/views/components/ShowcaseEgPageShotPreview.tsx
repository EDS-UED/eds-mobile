import type { ThemeMode } from '@eds/mobile-components';
import { PageShotDemo } from '@eds/mobile-components/preview/motion';

type ShowcaseEgPageShotPreviewProps = Record<string, unknown> & {
  mode?: ThemeMode;
};

/** EgPageShot · motion-page-shot 演示（业务入口 `EgPageShot` / `EgPageShotTrigger`）。 */
export function ShowcaseEgPageShotPreview({ mode = 'light' }: ShowcaseEgPageShotPreviewProps) {
  return <PageShotDemo mode={mode} />;
}