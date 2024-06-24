import { Dispatch, SetStateAction, createContext, useContext } from "react";
import { Plan, PlanItem } from "../models";

export interface PlanItemState {
    planItem: PlanItem;
    checked: boolean;
    locked: boolean;
};

interface Props {
    planItems: PlanItemState[],
    setPlanItems: Dispatch<SetStateAction<PlanItemState[]>>,
    refreshFlag: boolean, 
    setRefreshFlag: Dispatch<SetStateAction<boolean>>,
    plan?: Plan,
    setPlan: Dispatch<SetStateAction<Plan>>,
};

export const PlanActivityContext = createContext<Props>({
    planItems: [],
    setPlanItems: () => {},
    refreshFlag: false,
    setRefreshFlag: () => {},
    plan: undefined,
    setPlan: () => {}
});

export function usePlanActivityContext() {
  const context = useContext(PlanActivityContext);
  if (context === undefined) { throw new Error("PlanActivityContext error."); }
  return context;
};