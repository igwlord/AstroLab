import React, { createContext, useState, useRef, useCallback, useEffect } from 'react';
import type { ZodiacFrequency } from '../types/zodiacFrequency';
import { ZODIAC_FREQUENCIES } from '../data/zodiacFrequencies';
import { logger } from '../utils/logger';

export interface AudioPlayerContextType {
  currentFrequency: ZodiacFrequency | null;
  isPlaying: boolean;
  volume: number;
  play: (frequency: ZodiacFrequency) => void;
  pause: () => void;
  toggle: () => void;
  next: () => void;
  previous: () => void;
  setVolume: (volume: number) => void;
}

export const AudioPlayerContext = createContext<AudioPlayerContextType | undefined>(undefined);

export const AudioPlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentFrequency, setCurrentFrequency] = useState<ZodiacFrequency | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(0.7); // Volumen inicial 70%
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Inicializar el elemento de audio
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.loop = true;
      
      // Event listeners
      audioRef.current.addEventListener('play', () => setIsPlaying(true));
      audioRef.current.addEventListener('pause', () => setIsPlaying(false));
      audioRef.current.addEventListener('ended', () => setIsPlaying(false));
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, []);

  const play = useCallback((frequency: ZodiacFrequency) => {
    if (!audioRef.current) return;

    try {
      // Si es la misma frecuencia y está pausada, solo reanudar
      if (currentFrequency?.id === frequency.id && audioRef.current.paused) {
        audioRef.current.play();
        setIsPlaying(true);
        return;
      }

      // Si es una nueva frecuencia, cambiar el audio
      if (currentFrequency?.id !== frequency.id) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current.src = frequency.audioFile;
        setCurrentFrequency(frequency);
      }

      // Reproducir
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(err => {
        logger.error('Error playing audio:', err);
      });
    } catch (error) {
      logger.error('Error in play function:', error);
    }
  }, [currentFrequency]);

  const pause = useCallback(() => {
    if (audioRef.current && !audioRef.current.paused) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, []);

  const toggle = useCallback(() => {
    if (!currentFrequency) return;
    
    if (isPlaying) {
      pause();
    } else {
      play(currentFrequency);
    }
  }, [currentFrequency, isPlaying, play, pause]);

  const next = useCallback(() => {
    if (!currentFrequency) return;

    const currentIndex = ZODIAC_FREQUENCIES.findIndex(f => f.id === currentFrequency.id);
    const nextIndex = (currentIndex + 1) % ZODIAC_FREQUENCIES.length;
    const nextFrequency = ZODIAC_FREQUENCIES[nextIndex];
    
    play(nextFrequency);
  }, [currentFrequency, play]);

  const previous = useCallback(() => {
    if (!currentFrequency) return;

    const currentIndex = ZODIAC_FREQUENCIES.findIndex(f => f.id === currentFrequency.id);
    const prevIndex = (currentIndex - 1 + ZODIAC_FREQUENCIES.length) % ZODIAC_FREQUENCIES.length;
    const prevFrequency = ZODIAC_FREQUENCIES[prevIndex];
    
    play(prevFrequency);
  }, [currentFrequency, play]);

  const setVolume = useCallback((newVolume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    setVolumeState(clampedVolume);
    if (audioRef.current) {
      audioRef.current.volume = clampedVolume;
    }
  }, []);

  // Sincronizar volumen con el audio element
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const value: AudioPlayerContextType = {
    currentFrequency,
    isPlaying,
    volume,
    play,
    pause,
    toggle,
    next,
    previous,
    setVolume,
  };

  return (
    <AudioPlayerContext.Provider value={value}>
      {children}
    </AudioPlayerContext.Provider>
  );
};
