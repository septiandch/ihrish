import { useCallback, useEffect, useRef, useState } from "react";

export function useSound(soundUrl: string) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [hasInteraction, setHasInteraction] = useState(false);

  // Initialize audio and user interaction detection
  useEffect(() => {
    if (typeof window !== "undefined") {
      audioRef.current = new Audio(soundUrl);
      setIsReady(true);

      // Listen for user interactions
      const handleInteraction = () => setHasInteraction(true);

      window.addEventListener("click", handleInteraction);
      window.addEventListener("keydown", handleInteraction);
      window.addEventListener("touchstart", handleInteraction);

      return () => {
        window.removeEventListener("click", handleInteraction);
        window.removeEventListener("keydown", handleInteraction);
        window.removeEventListener("touchstart", handleInteraction);
        if (audioRef.current) {
          audioRef.current = null;
        }
      };
    }
  }, [soundUrl]);

  // Play function with interaction check
  const play = useCallback(() => {
    if (!audioRef.current || !isReady || !hasInteraction) return;

    // Reset to start and play
    audioRef.current.currentTime = 0;
    const playPromise = audioRef.current.play();

    if (playPromise) {
      playPromise.catch((error) => {
        console.warn("Audio playback prevented:", error);
      });
    }
  }, [isReady, hasInteraction]);

  return {
    play,
    isReady,
    canAutoplay: hasInteraction,
  };
}
