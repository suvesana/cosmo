'use server';

/**
 * @fileOverview Generates a multiple-choice quiz based on the fun facts about a planet.
 *
 * - generateQuizQuestions - A function that generates quiz questions.
 * - GenerateQuizQuestionsInput - The input type for the generateQuizQuestions function.
 * - GenerateQuizQuestionsOutput - The return type for the generateQuizQuestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateQuizQuestionsInputSchema = z.object({
  funFacts: z.string().describe('Fun facts about a specific planet.'),
  planetName: z.string().describe('The name of the planet.'),
});
export type GenerateQuizQuestionsInput = z.infer<
  typeof GenerateQuizQuestionsInputSchema
>;

const GenerateQuizQuestionsOutputSchema = z.object({
  quizQuestions: z
    .array(
      z.object({
        question: z.string().describe('The quiz question.'),
        options: z.array(z.string()).describe('The multiple-choice options.'),
        correctAnswer: z.string().describe('The correct answer.'),
      })
    )
    .describe('Array of quiz questions.'),
});
export type GenerateQuizQuestionsOutput = z.infer<
  typeof GenerateQuizQuestionsOutputSchema
>;

export async function generateQuizQuestions(
  input: GenerateQuizQuestionsInput
): Promise<GenerateQuizQuestionsOutput> {
  return generateQuizQuestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateQuizQuestionsPrompt',
  input: {schema: GenerateQuizQuestionsInputSchema},
  output: {schema: GenerateQuizQuestionsOutputSchema},
  prompt: `You are an expert quiz generator for school students.

  Generate a multiple-choice quiz based on the following fun facts about {{planetName}}:
  {{funFacts}}

  The quiz should have 3 questions. Each question should have 4 options, with one correct answer. Make sure the questions and options are appropriate for school students.
  Return the quiz questions in a JSON format.
  Make sure the correct answer is one of the options.
  Here is the format:
  {
    "quizQuestions": [
      {
        "question": "Question 1",
        "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
        "correctAnswer": "Option 1"
      },
      {
        "question": "Question 2",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "correctAnswer": "Option B"
      },
      {
        "question": "Question 3",
        "options": ["Choice 1", "Choice 2", "Choice 3", "Choice 4"],
        "correctAnswer": "Choice 3"
      }
    ]
  }
  `,
});

const generateQuizQuestionsFlow = ai.defineFlow(
  {
    name: 'generateQuizQuestionsFlow',
    inputSchema: GenerateQuizQuestionsInputSchema,
    outputSchema: GenerateQuizQuestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
