import { Alert, Platform, Share } from 'react-native';
import * as Clipboard from 'expo-clipboard';

async function writeWebClipboard(text: string): Promise<boolean> {
  if (Platform.OS !== 'web' || typeof navigator === 'undefined') {
    return false;
  }
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return true;
  }
  return false;
}

/** 写入系统剪贴板；失败时尝试 Web API 或 Share。 */
export async function copyShowcaseText(text: string, subject = 'EDS Showcase'): Promise<boolean> {
  const payload = text.trim();
  if (!payload) {
    Alert.alert('复制失败', '没有可复制的内容。');
    return false;
  }

  try {
    await Clipboard.setStringAsync(payload);
    return true;
  } catch {
    try {
      if (await writeWebClipboard(payload)) {
        return true;
      }
    } catch {
      // fall through
    }

    try {
      const result = await Share.share({ message: payload, title: subject });
      if (result.action === Share.sharedAction) {
        return true;
      }
    } catch {
      // fall through
    }

    Alert.alert('复制失败', '无法写入剪贴板，请重试。');
    return false;
  }
}
