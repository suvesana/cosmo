'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import type { QuizQuestion } from '@/lib/types';
import { CheckCircle } from 'lucide-react';

interface QuizViewProps {
  questions: QuizQuestion[];
  onSubmit: (answers: Record<number, string>) => void;
}

export function QuizView({ questions, onSubmit }: QuizViewProps) {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const allQuestionsAnswered = Object.keys(answers).length === questions.length;

  const handleAnswerChange = (questionIndex: number, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionIndex]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(answers);
  };

  return (
    <div className="w-full animate-in fade-in duration-500">
      <Card className="w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-headline text-accent">Planet Quiz</CardTitle>
          <CardDescription>Test your newfound knowledge!</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            {questions.map((q, index) => (
              <div key={index} className="space-y-4 p-4 rounded-lg bg-primary/10">
                <p className="text-lg font-semibold">{`${index + 1}. ${q.question}`}</p>
                <RadioGroup
                  onValueChange={(value) => handleAnswerChange(index, value)}
                  className="space-y-2"
                >
                  {q.options.map((option, optionIndex) => (
                    <div key={optionIndex} className="flex items-center space-x-3 bg-background/50 p-3 rounded-md border border-transparent has-[:checked]:border-accent has-[:checked]:bg-accent/20">
                      <RadioGroupItem value={option} id={`q${index}-o${optionIndex}`} />
                      <Label htmlFor={`q${index}-o${optionIndex}`} className="text-base flex-1 cursor-pointer">
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            ))}
            <Button type="submit" size="lg" className="w-full font-bold" disabled={!allQuestionsAnswered}>
              <CheckCircle className="mr-2 h-5 w-5" />
              Submit Answers
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
