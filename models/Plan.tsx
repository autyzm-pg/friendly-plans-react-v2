import isEmpty from 'lodash.isempty';
import ImagePicker from 'react-native-image-crop-picker';

import { DEFAULT_EMOJI } from '../assets/emojis';
import { getPlanItemsRef, getPlanRef, getPlansRef } from './FirebaseRefProxy';
import { PlanItem } from './PlanItem';
import { ParameterlessConstructor, SubscribableModel } from './SubscribableModel';
import { executeQuery } from '../services/DatabaseService';

export class Plan {
  
  name!: string;
  id!: string;
  studentId!: string;
  emoji!: string;

  
  static createPlan = async (studentId: string, name: string): Promise<Plan> => {
    const insertIntoPlanTable = `
      INSERT INTO Plan (name, studentId, emoji)
      VALUES ((?), (?), (?));
    `;
    await executeQuery('BEGIN TRANSACTION;');

    await executeQuery(insertIntoPlanTable, [
      name, 
      studentId, 
      DEFAULT_EMOJI
    ]);
    
    const resultSet = await executeQuery(`SELECT * FROM Plan WHERE name = (?) ORDER BY id DESC LIMIT 1`, [name])
    
    if (!(resultSet.rows.length)) {
      await executeQuery('ROLLBACK;');
      throw new Error('Could not create new plan')
    } else {
      await executeQuery('COMMIT;');
    }
    
    return resultSet.rows.item(0)
  }

  static getPlans = async (studentId: string): Promise<Plan[]> => {
    // Sample data for inserting into StudentData table
    const selectAllFromPlanTable = `SELECT * FROM Plan WHERE studentId = (?);`;
    const resultSet = await executeQuery(selectAllFromPlanTable, [studentId])
    let resultsArray: Plan[] = [];
    for (let i = 0; i < resultSet.rows.length; i++) {
      resultsArray.push(resultSet.rows.item(i));
    }
    return resultsArray;
  }

  static updatePlan = async (plan: Plan, studentId: string): Promise<void> => {
    try {
      const updateQuery = `
          UPDATE Plan
          SET name = (?), studentId = (?), emoji = (?)
          WHERE id = (?);
      `;

      const params = [
        plan.name,
        studentId,
        plan.emoji,
        plan.id
      ];

      await executeQuery(updateQuery, params);
    } catch (error) {
        console.error("Error updating plan:", error);
    }
  }

  static deletePlan = async (plan: Plan): Promise<void> => {
    const deleteStudentData = `DELETE FROM Plan WHERE id = (?);`;
    await executeQuery(deleteStudentData, [plan.id]);
    return 
  }

  // TODO: deleting Plan items, elements and subitems
}
