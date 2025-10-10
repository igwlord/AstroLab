import { useState, useEffect } from 'react';
import AstrologicalWeatherCard from '../components/AstrologicalWeatherCard';
import DailyChartWheel from '../components/DailyChartWheel';
import WeatherDetailsModal from '../components/WeatherDetailsModal';
import { getDailyAstrologicalWeather, type DailyWeather } from '../services/dailyWeather';
import { logger } from '../utils/logger';
import type { PlanetData } from '../components/DailyChartWheel';
import { Info } from 'lucide-react';

const Dashboard: React.FC = () => {
  const [chartSize, setChartSize] = useState(500);
  const [planets, setPlanets] = useState<PlanetData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [weather, setWeather] = useState<DailyWeather | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const updateSize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setChartSize(Math.min(width - 60, 360));
      } else if (width < 768) {
        setChartSize(420);
      } else if (width < 1024) {
        setChartSize(480);
      } else {
        setChartSize(550);
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Cargar datos astrológicos reales
  useEffect(() => {
    const loadAstrologicalData = async () => {
      try {
        setIsLoading(true);
        const weatherData: DailyWeather = await getDailyAstrologicalWeather();
        setWeather(weatherData);
        
        // Mapear planetas del weather a formato del Chart Wheel
        const planetsData: PlanetData[] = [];
        
        // Colores tradicionales astrológicos
        const planetColors: Record<string, string> = {
          sun: '#FFD700',      // Sol: dorado
          moon: '#E8E8E8',     // Luna: plateado
          mercury: '#F4E04D',  // Mercurio: amarillo limón
          venus: '#FF69B4',    // Venus: rosa
          mars: '#FF4444',     // Marte: rojo brillante
          jupiter: '#4A90E2',  // Júpiter: azul cielo
          saturn: '#8B7355',   // Saturno: marrón/ocre
          uranus: '#40E0D0',   // Urano: turquesa
          neptune: '#9370DB',  // Neptuno: azul violeta
          pluto: '#8B0000'     // Plutón: carmesí oscuro
        };

        const planetSymbols: Record<string, string> = {
          sun: '☉',
          moon: '☽',
          mercury: '☿',
          venus: '♀',
          mars: '♂',
          jupiter: '♃',
          saturn: '♄',
          uranus: '♅',
          neptune: '♆',
          pluto: '♇'
        };

        const planetNames: Record<string, string> = {
          sun: 'Sol',
          moon: 'Luna',
          mercury: 'Mercurio',
          venus: 'Venus',
          mars: 'Marte',
          jupiter: 'Júpiter',
          saturn: 'Saturno',
          uranus: 'Urano',
          neptune: 'Neptuno',
          pluto: 'Plutón'
        };

        // Agregar cada planeta si existe
        const planetKeys = ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto'] as const;
        
        for (const key of planetKeys) {
          const planetPos = weatherData[key];
          if (planetPos) {
            planetsData.push({
              name: planetNames[key],
              symbol: planetSymbols[key],
              degree: planetPos.longitude, // Usar longitude (0-360°) en lugar de degree (0-30°)
              sign: planetPos.sign,
              retrograde: planetPos.retrograde || false,
              color: planetColors[key]
            });
          }
        }

        setPlanets(planetsData);
      } catch (error) {
        logger.error('Error cargando clima astrológico:', error);
        // Si falla, usar datos de ejemplo
        setPlanets([
          { name: 'Sol', symbol: '☉', degree: 194, sign: 'Libra', color: '#FFD700' },
          { name: 'Luna', symbol: '☽', degree: 14, sign: 'Aries', color: '#E8E8E8' },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    loadAstrologicalData();
  }, []);

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6">
      <div className="max-w-5xl w-full space-y-4 sm:space-y-6">
        <AstrologicalWeatherCard />
        <div className="relative bg-gradient-to-br from-gray-900/80 via-purple-950/80 to-gray-900/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl border border-purple-400/40 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
          <h3 className="relative text-lg sm:text-xl md:text-2xl font-bold text-center mb-4 sm:mb-5 text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-200 animate-pulse px-2" style={{ animationDuration: `3s` }}>
            ✨ Carta del Cielo de Hoy ✨
          </h3>
          <div className="relative flex justify-center items-center">
            {isLoading ? (
              <div className="flex items-center justify-center" style={{ height: chartSize }}>
                <div className="text-yellow-300 animate-pulse">Cargando cielo actual...</div>
              </div>
            ) : (
              <DailyChartWheel 
                size={chartSize}
                planets={planets}
              />
            )}
          </div>

          {/* Botón para abrir modal de detalles - Con efectos llamativos */}
          {weather && (
            <div className="relative mt-8 flex justify-center">
              {/* Efecto de resplandor animado */}
              <div className="absolute inset-0 flex justify-center items-center">
                <div className="w-64 h-12 bg-purple-500/30 rounded-full blur-xl animate-pulse"></div>
              </div>
              
              <button
                onClick={() => setIsModalOpen(true)}
                className="relative group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:via-indigo-500 hover:to-purple-500 rounded-2xl text-base sm:text-lg font-bold text-white transition-all duration-500 shadow-2xl shadow-purple-500/50 hover:shadow-purple-400/70 hover:scale-110 active:scale-95 border-2 border-purple-400/50 hover:border-purple-300 animate-pulse"
                style={{ animationDuration: '2s' }}
              >
                {/* Brillo interior animado */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-500 animate-shimmer"></div>
                
                <Info className="w-6 h-6 drop-shadow-lg group-hover:rotate-12 transition-transform duration-300" />
                <span className="drop-shadow-lg tracking-wide">Ver Detalles del Cielo</span>
                
                {/* Iconos de estrellas decorativas */}
                <span className="text-yellow-300 animate-pulse group-hover:scale-125 transition-transform">✨</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Detalles */}
      {weather && (
        <WeatherDetailsModal 
          weather={weather}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;
