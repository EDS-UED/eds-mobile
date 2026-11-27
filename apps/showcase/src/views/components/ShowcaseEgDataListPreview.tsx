import {
  EG_DATA_LIST_SCENE_CONTENT_INSET,
  EG_DATA_LIST_SUB_TEXT_MAX_LINES,
  EgAvatar,
  EgTag,
  EgCryptoBtc,
  EgDataList,
  EgDataListPrimaryRow,
  EgDataListMessage,
  EgDataListReddot,
  EgDataListRow,
  EgDataListSubText,
  EgSwitch,
  EgSymbol,
  getEgDataListRowLayout,
} from '@eds/mobile-components';
import type { EgSymbolSize } from '@eds/mobile-components';
import mobileTheme from '@eds/mobile-tokens/theme';
import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { ShowcaseSansText } from '@/components/ShowcaseSansText';
import {
  dataListGraphicSpacingToken,
  dataListGraphicAvatarSize,
  readDataListGraphicSize,
  readDataListGraphicType,
  readDataListPrimaryTagEnabled,
  readDataListPrimaryWeight,
  readDataListRowCount,
  readDataListSubBoldSegment,
  readDataListWidgetFlags,
  type DataListWidgetFlags,
} from '@/data/components/dataListCustomizeModel';
import { useShowcaseColors } from '@/hooks/useShowcaseColors';
import type { ShowcaseColorMap } from '@/hooks/useShowcaseColors';
import { edsTokenFont } from '@/views/shared/resolveEdsTheme';

type ShowcaseEgDataListPreviewProps = Record<string, unknown>;

type DataListPressIntensity = 'xs' | 'sm' | 'md' | 'lg';

function DataListGraphicSlot({
  graphicEnabled,
  graphicSize,
  graphicType,
  iconSymbolSize,
  mode,
  colors,
}: {
  graphicEnabled: boolean;
  graphicSize: ReturnType<typeof readDataListGraphicSize>;
  graphicType: ReturnType<typeof readDataListGraphicType>;
  iconSymbolSize: EgSymbolSize;
  mode: 'light' | 'dark';
  colors: ShowcaseColorMap;
}) {
  if (!graphicEnabled) return null;

  const token = dataListGraphicSpacingToken(graphicSize);
  const boxPx = mobileTheme.spacing[token] as number;
  const radiusFull = mobileTheme.spacing['radius-full'] as number;

  if (graphicType === 'avatar') {
    return (
      <EgAvatar
        name="EDS"
        size={dataListGraphicAvatarSize(graphicSize)}
        variant="initials"
        accessibilityLabel="头像"
      />
    );
  }

  if (graphicType === 'crypto') {
    const boxPx = mobileTheme.spacing[dataListGraphicSpacingToken(graphicSize)] as number;
    return <EgCryptoBtc mode={mode} displayPx={boxPx} accessibilityLabel="BTC" />;
  }

  if (graphicType === 'icon') {
    return (
      <View
        style={{
          width: boxPx,
          height: boxPx,
          borderRadius: radiusFull,
          backgroundColor: colors['material-card-deep'] as string,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <EgSymbol name="eds-add" mode={mode} size={iconSymbolSize} accessibilityLabel="图标" />
      </View>
    );
  }

  return (
    <View
      style={{
        width: boxPx,
        height: boxPx,
        borderRadius: radiusFull,
        backgroundColor: colors['material-card-deep'] as string,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <ShowcaseSansText
        style={[
          edsTokenFont('body-small-strong', '600'),
          { color: colors['text-base-secondary'] as string },
        ]}
      >
        插槽
      </ShowcaseSansText>
    </View>
  );
}

function DataListTrailingSlotPlaceholder({
  mode,
  colors,
  fullHeight = false,
}: {
  mode: 'light' | 'dark';
  colors: ShowcaseColorMap;
  fullHeight?: boolean;
}) {
  return (
    <View
      style={[
        styles.trailingSlot,
        fullHeight ? styles.trailingSlotFullHeight : null,
        {
          borderColor: colors['text-base-quaternary'] as string,
        },
      ]}
    >
      <ShowcaseSansText
        style={[
          edsTokenFont('body-small-strong', '600'),
          { color: colors['text-base-tertiary'] as string },
        ]}
      >
        插槽
      </ShowcaseSansText>
    </View>
  );
}

/** 挂件 · 主文本行尾（时间 / Tag · 与 {@link EgDataListPrimaryRow} 同行对齐）。 */
function DataListPrimaryRowWidgets({
  flags,
  mode,
  colors,
  gap,
}: {
  flags: DataListWidgetFlags;
  mode: 'light' | 'dark';
  colors: ShowcaseColorMap;
  gap: number;
}) {
  if (!flags.showTime && !flags.showTag) return null;

  const secondaryStyle = [
    edsTokenFont('body-small', '400'),
    { color: colors['text-base-secondary'] as string },
  ];

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap }}>
      {flags.showTime ? (
        <ShowcaseSansText key="time" style={secondaryStyle}>
          14:20
        </ShowcaseSansText>
      ) : null}
      {flags.showTag ? (
        <EgTag
          key="widget-tag"
          size="sm"
          label="标签"
          mode={mode}
          rowAlign
          accessibilityLabel="挂件标签"
        />
      ) : null}
    </View>
  );
}

/** 内容区右侧满高插槽 · 仅右箭头 / Switch / 自定义。 */
function DataListContentSlotColumn({
  flags,
  mode,
  colors,
  gap,
  marginLeft,
}: {
  flags: DataListWidgetFlags;
  mode: 'light' | 'dark';
  colors: ShowcaseColorMap;
  gap: number;
  marginLeft: number;
}) {
  if (!flags.slotOpen) return null;

  const hasSlotItems = flags.showSwitch || flags.showCustom || flags.showArrow;
  if (!hasSlotItems) return null;

  return (
    <View style={[styles.slotColumn, { marginLeft, gap }]}>
      {flags.showSwitch ? (
        <EgSwitch key="slot-switch" mode={mode} value={false} accessibilityLabel="开关" />
      ) : null}
      {flags.showCustom ? (
        <DataListTrailingSlotPlaceholder key="slot-custom" mode={mode} colors={colors} fullHeight />
      ) : null}
      {flags.showArrow ? (
        <EgSymbol
          key="slot-arrow"
          name="eds-arrow-right-mini-ios"
          mode={mode}
          size="sm"
          strokeScaleToken="stroke-xl"
          strokeColorToken="stroke-base-tertiary"
          accessibilityLabel="进入"
        />
      ) : null}
    </View>
  );
}

function DataListDemoRow({
  index,
  state,
  interactive,
  pressIntensity,
  pressHapticEnabled,
  touchGestureEnabled,
  mode,
  colors,
}: {
  index: number;
  state: ShowcaseEgDataListPreviewProps;
  interactive: boolean;
  pressIntensity: DataListPressIntensity;
  pressHapticEnabled: boolean;
  touchGestureEnabled: boolean;
  mode: 'light' | 'dark';
  colors: ShowcaseColorMap;
}) {
  const spacing = mobileTheme.spacing;
  const layout = getEgDataListRowLayout();
  const graphicEnabled = state.graphicEnabled !== false;
  const graphicSize = readDataListGraphicSize(state);
  const graphicType = readDataListGraphicType(state);
  const iconSymbolSize = (state.iconSymbolSize as EgSymbolSize | undefined) ?? 'md';
  const primaryWeight = readDataListPrimaryWeight(state);
  const subBoldSegment = readDataListSubBoldSegment(state);
  const descriptionEnabled = state.descriptionEnabled === true;
  const primaryTagEnabled = readDataListPrimaryTagEnabled(state);
  const widgetSlotEnabled = state.widgetEnabled === true;
  const widgetFlags = readDataListWidgetFlags(state);
  const slotColumnVisible =
    widgetFlags.slotOpen &&
    (widgetFlags.showSwitch || widgetFlags.showCustom || widgetFlags.showArrow);
  const slotLeadingMargin = slotColumnVisible ? layout.contentSlotGap : 0;
  const primaryTrailingGap = spacing['spacing-2'] as number;

  const onPress = interactive ? () => undefined : undefined;
  const onLongPress = touchGestureEnabled && interactive ? () => undefined : undefined;

  const descriptionStyle = [
    edsTokenFont('body-small', '400'),
    { color: colors['text-base-secondary'] as string },
  ];

  const primaryLabel = index === 0 ? '1.28 BTC' : `列表项 ${index + 1}`;
  const subSegmentA = '待确认';
  const subSegmentB =
    index === 0
      ? '：对方地址 0x1234…5678 已在链上广播，预计 10 分钟内完成确认，请耐心等待。'
      : ' · 预计 10 分钟';

  return (
    <EgDataListRow
      axis={graphicEnabled ? 'row' : 'column'}
      accessibilityLabel={`数据行 ${index + 1}`}
      onPress={onPress}
      interactive={interactive}
      mode={mode}
      pressIntensity={pressIntensity}
      pressHapticEnabled={pressHapticEnabled}
      touchGestureEnabled={touchGestureEnabled}
      onLongPress={onLongPress}
    >
      <DataListGraphicSlot
        graphicEnabled={graphicEnabled}
        graphicSize={graphicSize}
        graphicType={graphicType}
        iconSymbolSize={iconSymbolSize}
        mode={mode}
        colors={colors}
      />
      <View
        style={{
          flex: 1,
          minWidth: 0,
          flexDirection: 'row',
          alignItems: 'stretch',
        }}
      >
        <View style={{ flex: 1, minWidth: 0, gap: layout.titleSubGap }}>
          <EgDataListPrimaryRow
            mode={mode}
            weight={primaryWeight}
            tag={
              primaryTagEnabled ? (
                <EgTag size="sm" label="标签" mode={mode} rowAlign accessibilityLabel="主文后标签" />
              ) : undefined
            }
            trailing={
              widgetSlotEnabled ? (
                <DataListPrimaryRowWidgets
                  flags={widgetFlags}
                  mode={mode}
                  colors={colors}
                  gap={primaryTrailingGap}
                />
              ) : undefined
            }
          >
            {primaryLabel}
          </EgDataListPrimaryRow>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: primaryTrailingGap }}>
            <EgDataListSubText
              mode={mode}
              segmentA={subSegmentA}
              segmentB={subSegmentB}
              boldSegmentA={subBoldSegment}
              style={{ flex: 1, minWidth: 0 }}
              numberOfLines={EG_DATA_LIST_SUB_TEXT_MAX_LINES}
              ellipsizeMode="tail"
            />
            {widgetSlotEnabled && (widgetFlags.showMessage || widgetFlags.showRedDot) ? (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: primaryTrailingGap }}>
                {widgetFlags.showMessage ? (
                  <EgDataListMessage mode={mode} label="9" accessibilityLabel="未读计数" />
                ) : null}
                {widgetFlags.showRedDot ? <EgDataListReddot mode={mode} accessibilityLabel="未读" /> : null}
              </View>
            ) : null}
          </View>
          {descriptionEnabled ? (
            <ShowcaseSansText style={descriptionStyle}>2026-03-12 14:20</ShowcaseSansText>
          ) : null}
        </View>
        <DataListContentSlotColumn
          flags={widgetFlags}
          mode={mode}
          colors={colors}
          gap={primaryTrailingGap}
          marginLeft={slotLeadingMargin}
        />
      </View>
    </EgDataListRow>
  );
}

/** EgDataList 详情 · Scene inset + DL-bleed + 插槽行预览。 */
export function ShowcaseEgDataListPreview(props: ShowcaseEgDataListPreviewProps) {
  const colors = useShowcaseColors();
  const mode = props.mode === 'dark' ? 'dark' : 'light';
  const rowCount = readDataListRowCount(props);
  const interactive = props.interactive !== false;
  const pressIntensity = (props.pressIntensity as DataListPressIntensity | undefined) ?? 'xs';
  const pressHapticEnabled = props.pressHapticEnabled === true;
  const touchGestureEnabled = props.touchGestureEnabled === true;
  const testID = props.testID as string | undefined;

  const rows = useMemo(
    () =>
      Array.from({ length: rowCount }, (_, index) => (
        <DataListDemoRow
          key={index}
          index={index}
          state={props}
          interactive={interactive}
          pressIntensity={pressIntensity}
          pressHapticEnabled={pressHapticEnabled}
          touchGestureEnabled={touchGestureEnabled}
          mode={mode}
          colors={colors}
        />
      )),
    [colors, interactive, mode, pressHapticEnabled, pressIntensity, props, rowCount, touchGestureEnabled],
  );

  return (
    <EgDataList sceneContentInset={EG_DATA_LIST_SCENE_CONTENT_INSET} testID={testID}>
      {rows}
    </EgDataList>
  );
}

const styles = StyleSheet.create({
  slotColumn: {
    flexGrow: 0,
    flexShrink: 0,
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  trailingSlot: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: mobileTheme.spacing['radius-sm'] as number,
    paddingHorizontal: mobileTheme.spacing['spacing-2'] as number,
    height: mobileTheme.typography.base['line-height-body-medium'] as number,
    justifyContent: 'center',
    flexShrink: 0,
  },
  trailingSlotFullHeight: {
    alignSelf: 'stretch',
    flexGrow: 0,
    flexShrink: 0,
    height: undefined,
    minHeight: mobileTheme.typography.base['line-height-body-medium'] as number,
    paddingHorizontal: mobileTheme.spacing['spacing-2'] as number,
    marginHorizontal: 0,
  },
});