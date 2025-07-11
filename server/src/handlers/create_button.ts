
import { db } from '../db';
import { buttonsTable } from '../db/schema';
import { type Button } from '../schema';

export const createButton = async (): Promise<Button> => {
  try {
    // Insert default red button with no text
    const result = await db.insert(buttonsTable)
      .values({
        color: 'red',
        text: null
      })
      .returning()
      .execute();

    const button = result[0];
    return {
      ...button,
      text: button.text // Already nullable, no conversion needed
    };
  } catch (error) {
    console.error('Button creation failed:', error);
    throw error;
  }
};
