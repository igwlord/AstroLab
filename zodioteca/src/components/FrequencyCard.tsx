import React from 'react';
import type { ZodiacFrequency } from '../types/zodiacFrequency';

interface FrequencyCardProps {
  frequency: ZodiacFrequency;
  isActive?: boolean;
  onClick: () => void;
}

const FrequencyCard: React.FC<FrequencyCardProps> = ({ frequency, isActive = false, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`
        relative group
        w-full aspect-square
        rounded-full
        flex flex-col items-center justify-center
        transition-all duration-300
        ${isActive 
          ? 'scale-110 shadow-2xl ring-4 ring-offset-2 ring-offset-purple-950' 
          : 'hover:scale-105 shadow-lg hover:shadow-xl'
        }
      `}
      style={{
        backgroundColor: frequency.color.hex,
        boxShadow: isActive 
          ? `0 0 40px ${frequency.color.hex}, 0 0 80px ${frequency.color.hex}80`
          : `0 0 20px ${frequency.color.hex}40`
      }}
    >
      {/* Símbolo del signo */}
      <span className={`
        text-4xl sm:text-5xl md:text-6xl font-bold
        transition-transform duration-300
        ${isActive ? 'scale-110' : 'group-hover:scale-110'}
      `}>
        {frequency.symbol}
      </span>
      
      {/* Nombre del signo */}
      <span className={`
        mt-2 text-sm sm:text-base font-semibold
        ${isActive ? 'text-white' : 'text-white/90 group-hover:text-white'}
      `}>
        {frequency.name}
      </span>
      
      {/* Frecuencia */}
      <span className="text-xs text-white/70 mt-1">
        {frequency.frequency} Hz
      </span>
      
      {/* Efecto de pulso cuando está activo */}
      {isActive && (
        <div 
          className="absolute inset-0 rounded-full animate-ping opacity-20"
          style={{ backgroundColor: frequency.color.hex }}
        />
      )}
    </button>
  );
};

export default FrequencyCard;
