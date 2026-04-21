import React, { useEffect, useRef, useState } from 'react';
import { BRAND } from "@/config/brand";

interface ScreenHeroProps {
  progress?: number;
}

const ScreenHero = ({ progress = 1 }: ScreenHeroProps) => {
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
        if (currentTime < 0.5) {
          setOpacity(currentTime / 0.5);
        } else if (currentTime > duration - 0.5) {
          setOpacity((duration - currentTime) / 0.5);
        } else {
          setOpacity(1);
        }
      }
      rafId = requestAnimationFrame(updateFade);
    };

    const handleEnded = () => {
      setOpacity(0);
      setTimeout(() => {
        if (video) {
          video.currentTime = 0;
          video.play().catch(e => console.error("Video replay failed:", e));
        }
      }, 100);
    };

    video.addEventListener('ended', handleEnded);
    rafId = requestAnimationFrame(updateFade);

    return () => {
      cancelAnimationFrame(rafId);
      video.removeEventListener('ended', handleEnded);
    };
  }, []);

  // Calculate dynamic text offset based on zoom progress
  const textTranslateY = (1 - progress) * 12;

  return (
    <section className="bg-black relative h-full w-full flex flex-col items-center overflow-hidden border-none cursor-default">
      {/* Top Section: Text Content (Sharp, No Blurs) */}
      <div 
        className="relative z-10 flex flex-col items-center text-center w-full pt-10 pb-4 px-6 shrink-0 transition-transform duration-100 ease-linear"
        style={{ transform: `translateY(${textTranslateY}vh)` }}
      >
        <h1
          className="font-semibold tracking-[-0.04em] leading-[1.0] mb-3 whitespace-pre-line"
          style={{
            fontFamily: BRAND.hero.headlineFont,
            fontSize: BRAND.hero.headlineSize,
            background: BRAND.hero.headlineGradient,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent"
          }}
        >
          {BRAND.hero.headline}
        </h1>

        <p 
          className="max-w-2xl mx-auto leading-relaxed px-4 opacity-100 antialiased"
          style={{
            color: BRAND.hero.subtextColor,
            fontFamily: BRAND.hero.subtextFont,
            fontSize: BRAND.hero.subtextSize
          }}
        >
          {BRAND.hero.subtext}
        </p>
      </div>

      {/* Bottom Section: Brighter, Crisp Wave Animation */}
      <div className="relative w-full flex-grow overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="w-full h-full object-cover brightness-110 contrast-110"
          style={{ opacity }} // Full brightness (opacity 1.0)
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260308_114720_3dabeb9e-2c39-4907-b747-bc3544e2d5b7.mp4"
        />
        
        {/* Deeper Black Gradients to hide edges and increase contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-black z-[1]" />
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black to-transparent z-[1]" />
        <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-black to-transparent z-[1]" />
        <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-black to-transparent z-[1]" />
      </div>

      {/* Very subtle glow, making sure it doesn't wash out the black */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[50%] bg-primary/[0.03] blur-[120px] -z-10 rounded-full" />
    </section>
  );
};

export default ScreenHero;
