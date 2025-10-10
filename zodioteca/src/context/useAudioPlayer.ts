import { useContext } from 'react';
import { AudioPlayerContext } from './AudioPlayerContext';
import type { AudioPlayerContextType } from './AudioPlayerContext';

/**
 * Hook para usar el contexto del reproductor de audio
 * @throws Error si se usa fuera del AudioPlayerProvider
 */
export const useAudioPlayer = (): AudioPlayerContextType => {
  const context = useContext(AudioPlayerContext);
  if (!context) {
    throw new Error('useAudioPlayer must be used within an AudioPlayerProvider');
  }
  return context;
};
