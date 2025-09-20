'use client';

import { useState, useTransition } from 'react';
import { Camera, Loader2, Star } from 'lucide-react';

import type { QuizQuestion } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { CosmicFactsLogo } from '@/components/icons';
import { CameraCapture } from '@/components/camera-capture';
import { PlanetDisplay } from '@/components/planet-display';
import { QuizView } from '@/components/quiz-view';
import { QuizResult } from '@/components/quiz-result';
import { getFunFacts, getQuiz, identifyPlanetFromImage } from '@/app/actions';

type AppState = 'idle' | 'capturing' | 'identifying' | 'displaying_facts' | 'quizzing' | 'results';
type QuizAnswers = Record<number, string>;

export default function CosmicFactsMain() {
  const [appState, setAppState] = useState<AppState>('idle');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [planetName, setPlanetName] = useState<string | null>(null);
  const [funFacts, setFunFacts] = useState<string[]>([]);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [quizResult, setQuizResult] = useState<{ score: number; total: number } | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleImageCapture = (imageDataUrl: string) => {
    setCapturedImage(imageDataUrl);
    setAppState('identifying');
    startTransition(async () => {
      const planetResult = await identifyPlanetFromImage(imageDataUrl);
      if ('error' in planetResult) {
        toast({ title: 'Error', description: planetResult.error, variant: 'destructive' });
        resetState();
        return;
      }

      const identifiedPlanet = planetResult.planetName;
      setPlanetName(identifiedPlanet);

      const factsResult = await getFunFacts(identifiedPlanet);
      if ('error' in factsResult) {
        toast({ title: 'Error', description: factsResult.error, variant: 'destructive' });
        resetState();
        return;
      }
      const generatedFacts = factsResult.funFacts;
      setFunFacts(generatedFacts);

      const quizResult = await getQuiz(identifiedPlanet, generatedFacts);
      if ('error' in quizResult) {
        toast({ title: 'Error', description: quizResult.error, variant: 'destructive' });
        resetState();
        return;
      }
      setQuizQuestions(quizResult.quizQuestions);

      setAppState('displaying_facts');
    });
  };

  const handleQuizSubmit = (answers: QuizAnswers) => {
    let score = 0;
    quizQuestions.forEach((q, index) => {
      if (answers[index] === q.correctAnswer) {
        score++;
      }
    });
    setQuizResult({ score, total: quizQuestions.length });
    setAppState('results');
  };

  const resetState = () => {
    setAppState('idle');
    setCapturedImage(null);
    setPlanetName(null);
    setFunFacts([]);
    setQuizQuestions([]);
    setQuizResult(null);
  };

  const renderContent = () => {
    if (isPending || appState === 'identifying') {
      return (
        <div className="flex flex-col items-center gap-4 text-center">
          <Loader2 className="h-16 w-16 animate-spin text-accent" />
          <h2 className="text-2xl font-headline font-semibold">Identifying Planet...</h2>
          <p className="text-muted-foreground">Our AI is analyzing the cosmic object!</p>
          {capturedImage && <img src={capturedImage} alt="Captured planet" className="mt-4 h-40 w-40 rounded-full object-cover border-4 border-primary" />}
        </div>
      );
    }

    switch (appState) {
      case 'capturing':
        return <CameraCapture onCapture={handleImageCapture} onCancel={() => setAppState('idle')} />;
      case 'displaying_facts':
        return (
          <PlanetDisplay
            planetName={planetName!}
            funFacts={funFacts}
            onStartQuiz={() => setAppState('quizzing')}
          />
        );
      case 'quizzing':
        return <QuizView questions={quizQuestions} onSubmit={handleQuizSubmit} />;
      case 'results':
        return <QuizResult result={quizResult!} onRetry={resetState} />;
      case 'idle':
      default:
        return (
          <div className="flex flex-col items-center gap-6 text-center">
            <CosmicFactsLogo />
            <p className="max-w-md text-lg text-muted-foreground font-body">
              Point your camera at a planet image, discover amazing facts, and test your knowledge with a fun quiz!
            </p>
            <Button size="lg" onClick={() => setAppState('capturing')} className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold text-lg">
              <Camera className="mr-2 h-6 w-6" />
              Scan a Planet!
            </Button>
            <div className="mt-6 text-sm text-muted-foreground font-body text-center">
              <p>A Grade 6B Science Exhibition Project for DPS Monarch International School.</p>
              <p className="font-bold mt-4 mb-2">Brought to life by our amazing team:</p>
              <ul className="flex flex-col items-center space-y-1">
                  <li className="flex items-center gap-2"><Star className="w-4 h-4 text-accent" /> Suvesana Vengadesh</li>
                  <li className="flex items-center gap-2"><Star className="w-4 h-4 text-accent" /> Kaashvi</li>
                  <li className="flex items-center gap-2"><Star className="w-4 h-4 text-accent" /> Evana</li>
              </ul>
            </div>
          </div>
        );
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-2xl shadow-primary/20 border-primary/20">
      <CardContent className="p-6 md:p-10">
        {renderContent()}
      </CardContent>
    </Card>
  );
}
