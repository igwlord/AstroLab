import React, { useState, useEffect } from 'react';
import { useI18n } from '../i18n';
import { useSavedCharts } from '../store/useSavedCharts';
import { 
  calculateNatalChart, 
  type NatalChart,
  getCountries,
  getProvinces,
  getCities,
  getNeighborhoods,
  findLocation
} from '../services/astroCalculator';

interface ChartData {
  name: string;
  date: string;
  time: string;
  timeAccuracy: 'exact' | 'approx' | 'unknown';
  country: string;
  province: string;
  city: string;
  neighborhood: string;
  latitude: number | null;
  longitude: number | null;
  timezone: string;
  houseSystem: 'Placidus' | 'WholeSign' | 'Koch' | 'Equal';
}

const NatalChartPage: React.FC = () => {
  const { t } = useI18n();
  const [step, setStep] = useState<'form' | 'result'>('form');
  const [calculating, setCalculating] = useState(false);
  const [result, setResult] = useState<NatalChart | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saveNotes, setSaveNotes] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);
  
  const { saveChart } = useSavedCharts();
  
  const [chartData, setChartData] = useState<ChartData>({
    name: '',
    date: '',
    time: '12:00',
    timeAccuracy: 'exact',
    country: '',
    province: '',
    city: '',
    neighborhood: '',
    latitude: null,
    longitude: null,
    timezone: '',
    houseSystem: 'Placidus'
  });

  // Listas dinámicas basadas en la selección
  const [countries] = useState(getCountries());
  const [provinces, setProvinces] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [neighborhoods, setNeighborhoods] = useState<string[]>([]);

  // Actualizar provincias cuando cambia el país
  useEffect(() => {
    if (chartData.country) {
      const provs = getProvinces(chartData.country);
      setProvinces(provs);
      // Resetear selecciones posteriores
      setChartData(prev => ({ ...prev, province: '', city: '', neighborhood: '' }));
      setCities([]);
      setNeighborhoods([]);
    }
  }, [chartData.country]);

  // Actualizar ciudades cuando cambia la provincia
  useEffect(() => {
    if (chartData.country && chartData.province) {
      const citiesData = getCities(chartData.country, chartData.province);
      setCities(citiesData);
      // Resetear selecciones posteriores
      setChartData(prev => ({ ...prev, city: '', neighborhood: '' }));
      setNeighborhoods([]);
    }
  }, [chartData.country, chartData.province]);

  // Actualizar barrios cuando cambia la ciudad
  useEffect(() => {
    if (chartData.country && chartData.province && chartData.city) {
      const neighborhoodsData = getNeighborhoods(chartData.country, chartData.province, chartData.city);
      setNeighborhoods(neighborhoodsData);
      setChartData(prev => ({ ...prev, neighborhood: '' }));
    }
  }, [chartData.country, chartData.province, chartData.city]);

  // Actualizar coordenadas automáticamente
  useEffect(() => {
    if (chartData.country && chartData.province && chartData.city) {
      const location = findLocation(
        chartData.country,
        chartData.province,
        chartData.city,
        chartData.neighborhood || undefined
      );
      
      if (location) {
        setChartData(prev => ({
          ...prev,
          latitude: location.latitude,
          longitude: location.longitude,
          timezone: location.timezone
        }));
        setError(null);
      }
    }
  }, [chartData.country, chartData.province, chartData.city, chartData.neighborhood]);

  const handleInputChange = (field: keyof ChartData, value: string | number | null) => {
    setChartData(prev => ({ ...prev, [field]: value }));
  };

  const handleCalculate = async () => {
    setCalculating(true);
    setError(null);
    
    try {
      // Verificar que tenemos coordenadas
      if (!chartData.latitude || !chartData.longitude) {
        throw new Error('Por favor selecciona una ubicación válida');
      }
      
      // Crear fecha en hora local del lugar de nacimiento
      // y convertirla correctamente a UTC
      
      const [year, month, day] = chartData.date.split('-').map(Number);
      const [hour, minute] = chartData.time.split(':').map(Number);
      
      // Mapa de offsets UTC para zonas horarias (simplificado para 1988)
      const timezoneOffsets: Record<string, number> = {
        'America/Argentina/Buenos_Aires': -3,
        'America/Mexico_City': -6,
        'America/Bogota': -5,
        'America/Santiago': -4,
        'America/Lima': -5,
        'Europe/Madrid': +1,
        'America/New_York': -5,
        'America/Los_Angeles': -8,
      };
      
      const offset = timezoneOffsets[chartData.timezone] || 0;
      
      // Crear fecha UTC correcta sumando el offset
      // Si son las 17:50 en Buenos Aires (UTC-3), en UTC son las 20:50
      const birthDateUTC = new Date(Date.UTC(
        year,
        month - 1,  // mes 0-indexed
        day,
        hour - offset,  // ajustar por zona horaria
        minute,
        0
      ));
      
      console.log('Datos de entrada:', {
        fechaLocal: `${chartData.date} ${chartData.time}`,
        timezone: chartData.timezone,
        offset: `UTC${offset >= 0 ? '+' : ''}${offset}`,
        birthDateUTC: birthDateUTC.toISOString(),
        coords: [chartData.latitude, chartData.longitude]
      });
      
      // Construir nombre de ubicación
      const locationName = [
        chartData.neighborhood,
        chartData.city,
        chartData.province,
        chartData.country
      ].filter(Boolean).join(', ');
      
      // Calcular carta natal (astronomy-engine espera UTC)
      const chart = await calculateNatalChart(
        birthDateUTC,
        chartData.latitude,
        chartData.longitude,
        locationName,
        chartData.timezone
      );
      
      console.log('Carta calculada:', chart);
      
      setResult(chart);
      setStep('result');
      setSavedSuccess(false); // Reset saved success message
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al calcular la carta natal');
      console.error('Error:', err);
    } finally {
      setCalculating(false);
    }
  };

  const handleSaveChart = () => {
    if (!result || !chartData.name) return;
    
    saveChart(chartData.name, result, saveNotes);
    setSavedSuccess(true);
    setShowSaveModal(false);
    setSaveNotes('');
    
    // Ocultar mensaje después de 3 segundos
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleNewChart = () => {
    setStep('form');
    setResult(null);
    setError(null);
    setSavedSuccess(false);
    // NO reseteamos chartData para que mantenga los últimos datos
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-purple-900 mb-4">
          {t('natalChart.title')}
        </h1>
        <p className="text-lg text-purple-700">
          Calcula tu carta natal completa con planetas, casas y aspectos
        </p>
      </div>

      {/* Form Section */}
      {step === 'form' && (
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-purple-100">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Información Personal */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-purple-900 mb-4 flex items-center gap-2">
                <span>👤</span> Información Personal
              </h2>

              {/* Nombre */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre completo
                </label>
                <input
                  type="text"
                  value={chartData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Ej: María González"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              {/* Fecha */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha de nacimiento
                </label>
                <input
                  type="date"
                  value={chartData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              {/* Hora */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hora de nacimiento
                </label>
                <input
                  type="time"
                  value={chartData.time}
                  onChange={(e) => handleInputChange('time', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              {/* Precisión de hora */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Precisión de la hora
                </label>
                <select
                  value={chartData.timeAccuracy}
                  onChange={(e) => handleInputChange('timeAccuracy', e.target.value as 'exact' | 'approx' | 'unknown')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="exact">Exacta (certificado de nacimiento)</option>
                  <option value="approx">Aproximada (recuerdo/estimación)</option>
                  <option value="unknown">Desconocida (carta solar 12:00)</option>
                </select>
                {chartData.timeAccuracy === 'unknown' && (
                  <p className="text-sm text-amber-600 mt-2">
                    ⚠️ Sin hora exacta, las casas y el ascendente no serán confiables
                  </p>
                )}
              </div>
            </div>

            {/* Ubicación */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-purple-900 mb-4 flex items-center gap-2">
                <span>📍</span> Lugar de Nacimiento
              </h2>

              {/* País */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  País *
                </label>
                <select
                  value={chartData.country}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Selecciona un país</option>
                  {countries.map(country => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
              </div>

              {/* Provincia/Estado */}
              {chartData.country && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Provincia / Estado *
                  </label>
                  <select
                    value={chartData.province}
                    onChange={(e) => handleInputChange('province', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Selecciona provincia/estado</option>
                    {provinces.map(province => (
                      <option key={province} value={province}>{province}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Ciudad */}
              {chartData.province && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ciudad *
                  </label>
                  <select
                    value={chartData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Selecciona ciudad</option>
                    {cities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Barrio (opcional) */}
              {chartData.city && neighborhoods.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Barrio / Zona (opcional para mayor precisión)
                  </label>
                  <select
                    value={chartData.neighborhood}
                    onChange={(e) => handleInputChange('neighborhood', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Ciudad completa</option>
                    {neighborhoods.map(neighborhood => (
                      <option key={neighborhood} value={neighborhood}>{neighborhood}</option>
                    ))}
                  </select>
                  <p className="text-sm text-purple-600 mt-1">
                    ✨ Selecciona un barrio para coordenadas más precisas
                  </p>
                </div>
              )}

              {/* Coordenadas detectadas */}
              {chartData.latitude && chartData.longitude && (
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm text-green-800">
                    <strong>✅ Ubicación detectada:</strong>
                  </p>
                  <p className="text-sm text-green-700 mt-1">
                    📍 {chartData.latitude.toFixed(4)}°, {chartData.longitude.toFixed(4)}°
                  </p>
                  <p className="text-sm text-green-700">
                    🕐 Zona horaria: {chartData.timezone}
                  </p>
                </div>
              )}

              {/* Coordenadas manuales (avanzado) */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Latitud (opcional)
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    value={chartData.latitude || ''}
                    onChange={(e) => handleInputChange('latitude', e.target.value ? parseFloat(e.target.value) : null)}
                    placeholder="-34.6037"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Longitud (opcional)
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    value={chartData.longitude || ''}
                    onChange={(e) => handleInputChange('longitude', e.target.value ? parseFloat(e.target.value) : null)}
                    placeholder="-58.3816"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Zona horaria */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Zona horaria
                </label>
                <select
                  value={chartData.timezone}
                  onChange={(e) => handleInputChange('timezone', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="America/Argentina/Buenos_Aires">Argentina (Buenos Aires)</option>
                  <option value="America/Mexico_City">México (Ciudad de México)</option>
                  <option value="America/Bogota">Colombia (Bogotá)</option>
                  <option value="America/Santiago">Chile (Santiago)</option>
                  <option value="America/Lima">Perú (Lima)</option>
                  <option value="Europe/Madrid">España (Madrid)</option>
                  <option value="America/New_York">USA (New York)</option>
                  <option value="America/Los_Angeles">USA (Los Angeles)</option>
                </select>
              </div>

              {/* Sistema de casas */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sistema de casas
                </label>
                <select
                  value={chartData.houseSystem}
                  onChange={(e) => handleInputChange('houseSystem', e.target.value as ChartData['houseSystem'])}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="Placidus">Placidus (más usado)</option>
                  <option value="WholeSign">Signos Enteros (tradicional)</option>
                  <option value="Koch">Koch</option>
                  <option value="Equal">Igual</option>
                </select>
              </div>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="mt-6 p-4 bg-red-50 rounded-lg border-l-4 border-red-500">
              <p className="text-sm text-red-800">
                <strong>⚠️ Error:</strong> {error}
              </p>
            </div>
          )}

          {/* Botón de cálculo */}
          <div className="mt-8 text-center">
            <button
              onClick={handleCalculate}
              disabled={
                !chartData.name || 
                !chartData.date || 
                !chartData.country || 
                !chartData.province || 
                !chartData.city ||
                !chartData.latitude ||
                !chartData.longitude ||
                calculating
              }
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg shadow-lg hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            >
              {calculating ? '⏳ Calculando...' : '🔮 Calcular Carta Natal'}
            </button>
            {(!chartData.name || !chartData.date || !chartData.city) && !calculating && (
              <p className="text-sm text-gray-500 mt-2">
                Completa nombre, fecha y ubicación completa para continuar
              </p>
            )}
          </div>

          {/* Info de desarrollo */}
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-500">
            <p className="text-sm text-blue-800 dark:text-blue-300">
              <strong>✨ Motor astronómico:</strong> Usando astronomy-engine (algoritmos de Meeus) 
              para cálculos precisos de posiciones planetarias, casas y aspectos.
            </p>
          </div>
        </div>
      )}

      {/* Result Section */}
      {step === 'result' && result && (
        <div className="space-y-6">
          {/* Header con botones */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-purple-100">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-3xl font-bold text-purple-900 mb-2">
                  Carta Natal de {chartData.name}
                </h2>
                <p className="text-gray-600">
                  📅 {new Date(result.date).toLocaleDateString('es-ES', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
                <p className="text-gray-600">
                  📍 {result.location} ({result.latitude.toFixed(4)}°, {result.longitude.toFixed(4)}°)
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowSaveModal(true)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  💾 Guardar
                </button>
                <button
                  onClick={handleNewChart}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  ✨ Nueva Carta
                </button>
              </div>
            </div>
            
            {/* Mensaje de éxito */}
            {savedSuccess && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800 font-medium">
                  ✅ Carta guardada exitosamente en "Mis Cartas"
                </p>
              </div>
            )}
          </div>

          {/* Trio Principal: SOL, LUNA, ASCENDENTE */}
          <div className="grid md:grid-cols-3 gap-6">
            {/* SOL */}
            {(() => {
              const sol = result.planets.find(p => p.name === 'Sol');
              if (!sol) return null;
              return (
                <div className="bg-gradient-to-br from-yellow-50 via-orange-50 to-yellow-100 rounded-2xl p-6 shadow-2xl border-2 border-yellow-300 relative overflow-hidden">
                  <div className="absolute top-0 right-0 text-8xl opacity-10">☀️</div>
                  <div className="relative z-10">
                    <h3 className="text-2xl font-bold text-yellow-900 mb-3 flex items-center gap-2">
                      <span className="text-3xl">☀️</span> SOL
                    </h3>
                    <p className="text-4xl font-black text-yellow-700 mb-2">
                      {sol.sign} {sol.degree.toFixed(2)}°
                    </p>
                    <p className="text-sm text-yellow-800 font-semibold mb-1">
                      Casa {sol.house}
                    </p>
                    <p className="text-sm text-yellow-700 italic">
                      Tu esencia y propósito vital
                    </p>
                  </div>
                </div>
              );
            })()}

            {/* LUNA */}
            {(() => {
              const luna = result.planets.find(p => p.name === 'Luna');
              if (!luna) return null;
              return (
                <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 rounded-2xl p-6 shadow-2xl border-2 border-indigo-300 relative overflow-hidden">
                  <div className="absolute top-0 right-0 text-8xl opacity-10">🌙</div>
                  <div className="relative z-10">
                    <h3 className="text-2xl font-bold text-indigo-900 mb-3 flex items-center gap-2">
                      <span className="text-3xl">🌙</span> LUNA
                    </h3>
                    <p className="text-4xl font-black text-indigo-700 mb-2">
                      {luna.sign} {luna.degree.toFixed(2)}°
                    </p>
                    <p className="text-sm text-indigo-800 font-semibold mb-1">
                      Casa {luna.house}
                    </p>
                    <p className="text-sm text-indigo-700 italic">
                      Tus emociones y necesidades
                    </p>
                  </div>
                </div>
              );
            })()}

            {/* ASCENDENTE */}
            <div className="bg-gradient-to-br from-pink-50 via-rose-50 to-red-100 rounded-2xl p-6 shadow-2xl border-2 border-rose-300 relative overflow-hidden">
              <div className="absolute top-0 right-0 text-8xl opacity-10">⬆️</div>
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-rose-900 mb-3 flex items-center gap-2">
                  <span className="text-3xl">⬆️</span> ASCENDENTE
                </h3>
                <p className="text-4xl font-black text-rose-700 mb-2">
                  {result.ascendant.sign} {result.ascendant.degree.toFixed(2)}°
                </p>
                <p className="text-sm text-rose-800 font-semibold mb-1">
                  Casa 1
                </p>
                <p className="text-sm text-rose-700 italic">
                  Tu máscara y primera impresión
                </p>
              </div>
            </div>
          </div>

          {/* Medio Cielo (secundario) */}
          <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl p-4 shadow-lg border border-cyan-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-4xl">🔝</span>
                <div>
                  <h3 className="text-lg font-bold text-cyan-900">Medio Cielo (MC)</h3>
                  <p className="text-sm text-cyan-700">Tu vocación y logros públicos</p>
                </div>
              </div>
              <p className="text-2xl font-bold text-cyan-700">
                {result.midheaven.sign} {result.midheaven.degree.toFixed(2)}°
              </p>
            </div>
          </div>

          {/* Planetas */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-purple-100">
            <h3 className="text-2xl font-bold text-purple-900 mb-4">🪐 Posiciones Planetarias</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-purple-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-purple-900">Planeta</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-purple-900">Signo</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-purple-900">Grado</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-purple-900">Casa</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-purple-900">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {result.planets.map((planet, idx) => (
                    <tr key={idx} className="hover:bg-purple-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-gray-900">{planet.name}</td>
                      <td className="px-4 py-3 text-gray-700">{planet.sign}</td>
                      <td className="px-4 py-3 text-gray-700">{planet.degree.toFixed(2)}°</td>
                      <td className="px-4 py-3 text-gray-700">Casa {planet.house}</td>
                      <td className="px-4 py-3">
                        {planet.retrograde ? (
                          <span className="text-red-600 font-semibold">℞ Retrógrado</span>
                        ) : (
                          <span className="text-green-600">→ Directo</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Casas */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-purple-100">
            <h3 className="text-2xl font-bold text-purple-900 mb-4">
              🏠 Casas Astrológicas ({chartData.houseSystem})
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {result.houses.map((house) => (
                <div
                  key={house.number}
                  className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border border-purple-200"
                >
                  <div className="text-lg font-bold text-purple-900">Casa {house.number}</div>
                  <div className="text-purple-700">
                    {house.sign} {house.degree.toFixed(2)}°
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Aspectos */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-purple-100">
            <h3 className="text-2xl font-bold text-purple-900 mb-4">✨ Aspectos Planetarios</h3>
            {result.aspects.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-purple-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-sm font-semibold text-purple-900">Planeta 1</th>
                      <th className="px-4 py-2 text-left text-sm font-semibold text-purple-900">Aspecto</th>
                      <th className="px-4 py-2 text-left text-sm font-semibold text-purple-900">Planeta 2</th>
                      <th className="px-4 py-2 text-left text-sm font-semibold text-purple-900">Orbe</th>
                      <th className="px-4 py-2 text-left text-sm font-semibold text-purple-900">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {result.aspects.map((aspect, idx) => (
                      <tr key={idx} className="hover:bg-purple-50 transition-colors">
                        <td className="px-4 py-3 font-medium text-gray-900">{aspect.planet1}</td>
                        <td className="px-4 py-3">
                          <span className={`font-semibold ${
                            aspect.type === 'Conjunción' ? 'text-yellow-600' :
                            aspect.type === 'Trígono' ? 'text-green-600' :
                            aspect.type === 'Sextil' ? 'text-blue-600' :
                            aspect.type === 'Cuadratura' ? 'text-red-600' :
                            'text-orange-600'
                          }`}>
                            {aspect.type}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-medium text-gray-900">{aspect.planet2}</td>
                        <td className="px-4 py-3 text-gray-700">{aspect.orb.toFixed(2)}°</td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {aspect.applying ? 'Aplicando' : 'Separando'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-600">No se encontraron aspectos mayores en esta carta.</p>
            )}
          </div>
        </div>
      )}

      {/* Modal para guardar carta */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-2xl font-bold text-purple-900 mb-4">
              💾 Guardar Carta Natal
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre de la carta
                </label>
                <input
                  type="text"
                  value={chartData.name}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notas (opcional)
                </label>
                <textarea
                  value={saveNotes}
                  onChange={(e) => setSaveNotes(e.target.value)}
                  placeholder="Añade notas sobre esta carta..."
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => {
                    setShowSaveModal(false);
                    setSaveNotes('');
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveChart}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  💾 Guardar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NatalChartPage;