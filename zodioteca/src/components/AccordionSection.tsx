import { useState } from 'react';
import type { ReactNode } from 'react';

interface AccordionSectionProps {
  title: string;
  icon: string;
  count?: number;
  children: ReactNode;
  defaultOpen?: boolean;
}

export default function AccordionSection({ title, icon, count, children, defaultOpen = false }: AccordionSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg sm:rounded-xl md:rounded-2xl shadow-lg border border-purple-100 dark:border-purple-700 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3 sm:p-4 md:p-6 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 hover:from-purple-100 hover:to-indigo-100 dark:hover:bg-purple-900/20 transition-colors"
      >
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="text-xl sm:text-2xl md:text-3xl">{icon}</span>
          <h3 className="text-base sm:text-lg md:text-2xl font-bold text-gray-800 dark:text-purple-100">
            {title}
          </h3>
          {count !== undefined && (
            <span className="text-xs sm:text-sm px-2 py-0.5 sm:px-2.5 sm:py-1 bg-purple-200 dark:bg-purple-800 text-purple-800 dark:text-purple-200 rounded-full font-semibold">
              {count}
            </span>
          )}
        </div>
        <svg
          className={`w-5 h-5 sm:w-6 sm:h-6 text-purple-600 dark:text-purple-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="p-3 sm:p-4 md:p-6 border-t border-purple-100 dark:border-purple-700 animate-slideUp bg-white dark:bg-gray-900">
          {children}
        </div>
      )}
    </div>
  );
}
