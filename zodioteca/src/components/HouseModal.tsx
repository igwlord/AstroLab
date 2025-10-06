import React, { useRef } from 'react';
import type { House } from '../types/house';
import StandardModal from './StandardModal';

interface HouseModalProps {
  house: House | null;
  isOpen: boolean;
  onClose: () => void;
}

const HouseModal: React.FC<HouseModalProps> = ({ house, isOpen, onClose }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playFrequency = () => {
    if (!house) return;
    
    const frequencyValue = house.frequency.split('/')[0].trim().replace(' Hz', '');
    const audioPath = `/media/${frequencyValue}.mp3`;
    
    if (audioRef.current) {
      audioRef.current.pause();
    }
    
    audioRef.current = new Audio(audioPath);
    audioRef.current.play().catch(err => {
      console.error('Error playing audio:', err);
    });
  };

  if (!isOpen || !house) return null;

  const getCategoryStyles = (category: string) => {
    const styles = {
      angular: {
        gradient: 'from-red-600 via-rose-600 to-pink-600',
        bg: 'bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20',
        badge: 'bg-red-500/20 text-red-700 dark:text-red-300',
        icon: '🔷',
        border: 'border-red-300 dark:border-red-700'
      },
      succedent: {
        gradient: 'from-green-600 via-emerald-600 to-teal-600',
        bg: 'bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20',
        badge: 'bg-green-500/20 text-green-700 dark:text-green-300',
        icon: '🔶',
        border: 'border-green-300 dark:border-green-700'
      },
      cadent: {
        gradient: 'from-blue-600 via-cyan-600 to-sky-600',
        bg: 'bg-gradient-to-br from-blue-50 to-sky-50 dark:from-blue-900/20 dark:to-sky-900/20',
        badge: 'bg-blue-500/20 text-blue-700 dark:text-blue-300',
        icon: '🔹',
        border: 'border-blue-300 dark:border-blue-700'
      }
    };

    return styles[category as keyof typeof styles];
  };

  const categoryStyle = getCategoryStyles(house.category);
  const categoryName = house.category === 'angular' ? 'Angular' : house.category === 'succedent' ? 'Sucedente' : 'Cadente';

  return (
    <StandardModal
      isOpen={isOpen}
      onClose={onClose}
      title={house.name}
      subtitle={house.title}
      icon={house.number.toString()}
      gradientColors={categoryStyle.gradient}
    >
      <div className={`${categoryStyle.bg} modal-content`}>
        {/* Representación visual de la casa */}
        <div className={`relative rounded-2xl overflow-hidden bg-gradient-to-br ${categoryStyle.gradient} p-8 text-white shadow-2xl`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-8xl font-black opacity-90">
                {house.number}
              </div>
              <div>
                <div className="text-3xl font-bold">{house.name}</div>
                <div className="text-xl opacity-90">{house.title}</div>
              </div>
            </div>
            <div className="text-6xl opacity-40">
              {categoryStyle.icon}
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <span className="px-3 py-1 bg-white/20 backdrop-blur rounded-full text-sm font-medium">
              {categoryName}
            </span>
            <span className="px-3 py-1 bg-white/20 backdrop-blur rounded-full text-sm font-medium">
              ♈ {house.naturalSign}
            </span>
            <span className="px-3 py-1 bg-white/20 backdrop-blur rounded-full text-sm font-medium">
              Regente: {house.naturalRuler}
            </span>
          </div>
        </div>

        {/* Descripción extensa */}
        <section>
          <h3 className="modal-h3 text-purple-900 dark:text-purple-100 flex items-center gap-2">
            <span className="modal-icon-md">🏛️</span>
            Arquetipo de la Casa
          </h3>
          <p className="modal-text text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
            {house.description}
          </p>
        </section>

        {/* Información de categoría */}
        <section className={`modal-section border-l-4 ${categoryStyle.border} ${categoryStyle.bg}`}>
          <h4 className="modal-h4 flex items-center gap-2">
            <span className="text-2xl">{categoryStyle.icon}</span>
            <span>Casa {categoryName}</span>
          </h4>
          <p className="modal-text">
            {house.category === 'angular' && (
              <>
                <strong>Casas Angulares (1, 4, 7, 10):</strong> Son las más poderosas. Representan 
                acción directa, iniciativas y experiencias inmediatas. Los planetas aquí tienen 
                máxima expresión y visibilidad en la vida.
              </>
            )}
            {house.category === 'succedent' && (
              <>
                <strong>Casas Sucedentes (2, 5, 8, 11):</strong> Consolidan y estabilizan lo iniciado 
                por las angulares. Representan recursos, valores y construcción. Los planetas aquí 
                buscan crear seguridad y permanencia.
              </>
            )}
            {house.category === 'cadent' && (
              <>
                <strong>Casas Cadentes (3, 6, 9, 12):</strong> Procesan, aprenden y transmutan. 
                Representan adaptación, aprendizaje y trascendencia. Los planetas aquí funcionan 
                en lo mental y espiritual.
              </>
            )}
          </p>
        </section>

          {/* Manifestación cotidiana */}
          <section className={`modal-section border-2 ${categoryStyle.border} ${categoryStyle.badge}`}>
            <h4 className="modal-h4 flex items-center gap-2">
              <span>🌟</span> Cómo se manifiesta en la vida cotidiana
            </h4>
            <p className="modal-text">
              {house.dailyManifestation}
            </p>
          </section>

          {/* Grid de características */}
          <div className="modal-grid">
            {/* Características astrológicas */}
            <div className="modal-card">
              <h4 className="modal-h4 text-purple-900 dark:text-purple-100">
                🏠 Características Astrológicas
              </h4>
              <div className="space-y-1.5 sm:space-y-2 modal-text-sm">
                <div>
                  <span className="font-semibold">Categoría:</span> {categoryStyle.icon} {categoryName}
                </div>
                <div>
                  <span className="font-semibold">Signo Natural:</span> {house.naturalSign}
                </div>
                <div>
                  <span className="font-semibold">Regente Natural:</span> {house.naturalRuler}
                </div>
              </div>
            </div>

            {/* Características holísticas */}
            <div className="modal-card">
              <h4 className="modal-h4 text-purple-900 dark:text-purple-100">
                🧘 Dimensión Holística
              </h4>
              <div className="space-y-1.5 sm:space-y-2 modal-text-sm">
                <div>
                  <span className="font-semibold">Color:</span> 
                  <span className="ml-2 inline-block w-3 h-3 sm:w-4 sm:h-4 rounded-full border border-gray-300" 
                    style={{ backgroundColor: 
                      house.color.includes('rojo') ? '#DC2626' :
                      house.color.includes('verde esmeralda') ? '#10B981' :
                      house.color.includes('amarillo') ? '#FBBF24' :
                      house.color.includes('blanco') || house.color.includes('plateado') ? '#C0C0C0' :
                      house.color.includes('dorado') ? '#FFD700' :
                      house.color.includes('verde oliva') ? '#84CC16' :
                      house.color.includes('rosa') ? '#F472B6' :
                      house.color.includes('negro') || house.color.includes('granate') ? '#7F1D1D' :
                      house.color.includes('púrpura') ? '#9333EA' :
                      house.color.includes('gris') ? '#4B5563' :
                      house.color.includes('azul eléctrico') ? '#06B6D4' :
                      house.color.includes('violeta') ? '#8B5CF6' : '#6B7280'
                    }}
                  ></span> {house.color}
                </div>
                <div>
                  <span className="font-semibold">Chakra:</span> {house.chakra}
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">Frecuencia:</span> {house.frequency}
                  <button
                    onClick={playFrequency}
                    className="px-2 py-1 text-xs rounded-full bg-purple-500 hover:bg-purple-600 text-white transition-colors flex items-center gap-1"
                    title="Reproducir frecuencia"
                  >
                    ▶️ <span className="hidden sm:inline">Escuchar</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Ejercicio holístico */}
          <section className="modal-section bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 border-2 border-purple-300 dark:border-purple-700">
            <h4 className="modal-h4 text-purple-900 dark:text-purple-100 flex items-center gap-2">
              <span className="modal-icon-sm">🧘‍♀️</span>
              Ejercicio Holístico de Integración
            </h4>
            <p className="modal-text text-gray-800 dark:text-gray-200">
              {house.holisticExercise}
            </p>
          </section>
        </div>
    </StandardModal>
  );
};

export default HouseModal;
