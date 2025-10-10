import { useState } from 'react';
import { Drawer } from 'vaul';
import type { GlossaryCategory } from '../types/glossary';

interface GlossaryCategoriesProps {
  categories: GlossaryCategory[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  entryCounts?: { [key: string]: number };
}

const GlossaryCategoriesComponent: React.FC<GlossaryCategoriesProps> = ({
  categories,
  selectedCategory,
  onCategoryChange,
  entryCounts = {},
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Categorías principales para desktop (primeras 5: Signos, Casas, Planetas, Lunas, Ascendentes)
  const mainCategories = categories.slice(0, 5);
  const moreCategories = categories.slice(5);

  // Agrupar categorías para el drawer móvil
  const categoryGroups = [
    {
      title: 'Básicos',
      categories: categories.filter(c => ['signs', 'houses', 'planets', 'lunar', 'ascendants'].includes(c.id)),
    },
    {
      title: 'Sistemas',
      categories: categories.filter(c => ['house-systems', 'coordinates'].includes(c.id)),
    },
    {
      title: 'Cuerpos Celestes',
      categories: categories.filter(c => ['asteroids', 'celestial'].includes(c.id)),
    },
    {
      title: 'Aspectos y Configuraciones',
      categories: categories.filter(c => ['aspects', 'configurations'].includes(c.id)),
    },
    {
      title: 'Avanzado',
      categories: categories.filter(c => ['dignities', 'advanced', 'relational', 'polarizations'].includes(c.id)),
    },
  ];

  const handleCategorySelect = (categoryId: string) => {
    onCategoryChange(categoryId);
    setIsDrawerOpen(false);
  };

  const selectedCategoryData = categories.find(c => c.id === selectedCategory);

  return (
    <>
      {/* MOBILE: Bottom Sheet Trigger */}
      <div className="md:hidden mb-6">
        <button
          onClick={() => setIsDrawerOpen(true)}
          className="w-full flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-800 rounded-xl border-2 border-purple-200 dark:border-purple-700 shadow-sm hover:shadow-md transition-all"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">{selectedCategoryData?.icon}</span>
            <div className="text-left">
              <p className="text-sm font-semibold text-purple-900 dark:text-purple-100">
                {selectedCategoryData?.name}
              </p>
              <p className="text-xs text-purple-600 dark:text-purple-300">
                {entryCounts[selectedCategory] || 0} términos
              </p>
            </div>
          </div>
          <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* DESKTOP: Tabs with More Dropdown */}
      <div className="hidden md:block mb-6">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Main Categories */}
          {mainCategories.map(category => {
            const count = entryCounts[category.id] || 0;
            const isActive = selectedCategory === category.id;

            return (
              <button
                key={category.id}
                onClick={() => onCategoryChange(category.id)}
                className={`
                  inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium
                  transition-all duration-200
                  ${isActive
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'bg-white dark:bg-gray-800 text-purple-700 dark:text-purple-300 border-2 border-purple-200 dark:border-purple-700 hover:border-purple-400 hover:shadow-md'
                  }
                `}
              >
                <span className="text-lg">{category.icon}</span>
                <span>{category.name}</span>
                {count > 0 && (
                  <span className={`
                    px-2 py-0.5 rounded-full text-xs font-semibold
                    ${isActive ? 'bg-purple-500' : 'bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300'}
                  `}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}

          {/* More Dropdown */}
          <div className="relative group">
            <button
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-white dark:bg-gray-800 text-purple-700 dark:text-purple-300 border-2 border-purple-200 dark:border-purple-700 hover:border-purple-400 hover:shadow-md transition-all"
            >
              <span>+ Más</span>
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300">
                {moreCategories.length}
              </span>
            </button>

            {/* Dropdown Menu */}
            <div className="absolute top-full left-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border-2 border-purple-200 dark:border-purple-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div className="p-2 max-h-96 overflow-y-auto">
                {moreCategories.map(category => {
                  const count = entryCounts[category.id] || 0;
                  const isActive = selectedCategory === category.id;

                  return (
                    <button
                      key={category.id}
                      onClick={() => onCategoryChange(category.id)}
                      className={`
                        w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm
                        transition-colors
                        ${isActive
                          ? 'bg-purple-600 text-white'
                          : 'text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/20'
                        }
                      `}
                    >
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <span className="text-lg flex-shrink-0">{category.icon}</span>
                        <span className="font-medium whitespace-nowrap">{category.name}</span>
                      </div>
                      {count > 0 && (
                        <span className={`
                          px-2 py-0.5 rounded-full text-xs font-semibold
                          ${isActive ? 'bg-purple-500' : 'bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300'}
                        `}>
                          {count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE: Bottom Sheet Drawer */}
      <Drawer.Root open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 bg-black/40 z-50" />
          <Drawer.Content className="bg-white dark:bg-gray-800 flex flex-col rounded-t-[24px] h-[85vh] mt-24 fixed bottom-0 left-0 right-0 z-50">
            {/* Handle */}
            <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-gray-300 dark:bg-gray-600 mb-4 mt-4" />

            {/* Header */}
            <div className="px-6 pb-4 border-b border-purple-100 dark:border-purple-800">
              <Drawer.Title className="text-xl font-bold text-purple-900 dark:text-purple-100">
                Categorías del Glosario
              </Drawer.Title>
              <p className="text-sm text-purple-600 dark:text-purple-300 mt-1">
                Explora {categories.length} categorías astrológicas
              </p>
            </div>

            {/* Content - Scrollable */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {categoryGroups.map((group, groupIndex) => (
                <div key={groupIndex} className="mb-6">
                  <h3 className="text-xs font-bold uppercase text-purple-600 dark:text-purple-400 mb-3 px-2">
                    {group.title}
                  </h3>
                  <div className="space-y-2">
                    {group.categories.map(category => {
                      const count = entryCounts[category.id] || 0;
                      const isActive = selectedCategory === category.id;

                      return (
                        <button
                          key={category.id}
                          onClick={() => handleCategorySelect(category.id)}
                          className={`
                            w-full flex items-center justify-between px-4 py-3 rounded-xl text-left
                            transition-all
                            ${isActive
                              ? 'bg-purple-600 text-white shadow-lg scale-[0.98]'
                              : 'bg-purple-50 dark:bg-gray-700 text-purple-900 dark:text-purple-100 hover:bg-purple-100 dark:hover:bg-gray-600'
                            }
                          `}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{category.icon}</span>
                            <div>
                              <p className="font-semibold">{category.name}</p>
                              <p className={`text-xs ${isActive ? 'text-purple-200' : 'text-purple-600 dark:text-purple-400'}`}>
                                {count} términos
                              </p>
                            </div>
                          </div>
                          {isActive && (
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-purple-100 dark:border-purple-800">
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="w-full py-3 px-4 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 transition-colors"
              >
                Cerrar
              </button>
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </>
  );
};

export default GlossaryCategoriesComponent;