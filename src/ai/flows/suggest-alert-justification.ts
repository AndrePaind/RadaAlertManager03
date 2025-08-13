'use server';
/**
 * @fileOverview AI agent that suggests a justification draft for alerts.
 *
 * - suggestAlertJustification - A function that suggests a justification draft for an alert.
 * - SuggestAlertJustificationInput - The input type for the suggestAlertJustification function.
 * - SuggestAlertJustificationOutput - The return type for the suggestAlertJustification function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestAlertJustificationInputSchema = z.object({
  regions: z.array(
    z.string().describe('The regions for which the alert is being created.')
  ).describe('A list of regions affected by the alert.'),
  eventDate: z.string().describe('The date of the event for which the alert is being created.'),
  eventType: z.string().describe('The type of event for which the alert is being created (e.g., heavy rainfall).'),
  severity: z.enum(['yellow', 'orange', 'red']).describe('The severity of the alert.'),
  ensembleForecasts: z.string().describe('The ensemble forecasts data that is used to determine the severity.'),
});
export type SuggestAlertJustificationInput = z.infer<typeof SuggestAlertJustificationInputSchema>;

const SuggestAlertJustificationOutputSchema = z.object({
  justification: z.string().describe('A suggested justification for the alert.'),
});
export type SuggestAlertJustificationOutput = z.infer<typeof SuggestAlertJustificationOutputSchema>;

export async function suggestAlertJustification(input: SuggestAlertJustificationInput): Promise<SuggestAlertJustificationOutput> {
  return suggestAlertJustificationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestAlertJustificationPrompt',
  input: {schema: SuggestAlertJustificationInputSchema},
  output: {schema: SuggestAlertJustificationOutputSchema},
  prompt: `You are an AI assistant that helps MeteOps Leads quickly create alert justifications.

  Given the following information, suggest a justification for the alert. Be concise and clear.

  Regions: {{regions}}
  Event Date: {{eventDate}}
  Event Type: {{eventType}}
  Severity: {{severity}}
  Ensemble Forecasts: {{ensembleForecasts}}

  Justification:`,
});

const suggestAlertJustificationFlow = ai.defineFlow(
  {
    name: 'suggestAlertJustificationFlow',
    inputSchema: SuggestAlertJustificationInputSchema,
    outputSchema: SuggestAlertJustificationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
