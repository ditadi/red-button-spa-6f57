
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { buttonsTable } from '../db/schema';
import { createButton } from '../handlers/create_button';
import { eq } from 'drizzle-orm';

describe('createButton', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should create a red button with no text', async () => {
    const result = await createButton();

    // Basic field validation
    expect(result.color).toEqual('red');
    expect(result.text).toBeNull();
    expect(result.id).toBeDefined();
    expect(result.created_at).toBeInstanceOf(Date);
  });

  it('should save button to database', async () => {
    const result = await createButton();

    // Query using proper drizzle syntax
    const buttons = await db.select()
      .from(buttonsTable)
      .where(eq(buttonsTable.id, result.id))
      .execute();

    expect(buttons).toHaveLength(1);
    expect(buttons[0].color).toEqual('red');
    expect(buttons[0].text).toBeNull();
    expect(buttons[0].created_at).toBeInstanceOf(Date);
  });

  it('should create multiple buttons with unique IDs', async () => {
    const button1 = await createButton();
    const button2 = await createButton();

    expect(button1.id).not.toEqual(button2.id);
    expect(button1.color).toEqual('red');
    expect(button2.color).toEqual('red');
    expect(button1.text).toBeNull();
    expect(button2.text).toBeNull();

    // Verify both buttons exist in database
    const buttons = await db.select()
      .from(buttonsTable)
      .execute();

    expect(buttons).toHaveLength(2);
  });
});
