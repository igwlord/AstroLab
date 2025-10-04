import React from 'react';
import { GLOSSARY_CATEGORIES, type GlossaryCategory } from '../types/glossary';
import { useI18n } from '../i18n';

interface GlossaryCategoriesProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  entryCounts?: { [key: string]: number };
  className?: string;
}

const GlossaryCategoriesComponent: React.FC<GlossaryCategoriesProps> = ({
  selectedCategory,
  onCategoryChange,
  entryCounts = {},
  className = ''
}) => {
  const { t } = useI18n();

  const getCategoryColorClasses = (category: GlossaryCategory, isSelected: boolean) => {
    const baseClasses = "flex items-center gap-2 px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer";
    
    if (isSelected) {
      const selectedColors: { [key: string]: string } = {
        'purple': 'bg-purple-100 text-purple-900 border-purple-300',
        'blue': 'bg-blue-100 text-blue-900 border-blue-300',
        'orange': 'bg-orange-100 text-orange-900 border-orange-300',
        'green': 'bg-green-100 text-green-900 border-green-300',
        'indigo': 'bg-indigo-100 text-indigo-900 border-indigo-300',
        'yellow': 'bg-yellow-100 text-yellow-900 border-yellow-300',
        'teal': 'bg-teal-100 text-teal-900 border-teal-300'
      };
      return `${baseClasses} ${selectedColors[category.color] || selectedColors.purple} border-2`;
    }

    return `${baseClasses} bg-white hover:bg-purple-50 text-purple-700 hover:text-purple-900 border border-purple-200 hover:border-purple-300`;
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <h3 className="text-lg font-semibold text-purple-900 mb-4">
        {t('glossary.categories')}
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-2 gap-2">
        {GLOSSARY_CATEGORIES.map((category) => {
          const count = entryCounts[category.id] || 0;
          const isSelected = selectedCategory === category.id;
          
          return (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={getCategoryColorClasses(category, isSelected)}
              title={category.description}
            >
              <span className="text-xl">{category.icon}</span>
              <div className="flex-1 text-left">
                <div className="font-medium">{category.name}</div>
                {count > 0 && (
                  <div className="text-xs opacity-75">
                    {count} {count === 1 ? 'término' : 'términos'}
                  </div>
                )}
              </div>
              
              {isSelected && (
                <div className="w-2 h-2 bg-current rounded-full opacity-60" />
              )}
            </button>
          );
        })}
      </div>

      {/* Quick stats */}
      {Object.keys(entryCounts).length > 0 && (
        <div className="mt-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
          <div className="flex items-center justify-between text-sm">
            <span className="text-purple-700">Total de términos:</span>
            <span className="font-semibold text-purple-900">
              {Object.values(entryCounts).reduce((sum, count) => sum + count, 0)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default GlossaryCategoriesComponent;