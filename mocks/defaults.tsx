import { 
  Student, 
  StudentDisplayOption, 
  StudentTextSizeOption, 
  Plan, 
  PlanItemType, 
  PlanItem,
  PLAN_ITEMS_ICONS} from '../models';
import { DEFAULT_EMOJI } from '../assets/emojis';
import i18n from '../locale/i18n';

export const getIconName = (item_type: string): string => PLAN_ITEMS_ICONS[item_type];

export class defaults {
  //@ts-ignore
  static student: Student = {
    name: "Student 1",
    displaySettings: StudentDisplayOption.ImageWithTextSlide,
    textSize: StudentTextSizeOption.Medium,
    isUpperCase: false,
    isSwipeBlocked: false,
    id: '1'
  }

  static plansList: Plan[] = [
    //@ts-ignore
    {
      name: "Plan 1",
      id: '111',
      studentId: '1',
      emoji: DEFAULT_EMOJI
    },
    //@ts-ignore
    {
      name: "Plan 2",
      id: '222',
      studentId: '1',
      emoji: DEFAULT_EMOJI
    }
  ]

  static planItemsList: PlanItem[] = [
    //@ts-ignore
    {
      id: "11",
      name: "LetterA",
      studentId: "1",
      planId: "111",
      type: PlanItemType.SimpleTask,
      completed: false,
      lector: true,
      nameForChild: "Letter A",
      itemOrder: 1,
      time: 5,
      image: "https://cdn3.iconfinder.com/data/icons/letters-and-numbers-1/32/letter_A_red-512.png",
      voicePath: "",
    },
    //@ts-ignore
    {
      id: "22",
      name: "Break",
      studentId: "1",
      planId: "111",
      type: PlanItemType.Break,
      completed: false,
      lector: true,
      nameForChild: "Get a quick rest!",
      itemOrder: 2,
      time: 5,
      image: "https://school.iqdoodle.com/wp-content/uploads/2020/02/how-to-doodle-a-task-269x300.jpg",
      voicePath: "",
    }
  ]

  static studentsList: Student[] = [
    //@ts-ignore
    {
      name: "Student 1",
      displaySettings: StudentDisplayOption.ImageWithTextSlide,
      textSize: StudentTextSizeOption.Medium,
      isUpperCase: false,
      isSwipeBlocked: false,
      id: '1',
      collectionCount: 2
    },
    //@ts-ignore
    {
      name: "Student 2",
      displaySettings: StudentDisplayOption.LargeImageSlide,
      textSize: StudentTextSizeOption.Small,
      isUpperCase: false,
      isSwipeBlocked: false,
      id: '3',
      collectionCount: 2
    },
    //@ts-ignore
    {
      name: "Osoba 3",
      displaySettings: StudentDisplayOption.ImageWithTextSlide,
      textSize: StudentTextSizeOption.Medium,
      isUpperCase: false,
      isSwipeBlocked: false,
      id: '4',
      collectionCount: 2
    },
  ]
}