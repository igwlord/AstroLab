import React from 'react';
import type { GlossaryEntry } from '../types/glossary';

interface GlossaryEntryProps {
  entry: GlossaryEntry;
  isExpanded?: boolean;
  onToggle?: () => void;
  showFullContent?: boolean;
}

const GlossaryEntryComponent: React.FC<GlossaryEntryProps> = ({ 
  entry, 
  isExpanded = false, 
  onToggle,
  showFullContent = false 
}) => {
  const getCategoryIcon = (category: string): string => {
    const icons: { [key: string]: string } = {
      'signs': '♈',
      'planets': '🪐',
      'houses': '🏠',
      'aspects': '📐',
      'basics': '⭐',
      'advanced': '🔮',
      'practices': '🧘'
    };
    return icons[category] || '📚';
  };

  const getCategoryColor = (category: string): string => {
    const colors: { [key: string]: string } = {
      'signs': 'text-orange-600 bg-orange-100',
      'planets': 'text-green-600 bg-green-100',
      'houses': 'text-indigo-600 bg-indigo-100',
      'aspects': 'text-yellow-600 bg-yellow-100',
      'basics': 'text-blue-600 bg-blue-100',
      'advanced': 'text-purple-600 bg-purple-100',
      'practices': 'text-teal-600 bg-teal-100'
    };
    return colors[category] || 'text-purple-600 bg-purple-100';
  };

  const formatContent = (content: string): string => {
    if (showFullContent) return content;
    
    // Extract just the first "Qué es:" section for preview
    const whatIsMatch = content.match(/\*\*Qué es:\*\*([\s\S]*?)(?=\*\*|---|\n##|$)/);
    if (whatIsMatch) {
      return whatIsMatch[1].trim().substring(0, 200) + '...';
    }
    
    // Fallback to first 200 characters
    return content.substring(0, 200) + '...';
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-purple-100 overflow-hidden transition-all duration-300 hover:shadow-lg">
      {/* Header */}
      <div 
        className="p-4 cursor-pointer"
        onClick={onToggle}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            {/* Title with full info for signs */}
            {entry.category === 'signs' && entry.dates && entry.element && entry.ruler ? (
              <div className="mb-2">
                <h3 className="text-xl font-bold text-purple-900 mb-1">
                  {entry.title} {entry.symbol || ''}
                </h3>
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 rounded-full text-purple-800 font-medium">
                    📅 {entry.dates}
                  </span>
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-orange-100 to-red-100 rounded-full font-medium">
                    {entry.element === 'Fuego' && '�'}
                    {entry.element === 'Agua' && '💧'}
                    {entry.element === 'Tierra' && '🌎'}
                    {entry.element === 'Aire' && '�'}
                    <span className="text-gray-800">{entry.element} {entry.modality}</span>
                  </span>
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-100 rounded-full text-indigo-800 font-medium">
                    👑 {entry.ruler}
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{getCategoryIcon(entry.category)}</span>
                <h3 className="text-xl font-semibold text-purple-900">
                  {entry.title}
                </h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(entry.category)}`}>
                  {entry.category}
                </span>
              </div>
            )}
          </div>
          
          {onToggle && (
            <button className="ml-4 text-purple-600 hover:text-purple-800 transition-colors">
              <svg 
                className={`w-5 h-5 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          )}
        </div>

        {/* Preview content */}
        {!isExpanded && (
          <div className="text-purple-700 text-sm leading-relaxed mt-3">
            <div 
              className="prose prose-sm"
              dangerouslySetInnerHTML={{ 
                __html: formatContent(entry.content)
                  .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                  .replace(/\n/g, '<br />')
              }}
            />
          </div>
        )}
      </div>

      {/* Expanded content */}
      {isExpanded && (
        <div className="px-4 pb-4">
          <div className="border-t border-purple-100 pt-4">
            
            {/* Key energy */}
            {entry.keyEnergy && (
              <div className="mb-4 p-3 bg-purple-50 rounded-lg">
                <h4 className="font-semibold text-purple-900 mb-2">Energía clave:</h4>
                <p className="text-purple-700">{entry.keyEnergy}</p>
              </div>
            )}

            {/* Characteristics */}
            {entry.characteristics && (
              <div className="mb-4">
                <h4 className="font-semibold text-purple-900 mb-3">Características:</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  {entry.characteristics.strengths && (
                    <div className="p-3 bg-green-50 rounded-lg">
                      <h5 className="font-medium text-green-800 mb-2">✅ Fortalezas:</h5>
                      <ul className="text-green-700 text-sm space-y-1">
                        {entry.characteristics.strengths.map((strength, index) => (
                          <li key={index}>• {strength}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {entry.characteristics.challenges && (
                    <div className="p-3 bg-yellow-50 rounded-lg">
                      <h5 className="font-medium text-yellow-800 mb-2">⚠️ Desafíos:</h5>
                      <ul className="text-yellow-700 text-sm space-y-1">
                        {entry.characteristics.challenges.map((challenge, index) => (
                          <li key={index}>• {challenge}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Compatibility */}
            {entry.compatibility && (
              <div className="mb-4">
                <h4 className="font-semibold text-purple-900 mb-3">Compatibilidad:</h4>
                <div className="space-y-2">
                  {entry.compatibility.harmonizes && (
                    <div className="flex items-center gap-2">
                      <span className="text-green-600">💚</span>
                      <span className="text-sm text-purple-700">
                        <strong>Armoniza con:</strong> {entry.compatibility.harmonizes.join(', ')}
                      </span>
                    </div>
                  )}
                  
                  {entry.compatibility.learns && (
                    <div className="flex items-center gap-2">
                      <span className="text-blue-600">🔄</span>
                      <span className="text-sm text-purple-700">
                        <strong>Aprende de:</strong> {entry.compatibility.learns.join(', ')}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Holistic practice */}
            {entry.practice && (
              <div className="mb-4 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-200">
                <h4 className="font-semibold text-purple-900 mb-3 flex items-center gap-2">
                  <span>🧘</span>
                  Práctica holística
                </h4>
                
                {entry.practice.description && (
                  <p className="text-purple-700 mb-3 text-sm">{entry.practice.description}</p>
                )}
                
                <div className="flex flex-wrap gap-4 text-sm">
                  {entry.practice.chakra && (
                    <span className="flex items-center gap-1 text-purple-600">
                      <span>🕉️</span>
                      <strong>Chakra:</strong> {entry.practice.chakra}
                    </span>
                  )}
                  
                  {entry.practice.frequency && (
                    <span className="flex items-center gap-1 text-purple-600">
                      <span>🎵</span>
                      <strong>Frecuencia:</strong> {entry.practice.frequency}
                    </span>
                  )}
                  
                  {entry.practice.duration && (
                    <span className="flex items-center gap-1 text-purple-600">
                      <span>⏱️</span>
                      <strong>Duración:</strong> {entry.practice.duration}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Full content */}
            <div className="prose prose-purple max-w-none text-sm">
              <div 
                dangerouslySetInnerHTML={{ 
                  __html: entry.content
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/\n/g, '<br />')
                    .replace(/---/g, '<hr />')
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ⚡ React.memo para evitar re-renders cuando entry no cambia
export default React.memo(GlossaryEntryComponent);