import React from 'react';
import ScreenHero from './ScreenHero';

interface ScreenContentProps {
  progress?: number;
}

const ScreenContent = ({ progress = 1 }: ScreenContentProps) => {
  return (
    <div className="w-full h-full bg-background overflow-hidden border-none outline-none">
      <main className="h-full">
        <ScreenHero progress={progress} />
      </main>
    </div>
  );
};

export default ScreenContent;
