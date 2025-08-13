// src/ai/flows/highlight-suggested-edits.ts
'use server';
/**
 * @fileOverview This file defines a Genkit flow for highlighting suggested edits to an alert based on forecast changes.
 *
 * - highlightSuggestedEdits - A function that takes the original alert and updated forecast data and returns suggested edits.
 * - HighlightSuggestedEditsInput - The input type for the highlightSuggestedEdits function.
 * - HighlightSuggestedEditsOutput - The return type for the highlightSuggestedEdits function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const HighlightSuggestedEditsInputSchema = z.object({
  originalAlert: z.string().describe('The original alert text.'),
  updatedForecast: z.string().describe('The updated forecast data.'),
});
export type HighlightSuggestedEditsInput = z.infer<
  typeof HighlightSuggestedEditsInputSchema
>;

const HighlightSuggestedEditsOutputSchema = z.object({
  suggestedEdits: z
    .string()
    .describe('Suggested edits to the original alert based on the updated forecast.'),
});
export type HighlightSuggestedEditsOutput = z.infer<
  typeof HighlightSuggestedEditsOutputSchema
>;

export async function highlightSuggestedEdits(
  input: HighlightSuggestedEditsInput
): Promise<HighlightSuggestedEditsOutput> {
  return highlightSuggestedEditsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'highlightSuggestedEditsPrompt',
  input: {schema: HighlightSuggestedEditsInputSchema},
  output: {schema: HighlightSuggestedEditsOutputSchema},
  prompt: `You are an AI assistant helping a MeteOps Lead identify suggested edits to an alert based on updated forecast data.

  Original Alert: {{{originalAlert}}}
  Updated Forecast Data: {{{updatedForecast}}}

  Based on the updated forecast data, suggest specific edits to the original alert. Be as concise as possible.
  Return the suggested edits, with explanations if necessary.`,
});

const highlightSuggestedEditsFlow = ai.defineFlow(
  {
    name: 'highlightSuggestedEditsFlow',
    inputSchema: HighlightSuggestedEditsInputSchema,
    outputSchema: HighlightSuggestedEditsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
