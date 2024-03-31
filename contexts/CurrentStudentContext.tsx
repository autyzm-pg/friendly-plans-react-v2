import { createContext, useContext } from "react";
import { Student } from "../models";

interface Props {
  currentStudent: Student | undefined;
  setCurrentStudent: (student: Student) => void;
}

export const CurrentStudentContext = createContext<Props | undefined>({
  currentStudent: undefined,
  setCurrentStudent: () => {}
});

export function useCurrentStudentContext() {
  const context = useContext(CurrentStudentContext);

  if (context === undefined) {
      throw new Error("urrentStudentContext must be used with a CurrentStudentContext.")
  }

  return context;
}
