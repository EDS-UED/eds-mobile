import type { CatalogSection } from '../types';

/** eds-biz-list-fields — universal business field scenes (one route each). */
export const listFieldSceneSlugs = [
  'list-field-general-structure',
  'list-field-currency',
  'list-field-address',
  'list-field-transaction-hash',
  'list-field-identifier',
  'list-field-amount',
  'list-field-time',
  'list-field-status',
  'list-field-action',
] as const;

export type ListFieldSceneSlug = (typeof listFieldSceneSlugs)[number];

export function isListFieldSceneSlug(slug: string): slug is ListFieldSceneSlug {
  return (listFieldSceneSlugs as readonly string[]).includes(slug);
}

export const scenesCatalog: CatalogSection[] = [
  {
    title: 'Consistency',
    items: [
      {
        name: 'Data Refresh',
        slug: 'data-refresh',
        description: 'Page state while data is reloading or being refreshed.',
        status: 'placeholder',
      },
      {
        name: 'Empty Page',
        slug: 'empty-page',
        description: 'Empty state when a list or detail view has no data.',
        status: 'placeholder',
      },
      {
        name: 'No Access',
        slug: 'no-permission',
        description: 'User lacks permission to view the current module or resource.',
        status: 'placeholder',
      },
    ],
  },
  {
    title: 'List Fields',
    items: [
      {
        name: 'General Structure',
        slug: 'list-field-general-structure',
        description: 'Generic Combo Title cell with primary and secondary text lines.',
        status: 'implemented',
      },
      {
        name: 'Currency',
        slug: 'list-field-currency',
        description: 'Token logo, symbol, and network suffix for cross-chain assets.',
        status: 'implemented',
      },
      {
        name: 'Address',
        slug: 'list-field-address',
        description: 'Single, double, alias, and collection address display in Data List cells.',
        status: 'implemented',
      },
      {
        name: 'Transaction Hash',
        slug: 'list-field-transaction-hash',
        description: 'Tail ellipsis, tooltip, and copy behavior for on-chain hashes.',
        status: 'implemented',
      },
      {
        name: 'Identifier',
        slug: 'list-field-identifier',
        description: 'ID / reference numbers with the same overflow rules as transaction hash.',
        status: 'implemented',
      },
      {
        name: 'Amount',
        slug: 'list-field-amount',
        description: 'Fiat and crypto amounts with grouping and optional conversion line.',
        status: 'implemented',
      },
      {
        name: 'Time',
        slug: 'list-field-time',
        description: 'Local datetime format and UTC offset in column headers.',
        status: 'implemented',
      },
      {
        name: 'Status',
        slug: 'list-field-status',
        description: 'Semantic status tags for list cell state columns.',
        status: 'implemented',
      },
      {
        name: 'Action',
        slug: 'list-field-action',
        description: 'Primary and overflow row actions in Data List action columns.',
        status: 'implemented',
      },
    ],
  },
];
