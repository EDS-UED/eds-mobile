import { useMemo, useState } from 'react';
import { View } from 'react-native';

import { findEgMenuItem, normalizeEgMenuSections } from './_shared/egMenuModel.js';
import { mapEgMenuSectionsToNativeActions } from './_shared/mapEgMenuToNativeActions.js';
import { getNativeMenuView, isNativeMenuViewAvailable } from './_shared/nativeMenuView.js';
import { renderEgMenuTrigger } from './_shared/renderEgMenuTrigger.js';
import { EgMenuAnchored } from './EgMenuAnchored.js';
import type { EgMenuProps } from './EgMenu.types.js';

/** iOS 26+ — 系统 Menu（SwiftUI · 样式 / 交互 / 动效）；缺 `@expo/ui` 时回退 RN 浮层。 */
export function EgMenuNative(props: EgMenuProps) {
  const MenuView = getNativeMenuView();
  if (!MenuView || !isNativeMenuViewAvailable()) {
    return <EgMenuAnchored {...props} />;
  }

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
  } = props;

  const sections = normalizeEgMenuSections({ sections: sectionsProp, items });
  const [innerSelectedId, setInnerSelectedId] = useState(defaultSelectedId);
  const selectedId = selectedIdProp ?? innerSelectedId;

  const actions = useMemo(
    () => mapEgMenuSectionsToNativeActions(sections, selectedId),
    [sections, selectedId],
  );

  const onPressAction = (event: { nativeEvent: { event: string } }) => {
    const id = event.nativeEvent.event;
    const item = findEgMenuItem(sections, id);
    if (!item || item.disabled) {
      return;
    }
    if (selectedIdProp == null) {
      setInnerSelectedId(item.id);
    }
    onSelect?.(item.id, item);
  };

  const triggerNode = renderEgMenuTrigger({
    trigger,
    triggerIcon,
    size,
    mode,
    disabled,
    testID,
    accessibilityLabel,
    ctx: { open: () => {}, disabled },
    nativeMenuHost: true,
  });

  return (
    <MenuView
      actions={actions}
      onPressAction={onPressAction}
      testID={testID}
      style={{ alignSelf: 'flex-start' }}
    >
      <View collapsable={false} pointerEvents={disabled ? 'none' : 'auto'}>
        {triggerNode}
      </View>
    </MenuView>
  );
}
