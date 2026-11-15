import type { ComponentType, ReactElement } from 'react';

type MaskedViewProps = {
  style?: object;
  maskElement: ReactElement;
  children?: ReactElement;
};

let MaskedViewComponent: ComponentType<MaskedViewProps> | null | undefined;

export function getMaskedView(): ComponentType<MaskedViewProps> | null {
  if (MaskedViewComponent !== undefined) {
    return MaskedViewComponent;
  }
  try {
    MaskedViewComponent = require('@react-native-masked-view/masked-view').default as ComponentType<MaskedViewProps>;
  } catch {
    MaskedViewComponent = null;
  }
  return MaskedViewComponent;
}