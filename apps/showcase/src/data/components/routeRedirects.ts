/** Family nav slugs → body/overview page slug */
export const FAMILY_LANDING_SLUG: Record<string, string> = {
  button: 'button-body',
  input: 'input-body',
  tag: 'tag-body',
  toggle: 'toggle-body',
  tab: 'tab-body',
  dropdown: 'dropdown-body',
  feedback: 'feedback-body',
  popovers: 'popovers-body',
  'tab-bar': 'tab-bar-body',
};

/**
 * Legacy or bare scene slugs → canonical `{family}-{scene}` slug.
 * Keeps old bookmarks working after family-prefix unification.
 */
export const LEGACY_COMPONENT_SLUG_REDIRECTS: Record<string, string> = {
  // Bare scene slugs (pre family-prefix)
  search: 'input-search',
  textarea: 'input-textarea',
  'quick-input': 'input-quick-input',
  'input-pointer': 'input-pointer',
  'input-group': 'input-combo-input-group',
  'text-input-combo': 'input-combo-text-input',
  'textarea-input-combo': 'input-combo-textarea-input',
  switch: 'toggle-switch',
  checkbox: 'toggle-checkbox',
  radio: 'toggle-radio',
  decide: 'toggle-decide',
  tabs: 'tab-tabs',
  'segmented-control': 'tab-segmented-control',
  'segmented-control-base': 'tab-base-segmented-control',
  'tab-base': 'tab-base-tab',
  toast: 'feedback-toast',
  'form-submission': 'feedback-form-submission',
  'status-card': 'feedback-status-card',
  'icon-container': 'button-icon-container',
  'popovers-notes': 'popovers-notes',

  // Desktop-era molecule slugs
  'button-text': 'button-brand',
  'button-icon': 'button-icon-container',
  'button-icon-pro': 'button-icon-container',
  'button-combo': 'button-combo-action',
  'button-pagination': 'button-brand',
  'input-textarea': 'input-textarea',
  'input-search': 'input-search',
  'input-combo-input': 'input-combo-text-input',
  'input-combo-textarea': 'input-combo-textarea-input',
  'input-combo': 'input-combo-text-input',
  'tag-status': 'tag-system',
  'tag-colorful': 'tag-color',
  'tag-palette': 'tag-color',
  'tag-custom': 'tag-color',
  'toggle-checkbox': 'toggle-checkbox',
  'toggle-radio': 'toggle-radio',
  'toggle-switch': 'toggle-switch',
  'toggle-decide': 'toggle-decide',
  'tab-segmented': 'tab-segmented-control',
  'tab-segmented-control': 'tab-segmented-control',
  'tab-tabs': 'tab-tabs',
  combo: 'button-combo-action',
  'icon-button': 'button-icon-container',
  segmented: 'tab-segmented-control',
  link: 'button-link',
  pagination: 'button-brand',
};

export function resolveComponentSlugRedirect(slug: string): string | undefined {
  if (slug in FAMILY_LANDING_SLUG) {
    return FAMILY_LANDING_SLUG[slug];
  }
  if (slug in LEGACY_COMPONENT_SLUG_REDIRECTS) {
    return LEGACY_COMPONENT_SLUG_REDIRECTS[slug];
  }
  return undefined;
}
