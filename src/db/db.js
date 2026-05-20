import Dexie from 'dexie';

export const db = new Dexie('MoneyVault');

db.version(1).stores({
  transactions: '++id,date,type,category',
  settings: 'key,value'
});

db.version(2).stores({
  transactions: '++id,date,type,category',
  settings: 'key,value'
});

export default db;
