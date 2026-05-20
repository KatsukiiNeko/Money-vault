import Dexie from 'dexie';

// Create the database instance
export const db = new Dexie('MoneyVault');

// Define the database schema
db.version(1).stores({
  transactions: '++id,date,type,category',
  settings: 'key,value'
});

// Create a settings table for storing app settings like the encryption key
db.version(2).stores({
  transactions: '++id,date,type,category',
  settings: 'key,value'
});

// Export the database instance with both tables
export default db;