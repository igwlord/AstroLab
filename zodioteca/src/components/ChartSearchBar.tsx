/**
 * CHART SEARCH BAR
 * Buscador inteligente con autocompletado para análisis de carta
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface SearchableItem {
  id: string;
  title: string;
  subtitle?: string;
  keywords: string[];
  category: string;
}

interface ChartSearchBarProps {
  items: SearchableItem[];
  onSearch: (results: SearchableItem[]) => void;
  placeholder?: string;
}

export default function ChartSearchBar({
  items,
  onSearch,
  placeholder = 'Buscar planetas, aspectos, casas...',
}: ChartSearchBarProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchableItem[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Buscar en tiempo real
  useEffect(() => {
    if (!searchTerm.trim()) {
      onSearch(items);
      setSuggestions([]);
      return;
    }

    const term = searchTerm.toLowerCase();
    
    // Filtrar items
    const results = items.filter(item =>
      item.title.toLowerCase().includes(term) ||
      item.subtitle?.toLowerCase().includes(term) ||
      item.keywords.some(k => k.toLowerCase().includes(term))
    );

    onSearch(results);
    
    // Mostrar sugerencias (máximo 5)
    if (isFocused) {
      setSuggestions(results.slice(0, 5));
    }
  }, [searchTerm, items, isFocused, onSearch]);

  // Limpiar búsqueda
  const handleClear = () => {
    setSearchTerm('');
    inputRef.current?.focus();
  };

  // Seleccionar sugerencia
  const handleSelectSuggestion = (item: SearchableItem) => {
    setSearchTerm(item.title);
    setSuggestions([]);
    inputRef.current?.blur();
  };

  // Shortcut: Ctrl+K o Cmd+K para enfocar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      {/* Input principal */}
      <div className={`
        relative flex items-center gap-3 
        bg-white dark:bg-gray-800 
        rounded-xl px-4 py-3 
        border-2 transition-all duration-200
        ${isFocused 
          ? 'border-purple-500 dark:border-purple-400 shadow-lg shadow-purple-500/20' 
          : 'border-gray-200 dark:border-gray-700 shadow-md'
        }
      `}>
        {/* Icono de búsqueda */}
        <svg 
          className="w-5 h-5 text-gray-400 dark:text-gray-500 flex-shrink-0" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
          />
        </svg>

        {/* Input */}
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          placeholder={placeholder}
          className="flex-1 bg-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 outline-none text-sm sm:text-base"
        />

        {/* Botón limpiar */}
        {searchTerm && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            onClick={handleClear}
            className="flex-shrink-0 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title="Limpiar búsqueda"
          >
            <svg 
              className="w-4 h-4 text-gray-400 dark:text-gray-500" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M6 18L18 6M6 6l12 12" 
              />
            </svg>
          </motion.button>
        )}

        {/* Shortcut hint */}
        {!isFocused && !searchTerm && (
          <div className="hidden md:flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
            <kbd className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded border border-gray-300 dark:border-gray-600 font-mono">
              {navigator.platform.includes('Mac') ? '⌘' : 'Ctrl'}
            </kbd>
            <kbd className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded border border-gray-300 dark:border-gray-600 font-mono">
              K
            </kbd>
          </div>
        )}
      </div>

      {/* Sugerencias dropdown */}
      <AnimatePresence>
        {isFocused && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full mt-2 w-full bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50"
          >
            <div className="p-2">
              <p className="text-xs text-gray-500 dark:text-gray-400 px-3 py-2 font-medium">
                Sugerencias
              </p>
              {suggestions.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleSelectSuggestion(item)}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors text-left"
                >
                  <svg 
                    className="w-4 h-4 text-purple-500 flex-shrink-0" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                    />
                  </svg>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {item.title}
                    </p>
                    {item.subtitle && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {item.subtitle}
                      </p>
                    )}
                  </div>
                  <span className="text-xs text-gray-400 dark:text-gray-500 flex-shrink-0">
                    {item.category}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Resultados count */}
      {searchTerm && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-2 text-sm text-gray-600 dark:text-gray-400 text-center"
        >
          {items.filter(item =>
            item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.subtitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.keywords.some(k => k.toLowerCase().includes(searchTerm.toLowerCase()))
          ).length} resultados encontrados
        </motion.p>
      )}
    </div>
  );
}
