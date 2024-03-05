import { 
    Student, 
    StudentDisplayOption, 
    StudentTextSizeOption, 
    Plan, 
    PlanItemType, 
    PlanItem} from '../models';
import { DEFAULT_EMOJI } from '../assets/emojis';
import i18n from '../locale/i18n';

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
            name: "A",
            studentId: "1",
            planId: "111",
            type: PlanItemType.SimpleTask,
            completed: false,
            lector: false,
            nameForChild: i18n.t('planItemActivity:taskNameForChild'),
            order: 1,
            time: 5,
            image: "",
            voicePath: "",
        },
        //@ts-ignore
        {
            id: "22",
            name: "B",
            studentId: "1",
            planId: "111",
            type: PlanItemType.Break,
            completed: false,
            lector: false,
            nameForChild: i18n.t('planItemActivity:taskNameForChild'),
            order: 2,
            time: 5,
            image: "",
            voicePath: "",
        }
    ]
}