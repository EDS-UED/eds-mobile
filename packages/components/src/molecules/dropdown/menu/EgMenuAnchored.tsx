import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  Dimensions,
  View,
  type LayoutChangeEvent,
} from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { EgSymbol } from '../../../atoms/_shared/symbol/EgSymbol.js';
import { EgDivider } from '../../../atoms/divider/divider/EgDivider.js';
import { EgGlass } from '../../../atoms/glass/EgGlass.js';
import { rnGlassBoxOuterShadowHostStyle } from '../../../atoms/glass/glassBoxRnStyle.js';
import { resolveGlassBoxComposition } from '../../../atoms/glass/resolveGlassBox.js';
import { edsFontStyle } from '../../../shared/fontFamily.js';
import { fieldTypography } from '../../../shared/typographyStyles.js';
import { getThemeColors, mobileTheme } from '../../../theme/index.js';
import {
  menuContainerStyle,
  menuContentOpacity,
  menuInSpringConfig,
  menuOriginScale,
  menuOutSpringConfig,
  menuShadowOpacity,
  menuShellRadius,
  menuTriggerLift,
  menuTriggerStyle,
} from '../../../shared/motion/menuMotion.js';
import type { EgMenuItemHitRect } from './_shared/egMenuItemHitTest.js';
import {
  EG_MENU_DEFAULT_MAX_HEIGHT_PX,
  EG_MENU_DEFAULT_WIDTH_PX,
  egMenuContainerPaddingHorizontalPx,
  egMenuContainerPaddingVerticalPx,
  egMenuDividerInsetPx,
  egMenuItemRowGapPx,
  egMenuItemIconLabelGapPx,
  egMenuItemPaddingEndPx,
  egMenuItemPaddingStartPx,
  egMenuItemPaddingVerticalPx,
  egMenuSectionGapPx,
  egMenuSectionTitlePaddingStartPx,
  egMenuSectionTitleColorToken,
  egMenuSectionTitlePaddingTopPx,
  egMenuSectionTitlePaddingBottomPx,
  egMenuItemSelectedBackgroundColorToken,
  resolveEgMenuMaxScrollHeight,
} from './_shared/egMenuLayoutDefaults.js';
import { normalizeEgMenuSections } from './_shared/egMenuModel.js';
import { renderEgMenuTrigger } from './_shared/renderEgMenuTrigger.js';
import {
  resolveEgMenuPanelFrame,
  type EgMenuAnchorRect,
} from './_shared/resolveEgMenuPanelFrame.js';
import type { EgMenuItem, EgMenuProps, EgMenuSection } from './EgMenu.types.js';
import { useEgMenuTrackInteraction } from './_shared/useEgMenuTrackInteraction.js';

/** Reduce Motion · menu → fade（与 motion-duration-fade 同档）。 */
const REDUCED_MOTION_FADE_MS = 180;

type MenuRowMeasurable = {
  measureInWindow: (callback: (x: number, y: number, width: number, height: number) => void) => void;
};

type MeasurableNode = {
  measureInWindow: (callback: (x: number, y: number, width: number, height: number) => void) => void;
};

type EgMenuPanelProps = {
  sections: EgMenuSection[];
  selectedId?: string;
  mode: NonNullable<EgMenuProps['mode']>;
  onPick: (item: EgMenuItem) => void;
  onSlidePick?: (item: EgMenuItem) => void;
  menuWidth: number;
  maxScrollHeight: number;
  /** 内容层动画样式（menu 动效内容后半程显出）。 */
  contentAnimatedStyle?: Record<string, unknown>;
  /** 变化即重测滑选命中区（窗口坐标受展开 transform 影响，须在落定后测）。 */
  measureToken?: number;
};

function EgMenuPanel({
  sections,
  selectedId,
  mode,
  onPick,
  onSlidePick,
  menuWidth,
  maxScrollHeight,
  contentAnimatedStyle,
  measureToken,
}: EgMenuPanelProps) {
  const colors = getThemeColors(mode);
  const containerPadH = egMenuContainerPaddingHorizontalPx();
  const containerPadV = egMenuContainerPaddingVerticalPx();
  const itemPadV = egMenuItemPaddingVerticalPx();
  const itemPadStart = egMenuItemPaddingStartPx();
  const itemPadEnd = egMenuItemPaddingEndPx();
  const itemIconLabelGap = egMenuItemIconLabelGapPx();
  const dividerInset = egMenuDividerInsetPx();
  const sectionTitleColorToken = egMenuSectionTitleColorToken();
  const sectionTitlePadStart = egMenuSectionTitlePaddingStartPx();
  const sectionTitlePadTop = egMenuSectionTitlePaddingTopPx();
  const sectionTitlePadBottom = egMenuSectionTitlePaddingBottomPx();
  const itemSelectedBgToken = egMenuItemSelectedBackgroundColorToken();
  const typoBase = mobileTheme.typography.base;
  const sectionGap = egMenuSectionGapPx();
  const itemRadius = mobileTheme.spacing['radius-lg'] as number;
  const itemRowGap = egMenuItemRowGapPx();
  const [contentHeight, setContentHeight] = useState(0);
  const [trackActive, setTrackActive] = useState(false);
  const needsScroll = contentHeight > maxScrollHeight;

  const flatItems = useMemo(
    () => sections.flatMap((section) => section.items),
    [sections],
  );

  const itemById = useMemo(() => {
    const map = new Map<string, EgMenuItem>();
    flatItems.forEach((item) => {
      map.set(item.id, item);
    });
    return map;
  }, [flatItems]);

  const rowRefs = useRef(new Map<string, MenuRowMeasurable>());
  const innerRef = useRef(null as MenuRowMeasurable | null);
  const rebuildGenerationRef = useRef(0);
  const layoutsShared = useSharedValue<EgMenuItemHitRect[]>([]);

  const rebuildHitRects = useCallback(() => {
    const generation = rebuildGenerationRef.current + 1;
    rebuildGenerationRef.current = generation;

    const inner = innerRef.current as unknown as MenuRowMeasurable | null;
    if (!inner?.measureInWindow) {
      layoutsShared.value = [];
      return;
    }

    const targets = flatItems.flatMap((item) => {
      const node = rowRefs.current.get(item.id);
      if (!node?.measureInWindow) {
        return [];
      }
      return [{ item, node }];
    });

    if (targets.length === 0) {
      layoutsShared.value = [];
      return;
    }

    inner.measureInWindow((_innerX: number, _innerY: number) => {
      if (rebuildGenerationRef.current !== generation) {
        return;
      }

      let remaining = targets.length;
      const measured: EgMenuItemHitRect[] = [];

      targets.forEach(({ item, node }) => {
        node.measureInWindow((_x: number, y: number, _w: number, h: number) => {
          if (rebuildGenerationRef.current !== generation) {
            return;
          }
          measured.push({ top: y, bottom: y + h, itemId: item.id });
          remaining -= 1;
          if (remaining === 0) {
            layoutsShared.value = measured.slice().sort((a, b) => a.top - b.top);
          }
        });
      });
    });
  }, [flatItems, layoutsShared]);

  const rebuildScheduledRef = useRef(false);
  const scheduleRebuildHitRects = useCallback(() => {
    if (rebuildScheduledRef.current) {
      return;
    }
    rebuildScheduledRef.current = true;
    requestAnimationFrame(() => {
      rebuildScheduledRef.current = false;
      rebuildHitRects();
    });
  }, [rebuildHitRects]);

  useEffect(() => {
    rebuildHitRects();
  }, [rebuildHitRects, sections, measureToken]);

  const isItemDisabled = useCallback(
    (itemId: string) => itemById.get(itemId)?.disabled === true,
    [itemById],
  );

  const handleTapItem = useCallback(
    (itemId: string) => {
      const item = itemById.get(itemId);
      if (item) {
        onPick(item);
      }
    },
    [itemById, onPick],
  );

  const handleSlideItem = useCallback(
    (itemId: string) => {
      const item = itemById.get(itemId);
      if (item) {
        onSlidePick?.(item);
      }
    },
    [itemById, onSlidePick],
  );

  const { gesture, hoverItemId } = useEgMenuTrackInteraction({
    disabled: false,
    layoutsShared,
    isItemDisabled,
    onSlideItem: handleSlideItem,
    onTapItem: handleTapItem,
    onTrackActiveChange: setTrackActive,
  });

  const emphasisItemId = hoverItemId ?? selectedId;

  const styles = useMemo(
    () =>
      StyleSheet.create({
        glass: {
          width: menuWidth,
          alignSelf: 'flex-start',
        },
        glassHost: {
          overflow: 'hidden',
        },
        scroll: {
          maxHeight: maxScrollHeight,
        },
        inner: {
          position: 'relative',
        },
        section: {},
        sectionTitleWrap: {
          paddingLeft: sectionTitlePadStart,
          paddingRight: itemPadEnd,
          paddingTop: sectionTitlePadTop,
          paddingBottom: sectionTitlePadBottom,
        },
        sectionTitle: {
          fontSize: typoBase['size-footnote'] as number,
          lineHeight: typoBase['line-height-footnote'] as number,
          ...edsFontStyle(String(typoBase['weight-medium'] as number) as '500'),
          color: colors[sectionTitleColorToken] as string,
        },
        row: {
          flexDirection: 'row',
          alignItems: 'flex-start',
          paddingLeft: itemPadStart,
          paddingRight: itemPadEnd,
          paddingVertical: itemPadV,
          borderRadius: itemRadius,
          borderCurve: 'continuous',
        },
        rowSelected: {
          backgroundColor: colors[itemSelectedBgToken] as string,
        },
        iconSlot: {
          width: mobileTheme.spacing['symbol-sm'] as number,
          height: mobileTheme.spacing['symbol-lg'] as number,
          marginRight: itemIconLabelGap,
          alignItems: 'center',
          justifyContent: 'center',
        },
        label: {
          flex: 1,
          ...fieldTypography('lg'),
          color: colors['text-base-primary'] as string,
        },
        labelDestructive: {
          color: colors['text-danger-primary'] as string,
        },
        labelDisabled: {
          opacity: 0.45,
        },
      }),
    [
      colors,
      itemPadStart,
      itemPadEnd,
      itemPadV,
      itemRowGap,
      itemIconLabelGap,
      itemRadius,
      menuWidth,
      containerPadH,
      containerPadV,
      sectionGap,
      sectionTitlePadStart,
      sectionTitlePadTop,
      sectionTitlePadBottom,
      sectionTitleColorToken,
      itemSelectedBgToken,
      typoBase,
    ],
  );

  const menuScroll = (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={{
        paddingHorizontal: containerPadH,
        paddingVertical: containerPadV,
      }}
      keyboardShouldPersistTaps="handled"
      scrollEnabled={needsScroll && !trackActive}
      onContentSizeChange={(_, height) => {
        setContentHeight(height);
        scheduleRebuildHitRects();
      }}
    >
      <GestureDetector gesture={gesture}>
        <View
          ref={(node) => {
            innerRef.current = node as unknown as MenuRowMeasurable | null;
          }}
          style={styles.inner}
          collapsable={false}
          onLayout={scheduleRebuildHitRects}
        >
          {sections.map((section, sectionIndex) => (
            <View key={section.title ?? `section-${sectionIndex}`}>
              {sectionIndex > 0 ? (
                <>
                  <View style={{ height: sectionGap }} />
                  <View style={{ paddingHorizontal: dividerInset }}>
                    <EgDivider variant="module" mode={mode} orientation="horizontal" />
                  </View>
                  <View style={{ height: sectionGap }} />
                </>
              ) : null}
              <View style={styles.section}>
                {section.title ? (
                  <View style={styles.sectionTitleWrap} onLayout={scheduleRebuildHitRects}>
                    <Text style={styles.sectionTitle}>{section.title}</Text>
                  </View>
                ) : null}
                {section.items.map((item, itemIndex) => {
                  const selected = item.id === selectedId;
                  const emphasized = item.id === emphasisItemId;
                  return (
                    <View
                      key={item.id}
                      ref={(node) => {
                        if (node) {
                          rowRefs.current.set(item.id, node as unknown as MenuRowMeasurable);
                        } else {
                          rowRefs.current.delete(item.id);
                        }
                      }}
                      accessibilityRole="menuitem"
                      accessibilityState={{ selected, disabled: item.disabled }}
                      style={[
                        styles.row,
                        emphasized ? styles.rowSelected : null,
                        itemIndex > 0 ? { marginTop: itemRowGap } : null,
                        item.disabled ? styles.labelDisabled : null,
                      ]}
                      onLayout={scheduleRebuildHitRects}
                    >
                      <View style={styles.iconSlot}>
                        {item.icon ? (
                          <EgSymbol
                            name={item.icon}
                            size="sm"
                            mode={mode}
                            strokeColorToken={
                              item.destructive ? 'text-danger-primary' : 'text-base-primary'
                            }
                          />
                        ) : null}
                      </View>
                      <Text
                        style={[
                          styles.label,
                          item.destructive ? styles.labelDestructive : null,
                          item.disabled ? styles.labelDisabled : null,
                        ]}
                      >
                        {item.label}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </View>
          ))}
        </View>
      </GestureDetector>
    </ScrollView>
  );

  return (
    <View style={[styles.glass, styles.glassHost]}>
      {/* 玻璃须在内容之下：iOS BlurView 会模糊其背后的一切；内容留在布局流中撑开面板高度。 */}
      <View pointerEvents="none" style={StyleSheet.absoluteFill}>
        <EgGlass box="glass-flotation-box" mode={mode} style={StyleSheet.absoluteFill} />
      </View>
      <Animated.View style={contentAnimatedStyle}>{menuScroll}</Animated.View>
    </View>
  );
}

export function EgMenuAnchored(props: EgMenuProps) {
  const {
    trigger,
    triggerIcon,
    sections: sectionsProp,
    items,
    selectedId: selectedIdProp,
    defaultSelectedId = 'messages',
    onSelect,
    size = 'md',
    disabled = false,
    mode = 'light',
    testID = 'eg-menu',
    accessibilityLabel,
    placement = 'bottom',
    align = 'start',
    menuWidth = EG_MENU_DEFAULT_WIDTH_PX,
    menuMaxHeight = EG_MENU_DEFAULT_MAX_HEIGHT_PX,
  } = props;

  const sections = normalizeEgMenuSections({ sections: sectionsProp, items });
  const anchorRef = useRef<MeasurableNode | null>(null);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const reduceMotion = useReducedMotion();
  const [anchor, setAnchor] = useState<EgMenuAnchorRect | null>(null);
  const [panelHeight, setPanelHeight] = useState(200);
  const [innerSelectedId, setInnerSelectedId] = useState(defaultSelectedId);
  const selectedId = selectedIdProp ?? innerSelectedId;
  const { width: windowWidth, height: windowHeight } = Dimensions.get('window');
  const progress = useSharedValue(0);
  const closing = useSharedValue(false);
  const maxScrollHeight = resolveEgMenuMaxScrollHeight(menuMaxHeight);
  const [measureToken, setMeasureToken] = useState(0);
  const mountedRef = useRef(false);
  /** 首次挂载时等浮层完成布局再起 spring：Modal / blur 挂载占掉的帧不计入动画时钟，几何也已稳定。 */
  const presentPendingRef = useRef(false);

  const bumpMeasureToken = useCallback(() => setMeasureToken((value) => value + 1), []);
  const onDismissed = useCallback(() => {
    mountedRef.current = false;
    setMounted(false);
  }, []);

  const startPresent = useCallback(() => {
    presentPendingRef.current = false;
    const onPresented = (finished?: boolean) => {
      'worklet';
      if (finished) {
        scheduleOnRN(bumpMeasureToken);
      }
    };
    progress.value = reduceMotion
      ? withTiming(1, { duration: REDUCED_MOTION_FADE_MS }, onPresented)
      : withSpring(1, menuInSpringConfig, onPresented);
  }, [bumpMeasureToken, progress, reduceMotion]);

  useEffect(() => {
    closing.value = !open;
    if (open) {
      if (mountedRef.current || anchor == null) {
        mountedRef.current = true;
        setMounted(true);
        startPresent();
        return;
      }
      mountedRef.current = true;
      presentPendingRef.current = true;
      setMounted(true);
      return;
    }
    presentPendingRef.current = false;
    const onSettled = (finished?: boolean) => {
      'worklet';
      if (finished) {
        scheduleOnRN(onDismissed);
      }
    };
    progress.value = reduceMotion
      ? withTiming(0, { duration: REDUCED_MOTION_FADE_MS }, onSettled)
      : withSpring(0, menuOutSpringConfig, onSettled);
  }, [anchor, closing, onDismissed, open, progress, reduceMotion, startPresent]);

  const shellStyles = useMemo(
    () =>
      StyleSheet.create({
        anchor: {
          alignSelf: 'flex-start',
        },
        modalRoot: {
          flex: 1,
        },
        dismissLayer: {
          ...StyleSheet.absoluteFill,
        },
        floater: {
          position: 'absolute',
          width: menuWidth,
        },
        shell: {
          overflow: 'hidden',
          borderCurve: 'continuous',
        },
        shadow: {
          ...StyleSheet.absoluteFill,
          borderCurve: 'continuous',
        },
      }),
    [menuWidth],
  );

  const openMenu = () => {
    if (disabled) {
      return;
    }
    const node = anchorRef.current;
    if (!node?.measureInWindow) {
      setOpen(true);
      return;
    }
    node.measureInWindow((x, y, width, height) => {
      setAnchor({ x, y, width, height });
      setOpen(true);
    });
  };

  const closeMenu = () => setOpen(false);

  const pick = (item: EgMenuItem, close = true) => {
    if (item.disabled) {
      return;
    }
    if (selectedIdProp == null) {
      setInnerSelectedId(item.id);
    }
    onSelect?.(item.id, item);
    if (close) {
      closeMenu();
    }
  };

  const slidePick = (item: EgMenuItem) => {
    pick(item, false);
  };

  const frame =
    anchor != null
      ? resolveEgMenuPanelFrame({
          anchor,
          panelWidth: menuWidth,
          panelHeight,
          windowWidth,
          windowHeight,
          placement,
          align,
        })
      : null;

  const transformOrigin = `${align === 'end' ? 'right' : align === 'center' ? 'center' : 'left'} ${
    placement === 'top' ? 'bottom' : 'top'
  }`;

  const panelAnimatedStyle = useAnimatedStyle(() =>
    menuContainerStyle(
      progress.value,
      reduceMotion,
      menuOriginScale,
      closing.value,
    ),
  );

  const glassComposition = useMemo(
    () => resolveGlassBoxComposition('glass-flotation-box', mode),
    [mode],
  );
  const panelRadius = glassComposition.borderRadius ?? (mobileTheme.spacing['radius-lg'] as number);
  const roundRadius = menuWidth / 2;
  const shellShadowStyle = useMemo(
    () => rnGlassBoxOuterShadowHostStyle(glassComposition.shadows),
    [glassComposition.shadows],
  );

  const shellAnimatedStyle = useAnimatedStyle(() => ({
    borderRadius: menuShellRadius(progress.value, roundRadius, panelRadius),
  }));

  const shadowAnimatedStyle = useAnimatedStyle(() => ({
    opacity: menuShadowOpacity(progress.value, reduceMotion, closing.value),
  }));

  const contentAnimatedStyle = useAnimatedStyle(() => ({
    opacity: menuContentOpacity(progress.value, reduceMotion, closing.value),
  }));

  const triggerAnimatedStyle = useAnimatedStyle(() =>
    menuTriggerStyle(progress.value, reduceMotion, menuTriggerLift, closing.value),
  );

  const triggerCtx = { open: openMenu, disabled };
  const usesDefaultTrigger = props.trigger == null;
  const triggerNode = renderEgMenuTrigger({
    trigger,
    triggerIcon,
    size,
    mode,
    disabled,
    testID,
    accessibilityLabel,
    ctx: triggerCtx,
    nativeMenuHost: false,
  });

  const anchorBody =
    typeof trigger === 'function' || usesDefaultTrigger ? (
      triggerNode
    ) : (
      <Pressable
        disabled={disabled}
        onPress={openMenu}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel ?? 'Menu'}
      >
        {triggerNode}
      </Pressable>
    );

  return (
    <>
      <View
        collapsable={false}
        ref={(node) => {
          anchorRef.current = node as unknown as MeasurableNode;
        }}
        style={shellStyles.anchor}
      >
        <Animated.View style={triggerAnimatedStyle}>{anchorBody}</Animated.View>
      </View>

      <Modal visible={mounted} transparent animationType="none" onRequestClose={closeMenu}>
        <View style={shellStyles.modalRoot} pointerEvents={open ? 'box-none' : 'none'}>
          <Pressable style={shellStyles.dismissLayer} onPress={closeMenu} accessibilityLabel="关闭菜单" />
          {frame ? (
            <Animated.View
              style={[
                shellStyles.floater,
                {
                  top: frame.top,
                  left: frame.left,
                  transformOrigin,
                },
                panelAnimatedStyle,
              ]}
              onLayout={(event: LayoutChangeEvent) => {
                const { height } = event.nativeEvent.layout;
                setPanelHeight((prev) => (prev === height ? prev : height));
                if (presentPendingRef.current) {
                  presentPendingRef.current = false;
                  requestAnimationFrame(() => requestAnimationFrame(startPresent));
                }
              }}
            >
              <Animated.View
                pointerEvents="none"
                style={[
                  shellStyles.shadow,
                  { borderRadius: panelRadius },
                  shellShadowStyle,
                  shadowAnimatedStyle,
                ]}
              />
              <Animated.View style={[shellStyles.shell, shellAnimatedStyle]}>
                <EgMenuPanel
                  measureToken={measureToken}
                  sections={sections}
                  selectedId={selectedId}
                  mode={mode}
                  menuWidth={menuWidth}
                  maxScrollHeight={maxScrollHeight}
                  onPick={(item) => pick(item, true)}
                  onSlidePick={slidePick}
                  contentAnimatedStyle={contentAnimatedStyle}
                />
              </Animated.View>
            </Animated.View>
          ) : null}
        </View>
      </Modal>
    </>
  );
}
