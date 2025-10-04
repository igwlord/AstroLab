import React from 'react';
import { useI18n } from '../i18n';

interface GlossarySearchProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  placeholder?: string;
  className?: string;
}

const GlossarySearch: React.FC<GlossarySearchProps> = ({
  searchTerm,
  onSearchChange,
  placeholder,
  className = ''
}) => {
  const { t } = useI18n();

  const defaultPlaceholder = placeholder || t('glossary.search');

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={defaultPlaceholder}
          className="w-full pl-10 pr-4 py-3 border border-purple-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-purple-400 text-purple-900"
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
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Search suggestions could go here in the future */}
      {searchTerm && searchTerm.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 text-sm text-purple-600 bg-white px-3 py-1 rounded shadow-sm border border-purple-100">
          Buscando: "{searchTerm}"
        </div>
      )}
    </div>
  );
};

export default GlossarySearch;