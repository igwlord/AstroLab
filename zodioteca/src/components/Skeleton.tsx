import React from 'react';
import { cn } from '../utils/cn';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'rectangular' | 'circular' | 'planetary';
  animation?: 'pulse' | 'wave' | 'twinkle';
}

/**
 * Componente base de skeleton loading con variantes astrológicas
 */
const Skeleton: React.FC<SkeletonProps> = ({
  className,
  variant = 'rectangular',
  animation = 'pulse'
}) => {
  const baseClasses = 'bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700';

  const variantClasses = {
    text: 'h-4 rounded',
    rectangular: 'rounded-md',
    circular: 'rounded-full',
    planetary: 'rounded-full shadow-lg'
  };

  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'animate-pulse', // TODO: Implementar wave animation
    twinkle: 'animate-twinkle'
  };

  return (
    <div
      className={cn(
        baseClasses,
        variantClasses[variant],
        animationClasses[animation],
        className
      )}
    />
  );
};

export default Skeleton;