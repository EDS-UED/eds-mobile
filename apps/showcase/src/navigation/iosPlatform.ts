import { Platform } from 'react-native';

function getIOSMajorVersion(): number {
  if (Platform.OS !== 'ios') {
    return 0;
  }

  const version = Platform.Version;
  if (typeof version === 'string') {
    return Number.parseInt(version.split('.')[0] ?? '0', 10);
  }

  return version;
}

/** iOS 26+ uses UIKit Liquid Glass; manual headerBlurEffect conflicts with it. */
export const isIOS26OrLater = getIOSMajorVersion() >= 26;
