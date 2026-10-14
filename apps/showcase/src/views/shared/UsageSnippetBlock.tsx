import { ShowcasePlainCodeSnippet } from '@/views/shared/ShowcasePlainCodeSnippet';

type UsageSnippetBlockProps = {
  importCode: string;
  usageCode: string;
};

/** Component detail — import + usage in the same code fence as token CSS snippets. */
export function UsageSnippetBlock({ importCode, usageCode }: UsageSnippetBlockProps) {
  const snippet = [importCode, usageCode].filter(Boolean).join('\n');

  return <ShowcasePlainCodeSnippet snippet={snippet} accessibilityLabel="复制用法代码" />;
}
