import React, { useEffect, useRef, useState } from 'react';

const BRANDS = [
  { name: 'Vortex', initial: 'V' },
  { name: 'Nimbus', initial: 'N' },
  { name: 'Prysma', initial: 'P' },
  { name: 'Cirrus', initial: 'C' },
  { name: 'Kynder', initial: 'K' },
  { name: 'Halcyn', initial: 'H' },
];

const ScreenSocialProof = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let rafId: number;

    const updateFade = () => {
      const duration = video.duration;
      const currentTime = video.currentTime;

      if (!isNaN(duration) && duration > 0) {
        // Fade in (0.5s)
        if (currentTime < 0.5) {
          setOpacity(currentTime / 0.5);
        } 
        // Fade out (last 0.5s)
        else if (currentTime > duration - 0.5) {
          setOpacity((duration - currentTime) / 0.5);
        } 
        // Solid in between
        else {
          setOpacity(1);
        }
      }
      rafId = requestAnimationFrame(updateFade);
    };

    const handleEnded = () => {
      setOpacity(0);
      setTimeout(() => {
        video.currentTime = 0;
        video.play().catch(e => console.error("Video replay failed:", e));
      }, 100);
    };

    video.addEventListener('ended', handleEnded);
    rafId = requestAnimationFrame(updateFade);

    return () => {
      cancelAnimationFrame(rafId);
      video.removeEventListener('ended', handleEnded);
    };
  }, []);

  return (
    <section className="relative w-full overflow-hidden bg-background">
      {/* Background Video */}
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-100"
        style={{ opacity }}
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260308_114720_3dabeb9e-2c39-4907-b747-bc3544e2d5b7.mp4"
      />

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background z-[1]" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center pt-16 pb-24 px-4 gap-20">
        <div className="h-40" aria-hidden="true" /> {/* Spacer for video visibility */}

        {/* Logo Marquee */}
        <div className="w-full max-w-5xl flex items-center overflow-hidden">
          {/* Left: Heading */}
          <div className="text-foreground/50 text-sm whitespace-nowrap shrink-0 leading-tight pr-12">
            Relied on by brands <br /> across the globe
          </div>

          {/* Right: Marquee Container */}
          <div className="flex-grow overflow-hidden relative group">
            <div className="flex animate-marquee gap-16 whitespace-nowrap">
              {/* Duplicated for seamless loop */}
              {[...BRANDS, ...BRANDS].map((brand, idx) => (
                <div key={idx} className="flex items-center gap-3 flex-shrink-0">
                  <div className="liquid-glass w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-bold">
                    {brand.initial}
                  </div>
                  <span className="text-base font-semibold text-foreground tracking-tight">
                    {brand.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ScreenSocialProof;
