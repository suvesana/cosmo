'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating fun facts about a given planet.
 *
 * The flow takes a planet name as input and returns a set of fun facts about that planet.
 * This file exports:
 *   - generateFunFacts: The main function to trigger the flow.
 *   - GenerateFunFactsInput: The input type for the flow.
 *   - GenerateFunFactsOutput: The output type for the flow.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateFunFactsInputSchema = z.object({
  planetName: z.string().describe('The name of the planet to generate fun facts for.'),
});
export type GenerateFunFactsInput = z.infer<typeof GenerateFunFactsInputSchema>;

const GenerateFunFactsOutputSchema = z.object({
  funFacts: z.array(z.string()).describe('An array of fun facts about the planet.'),
});
export type GenerateFunFactsOutput = z.infer<typeof GenerateFunFactsOutputSchema>;

export async function generateFunFacts(input: GenerateFunFactsInput): Promise<GenerateFunFactsOutput> {
  return generateFunFactsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateFunFactsPrompt',
  input: {schema: GenerateFunFactsInputSchema},
  output: {schema: GenerateFunFactsOutputSchema},
  prompt: `You are a fun fact generator for elementary school students.

  Generate 3 fun facts about the planet {{planetName}}. The fun facts should be appropriate and interesting for elementary school students.

  Format each fun fact as a short, complete sentence.

  Return the fun facts as a JSON array.`,
});

const generateFunFactsFlow = ai.defineFlow(
  {
    name: 'generateFunFactsFlow',
    inputSchema: GenerateFunFactsInputSchema,
    outputSchema: GenerateFunFactsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
