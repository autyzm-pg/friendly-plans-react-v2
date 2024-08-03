import { createContext, useContext } from "react";

interface Props {
  editionMode: boolean;
  setEditionMode: (mode: boolean) => void;
  loading: boolean,
  setLoading: (loaded: boolean) => void;
}

export const RootNavigatorContext = createContext<Props | undefined>({
  editionMode: false,
  setEditionMode: () => {},
  loading: true,
  setLoading: () => {},
});

export function useRootNavigatorContext() {
  const context = useContext(RootNavigatorContext);

  if (context === undefined) {
    throw new Error("useRootNavigatorContext must be used with a RootNavigatorContext.")
  }

  return context;
}
