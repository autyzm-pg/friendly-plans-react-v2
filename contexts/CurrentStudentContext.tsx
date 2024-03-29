import { createContext, useContext } from "react";
import { Student } from "../models";

interface Props {
  student: Student | null;
  setStudent: (student: Student) => void;
}

export const CurrentStudentContext = createContext<Props | undefined>({
  student: null,
  setStudent: () => {}
});

export function useCurrentStudentContext() {
  const context = useContext(CurrentStudentContext);

  if (context === undefined) {
      throw new Error("urrentStudentContext must be used with a CurrentStudentContext.")
  }

  return context;
}
