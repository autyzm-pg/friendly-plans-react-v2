import { PlanItemType } from './PlanItem';

export interface PlanElement {
  id: string;
  name: string;
  type: PlanItemType;
  completed: boolean;
  time: number;
  lector: boolean;
  itemOrder: number;
  nameForChild?: string;
  image?: string;
  voicePath?: string;

  complete: () => Promise<void>;
  update: (changes: any) => Promise<void>;
}
