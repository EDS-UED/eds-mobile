import { useCallback, useMemo, useState, type ReactElement, type ReactNode } from 'react';
import {
  LayoutChangeEvent,
  StyleSheet,
  View,
  type ViewProps,
  type ViewStyle,
} from 'react-native';

import { EgAtomSvg } from '../../../atoms/_shared/icon/EgAtomSvg.js';
import { GlassBoxEffectLayers } from '../../../atoms/glass/GlassBoxEffectLayers.js';
import { GlassBoxInsetHighlightOverlay } from '../../../atoms/glass/GlassBoxInsetHighlightOverlay.js';
import { rnColorFromHex } from '../../../atoms/glass/glassBoxRnStyle.js';
import { getMaskedView } from '../../../atoms/glass/nativeMaskedView.js';
import { resolveGlassBoxComposition } from '../../../atoms/glass/resolveGlassBox.js';
import { getThemeColors } from '../../../theme/index.js';
import {
  buildPopoverOutlinePath,
  getPopoverShellMetrics,
  POPOVER_RADIUS,
  resolvePopoverPanelMins,
  type PopoverPanelDimensions,
} from '../_shared/popoverShape.js';
import { resolveEgPopoversPlacement } from '../_shared/resolveEgPopoversPlacement.js';
import { EG_POPOVERS_MENU_BOX, EG_POPOVERS_SLOT_PADDING } from './egPopoversMetrics.js';
import {
  buildEgPopoversMaskMarkup,
  buildEgPopoversShapeShadowMarkup,
  buildEgPopoversShellMarkup,
} from './egPopoversShellMarkup.js';
import type { EgPopoversProps } from './EgPopovers.types.js';

/**
 * Popovers · Desktop 一体 SVG + `glass-menu-box`（毛玻璃裁进 path · 叠色 / 描边 / SVG 投影）。
 */
export function EgPopovers({
  mode = 'light',
  edge = 'leading-top',
  slot,
  children,
  size = 'compact',
  testID,
  style,
}: EgPopoversProps & Pick<ViewProps, 'style'>) {
  const content = slot ?? children;
  const panelMins = resolvePopoverPanelMins(size);
  const composition = useMemo(
    () => resolveGlassBoxComposition(EG_POPOVERS_MENU_BOX, mode),
    [mode],
  );
  const colors = getThemeColors(mode);
  const MaskedView = useMemo(() => getMaskedView(), []);
  const shellPaint = MaskedView ? 'glass-masked' : 'token-only';

  const [panel, setPanel] = useState<PopoverPanelDimensions>(() => ({
    panelW: panelMins.panelMinW,
    panelH: panelMins.panelMinH,
  }));

  const { placement, align } = resolveEgPopoversPlacement(edge);
  const shell = useMemo(
    () => getPopoverShellMetrics(placement, panel, panelMins),
    [panel, panelMins, placement],
  );
  const outlinePath = buildPopoverOutlinePath(
    placement,
    align,
    panel,
    panelMins,
    POPOVER_RADIUS,
  );
  const borderColor = rnColorFromHex(
    composition.border?.color ?? (colors['stroke-base-quaternary'] as string),
  );
  const borderWidth = composition.border?.width ?? 0;
  const shadowXml = buildEgPopoversShapeShadowMarkup(
    shell.viewBox,
    shell.width,
    shell.height,
    outlinePath,
    composition.shadows,
  );
  const shellXml = buildEgPopoversShellMarkup(
    shell.viewBox,
    shell.width,
    shell.height,
    outlinePath,
    composition,
    shellPaint,
    borderColor,
    borderWidth,
  );
  const maskXml = buildEgPopoversMaskMarkup(
    shell.viewBox,
    shell.width,
    shell.height,
    outlinePath,
  );
  const inset = shell.contentInset;

  const onSlotLayout = useCallback(
    (event: LayoutChangeEvent) => {
      const { width, height } = event.nativeEvent.layout;
      const panelW = Math.max(Math.ceil(width), panelMins.panelMinW);
      const panelH = Math.max(Math.ceil(height), panelMins.panelMinH);
      setPanel((prev) =>
        prev.panelW === panelW && prev.panelH === panelH
          ? prev
          : { panelW, panelH },
      );
    },
    [panelMins.panelMinH, panelMins.panelMinW],
  );

  const maskElement = useMemo(
    (): ReactElement => (
      <View
        style={{
          width: shell.width,
          height: shell.height,
          backgroundColor: 'transparent',
        }}
      >
        <EgAtomSvg xml={maskXml} width={shell.width} height={shell.height} />
      </View>
    ),
    [maskXml, shell.height, shell.width],
  );

  const menuGlassLayers = (
    <>
      <GlassBoxEffectLayers mode={mode} composition={composition} />
      <GlassBoxInsetHighlightOverlay shadows={composition.shadows} cornerStyle={styles.flatCorner} />
    </>
  );

  const contentHostStyle: ViewStyle = {
    position: 'absolute',
    top: inset.top,
    left: inset.left,
    width: panel.panelW,
    minWidth: panelMins.panelMinW,
    minHeight: panelMins.panelMinH,
    zIndex: 2,
  };

  return (
    <View
      style={StyleSheet.flatten([
        styles.host,
        { width: shell.width, height: shell.height },
        style,
      ])}
      testID={testID ?? 'popovers'}
    >
      <View pointerEvents="none" style={styles.shell}>
        {shadowXml ? (
          <View style={styles.shadowLayer}>
            <EgAtomSvg xml={shadowXml} width={shell.width} height={shell.height} />
          </View>
        ) : null}
        {MaskedView ? (
          <MaskedView
            style={[styles.shell, { width: shell.width, height: shell.height }]}
            maskElement={maskElement}
          >
            <View style={[StyleSheet.absoluteFill, styles.glassClip]}>
              {menuGlassLayers}
            </View>
          </MaskedView>
        ) : null}
        <View style={styles.outlineLayer}>
          <EgAtomSvg xml={shellXml} width={shell.width} height={shell.height} />
        </View>
      </View>
      <View style={contentHostStyle} collapsable={false}>
        <View
          testID={testID ? `${testID}-slot` : 'popovers-slot'}
          style={styles.contentSlot}
          onLayout={onSlotLayout}
        >
          {content as ReactNode}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  host: {
    alignSelf: 'flex-start',
    overflow: 'visible',
    backgroundColor: 'transparent',
  },
  shell: {
    ...StyleSheet.absoluteFill,
    overflow: 'visible',
  },
  glassClip: {
    backgroundColor: 'transparent',
  },
  shadowLayer: {
    ...StyleSheet.absoluteFill,
    zIndex: 0,
  },
  outlineLayer: {
    ...StyleSheet.absoluteFill,
    zIndex: 1,
  },
  flatCorner: {
    borderRadius: 0,
  },
  contentSlot: {
    alignSelf: 'flex-start',
    padding: EG_POPOVERS_SLOT_PADDING,
    minWidth: 0,
    minHeight: 0,
  },
});