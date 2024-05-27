import { Dispatch, SetStateAction, createContext, useContext } from "react";
import { Plan, PlanItem, PlanItemType, PlanSubItem } from "../models";
import { Alert } from "react-native";
import { i18n } from "../locale";
import { DragEndParams } from "react-native-draggable-flatlist";

export interface PlanItemState {
    planItem: PlanItem;
    checked: boolean;
    completed: boolean;
};

interface Props {
    planItems: PlanItemState[],
    setPlanItems: Dispatch<SetStateAction<PlanItemState[]>>,
    refreshFlag: boolean, 
    setRefreshFlag: Dispatch<SetStateAction<boolean>>,
};

export const PlanActivityContext = createContext<Props>({
    planItems: [],
    setPlanItems: () => {},
    refreshFlag: false,
    setRefreshFlag: () => {}
});

export function usePlanActivityContext() {
  const context = useContext(PlanActivityContext);
  if (context === undefined) { throw new Error("PlanActivityContext error."); }
  return context;
};

export class PlanActivityHelper {
    private setPlanItems: Dispatch<SetStateAction<PlanItemState[]>>;
    private setRefreshFlag: Dispatch<SetStateAction<boolean>>;

    constructor(setPlanItems: Dispatch<SetStateAction<PlanItemState[]>>,
                setRefreshFlag: Dispatch<SetStateAction<boolean>>,
    ) {
        this.setPlanItems = setPlanItems;
        this.setRefreshFlag = setRefreshFlag;
    };

    getPlanItems = async (plan: Plan) => {
        if (!plan) { return; }
        const planItems = await PlanItem.getPlanItems(plan);
        const state = planItems.map((item) => { return { planItem: item, checked: false, completed: item.completed}; });
        this.setPlanItems(state);
    };

    deleteMultiple = async(planItems: PlanItemState[]) => {
        Alert.alert(i18n.t('planActivity:deleteTaskHeader'), i18n.t('planActivity:deleteTaskInfo'), [
            { text: i18n.t('common:cancel') },
            {
                text: i18n.t('common:confirm'),
                onPress: () => {
                    planItems.forEach(async(state: PlanItemState) => {
                        if (!state.checked) { return; }
                        await PlanItem.deletePlanItem(state.planItem);
                    });
                    this.setRefreshFlag(flag => !flag);
                },
            },
        ]);
    };
    
    unSelectMultiple = (planItems: PlanItemState[]) => {
        const checked = planItems.filter((state) => state.checked == true).length;
        if (checked == planItems.length) {
            const updated = planItems.map((state) => { return { planItem: state.planItem, checked: false, completed: state.planItem.completed}; });
            this.setPlanItems(updated);
        } else {
            const updated = planItems.map((state) => { return { planItem: state.planItem, checked: true, completed: state.planItem.completed}; });
            this.setPlanItems(updated);
        }
    };
    
    changeStateOfMultiple = async(planItems: PlanItemState[]) => {
        planItems.forEach(async(state: PlanItemState) => {
            state.planItem.completed = !state.planItem.completed;
            await PlanItem.updatePlanItem(state.planItem);
            if (state.planItem.type === PlanItemType.ComplexTask) { return; }
            await PlanSubItem.getPlanSubItems(state.planItem).then(subItems => {
                subItems.forEach(async(subItem) => {
                    subItem.completed = state.planItem.completed;
                    await PlanSubItem.updatePlanSubItem(subItem);
                });
            });
        });
        this.setRefreshFlag(flag => !flag);
    };

    updatePlanItemsOrder = async (planItems: PlanItemState[]) => {
        const updated = planItems.map((state, index) => ({...state,
            planItem: {
            ...state.planItem,
            itemOrder: index + 1,
            },
        }));
        for (const state of updated) {
            await PlanItem.updatePlanItem(state.planItem);
        }
        this.setPlanItems(updated);
    };
    
    handlePlanListOrderChanged = ({ data }: DragEndParams<PlanItemState>) => {
        this.updatePlanItemsOrder(data);
    };
    
    // const shuffle = (array: TaskState[]) => {
    //     let currentIndex = array.length;
    //     let temporaryValue;
    //     let randomIndex;

    //     while (0 !== currentIndex) {
    //     randomIndex = Math.floor(Math.random() * currentIndex);
    //     currentIndex -= 1;
    //     temporaryValue = array[currentIndex];
    //     array[currentIndex] = array[randomIndex];
    //     array[randomIndex] = temporaryValue;
    //     }

    //     return array;
    // };

    // const shuffleTasks = () => {
    //     let array = planItemList;
    //     array = shuffle(array);
    //     updatePlanItemsOrder(array)
    // };
};