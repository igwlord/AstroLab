/**
 * DEMO VERSION - ExerciseChartPage with Redesigned UX
 * 
 * This is a simplified demonstration version with static content
 * to showcase the new UI/UX design with tabs, search, and cards.
 * 
 * Status: DEMO ONLY - Uses hardcoded strings, no real data
 * Next Step: Implement full version with proper type handling
 */

import { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ChartAnalysisCard from '../components/ChartAnalysisCard';
import ChartSearchBar from '../components/ChartSearchBar';
import ChartTabsNavigation from '../components/ChartTabsNavigation';
import ChartAnalysisModal from '../components/ChartAnalysisModal';

// Static demo data - no type errors
interface DemoChartItem {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  category: 'planet' | 'point' | 'aspect' | 'concentration';
  dignityBadge?: {
    type: 'domicile' | 'exaltation' | 'detriment' | 'fall' | 'neutral';
    label: string;
    color: string;
  };
  preview: string;
  isNew?: boolean;
  isImportant?: boolean;
  content: {
    sections: Array<{
      id: string;
      title: string;
      content: string;
    }>;
  };
}

export default function ExerciseChartPageDemo() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'all' | 'planet' | 'point'>('all');
  const [selectedItem, setSelectedItem] = useState<DemoChartItem | null>(null);

  // Static demo content - no backend dependencies - wrapped in useMemo
  const demoItems: DemoChartItem[] = useMemo(() => [
    {
      id: 'luna',
      icon: '🌙',
      title: 'Luna en Tauro',
      subtitle: 'Casa 10 • Estrés: 7/10',
      category: 'planet',
      dignityBadge: {
        type: 'exaltation',
        label: 'Exaltación',
        color: 'blue'
      },
      preview: 'Tu Luna en Tauro busca seguridad emocional a través de la estabilidad material y sensorial. Necesitas rutinas predecibles para sentirte en paz.',
      isImportant: true,
      content: {
        sections: [
          {
            id: 'configuracion',
            title: '🌙 Configuración Lunar',
            content: 'Tu Luna está en Tauro (exaltación), en la Casa 10. Esta posición sugiere que tus emociones están profundamente conectadas con tu imagen pública y profesión.'
          },
          {
            id: 'necesidades',
            title: '💝 Necesidades Emocionales',
            content: 'Necesitas: estabilidad material, rutinas predecibles, contacto físico, belleza y comodidad, seguridad financiera. Tu bienestar emocional depende de sentir que tienes bases sólidas.'
          },
          {
            id: 'estres',
            title: '⚠️ Nivel de Estrés: Alto (7/10)',
            content: 'Tu Luna presenta un nivel de estrés significativo debido a aspectos tensos. Factores: múltiples aspectos difíciles, tensiones entre necesidades emocionales y otros planetas.'
          },
          {
            id: 'aspectos',
            title: '🔗 Aspectos Lunares',
            content: 'Aspectos difíciles: 5 | Aspectos armónicos: 2. La Luna recibe más tensión que apoyo, lo que puede manifestarse como inestabilidad emocional o dificultad para relajarte.'
          }
        ]
      }
    },
    {
      id: 'mercurio',
      icon: '☿',
      title: 'Mercurio en Libra',
      subtitle: 'Casa 3 • Retrógrado',
      category: 'planet',
      dignityBadge: {
        type: 'neutral',
        label: 'Neutral',
        color: 'gray'
      },
      preview: 'Tu Mercurio en Libra piensa de forma equilibrada y diplomática. La comunicación busca armonía y considera múltiples perspectivas antes de decidir.',
      content: {
        sections: [
          {
            id: 'comunicacion',
            title: '💬 Estilo de Comunicación',
            content: 'Tu Mercurio en Libra se expresa con tacto y diplomacia. Buscas el equilibrio en las palabras, considerando el impacto en los demás. Puedes ser indeciso al hablar.'
          },
          {
            id: 'aprendizaje',
            title: '📚 Estilo de Aprendizaje',
            content: 'Aprendes mejor en contextos armoniosos, con debates equilibrados. Necesitas ver ambos lados de cada tema. El conflicto bloquea tu capacidad de procesar información.'
          },
          {
            id: 'retrogrado',
            title: '⏪ Mercurio Retrógrado',
            content: 'Tu Mercurio retrógrado indica un pensamiento reflexivo y profundo. Tiendes a revisar ideas antes de expresarlas. Fortaleza: introspección, análisis cuidadoso. Desafío: indecisión, autocrítica excesiva.'
          }
        ]
      }
    },
    {
      id: 'venus',
      icon: '♀',
      title: 'Venus en Escorpio',
      subtitle: 'Casa 4',
      category: 'planet',
      dignityBadge: {
        type: 'detriment',
        label: 'Detrimento',
        color: 'orange'
      },
      preview: 'Tu Venus en Escorpio ama con intensidad profunda. Las relaciones son experiencias transformadoras, no superficiales. Todo o nada.',
      content: {
        sections: [
          {
            id: 'estilo',
            title: '💖 Estilo Relacional',
            content: 'Venus en Escorpio ama con intensidad magnética. Buscas fusión emocional, lealtad absoluta, transformación a través del amor. No te interesan las conexiones superficiales.'
          },
          {
            id: 'valores',
            title: '💎 Valores y Placer',
            content: 'Valoras: la profundidad emocional, la lealtad inquebrantable, el misterio, la transformación. Encuentras placer en experiencias intensas que toquen tu alma.'
          },
          {
            id: 'desafios',
            title: '⚠️ Desafíos (Detrimento)',
            content: 'Venus en detrimento puede manifestar: celos, posesividad, dificultad para confiar, miedo al abandono. Necesitas trabajar la vulnerabilidad y soltar el control.'
          }
        ]
      }
    },
    {
      id: 'nodo-norte',
      icon: '☊',
      title: 'Nodo Norte en Virgo',
      subtitle: 'Casa 2',
      category: 'point',
      preview: 'Tu propósito evolutivo implica desarrollar organización, servicio práctico y atención al detalle. Dejar atrás el caos y la dispersión.',
      isNew: true,
      content: {
        sections: [
          {
            id: 'proposito',
            title: '🎯 Propósito de Vida',
            content: 'El Nodo Norte en Virgo te llama a desarrollar: organización, disciplina, servicio útil, humildad, atención a los detalles. Tu crecimiento está en la práctica, no en la teoría.'
          },
          {
            id: 'nodo-sur',
            title: '🔄 Patrón Kármico (Nodo Sur en Piscis)',
            content: 'Vienes con facilidad para: la intuición, la compasión, lo místico. Pero también con tendencia a: escapismo, victimización, confusión, falta de límites. Necesitas integrar estructura.'
          },
          {
            id: 'integracion',
            title: '⚖️ Camino de Integración',
            content: 'No se trata de abandonar tu sensibilidad pisciana, sino de darle FORMA práctica. Usa tu intuición para servir de manera concreta. Organiza tu compasión.'
          }
        ]
      }
    },
    {
      id: 'quiron',
      icon: '⚷',
      title: 'Quirón en Géminis',
      subtitle: 'Casa 11',
      category: 'point',
      preview: 'Tu herida está relacionada con la comunicación, el aprendizaje y sentirte escuchado. El don: ayudar a otros a encontrar su voz.',
      content: {
        sections: [
          {
            id: 'herida',
            title: '🩹 La Herida',
            content: 'Quirón en Géminis indica dolor relacionado con: no sentirte escuchado, dificultades de aprendizaje, sentir que tus palabras no valen, comparaciones con hermanos, miedo a hablar.'
          },
          {
            id: 'manifestacion',
            title: '💔 Cómo se Manifiesta',
            content: 'Puedes experimentar: bloqueos al comunicarte, inseguridad intelectual, dispersión mental, miedo a parecer ignorante. La herida se activa en grupos y con amigos.'
          },
          {
            id: 'don',
            title: '✨ El Don del Sanador',
            content: 'Tu dolor te convierte en maestro de la comunicación. Puedes ayudar a otros a: encontrar su voz, superar bloqueos de aprendizaje, validar sus ideas. Tu empatía es tu poder.'
          }
        ]
      }
    },
    {
      id: 'lilith',
      icon: '⚸',
      title: 'Lilith en Aries',
      subtitle: 'Casa 9',
      category: 'point',
      preview: 'Tu poder reprimido está en la asertividad, el liderazgo y la independencia. Trabajar: el miedo a ser "demasiado", a ocupar espacio, a liderar.',
      content: {
        sections: [
          {
            id: 'represion',
            title: '🌑 El Poder Reprimido',
            content: 'Lilith en Aries indica poder reprimido en: asertividad, independencia, liderazgo, rabia sana, iniciativa. Te enseñaron que era "malo" ser directo, fuerte o ambicioso.'
          },
          {
            id: 'senales',
            title: '🚨 Señales de Represión',
            content: '1. Te cuesta decir "no" directamente. 2. Esperas que otros tomen la iniciativa. 3. Tu rabia sale de forma pasivo-agresiva. 4. Te sientes culpable por querer liderar.'
          },
          {
            id: 'liberacion',
            title: '🔥 Camino de Liberación',
            content: 'Recupera tu poder aprendiendo a: expresar deseos claramente, tomar iniciativa sin pedir permiso, ocupar espacio sin disculparte, liderar con valentía.'
          }
        ]
      }
    }
  ], []); // Static data, no dependencies

  // Search items for ChartSearchBar
  const searchableItems = useMemo(() => 
    demoItems.map(item => ({
      id: item.id,
      title: item.title,
      subtitle: item.subtitle || '',
      keywords: [item.title, item.subtitle, item.preview],
      category: item.category
    })),
    [demoItems]
  );

  // Filtered items from search
  const [filteredItems, setFilteredItems] = useState(demoItems);

  // Handle search results - match the SearchableItem[] signature exactly
  const handleSearch = useCallback((results: Array<{ id: string; title: string; subtitle?: string; keywords: string[]; category: string }>) => {
    const resultIds = new Set(results.map(r => r.id));
    setFilteredItems(demoItems.filter(item => resultIds.has(item.id)));
  }, [demoItems]);

  // Apply tab filter
  const displayedItems = useMemo(() => {
    if (activeTab === 'all') return filteredItems;
    return filteredItems.filter(item => item.category === activeTab);
  }, [filteredItems, activeTab]);

  // Tabs configuration
  const tabs = useMemo(() => [
    { id: 'all', label: 'Todos', icon: '✨', count: demoItems.length, color: 'purple' },
    { id: 'planet', label: 'Planetas', icon: '🪐', count: demoItems.filter(i => i.category === 'planet').length, color: 'blue' },
    { id: 'point', label: 'Puntos', icon: '⚡', count: demoItems.filter(i => i.category === 'point').length, color: 'pink' }
  ], [demoItems]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900">
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
        
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/ejercicios')}
            className="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-200 flex items-center gap-2 text-sm font-medium mb-4"
          >
            ← Volver al Plan
          </button>
          
          <div className="text-center mb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-purple-900 dark:text-white mb-2">
              Tu Carta Natal - Análisis Completo
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Guido • 16 Oct 1988, 20:50 • Buenos Aires
            </p>
            
            {/* Demo Badge */}
            <div className="mt-4 inline-flex items-center gap-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 px-4 py-2 rounded-full text-sm font-medium">
              <span>⚡</span>
              <span>DEMO VERSION - Vista previa del nuevo diseño</span>
            </div>
          </div>

          {/* Search Bar */}
          <ChartSearchBar
            items={searchableItems}
            onSearch={handleSearch}
            placeholder="Buscar en tu carta (ej: Luna, Mercurio, Nodo Norte)..."
          />

          {/* Tabs Navigation */}
          <ChartTabsNavigation
            tabs={tabs}
            activeTab={activeTab}
            onChange={(tabId) => setActiveTab(tabId as 'all' | 'planet' | 'point')}
          />
        </div>

        {/* Results Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredItems.map(item => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <ChartAnalysisCard
                  id={item.id}
                  icon={item.icon}
                  title={item.title}
                  subtitle={item.subtitle}
                  dignityBadge={item.dignityBadge}
                  preview={item.preview}
                  category={item.category}
                  onClick={() => setSelectedItem(item)}
                  isNew={item.isNew}
                  isImportant={item.isImportant}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {filteredItems.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              No se encontraron resultados
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Intenta con otra búsqueda o cambia de categoría
            </p>
            <button
              onClick={() => {
                setFilteredItems(demoItems);
                setActiveTab('all');
              }}
              className="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-200 font-medium"
            >
              Limpiar filtros
            </button>
          </motion.div>
        )}

        {/* Stats Footer */}
        <div className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>
            Mostrando {filteredItems.length} de {demoItems.length} elementos
          </p>
        </div>
      </div>

      {/* Modal */}
      <ChartAnalysisModal
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        title={selectedItem?.title || ''}
        icon={selectedItem?.icon || ''}
        subtitle={selectedItem?.subtitle || ''}
        content={
          <div className="space-y-6">
            {selectedItem?.content.sections.map((section) => (
              <div key={section.id} id={section.id} className="scroll-mt-20">
                <h3 className="text-xl font-semibold text-purple-900 dark:text-purple-200 mb-3">
                  {section.title}
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {section.content}
                </p>
              </div>
            ))}
          </div>
        }
        sidebarSections={selectedItem?.content.sections.map(s => ({ id: s.id, label: s.title }))}
        navigation={{
          prev: selectedItem ? {
            id: displayedItems[displayedItems.findIndex(i => i.id === selectedItem.id) - 1]?.id || displayedItems[displayedItems.length - 1].id,
            title: displayedItems[displayedItems.findIndex(i => i.id === selectedItem.id) - 1]?.title || displayedItems[displayedItems.length - 1].title,
            icon: displayedItems[displayedItems.findIndex(i => i.id === selectedItem.id) - 1]?.icon || displayedItems[displayedItems.length - 1].icon
          } : undefined,
          next: selectedItem ? {
            id: displayedItems[displayedItems.findIndex(i => i.id === selectedItem.id) + 1]?.id || displayedItems[0].id,
            title: displayedItems[displayedItems.findIndex(i => i.id === selectedItem.id) + 1]?.title || displayedItems[0].title,
            icon: displayedItems[displayedItems.findIndex(i => i.id === selectedItem.id) + 1]?.icon || displayedItems[0].icon
          } : undefined
        }}
        onNavigate={(id) => {
          const item = displayedItems.find(i => i.id === id);
          if (item) setSelectedItem(item);
        }}
      />
    </div>
  );
}
