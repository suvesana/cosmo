'use server';

import { analyzeImageContent } from '@/ai/flows/analyze-image-content';
import { generateFunFacts } from '@/ai/flows/generate-fun-facts';
import { generateQuizQuestions } from '@/ai/flows/generate-quiz-questions';
import { textToSpeech } from '@/ai/flows/text-to-speech';
import type { QuizQuestion } from '@/lib/types';

export async function identifyPlanetFromImage(
  photoDataUri: string
): Promise<{ planetName: string } | { error: string }> {
  try {
    const result = await analyzeImageContent({ photoDataUri });
    // Basic validation for common non-planet responses
    if (!result.planetName || result.planetName.toLowerCase().includes('not a planet')) {
        return { error: "This doesn't look like a planet. Please try another image!" };
    }
    return result;
  } catch (e) {
    console.error(e);
    return { error: 'Failed to analyze the image. Please try again.' };
  }
}

export async function getFunFacts(
  planetName: string
): Promise<{ funFacts: string[] } | { error: string }> {
  try {
    return await generateFunFacts({ planetName });
  } catch (e) {
    console.error(e);
    return { error: 'Failed to generate fun facts. Please try again.' };
  }
}

export async function getQuiz(
  planetName: string,
  funFacts: string[]
): Promise<{ quizQuestions: QuizQuestion[] } | { error: string }> {
  try {
    const factsAsString = funFacts.join(' ');
    const result = await generateQuizQuestions({ planetName, funFacts: factsAsString });
    return { quizQuestions: result.quizQuestions };
  } catch (e) {
    console.error(e);
    return { error: 'Failed to generate the quiz. Please try again.' };
  }
}

export async function getNarrationAudio(
  text: string
): Promise<{ audioDataUri: string } | { error: string }> {
  try {
    const result = await textToSpeech({ text });
    return result;
  } catch (e) {
    console.error(e);
    return { error: 'Failed to generate narration. Please try again.' };
  }
}
