'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Volume2, PlayCircle, Loader2 } from 'lucide-react';
import { getNarrationAudio } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';

interface PlanetDisplayProps {
  planetName: string;
  funFacts: string[];
  onStartQuiz: () => void;
}

const planetImages: Record<string, { src: string, hint: string }> = {
  mercury: { src: 'https://placehold.co/300x300/A8A2A2/FFFFFF.png', hint: 'cartoon mercury' },
  venus: { src: 'https://placehold.co/300x300/E6C2A6/FFFFFF.png', hint: 'cartoon venus' },
  earth: { src: 'https://placehold.co/300x300/6FA8DC/FFFFFF.png', hint: 'cartoon earth' },
  mars: { src: 'https://placehold.co/300x300/C1440E/FFFFFF.png', hint: 'cartoon mars' },
  jupiter: { src: 'https://placehold.co/300x300/D8B48A/FFFFFF.png', hint: 'cartoon jupiter' },
  saturn: { src: 'https://placehold.co/300x300/E3D5B9/FFFFFF.png', hint: 'cartoon saturn' },
  uranus: { src: 'https://placehold.co/300x300/A4D8E6/FFFFFF.png', hint: 'cartoon uranus' },
  neptune: { src: 'https://placehold.co/300x300/3A5FCD/FFFFFF.png', hint: 'cartoon neptune' },
  default: { src: 'https://placehold.co/300x300/808080/FFFFFF.png', hint: 'cartoon planet' },
};

export function PlanetDisplay({ planetName, funFacts, onStartQuiz }: PlanetDisplayProps) {
  const [isNarrating, setIsNarrating] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  const planetKey = planetName.toLowerCase();
  const planetImage = planetImages[planetKey] || planetImages.default;

  const handleNarrate = async () => {
    if (isGenerating || isNarrating) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      setIsNarrating(false);
      return;
    }

    setIsGenerating(true);
    const allFacts = funFacts.join('. ');
    const result = await getNarrationAudio(allFacts);
    setIsGenerating(false);

    if ('error' in result) {
      toast({ title: 'Error', description: result.error, variant: 'destructive' });
      return;
    }

    if (audioRef.current) {
      audioRef.current.src = result.audioDataUri;
      audioRef.current.play();
      setIsNarrating(true);
    }
  };

  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;

    const handleAudioEnd = () => setIsNarrating(false);
    audio.addEventListener('ended', handleAudioEnd);

    return () => {
      if (audio) {
        audio.removeEventListener('ended', handleAudioEnd);
        audio.pause();
        audio.src = '';
      }
    };
  }, []);

  return (
    <div className="flex flex-col items-center gap-6 w-full animate-in fade-in duration-500">
      <audio ref={audioRef} className="hidden" />
      <h2 className="text-4xl md:text-5xl font-headline font-bold text-center capitalize text-accent">{planetName}</h2>
      <div className={`relative transition-transform duration-300 ${isNarrating ? 'scale-105' : 'scale-100'}`}>
        <Image
          src={planetImage.src}
          alt={`Cartoon of ${planetName}`}
          width={250}
          height={250}
          className="rounded-full shadow-2xl shadow-primary/40"
          data-ai-hint={planetImage.hint}
        />
        <div className={`absolute bottom-8 left-1/2 -translate-x-1/2 w-16 bg-background rounded-full transition-all duration-200 ${isNarrating ? 'h-12 animate-pulse' : 'h-4'}`}></div>
      </div>
      
      <Card className="w-full bg-primary/10">
        <CardHeader>
          <CardTitle className="text-2xl font-headline flex items-center gap-2">
            Fun Facts!
            <Button variant="ghost" size="icon" onClick={handleNarrate} disabled={isGenerating} className="text-accent hover:bg-accent/20">
              {isGenerating ? <Loader2 className="h-6 w-6 animate-spin" /> : <Volume2 className="h-6 w-6" />}
            </Button>
          </CardTitle>
          <CardDescription>Listen to {planetName} share some secrets!</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3 list-disc list-inside text-lg">
            {funFacts.map((fact, index) => (
              <li key={index}>{fact}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
      
      <Button size="lg" onClick={onStartQuiz} className="mt-4 bg-accent hover:bg-accent/90 text-accent-foreground font-bold">
        <PlayCircle className="mr-2 h-6 w-6" />
        Take the Quiz!
      </Button>
    </div>
  );
}
