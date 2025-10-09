/**
 * 🌟 FORMULARIO DE CARTA NATAL - Versión Simplificada
 * 
 * Características:
 * - Autocompletado de ciudades con Fuse.js
 * - Cálculo automático de timezone con DST (Luxon)
 * - Configuración avanzada con opciones de display
 * - Diseño moderno coherente con AstroLab
 */

import { useState, useMemo, useEffect } from 'react';
import { DateTime } from 'luxon';
import Fuse from 'fuse.js';
import { Search, MapPin, Settings, X } from 'lucide-react';
import type { FormValue, NatalChartFormProps } from '../types/natalForm';
import { DEFAULT_SETTINGS } from '../types/natalForm';
import { CITIES_DB, type CityData } from '../data/cities';

const MONTHS_ES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

// Clave para localStorage
const FORM_STORAGE_KEY = 'astrolab_last_natal_form';

// Cargar datos guardados del localStorage
const loadSavedFormData = (): Partial<FormValue> | null => {
  try {
    const saved = localStorage.getItem(FORM_STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error('Error loading saved form data:', error);
  }
  return null;
};

// Guardar datos en localStorage
const saveFormData = (data: FormValue) => {
  try {
    localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving form data:', error);
  }
};

export default function NatalChartForm({ defaultValues, onSubmit, onCancel }: NatalChartFormProps) {
  // ===========================
  // ESTADO DEL FORMULARIO CON PERSISTENCIA
  // ===========================
  const [formData, setFormData] = useState<FormValue>(() => {
    // Intentar cargar datos guardados
    const savedData = loadSavedFormData();
    
    if (savedData) {
      // Usar datos guardados si existen
      return {
        name: savedData.name || '',
        surname: savedData.surname,
        gender: savedData.gender,
        isSelf: savedData.isSelf ?? true,
        birth: savedData.birth || {
          day: 1,
          month: 1,
          year: 2000,
          time: undefined,
          timeAccuracy: 'exact',
        },
        location: savedData.location || {
          countryCode: '',
          region: undefined,
          city: undefined,
          neighborhood: undefined,
          lat: undefined,
          lon: undefined,
          tzId: undefined,
        },
        settings: savedData.settings || DEFAULT_SETTINGS,
      };
    }
    
    // Si no hay datos guardados, usar valores por defecto
    return {
      name: defaultValues?.name || '',
      surname: defaultValues?.surname,
      gender: defaultValues?.gender,
      isSelf: defaultValues?.isSelf ?? true,
      birth: defaultValues?.birth || {
        day: 1,
        month: 1,
        year: 2000,
        time: undefined,
        timeAccuracy: 'exact',
      },
      location: defaultValues?.location || {
        countryCode: '',
        region: undefined,
        city: undefined,
        neighborhood: undefined,
        lat: undefined,
        lon: undefined,
        tzId: undefined,
      },
      settings: defaultValues?.settings || DEFAULT_SETTINGS,
    };
  });

  // Guardar automáticamente cuando cambian los datos
  useEffect(() => {
    saveFormData(formData);
  }, [formData]);

  // ===========================
  // BÚSQUEDA DE CIUDADES
  // ===========================
  const [cityQuery, setCityQuery] = useState(() => {
    // Restaurar el texto de búsqueda si hay ciudad guardada
    const savedData = loadSavedFormData();
    if (savedData?.location && savedData.location.city && savedData.location.countryCode) {
      const city = CITIES_DB.find(c => 
        c.name === savedData.location!.city && 
        c.countryCode === savedData.location!.countryCode
      );
      if (city) {
        return `${city.name}, ${city.country}`;
      }
    }
    return '';
  });
  
  const [selectedCity, setSelectedCity] = useState<CityData | null>(() => {
    // Restaurar ciudad seleccionada
    const savedData = loadSavedFormData();
    if (savedData?.location && savedData.location.city && savedData.location.countryCode) {
      const city = CITIES_DB.find(c => 
        c.name === savedData.location!.city && 
        c.countryCode === savedData.location!.countryCode
      );
      return city || null;
    }
    return null;
  });
  
  const [showCityResults, setShowCityResults] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // Configurar Fuse.js para búsqueda fuzzy
  const fuse = useMemo(() => {
    return new Fuse(CITIES_DB, {
      keys: [
        { name: 'name', weight: 0.4 },
        { name: 'aliases', weight: 0.3 },
        { name: 'country', weight: 0.2 },
        { name: 'region', weight: 0.1 },
      ],
      threshold: 0.3,
      includeScore: true,
      minMatchCharLength: 2,
    });
  }, []);

  // Resultados de búsqueda
  const cityResults = useMemo(() => {
    if (cityQuery.length < 2) return [];
    return fuse.search(cityQuery).slice(0, 8).map(result => result.item);
  }, [cityQuery, fuse]);

  // ===========================
  // HANDLERS
  // ===========================
  const handleCitySelect = (city: CityData) => {
    setSelectedCity(city);
    setCityQuery(`${city.name}, ${city.country}`);
    setShowCityResults(false);
    
    setFormData(prev => ({
      ...prev,
      location: {
        countryCode: city.countryCode,
        region: city.region,
        city: city.name,
        neighborhood: undefined,
        lat: city.lat,
        lon: city.lon,
        tzId: city.tzId,
      },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validaciones básicas
    if (!formData.name.trim()) {
      alert('Por favor ingresa un nombre');
      return;
    }
    
    if (!selectedCity) {
      alert('Por favor selecciona una ciudad');
      return;
    }
    
    if (!formData.birth.time) {
      alert('Por favor ingresa la hora de nacimiento');
      return;
    }
    
    onSubmit(formData);
  };

  // Convertir coords a DMS (grados, minutos, segundos)
  const toDMS = (decimal: number, isLat: boolean): string => {
    const absolute = Math.abs(decimal);
    const degrees = Math.floor(absolute);
    const minutesDecimal = (absolute - degrees) * 60;
    const minutes = Math.floor(minutesDecimal);
    const seconds = Math.floor((minutesDecimal - minutes) * 60);
    
    const direction = isLat 
      ? (decimal >= 0 ? 'N' : 'S')
      : (decimal >= 0 ? 'E' : 'W');
    
    return `${degrees}°${minutes}'${seconds}" ${direction}`;
  };

  // Calcular offset de timezone con DST
  const getTimezoneOffset = (): string => {
    if (!selectedCity || !formData.birth.time) return '';
    
    const dt = DateTime.fromObject({
      year: formData.birth.year,
      month: formData.birth.month + 1,
      day: formData.birth.day,
      hour: formData.birth.time.hour,
      minute: formData.birth.time.minute,
    }, { zone: selectedCity.tzId });
    
    const offsetMinutes = dt.offset;
    const hours = Math.floor(Math.abs(offsetMinutes) / 60);
    const minutes = Math.abs(offsetMinutes) % 60;
    const sign = offsetMinutes >= 0 ? '+' : '-';
    
    return `UTC${sign}${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  // ===========================
  // RENDER
  // ===========================
  return (
    <div className="flex justify-center px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-4xl space-y-5">
        {/* HEADER */}
        <div className="bg-gradient-to-r from-purple-600/20 to-indigo-600/20 rounded-xl p-4 border border-purple-400/30">
          <h2 className="text-2xl font-bold text-white mb-2">
            📊 Nueva Carta Natal
          </h2>
          <p className="text-sm text-white/70">
            Ingresa los datos de nacimiento para calcular la carta astral
          </p>
        </div>

      {/* SECCIÓN 1: DATOS PERSONALES Y FECHA - LADO A LADO */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* DATOS PERSONALES */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 space-y-3">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span className="text-lg">👤</span>
            Datos Personales
          </h3>
          
          {/* Nombre */}
          <div>
            <label className="block text-xs font-medium text-white/90 mb-1.5">
              Nombre *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white text-sm placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              placeholder="Ej: María"
              required
            />
          </div>

          {/* Apellido (opcional) */}
          <div>
            <label className="block text-xs font-medium text-white/90 mb-1.5">
              Apellido (opcional)
            </label>
            <input
              type="text"
              value={formData.surname || ''}
              onChange={(e) => setFormData({ ...formData, surname: e.target.value })}
              className="w-full px-3 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white text-sm placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              placeholder="Ej: González"
            />
          </div>
        </div>

        {/* FECHA Y HORA DE NACIMIENTO */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 space-y-3">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span className="text-lg">🗓️</span>
            Fecha y Hora
          </h3>

          {/* Fecha */}
          <div className="grid grid-cols-3 gap-2">
            {/* Día */}
            <div>
              <label className="block text-xs font-medium text-white/90 mb-1.5">Día</label>
              <select
                value={formData.birth.day}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  birth: { ...formData.birth, day: Number(e.target.value) }
                })}
                className="w-full px-2 py-2.5 text-sm bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
              >
                {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                  <option key={day} value={day} className="bg-gray-800">{day}</option>
                ))}
              </select>
            </div>

            {/* Mes */}
            <div>
              <label className="block text-xs font-medium text-white/90 mb-1.5">Mes</label>
              <select
                value={formData.birth.month}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  birth: { ...formData.birth, month: Number(e.target.value) }
                })}
                className="w-full px-2 py-2.5 text-sm bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
              >
                {MONTHS_ES.map((month, index) => (
                  <option key={index} value={index} className="bg-gray-800">{month}</option>
                ))}
              </select>
            </div>

            {/* Año */}
            <div>
              <label className="block text-xs font-medium text-white/90 mb-1.5">Año</label>
              <input
                type="number"
                value={formData.birth.year}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  birth: { ...formData.birth, year: Number(e.target.value) || 0 }
                })}
                onFocus={(e) => e.target.select()}
                min="1900"
                max="2100"
                placeholder="2000"
                className="w-full px-2 py-2.5 text-sm bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
              />
            </div>
          </div>

          {/* Hora */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-medium text-white/90 mb-1.5">Hora</label>
              <select
                value={formData.birth.time?.hour || 0}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  birth: { 
                    ...formData.birth, 
                    time: { 
                      hour: Number(e.target.value), 
                      minute: formData.birth.time?.minute || 0 
                    }
                  }
                })}
                className="w-full px-2 py-2.5 text-sm bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
              >
                {Array.from({ length: 24 }, (_, i) => i).map(hour => (
                  <option key={hour} value={hour} className="bg-gray-800">
                    {hour.toString().padStart(2, '0')}h
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-white/90 mb-1.5">Min</label>
              <select
                value={formData.birth.time?.minute || 0}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  birth: { 
                    ...formData.birth, 
                    time: { 
                      hour: formData.birth.time?.hour || 0, 
                      minute: Number(e.target.value) 
                    }
                  }
                })}
                className="w-full px-2 py-2.5 text-sm bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
              >
                {Array.from({ length: 60 }, (_, i) => i).map(minute => (
                  <option key={minute} value={minute} className="bg-gray-800">
                    {minute.toString().padStart(2, '0')}m
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* LUGAR DE NACIMIENTO + BOTÓN CONFIGURACIÓN */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Lugar de Nacimiento
          </h3>
          
          {/* Botón pequeño de configuración */}
          <button
            type="button"
            onClick={() => setShowSettingsModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-xs font-medium text-white transition-all hover:scale-105"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Configuración</span>
          </button>
        </div>

        {/* Buscador de ciudad */}
        <div className="relative">
          <label className="block text-xs font-medium text-white/90 mb-1.5">
            Ciudad *
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              type="text"
              value={cityQuery}
              onChange={(e) => {
                setCityQuery(e.target.value);
                setShowCityResults(true);
              }}
              onFocus={() => setShowCityResults(true)}
              className="w-full pl-10 pr-10 py-2.5 text-sm bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
              placeholder="Buscar ciudad... (ej: Buenos Aires)"
              autoComplete="off"
            />
            {selectedCity && cityQuery && (
              <button
                type="button"
                onClick={() => {
                  setCityQuery('');
                  setSelectedCity(null);
                  setFormData(prev => ({ ...prev, location: { ...prev.location, city: undefined, lat: undefined, lon: undefined, tzId: undefined }}));
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded"
              >
                <X className="w-4 h-4 text-white/60" />
              </button>
            )}
          </div>

          {/* Resultados de búsqueda */}
          {showCityResults && cityResults.length > 0 && (
            <div className="absolute z-20 mt-2 w-full bg-gray-900/95 backdrop-blur-md border border-purple-400/30 rounded-lg shadow-2xl max-h-64 overflow-y-auto">
              {cityResults.map((city) => (
                <button
                  key={city.id}
                  type="button"
                  onClick={() => handleCitySelect(city)}
                  className="w-full px-3 py-2.5 text-left hover:bg-purple-600/30 transition-colors border-b border-white/5 last:border-b-0"
                >
                  <div className="font-medium text-sm text-white">{city.name}</div>
                  <div className="text-xs text-white/60">
                    {city.region && `${city.region}, `}{city.country}
                  </div>
                  <div className="text-xs text-white/40 mt-0.5">
                    {city.lat.toFixed(4)}°, {city.lon.toFixed(4)}° • {city.tzId}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info de ciudad seleccionada */}
        {selectedCity && (
          <div className="bg-purple-600/20 rounded-lg p-3 border border-purple-400/30 space-y-2">
            <div className="flex items-center gap-2 text-white text-sm font-medium">
              <MapPin className="w-3.5 h-3.5" />
              {selectedCity.name}, {selectedCity.country}
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <div className="text-white/60">Coordenadas</div>
                <div className="text-white font-mono">
                  {selectedCity.lat.toFixed(4)}°, {selectedCity.lon.toFixed(4)}°
                </div>
              </div>
              <div>
                <div className="text-white/60">Timezone</div>
                <div className="text-white font-mono">{selectedCity.tzId}</div>
              </div>
              <div>
                <div className="text-white/60">Coords DMS</div>
                <div className="text-white font-mono text-[10px]">
                  {toDMS(selectedCity.lat, true)}<br/>
                  {toDMS(selectedCity.lon, false)}
                </div>
              </div>
              <div>
                <div className="text-white/60">Offset {formData.birth.time && '(DST)'}</div>
                <div className="text-white font-mono">{getTimezoneOffset() || 'N/A'}</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MODAL DE CONFIGURACIÓN AVANZADA */}
      {showSettingsModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
          onClick={() => setShowSettingsModal(false)}
        >
          <div 
            className="relative bg-gradient-to-br from-purple-900/95 via-indigo-900/95 to-violet-900/95 rounded-2xl w-full max-w-md border border-purple-400/30 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header del Modal */}
            <div className="bg-gradient-to-r from-purple-600/90 to-indigo-600/90 backdrop-blur-md border-b border-white/20 p-4 flex items-center justify-between rounded-t-2xl">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-white" />
                <h3 className="text-lg font-bold text-white">Configuración Avanzada</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowSettingsModal(false)}
                className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                aria-label="Cerrar"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Contenido del Modal */}
            <div className="p-5 space-y-4">
              <p className="text-sm text-white/70">
                Opciones de visualización en la rueda astrológica
              </p>

              {/* Display Options */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-white/80 uppercase tracking-wider">
                  Display
                </h4>

                {/* Fortuna */}
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={formData.settings.display.fortuna}
                    onChange={(e) => setFormData({
                      ...formData,
                      settings: {
                        ...formData.settings,
                        display: { ...formData.settings.display, fortuna: e.target.checked }
                      }
                    })}
                    className="w-4 h-4 rounded border-white/20 bg-white/10 text-purple-600 focus:ring-2 focus:ring-purple-500 cursor-pointer"
                  />
                  <span className="text-sm text-white group-hover:text-purple-300 transition-colors">
                    ⊕ Parte de la Fortuna
                  </span>
                </label>

                {/* Vertex */}
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={formData.settings.display.vertex}
                    onChange={(e) => setFormData({
                      ...formData,
                      settings: {
                        ...formData.settings,
                        display: { ...formData.settings.display, vertex: e.target.checked }
                      }
                    })}
                    className="w-4 h-4 rounded border-white/20 bg-white/10 text-purple-600 focus:ring-2 focus:ring-purple-500 cursor-pointer"
                  />
                  <span className="text-sm text-white group-hover:text-purple-300 transition-colors">
                    Vx Vertex
                  </span>
                </label>

                {/* Chiron */}
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={formData.settings.display.chiron}
                    onChange={(e) => setFormData({
                      ...formData,
                      settings: {
                        ...formData.settings,
                        display: { ...formData.settings.display, chiron: e.target.checked }
                      }
                    })}
                    className="w-4 h-4 rounded border-white/20 bg-white/10 text-purple-600 focus:ring-2 focus:ring-purple-500 cursor-pointer"
                  />
                  <span className="text-sm text-white group-hover:text-purple-300 transition-colors">
                    ⚷ Chiron
                  </span>
                </label>

                {/* Lilith True */}
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={formData.settings.display.lilithTrue}
                    onChange={(e) => setFormData({
                      ...formData,
                      settings: {
                        ...formData.settings,
                        display: { ...formData.settings.display, lilithTrue: e.target.checked }
                      }
                    })}
                    className="w-4 h-4 rounded border-white/20 bg-white/10 text-purple-600 focus:ring-2 focus:ring-purple-500 cursor-pointer"
                  />
                  <span className="text-sm text-white group-hover:text-purple-300 transition-colors">
                    ⚸ Lilith (True)
                  </span>
                </label>

                {/* Lunar Nodes True */}
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={formData.settings.display.nodesTrue}
                    onChange={(e) => setFormData({
                      ...formData,
                      settings: {
                        ...formData.settings,
                        display: { ...formData.settings.display, nodesTrue: e.target.checked }
                      }
                    })}
                    className="w-4 h-4 rounded border-white/20 bg-white/10 text-purple-600 focus:ring-2 focus:ring-purple-500 cursor-pointer"
                  />
                  <span className="text-sm text-white group-hover:text-purple-300 transition-colors">
                    ☊☋ Nodos Lunares (True)
                  </span>
                </label>
              </div>

              <div className="pt-3 border-t border-white/10">
                <p className="text-xs text-white/50 italic">
                  💡 Estas opciones afectan solo a la visualización de la rueda. Los modales y tablas mostrarán todos los datos.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gradient-to-r from-purple-600/90 to-indigo-600/90 backdrop-blur-md border-t border-white/20 p-4 rounded-b-2xl">
              <button
                type="button"
                onClick={() => setShowSettingsModal(false)}
                className="w-full py-2.5 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-bold text-white transition-all"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BOTONES */}
      <div className="flex gap-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-all"
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          className="flex-1 px-6 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-purple-500/50 hover:scale-105 active:scale-95"
        >
          ✨ Calcular Carta Natal
        </button>
      </div>
    </form>
    </div>
  );
}
