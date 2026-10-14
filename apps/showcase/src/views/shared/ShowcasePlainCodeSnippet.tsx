import { HighlightedNativeSnippet } from '@/views/shared/HighlightedNativeSnippet';

type ShowcasePlainCodeSnippetProps = {
  snippet: string;
  accessibilityLabel?: string;
};

/** Detail code block — RN/TS syntax colors via showcaseDocColors. */
export function ShowcasePlainCodeSnippet(props: ShowcasePlainCodeSnippetProps) {
  return <HighlightedNativeSnippet {...props} />;
}
