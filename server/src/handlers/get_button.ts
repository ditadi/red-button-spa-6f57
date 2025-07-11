
import { db } from '../db';
import { buttonsTable } from '../db/schema';
import { type GetButtonInput, type Button } from '../schema';
import { eq } from 'drizzle-orm';

export const getButton = async (input: GetButtonInput): Promise<Button> => {
  try {
    // Query for the specific button by ID
    const results = await db.select()
      .from(buttonsTable)
      .where(eq(buttonsTable.id, input.id))
      .execute();

    if (results.length === 0) {
      throw new Error(`Button with ID ${input.id} not found`);
    }

    const button = results[0];
    return {
      id: button.id,
      color: button.color,
      text: button.text,
      created_at: button.created_at
    };
  } catch (error) {
    console.error('Get button failed:', error);
    throw error;
  }
};
