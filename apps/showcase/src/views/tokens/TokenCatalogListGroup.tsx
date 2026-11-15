import { Children, cloneElement, isValidElement, type ReactElement } from 'react';

import { ShowcaseListGroup } from '@/views/shared/ShowcaseListGroup';

export type TokenCatalogInsetRowProps = {
  variant?: 'card' | 'inset';
  showDivider?: boolean;
};

type TokenCatalogListGroupProps = {
  title?: string;
  children: React.ReactNode;
};

/** 令牌分类列表 — 组标题 + **单张**浅底卡片，多行 inset（无行内分割线）。 */
export function TokenCatalogListGroup({ title, children }: TokenCatalogListGroupProps) {
  const items = Children.toArray(children).filter((node): node is ReactElement => isValidElement(node));
  const insetProps: TokenCatalogInsetRowProps = { variant: 'inset' };

  return (
    <ShowcaseListGroup label={title} labelVariant="token">
      {items.map((child) =>
        cloneElement(child as ReactElement<TokenCatalogInsetRowProps>, insetProps),
      )}
    </ShowcaseListGroup>
  );
}