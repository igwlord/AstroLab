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
    const baseClasses = "flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-3 rounded-lg transition-all duration-200 cursor-pointer";
    
    if (isSelected) {
      const selectedColors: { [key: string]: string } = {
        'purple': 'bg-purple-100 dark:bg-purple-900/50 text-purple-900 dark:text-purple-100 border-purple-300 dark:border-purple-700',
        'blue': 'bg-blue-100 dark:bg-blue-900/50 text-blue-900 dark:text-blue-100 border-blue-300 dark:border-blue-700',
        'orange': 'bg-orange-100 dark:bg-orange-900/50 text-orange-900 dark:text-orange-100 border-orange-300 dark:border-orange-700',
        'green': 'bg-green-100 dark:bg-green-900/50 text-green-900 dark:text-green-100 border-green-300 dark:border-green-700',
        'indigo': 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-900 dark:text-indigo-100 border-indigo-300 dark:border-indigo-700',
        'yellow': 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-900 dark:text-yellow-100 border-yellow-300 dark:border-yellow-700',
        'teal': 'bg-teal-100 dark:bg-teal-900/50 text-teal-900 dark:text-teal-100 border-teal-300 dark:border-teal-700'
      };
      return `${baseClasses} ${selectedColors[category.color] || selectedColors.purple} border-2`;
    }

    return `${baseClasses} bg-white dark:bg-gray-800 hover:bg-purple-50 dark:hover:bg-purple-900/30 text-purple-700 dark:text-purple-300 hover:text-purple-900 dark:hover:text-purple-100 border border-purple-200 dark:border-purple-800 hover:border-purple-300 dark:hover:border-purple-700`;
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <h3 className="text-base sm:text-lg font-semibold text-purple-900 dark:text-purple-100 mb-2 sm:mb-4">
        {t('glossary.categories')}
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-2 gap-1.5 sm:gap-2">
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
              <span className="text-lg sm:text-xl">{category.icon}</span>
              <div className="flex-1 text-left">
                <div className="text-sm sm:text-base font-medium">{category.name}</div>
                {count > 0 && (
                  <div className="text-[10px] sm:text-xs opacity-75">
                    {count} {count === 1 ? 'término' : 'términos'}
                  </div>
                )}
              </div>
              
              {isSelected && (
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-current rounded-full opacity-60" />
              )}
            </button>
          );
        })}
      </div>

      {/* Quick stats */}
      {Object.keys(entryCounts).length > 0 && (
        <div className="mt-2 sm:mt-4 p-2 sm:p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <span className="text-purple-700 dark:text-purple-300">Total de términos:</span>
            <span className="font-semibold text-purple-900 dark:text-purple-100">
              {Object.values(entryCounts).reduce((sum, count) => sum + count, 0)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default GlossaryCategoriesComponent;