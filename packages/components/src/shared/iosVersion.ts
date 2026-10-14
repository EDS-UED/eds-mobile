import { Platform } from 'react-native';

function getIOSMajorVersion(): number {
  if (Platform.OS !== 'ios') {
    return 0;
  }

  const version = (Platform as typeof Platform & { Version: string | number }).Version;
  if (typeof version === 'string') {
    return Number.parseInt(version.split('.')[0] ?? '0', 10);
  }

  return version;
}

/** iOS 26+ — 系统 Liquid Glass / NativeTabs 等原生增强入口。 */
export function isIos26OrLater(): boolean {
  return Platform.OS === 'ios' && getIOSMajorVersion() >= 26;
}
