
import { serial, text, pgTable, timestamp } from 'drizzle-orm/pg-core';

export const buttonsTable = pgTable('buttons', {
  id: serial('id').primaryKey(),
  color: text('color').notNull(),
  text: text('text'), // Nullable by default for button text
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// TypeScript type for the table schema
export type Button = typeof buttonsTable.$inferSelect; // For SELECT operations
export type NewButton = typeof buttonsTable.$inferInsert; // For INSERT operations

// Important: Export all tables and relations for proper query building
export const tables = { buttons: buttonsTable };
