'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PartyPopper, RotateCcw, Award } from 'lucide-react';

interface QuizResultProps {
  result: {
    score: number;
    total: number;
  };
  onRetry: () => void;
}

export function QuizResult({ result, onRetry }: QuizResultProps) {
  const isPerfectScore = result.score === result.total;

  return (
    <div className="w-full flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-500">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="mx-auto bg-accent/20 text-accent rounded-full p-4 w-fit mb-4">
            {isPerfectScore ? (
              <PartyPopper className="h-12 w-12" />
            ) : (
              <Award className="h-12 w-12" />
            )}
          </div>
          <CardTitle className="text-4xl font-headline">
            {isPerfectScore ? 'Hurray!' : 'Great Effort!'}
          </CardTitle>
          <CardDescription className="text-lg">
            You scored {result.score} out of {result.total}.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-6">
            {isPerfectScore
              ? "You're a true cosmic explorer! You answered all questions correctly."
              : 'You did a great job! Keep exploring to learn even more about our amazing universe.'}
          </p>
          <Button size="lg" onClick={onRetry} className="w-full font-bold">
            <RotateCcw className="mr-2 h-5 w-5" />
            {isPerfectScore ? 'Play Again' : 'Try Again'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
