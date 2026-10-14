import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ComponentRef,
  type ReactNode,
  type RefObject,
} from 'react';
import { Platform, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { getBlurTargetView } from './nativeBlur.js';

type BlurHostView = ComponentRef<typeof View>;
type BlurTargetRef = RefObject<BlurHostView | null>;

type GlassBlurScopeContextValue = {
  activeTargetRef: BlurTargetRef | null;
  register: (id: number, ref: BlurTargetRef, active: boolean) => void;
  unregister: (id: number) => void;
};

const GlassBlurScopeContext = createContext<GlassBlurScopeContextValue | null>(null);

/**
 * Android: active `GlassBlurBackdrop` target for `BlurView.blurTarget`.
 * `null` until a backdrop is mounted — expo-blur only reads `blurTarget.current` on mount/update,
 * so consumers must re-render when the target appears (context state, not a bare ref).
 */
export function useGlassBlurTargetRef(): BlurTargetRef | null {
  return useContext(GlassBlurScopeContext)?.activeTargetRef ?? null;
}

type GlassBlurScopeProps = {
  children: ReactNode;
};

type RegisteredTarget = { ref: BlurTargetRef; active: boolean; order: number };

/** Wrap a screen region that contains `GlassBlurBackdrop` + glass surfaces (glass must not be inside the backdrop). */
export function GlassBlurScope({ children }: GlassBlurScopeProps) {
  const targetsRef = useRef(new Map<number, RegisteredTarget>());
  const orderRef = useRef(0);
  const [activeTargetRef, setActiveTargetRef] = useState<BlurTargetRef | null>(null);

  const recompute = useCallback(() => {
    let next: RegisteredTarget | null = null;
    for (const target of targetsRef.current.values()) {
      if (!target.active) continue;
      if (!next || target.order > next.order) next = target;
    }
    setActiveTargetRef((prev) => (prev === (next?.ref ?? null) ? prev : (next?.ref ?? null)));
  }, []);

  const register = useCallback(
    (id: number, ref: BlurTargetRef, active: boolean) => {
      const existing = targetsRef.current.get(id);
      const becameActive = active && !existing?.active;
      orderRef.current += becameActive || !existing ? 1 : 0;
      targetsRef.current.set(id, {
        ref,
        active,
        order: becameActive || !existing ? orderRef.current : existing.order,
      });
      recompute();
    },
    [recompute],
  );

  const unregister = useCallback(
    (id: number) => {
      targetsRef.current.delete(id);
      recompute();
    },
    [recompute],
  );

  const value = useMemo(
    () => ({ activeTargetRef, register, unregister }),
    [activeTargetRef, register, unregister],
  );

  return <GlassBlurScopeContext.Provider value={value}>{children}</GlassBlurScopeContext.Provider>;
}

type GlassBlurBackdropProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  /**
   * 多屏共用一个 Scope（Tabs / Stack）时传当前屏是否 focused；
   * 失焦屏会被 react-native-screens detach，不能作为 blur 采样源。
   */
  active?: boolean;
};

let nextBackdropId = 1;

/**
 * Content drawn into the Android blur target (blobs, page bg). Keep glass controls as siblings, not inside this tree.
 */
export function GlassBlurBackdrop({ children, style, active = true }: GlassBlurBackdropProps) {
  const scope = useContext(GlassBlurScopeContext);
  const ownRef = useRef<BlurHostView>(null);
  const idRef = useRef(0);
  if (idRef.current === 0) {
    idRef.current = nextBackdropId++;
  }
  const BlurTargetView = getBlurTargetView();
  const flatStyle = StyleSheet.flatten(style) as ViewStyle | undefined;
  const useNativeTarget = Platform.OS === 'android' && BlurTargetView != null && scope != null;

  const register = scope?.register;
  const unregister = scope?.unregister;

  useLayoutEffect(() => {
    if (!useNativeTarget || !register) return;
    register(idRef.current, ownRef, active);
  }, [active, register, useNativeTarget]);

  useLayoutEffect(() => {
    if (!useNativeTarget || !unregister) return;
    const id = idRef.current;
    return () => unregister(id);
  }, [unregister, useNativeTarget]);

  if (useNativeTarget && BlurTargetView) {
    return (
      <BlurTargetView ref={ownRef} style={flatStyle}>
        {children}
      </BlurTargetView>
    );
  }

  return (
    <View style={style}>
      {children}
    </View>
  );
}
