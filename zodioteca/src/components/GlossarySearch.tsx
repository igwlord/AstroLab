import React, { useMemo, useRef, useEffect } from 'react';

export interface SearchResult {
  id: string;
  title: string;
  category: string;
  categoryName: string;
  categoryIcon: string;
  snippet?: string;
  matchType: 'title' | 'content' | 'keyword';
}

interface GlossarySearchProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onResultClick?: (result: SearchResult) => void;
  searchResults?: SearchResult[];
  placeholder?: string;
  className?: string;
  showResults?: boolean;
}

const GlossarySearch: React.FC<GlossarySearchProps> = ({
  searchTerm,
  onSearchChange,
  onResultClick,
  searchResults = [],
  placeholder,
  className = '',
  showResults = true
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const defaultPlaceholder = placeholder || 'Buscar en todo el glosario...';

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Abrir dropdown cuando hay búsqueda
  useEffect(() => {
    if (searchTerm.trim().length > 0 && searchResults.length > 0) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [searchTerm, searchResults]);

  // Agrupar resultados por categoría
  const groupedResults = useMemo(() => {
    const groups: { [key: string]: SearchResult[] } = {};
    
    searchResults.forEach(result => {
      if (!groups[result.category]) {
        groups[result.category] = [];
      }
      groups[result.category].push(result);
    });

    return Object.entries(groups).map(([category, results]) => ({
      category,
      categoryName: results[0]?.categoryName || category,
      categoryIcon: results[0]?.categoryIcon || '📖',
      results: results.slice(0, 5) // Limitar a 5 resultados por categoría
    }));
  }, [searchResults]);

  const handleResultClick = (result: SearchResult) => {
    setIsOpen(false);
    onResultClick?.(result);
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          onFocus={() => searchTerm.trim().length > 0 && searchResults.length > 0 && setIsOpen(true)}
          placeholder={defaultPlaceholder}
          className="w-full pl-10 pr-10 py-3 border border-purple-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-purple-400 text-purple-900 shadow-sm"
        />
        
        {/* Search icon */}
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Clear button */}
        {searchTerm && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-purple-400 hover:text-purple-600 transition-colors"
            title="Limpiar búsqueda"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Dropdown de resultados */}
      {showResults && isOpen && searchTerm.trim().length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-2xl border border-purple-200 max-h-[500px] overflow-y-auto z-50">
          {searchResults.length === 0 ? (
            <div className="p-6 text-center">
              <div className="text-purple-300 mb-2">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-sm text-purple-600 font-medium">No se encontraron resultados</p>
              <p className="text-xs text-purple-400 mt-1">Intenta con otras palabras clave</p>
            </div>
          ) : (
            <div className="py-2">
              {/* Header con contador */}
              <div className="px-4 py-2 border-b border-purple-100 bg-purple-50">
                <p className="text-xs font-semibold text-purple-700 uppercase tracking-wide">
                  {searchResults.length} {searchResults.length === 1 ? 'resultado encontrado' : 'resultados encontrados'}
                </p>
              </div>

              {/* Resultados agrupados por categoría */}
              {groupedResults.map(({ category, categoryName, categoryIcon, results }) => (
                <div key={category} className="border-b border-purple-50 last:border-b-0">
                  {/* Header de categoría */}
                  <div className="px-4 py-2 bg-gradient-to-r from-purple-50 to-transparent">
                    <p className="text-xs font-bold text-purple-700 flex items-center gap-2">
                      <span>{categoryIcon}</span>
                      <span>{categoryName}</span>
                      <span className="text-purple-400 font-normal">({results.length})</span>
                    </p>
                  </div>

                  {/* Items de la categoría */}
                  <div>
                    {results.map((result) => (
                      <button
                        key={result.id}
                        onClick={() => handleResultClick(result)}
                        className="w-full px-4 py-3 text-left hover:bg-purple-50 transition-colors border-b border-purple-50 last:border-b-0 group"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-purple-900 group-hover:text-purple-700 mb-1">
                              {result.title}
                            </p>
                            {result.snippet && (
                              <p className="text-xs text-purple-600 line-clamp-2">
                                {result.snippet}
                              </p>
                            )}
                          </div>
                          <div className="flex-shrink-0">
                            <svg 
                              className="w-4 h-4 text-purple-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" 
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              {/* Footer si hay más resultados */}
              {searchResults.length > 15 && (
                <div className="px-4 py-3 bg-purple-50 border-t border-purple-100">
                  <p className="text-xs text-purple-600 text-center">
                    Mostrando los primeros 15 resultados. Refina tu búsqueda para ver más.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GlossarySearch;