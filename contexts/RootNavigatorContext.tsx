import { createContext, useContext } from "react";

interface Props {
  editionMode: boolean;
  setEditionMode: () => void;
}

export const RootNavigatorContext = createContext<Props | undefined>({
  editionMode: false,
  setEditionMode: () => {}
});

export function useRootNavigatorContext() {
  const context = useContext(RootNavigatorContext);

  if (context === undefined) {
    throw new Error("useRootNavigatorContext must be used with a RootNavigatorContext.")
  }

  return context;
}
