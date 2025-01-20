// db.ts
import Dexie, { type EntityTable } from 'dexie';
import { IExpenseData } from '../shared/interfaces';

const db = new Dexie('ExpensesDatabase') as Dexie & {
  Expenses: EntityTable<
  IExpenseData,
    'id' // primary key "id" (for the typings only)
  >;
};

// Schema declaration:
db.version(1).stores({
  Expenses: '++id, description, amount, date'
});

export { db };