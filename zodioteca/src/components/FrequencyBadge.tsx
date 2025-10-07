import { useNavigate } from 'react-router-dom';
import { useI18n } from '../i18n';
import { ZODIAC_FREQUENCIES } from '../data/zodiacFrequencies';

interface FrequencyBadgeProps {
  frequency: string; // "528 Hz" o "528"
  onClose: () => void;
  className?: string;
}

const FrequencyBadge: React.FC<FrequencyBadgeProps> = ({
  frequency,
  onClose,
  className = ''
}) => {
  const navigate = useNavigate();
  const { t } = useI18n();

  // Extraer solo el número de la frecuencia
  const frequencyNumber = parseInt(frequency.replace(/[^0-9]/g, ''));
  
  // Buscar el signo zodiacal que corresponde a esta frecuencia
  const zodiacMatch = ZODIAC_FREQUENCIES.find(z => z.frequency === frequencyNumber);
  const targetId = zodiacMatch?.id || null;

  const handleNavigate = (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (!targetId) {
      console.warn(`No se encontró un signo zodiacal para la frecuencia ${frequency}`);
      return;
    }
    
    onClose();
    
    // Navegar con parámetro para auto-reproducción
    navigate('/frequencies', { state: { autoPlayId: targetId } });
    
    // Auto-scroll al elemento después de la navegación
    setTimeout(() => {
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center'
        });
        
        // Destacar el elemento brevemente con animación de pulso
        element.classList.add('ring-4', 'ring-purple-500', 'ring-opacity-50', 'animate-pulse');
        setTimeout(() => {
          element.classList.remove('ring-4', 'ring-purple-500', 'ring-opacity-50', 'animate-pulse');
        }, 2000);
      }
    }, 300);
  };

  return (
    <div className={`mt-4 p-3 sm:p-4 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-xl border border-purple-200 dark:border-purple-700 transition-all hover:shadow-md ${className}`}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-start sm:items-center gap-2.5 sm:gap-3 flex-1">
          <span className="text-2xl sm:text-3xl flex-shrink-0">🎵</span>
          <div className="flex-1 min-w-0">
            <p className="text-sm sm:text-base font-semibold text-purple-900 dark:text-purple-100 truncate">
              {t('glossary.frequency')}: <span className="text-purple-600 dark:text-purple-400">{frequency}</span>
            </p>
            <p className="text-xs sm:text-sm text-purple-600 dark:text-purple-400 mt-0.5">
              {t('glossary.listenInFrequencies')}
            </p>
          </div>
        </div>
        
        <button
          onClick={handleNavigate}
          className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2 bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white text-sm font-medium rounded-lg transition-colors shadow-sm hover:shadow-md"
          aria-label={`${t('glossary.goToFrequencies')} ${frequency}`}
        >
          <span>{t('glossary.goButton')}</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default FrequencyBadge;
