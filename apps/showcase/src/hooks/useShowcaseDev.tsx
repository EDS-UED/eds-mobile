import { createContext, useContext, useMemo, useState, type PropsWithChildren } from 'react';

import type { ShowcaseInspectSelection, ShowcasePreviewMode } from './showcaseDevTypes';

type ShowcaseDevContextValue = {
  mode: ShowcasePreviewMode;
  setMode: (mode: ShowcasePreviewMode) => void;
  pinned: ShowcaseInspectSelection | null;
  pinSelection: (selection: ShowcaseInspectSelection) => void;
  clearPinned: () => void;
};

const ShowcaseDevContext = createContext<ShowcaseDevContextValue | null>(null);

export function ShowcaseDevProvider({ children }: PropsWithChildren) {
  const [mode, setMode] = useState<ShowcasePreviewMode>('preview');
  const [pinned, setPinned] = useState<ShowcaseInspectSelection | null>(null);

  const value = useMemo(
    () => ({
      mode,
      setMode,
      pinned,
      pinSelection: setPinned,
      clearPinned: () => setPinned(null),
    }),
    [mode, pinned],
  );

  return <ShowcaseDevContext.Provider value={value}>{children}</ShowcaseDevContext.Provider>;
}

export function useShowcaseDev() {
  const context = useContext(ShowcaseDevContext);
  if (!context) {
    throw new Error('useShowcaseDev must be used within ShowcaseDevProvider');
  }
  return context;
}
