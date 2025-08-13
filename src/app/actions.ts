'use server';

import { suggestAlertJustification as suggestAlertJustificationFlow, type SuggestAlertJustificationInput } from "@/ai/flows/suggest-alert-justification";

export async function suggestJustificationAction(input: SuggestAlertJustificationInput) {
    try {
        const result = await suggestAlertJustificationFlow(input);
        return { success: true, justification: result.justification };
    } catch (error) {
        console.error("Error suggesting justification:", error);
        return { success: false, error: "Failed to generate justification." };
    }
}
