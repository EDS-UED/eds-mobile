import { resolveThemeMode } from '@eds/mobile-components/catalog';
import { MotionDemo } from '@eds/mobile-components/preview/motion';
import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';

export function MotionDemoView() {
  const scheme = useColorScheme();
  const normalizedScheme = scheme === 'light' || scheme === 'dark' ? scheme : undefined;
  const mode = resolveThemeMode(normalizedScheme);
  return (
    <>
      <MotionDemo mode={mode} />
      <Stack.Title>动效演示</Stack.Title>
    </>
  );
}
