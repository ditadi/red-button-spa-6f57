
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { buttonsTable } from '../db/schema';
import { type GetButtonInput, getButtonInputSchema } from '../schema';
import { getButton } from '../handlers/get_button';

// Simple test input
const testInput: GetButtonInput = {
  id: 1
};

describe('getButton', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should get a button by ID', async () => {
    // First, create a test button
    const insertResult = await db.insert(buttonsTable)
      .values({
        color: 'red',
        text: 'Test Button'
      })
      .returning()
      .execute();

    const createdButton = insertResult[0];

    // Now get the button
    const result = await getButton({ id: createdButton.id });

    // Basic field validation
    expect(result.id).toEqual(createdButton.id);
    expect(result.color).toEqual('red');
    expect(result.text).toEqual('Test Button');
    expect(result.created_at).toBeInstanceOf(Date);
  });

  it('should get a button with null text', async () => {
    // Create a button with null text
    const insertResult = await db.insert(buttonsTable)
      .values({
        color: 'blue',
        text: null
      })
      .returning()
      .execute();

    const createdButton = insertResult[0];

    // Get the button
    const result = await getButton({ id: createdButton.id });

    expect(result.id).toEqual(createdButton.id);
    expect(result.color).toEqual('blue');
    expect(result.text).toBeNull();
    expect(result.created_at).toBeInstanceOf(Date);
  });

  it('should use default ID when not provided', async () => {
    // Create a button with ID 1
    await db.insert(buttonsTable)
      .values({
        color: 'green',
        text: 'Default Button'
      })
      .returning()
      .execute();

    // Parse empty object to apply Zod defaults
    const parsedInput = getButtonInputSchema.parse({});
    
    // Get button with parsed input (should default to 1)
    const result = await getButton(parsedInput);

    expect(result.id).toEqual(1);
    expect(result.color).toEqual('green');
    expect(result.text).toEqual('Default Button');
  });

  it('should throw error when button not found', async () => {
    // Try to get a button that doesn't exist
    await expect(getButton({ id: 999 })).rejects.toThrow(/Button with ID 999 not found/i);
  });
});
