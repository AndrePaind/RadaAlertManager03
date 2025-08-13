'use server';
/**
 * @file This file contains server actions that are called from the client-side components.
 * Server actions are a Next.js feature that allows running server-side code from the client,
 * eliminating the need to create separate API routes for many use cases.
 */

import {
  suggestAlertJustification as suggestAlertJustificationFlow,
  type SuggestAlertJustificationInput,
} from '@/ai/flows/suggest-alert-justification';

/**
 * Calls the Genkit AI flow to suggest a justification for a weather alert.
 * This function is invoked from the AlertForm component.
 *
 * @param input - The data required by the AI flow, including regions, event details, and severity.
 * @returns An object indicating success or failure, with the suggested justification or an error message.
 *
 * @backend-note This is the primary integration point for the AI suggestion feature. The backend developer
 * might need to adjust the `suggestAlertJustificationFlow` or the data it receives, but the client-side
 * call will remain the same. The `ensembleForecasts` property in the input is currently using mock data
 * and should be connected to a real data source.
 */
export async function suggestJustificationAction(
  input: SuggestAlertJustificationInput
) {
  try {
    const result = await suggestAlertJustificationFlow(input);
    return { success: true, justification: result.justification };
  } catch (error) {
    console.error('Error suggesting justification:', error);
    return { success: false, error: 'Failed to generate justification.' };
  }
}
