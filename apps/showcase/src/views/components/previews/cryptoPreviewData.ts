import { cryptoNames, getProcessedCrypto } from '@/stubs/eds-components';

export function getRegisteredCryptoCount(): number {
  return cryptoNames.filter((name) => Boolean(getProcessedCrypto(name))).length;
}

export function getCryptoPageLead(): string {
  return `共 ${getRegisteredCryptoCount()} 个资产；name 与 packages/components/src/atoms/crypto/*.svg 文件名一致（不含 .svg）。画廊展示名通过 formatCryptoDisplayName 去掉 eds- 前缀；类型见 resolveCryptoAssetKind。SVG 原样渲染，不做换色或结构改写。`;
}
