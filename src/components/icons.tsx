import { Sparkles } from 'lucide-react';

export function CosmicFactsLogo() {
  return (
    <div className="flex items-center justify-center gap-2">
      <div className="relative">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-primary"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 12c-3.31 0-6 2.69-6 6" />
          <path d="M12 12c3.31 0 6 2.69 6 6" />
        </svg>
        <Sparkles className="absolute -top-1 -right-1 h-5 w-5 text-accent" />
      </div>
      <h1 className="text-4xl font-headline font-bold text-foreground">
        CosmicFacts
      </h1>
    </div>
  );
}
