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
  mercury: { src: 'https://hobart.k12.in.us/cside/Hitchhiker/mercury.gif', hint: 'cartoon mercury' },
  venus: { src: 'https://i.pinimg.com/564x/0f/a5/31/0fa531643954939ec86201276cada5ad.jpg', hint: 'cartoon venus' },
  earth: { src: 'https://static.vecteezy.com/system/resources/thumbnails/002/297/979/small_2x/planet-illustration-of-the-planet-earth-planet-with-t-shirts-and-ode-cartoon-style-free-vector.jpg', hint: 'cartoon earth' },
  mars: { src: 'https://i.fbcd.co/products/resized/resized-750-500/1806-m10-i006-n007-e06p-cc9a318359dbb8c2c3d1466cb5e8c20b2f18a7a017e73d9a9b6c4d12bb74e595.webp', hint: 'cartoon mars' },
  jupiter: { src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRadeylm7xbJeBBSkZVTiLQD4WAyEDOOW8lsA&s', hint: 'cartoon jupiter' },
  saturn: { src: 'https://www.shutterstock.com/image-vector/saturn-planet-vector-icon-isolated-260nw-2591459667.jpg', hint: 'cartoon saturn' },
  uranus: { src: 'https://static.vecteezy.com/system/resources/previews/002/728/980/non_2x/sticker-template-with-uranus-planet-isolated-free-vector.jpg', hint: 'cartoon uranus' },
  neptune: { src: 'https://img.freepik.com/premium-vector/neptune_1123339-2152.jpg', hint: 'cartoon neptune' },
  default: { src: 'https://t3.ftcdn.net/jpg/01/93/13/54/360_F_193135491_La4vpQjhnLojIZB1AERxh4Tu9RL0YdHj.jpg', hint: 'cartoon planet' },
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
