import React, { useEffect, useRef } from 'react';
import Hls from 'hls.js';

interface VideoHlsProps {
  src: string;
  fallbackSrc?: string;
  className?: string;
  poster?: string;
}

const VideoHls: React.FC<VideoHlsProps> = ({ src, fallbackSrc, className, poster }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let hls: Hls;

    if (Hls.isSupported()) {
      hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
      });
      hls.loadSource(src);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch(e => console.error("HLS Auto-play failed:", e));
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              console.error("HLS Network error, trying fallback...");
              hls.destroy();
              if (fallbackSrc) video.src = fallbackSrc;
              break;
            default:
              hls.destroy();
              if (fallbackSrc) video.src = fallbackSrc;
              break;
          }
        }
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Native HLS support (Safari)
      video.src = src;
      video.addEventListener('loadedmetadata', () => {
        video.play().catch(e => console.error("Native Auto-play failed:", e));
      });
    } else if (fallbackSrc) {
      // Fallback to MP4
      video.src = fallbackSrc;
    }

    return () => {
      if (hls) {
        hls.destroy();
      }
    };
  }, [src, fallbackSrc]);

  return (
    <video
      ref={videoRef}
      className={className}
      poster={poster}
      muted
      playsInline
      loop
      style={{
        width: '100%',
        height: 'auto',
        display: 'block',
        mixBlendMode: 'screen',
      }}
    />
  );
};

export default VideoHls;
