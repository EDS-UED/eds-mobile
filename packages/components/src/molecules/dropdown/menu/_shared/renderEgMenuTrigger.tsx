import type { ReactNode } from 'react';

import { EgButtonGlass } from '../../../button/button-glass/EgButtonGlass.js';
import type { ControlSize } from '../../../../shared/types.js';
import type { ThemeMode } from '../../../../theme/index.js';
import type { EgMenuProps, EgMenuTriggerContext } from '../EgMenu.types.js';

const DEFAULT_TRIGGER_ICON = 'eds-more-ios';

type RenderEgMenuTriggerOptions = {
  trigger: EgMenuProps['trigger'];
  triggerIcon?: string;
  size?: ControlSize;
  mode?: ThemeMode;
  disabled: boolean;
  testID: string;
  accessibilityLabel?: string;
  ctx: EgMenuTriggerContext;
  /** iOS 26+ MenuView — 勿给默认玻璃钮 `onPress`（避免嵌套手势）。 */
  nativeMenuHost: boolean;
};

export function renderEgMenuTrigger({
  trigger,
  triggerIcon,
  size = 'md',
  mode = 'light',
  disabled,
  testID,
  accessibilityLabel,
  ctx,
  nativeMenuHost,
}: RenderEgMenuTriggerOptions): ReactNode {
  if (typeof trigger === 'function') {
    return trigger(ctx);
  }
  if (trigger != null) {
    return trigger;
  }

  return (
    <EgButtonGlass
      kind="icon"
      iconCount={1}
      icon={triggerIcon ?? DEFAULT_TRIGGER_ICON}
      size={size}
      mode={mode}
      disabled={disabled}
      onPress={nativeMenuHost ? undefined : ctx.open}
      testID={`${testID}-trigger`}
      accessibilityLabel={accessibilityLabel ?? 'Menu'}
    />
  );
}
