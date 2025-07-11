
import { z } from 'zod';

// Button schema - represents the red button state
export const buttonSchema = z.object({
  id: z.number(),
  color: z.string(),
  text: z.string().nullable(),
  created_at: z.coerce.date()
});

export type Button = z.infer<typeof buttonSchema>;

// Input schema for getting button state
export const getButtonInputSchema = z.object({
  id: z.number().optional().default(1) // Default to button with ID 1
});

export type GetButtonInput = z.infer<typeof getButtonInputSchema>;
