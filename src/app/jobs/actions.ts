'use server';

import { generateJobListingDescription, GenerateJobListingDescriptionInput } from '@/ai/flows/generate-job-listing-description';
import { z } from 'zod';

const GenerateJobListingDescriptionInputSchema = z.object({
  jobTitle: z.string().describe('The title of the job.'),
  companyName: z.string().describe('The name of the company.'),
  keywords: z.string().describe('Keywords related to the job, separated by commas.'),
  language: z.string().describe('The language for the job description (e.g., English, Tajik, Russian).'),
});

export async function generateDescriptionAction(input: GenerateJobListingDescriptionInput): Promise<{ description?: string; error?: string }> {
  const validation = GenerateJobListingDescriptionInputSchema.safeParse(input);
  if (!validation.success) {
      return { error: "Invalid input provided." };
  }

  try {
    const result = await generateJobListingDescription(validation.data);
    return { description: result.jobDescription };
  } catch (error) {
    console.error("Error generating job description:", error);
    return { error: 'An error occurred while generating the description.' };
  }
}
