import { EgSwitch, resolveEgSwitchSize } from '@eds/mobile-components';
import type { ThemeMode } from '@eds/mobile-components';
import { StyleSheet, View } from 'react-native';

type ShowcaseEgSwitchPreviewProps = Record<string, unknown>;

/** Switch 详情 Live — 只传 EgSwitch 契约字段；尺寸由 `resolveEgSwitchSize` 锁定。 */
export function ShowcaseEgSwitchPreview(props: ShowcaseEgSwitchPreviewProps) {
  const mode: ThemeMode = props.mode === 'dark' ? 'dark' : 'light';
  const size = resolveEgSwitchSize(props.size);
  const forceRnImplementation = props.forceRnImplementation === true;
  const testID = typeof props.testID === 'string' ? props.testID : undefined;

  const switchProps: Record<string, unknown> = {
    mode,
    size,
    testID,
    disabled: props.disabled === true,
    ...(forceRnImplementation ? { forceRnImplementation: true as const } : {}),
  };

  if (props.value === true || props.value === false) {
    switchProps.value = props.value;
  } else {
    switchProps.defaultValue = props.defaultValue === true;
  }

  return (
    <View style={styles.root}>
      <EgSwitch {...switchProps} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});