import React from 'react';
import InfiniteSlider from './ui/infinite-slider';

const LOGOS = [
  { name: 'OpenAI', url: 'https://html.tailus.io/blocks/customers/openai.svg' },
  { name: 'Nvidia', url: 'https://html.tailus.io/blocks/customers/nvidia.svg' },
  { name: 'GitHub', url: 'https://www.vectorlogo.zone/logos/github/github-tile.svg' },
  { name: 'Microsoft', url: 'https://www.vectorlogo.zone/logos/microsoft/microsoft-icon.svg' },
  { name: 'Apple', url: 'https://www.vectorlogo.zone/logos/apple/apple-icon.svg' },
  { name: 'Google', url: 'https://www.vectorlogo.zone/logos/google/google-icon.svg' },
];

const LogoCloud = () => {
  const logoItems = LOGOS.map((logo) => (
    <div key={logo.name} className="group px-4 transition-all duration-300">
      <img
        src={logo.url}
        alt={logo.name}
        className="h-8 md:h-10 w-auto brightness-0 invert opacity-40 group-hover:opacity-100 transition-opacity"
      />
    </div>
  ));

  return (
    <div className="w-full py-12 md:py-20 border-b border-white/5 bg-black/20 backdrop-blur-sm">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
          <div className="flex-shrink-0 text-center md:text-left">
            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 mb-1">
              Trusted by experts
            </h2>
            <div className="hidden md:block w-px h-8 bg-white/10 mx-auto md:mx-0 my-4" />
            <p className="text-sm text-white/40 font-light">
              Powering the best teams
            </p>
          </div>
          
          <div className="flex-grow overflow-hidden">
            <InfiniteSlider items={logoItems} speed={30} gap={60} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoCloud;
