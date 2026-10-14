import { Component, type ErrorInfo, type ReactNode } from 'react';

type GlassNativePlatformBoundaryProps = {
  children: ReactNode;
};

type GlassNativePlatformBoundaryState = {
  failed: boolean;
};

/** expo-glass-effect / Android liquid-glass 原生异常时卸载增强层，保留 Effect 叠层。 */
export class GlassNativePlatformBoundary extends Component<
  GlassNativePlatformBoundaryProps,
  GlassNativePlatformBoundaryState
> {
  state: GlassNativePlatformBoundaryState = { failed: false };

  static getDerivedStateFromError(): GlassNativePlatformBoundaryState {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (typeof __DEV__ !== 'undefined' && __DEV__) {
      console.warn('[EDS] Native glass platform layer failed — Effect stack only', error, info.componentStack);
    }
  }

  render() {
    if (this.state.failed) {
      return null;
    }
    return this.props.children;
  }
}
