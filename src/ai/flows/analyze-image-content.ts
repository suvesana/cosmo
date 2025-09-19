'use server';

/**
 * @fileOverview An AI agent that identifies the content of an image, specifically planets.
 *
 * - analyzeImageContent - A function that handles the image analysis process.
 * - AnalyzeImageContentInput - The input type for the analyzeImageContent function.
 * - AnalyzeImageContentOutput - The return type for the analyzeImageContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeImageContentInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      'A photo, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' // Properly escaped quotes
    ),
});
export type AnalyzeImageContentInput = z.infer<typeof AnalyzeImageContentInputSchema>;

const AnalyzeImageContentOutputSchema = z.object({
  planetName: z.string().describe('The name of the planet identified in the image.'),
});
export type AnalyzeImageContentOutput = z.infer<typeof AnalyzeImageContentOutputSchema>;

export async function analyzeImageContent(input: AnalyzeImageContentInput): Promise<AnalyzeImageContentOutput> {
  return analyzeImageContentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeImageContentPrompt',
  input: {schema: AnalyzeImageContentInputSchema},
  output: {schema: AnalyzeImageContentOutputSchema},
  prompt: `You are an expert in identifying planets from images.

  Analyze the image provided and identify the planet shown in the image. Return the name of the planet.
  
  Here is the image to analyze:
  {{media url=photoDataUri}}`,
});

const analyzeImageContentFlow = ai.defineFlow(
  {
    name: 'analyzeImageContentFlow',
    inputSchema: AnalyzeImageContentInputSchema,
    outputSchema: AnalyzeImageContentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
