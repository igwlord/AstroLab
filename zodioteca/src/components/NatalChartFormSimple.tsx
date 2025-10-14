/**
 * 🌟 FORMULARIO DE CARTA NATAL - Versión Simplificada
 * 
 * Características:
 * - Autocompletado de ciudades con Fuse.js
 * - Cálculo automático de timezone con DST (Luxon)
 * - Configuración avanzada con opciones de display
 * - Diseño moderno coherente con AstroLab
 */

import { useState, useMemo, useEffect, useRef, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import { DateTime } from 'luxon';
import Fuse from 'fuse.js';
import { Search, MapPin, Settings, X } from '../utils/icons';
import { logger } from '../utils/logger';
import type { FormValue, NatalChartFormProps } from '../types/natalForm';
import { DEFAULT_SETTINGS } from '../types/natalForm';
import { CITIES_DB, type CityData } from '../data/cities';
import { useSettingsStore } from '../store/useSettings';
import { HOUSE_SYSTEMS } from '../types/houseSystem';

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
      const data = JSON.parse(saved);
      // 🔧 Limpiar datos legacy: remover nodesTrue si existe
      if (data.settings?.display?.nodesTrue !== undefined) {
        delete data.settings.display.nodesTrue;
      }
      return data;
    }
  } catch (error) {
    logger.error('Error loading saved form data:', error);
  }
  return null;
};

// Guardar datos en localStorage
const saveFormData = (data: FormValue) => {
  try {
    localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    logger.error('Error saving form data:', error);
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
  const [useManualCoordinates, setUseManualCoordinates] = useState(false);
  const cityInputRef = useRef<HTMLInputElement>(null);
  const [dropdownPosition, setDropdownPosition] = useState<{ top: number; left: number; width: number } | null>(null);
  
  // Sistema de casas - inicializar desde el store solo una vez
  const [houseSystem, setHouseSystemState] = useState(() => useSettingsStore.getState().astro.houseSystem);
  
  // Actualizar el store global cuando cambie localmente
  const setHouseSystem = (newSystem: 'placidus' | 'koch' | 'whole-sign' | 'equal-house' | 'porphyry' | 'campanus') => {
    setHouseSystemState(newSystem);
    useSettingsStore.getState().setHouseSystem(newSystem);
  };

  // Helper para calcular posición del dropdown
  const updateDropdownPosition = () => {
    if (cityInputRef.current) {
      const rect = cityInputRef.current.getBoundingClientRect();
      setDropdownPosition({
        // Para position: fixed, top/left son relativos al viewport
        top: rect.bottom + 8,
        left: rect.left,
        width: rect.width,
      });
    }
  };

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

  // Calcular posición antes del paint cuando abrimos y hay resultados
  useLayoutEffect(() => {
    if (showCityResults && cityResults.length > 0) {
      updateDropdownPosition();
    } else {
      setDropdownPosition(null);
    }
  }, [showCityResults, cityResults]);

  // Mantener posición actualizada con scroll/resize mientras está abierto
  useEffect(() => {
    if (!showCityResults) return;
    const onScrollResize = () => updateDropdownPosition();
    window.addEventListener('scroll', onScrollResize);
    window.addEventListener('resize', onScrollResize);
    return () => {
      window.removeEventListener('scroll', onScrollResize);
      window.removeEventListener('resize', onScrollResize);
    };
  }, [showCityResults]);

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showCityResults && cityInputRef.current && !cityInputRef.current.contains(event.target as Node)) {
        // Verificar si el click fue en el dropdown
        const dropdown = document.querySelector('[data-city-dropdown]');
        if (!dropdown?.contains(event.target as Node)) {
          setShowCityResults(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showCityResults]);

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
    
    // Validar ciudad solo si NO estamos usando coordenadas manuales
    if (!useManualCoordinates && !selectedCity) {
      alert('Por favor selecciona una ciudad');
      return;
    }
    
    // Validar coordenadas manuales si está activado
    if (useManualCoordinates) {
      const { lat, lon, tzId } = formData.location;
      
      if (!lat || !lon || !tzId) {
        alert('Por favor completa todos los campos de coordenadas (Latitud, Longitud, Timezone)');
        return;
      }
      
      if (lat < -90 || lat > 90) {
        alert('La latitud debe estar entre -90 y 90');
        return;
      }
      
      if (lon < -180 || lon > 180) {
        alert('La longitud debe estar entre -180 y 180');
        return;
      }
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
        <div className="bg-gradient-to-r from-purple-200/50 to-indigo-200/50 dark:from-purple-600/20 dark:to-indigo-600/20 rounded-xl p-4 border border-purple-300 dark:border-purple-400/30">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
            📊 Nueva Carta Natal
          </h2>
          <p className="text-sm text-gray-700 dark:text-white/70">
            Ingresa los datos de nacimiento para calcular la carta astral
          </p>
        </div>

      {/* SECCIÓN 1: DATOS PERSONALES Y FECHA - LADO A LADO */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* DATOS PERSONALES */}
        <div className="bg-white/90 dark:bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-gray-200 dark:border-white/10 space-y-3">
          <h3 className="text-base font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <span className="text-lg">👤</span>
            Datos Personales
          </h3>
          
          {/* Nombre */}
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-white/90 mb-1.5">
              Nombre *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2.5 bg-white dark:bg-white/10 border border-gray-300 dark:border-white/20 rounded-lg text-gray-800 dark:text-white text-sm placeholder-gray-400 dark:placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              placeholder="Ej: María"
              required
            />
          </div>

          {/* Apellido (opcional) */}
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-white/90 mb-1.5">
              Apellido (opcional)
            </label>
            <input
              type="text"
              value={formData.surname || ''}
              onChange={(e) => setFormData({ ...formData, surname: e.target.value })}
              className="w-full px-3 py-2.5 bg-white dark:bg-white/10 border border-gray-300 dark:border-white/20 rounded-lg text-gray-800 dark:text-white text-sm placeholder-gray-400 dark:placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              placeholder="Ej: González"
            />
          </div>
        </div>

        {/* FECHA Y HORA DE NACIMIENTO */}
        <div className="bg-white/90 dark:bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-gray-200 dark:border-white/10 space-y-3">
          <h3 className="text-base font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <span className="text-lg">🗓️</span>
            Fecha y Hora
          </h3>

          {/* Fecha */}
          <div className="grid grid-cols-3 gap-2">
            {/* Día */}
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-white/90 mb-1.5">Día</label>
              <select
                value={formData.birth.day}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  birth: { ...formData.birth, day: Number(e.target.value) }
                })}
                className="w-full px-2 py-2.5 text-sm bg-white dark:bg-white/10 border border-gray-300 dark:border-white/20 rounded-lg text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
              >
                {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                  <option key={day} value={day} className="bg-white dark:bg-gray-800">{day}</option>
                ))}
              </select>
            </div>

            {/* Mes */}
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-white/90 mb-1.5">Mes</label>
              <select
                value={formData.birth.month}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  birth: { ...formData.birth, month: Number(e.target.value) }
                })}
                className="w-full px-2 py-2.5 text-sm bg-white dark:bg-white/10 border border-gray-300 dark:border-white/20 rounded-lg text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
              >
                {MONTHS_ES.map((month, index) => (
                  <option key={index} value={index} className="bg-white dark:bg-gray-800">{month}</option>
                ))}
              </select>
            </div>

            {/* Año */}
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-white/90 mb-1.5">Año</label>
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
                className="w-full px-2 py-2.5 text-sm bg-white dark:bg-white/10 border border-gray-300 dark:border-white/20 rounded-lg text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
              />
            </div>
          </div>

          {/* Hora */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-white/90 mb-1.5">Hora</label>
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
                className="w-full px-2 py-2.5 text-sm bg-white dark:bg-white/10 border border-gray-300 dark:border-white/20 rounded-lg text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
              >
                {Array.from({ length: 24 }, (_, i) => i).map(hour => (
                  <option key={hour} value={hour} className="bg-white dark:bg-gray-800">
                    {hour.toString().padStart(2, '0')}h
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-white/90 mb-1.5">Min</label>
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
                className="w-full px-2 py-2.5 text-sm bg-white dark:bg-white/10 border border-gray-300 dark:border-white/20 rounded-lg text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
              >
                {Array.from({ length: 60 }, (_, i) => i).map(minute => (
                  <option key={minute} value={minute} className="bg-white dark:bg-gray-800">
                    {minute.toString().padStart(2, '0')}m
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* LUGAR DE NACIMIENTO + BOTÓN CONFIGURACIÓN */}
      <div className="bg-white/90 dark:bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-gray-200 dark:border-white/10 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Lugar de Nacimiento
          </h3>
          
          {/* Botón pequeño de configuración */}
          <button
            type="button"
            onClick={() => setShowSettingsModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-100 dark:bg-white/10 hover:bg-purple-200 dark:hover:bg-white/20 border border-purple-300 dark:border-white/20 rounded-lg text-xs font-medium text-purple-800 dark:text-white transition-all hover:scale-105"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Configuración</span>
          </button>
        </div>

        {/* Buscador de ciudad O coordenadas manuales */}
        {!useManualCoordinates ? (
        <>
        <div className="relative">
          <label className="block text-xs font-medium text-gray-700 dark:text-white/90 mb-1.5">
            Ciudad *
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-white/40 pointer-events-none" />
            <input
              ref={cityInputRef}
              type="text"
              value={cityQuery}
              onChange={(e) => {
                setCityQuery(e.target.value);
                setShowCityResults(true);
                // actualizar posición al tipear
                requestAnimationFrame(() => updateDropdownPosition());
              }}
              onFocus={() => {
                setShowCityResults(true);
                // actualizar posición al enfocar
                requestAnimationFrame(() => updateDropdownPosition());
              }}
              className="w-full pl-10 pr-10 py-2.5 text-sm bg-white dark:bg-white/10 border border-gray-300 dark:border-white/20 rounded-lg text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
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
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 dark:hover:bg-white/10 rounded z-10"
              >
                <X className="w-4 h-4 text-gray-600 dark:text-white/60" />
              </button>
            )}
          </div>

          {/* Resultados de búsqueda en Portal (escapa de stacking y transform) */}
          {showCityResults && cityResults.length > 0 && dropdownPosition &&
            createPortal(
              <div
                data-city-dropdown
                className="fixed z-[9999] bg-white dark:bg-gray-900/95 backdrop-blur-md border border-gray-300 dark:border-purple-400/30 rounded-lg shadow-2xl max-h-64 overflow-y-auto"
                style={{
                  top: `${dropdownPosition.top}px`,
                  left: `${dropdownPosition.left}px`,
                  width: `${dropdownPosition.width}px`,
                }}
              >
                {cityResults.map((city) => (
                  <button
                    key={city.id}
                    type="button"
                    onClick={() => handleCitySelect(city)}
                    className="w-full px-3 py-2.5 text-left hover:bg-purple-100 dark:hover:bg-purple-600/30 transition-colors border-b border-gray-200 dark:border-white/5 last:border-b-0"
                  >
                    <div className="font-medium text-sm text-gray-800 dark:text-white">{city.name}</div>
                    <div className="text-xs text-gray-600 dark:text-white/60">
                      {city.region && `${city.region}, `}{city.country}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-white/40 mt-0.5">
                      {city.lat.toFixed(4)}°, {city.lon.toFixed(4)}° • {city.tzId}
                    </div>
                  </button>
                ))}
              </div>,
              document.body
            )
          }
        </div>

        {/* Info de ciudad seleccionada */}
        {selectedCity && (
          <div className="bg-purple-100 dark:bg-purple-600/20 rounded-lg p-3 border border-purple-300 dark:border-purple-400/30 space-y-2">
            <div className="flex items-center gap-2 text-gray-800 dark:text-white text-sm font-medium min-w-0">
              <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="truncate">{selectedCity.name}, {selectedCity.country}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="min-w-0">
                <div className="text-gray-600 dark:text-white/60">Coordenadas</div>
                <div className="text-gray-800 dark:text-white font-mono text-[11px] break-all">
                  {selectedCity.lat.toFixed(4)}°, {selectedCity.lon.toFixed(4)}°
                </div>
              </div>
              <div className="min-w-0">
                <div className="text-gray-600 dark:text-white/60">Timezone</div>
                <div className="text-gray-800 dark:text-white font-mono text-[11px] truncate" title={selectedCity.tzId}>
                  {selectedCity.tzId}
                </div>
              </div>
              <div className="min-w-0">
                <div className="text-gray-600 dark:text-white/60">Coords DMS</div>
                <div className="text-gray-800 dark:text-white font-mono text-[10px] break-all">
                  {toDMS(selectedCity.lat, true)}<br/>
                  {toDMS(selectedCity.lon, false)}
                </div>
              </div>
              <div className="min-w-0">
                <div className="text-gray-600 dark:text-white/60">Offset {formData.birth.time && '(DST)'}</div>
                <div className="text-gray-800 dark:text-white font-mono text-[11px]">{getTimezoneOffset() || 'N/A'}</div>
              </div>
            </div>
          </div>
        )}
        </>
        ) : (
        <>
        {/* Modo Coordenadas Manuales */}
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            {/* Latitud */}
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-white/90 mb-1.5">
                Latitud *
              </label>
              <input
                type="number"
                step="0.0001"
                min="-90"
                max="90"
                value={formData.location.lat || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  location: { ...prev.location, lat: parseFloat(e.target.value) || undefined }
                }))}
                className="w-full px-3 py-2.5 bg-white dark:bg-white/10 border border-gray-300 dark:border-white/20 rounded-lg text-gray-800 dark:text-white text-sm placeholder-gray-400 dark:placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                placeholder="-34.6037"
              />
              <p className="text-[10px] text-gray-500 dark:text-white/40 mt-1">Sur: negativo, Norte: positivo</p>
            </div>

            {/* Longitud */}
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-white/90 mb-1.5">
                Longitud *
              </label>
              <input
                type="number"
                step="0.0001"
                min="-180"
                max="180"
                value={formData.location.lon || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  location: { ...prev.location, lon: parseFloat(e.target.value) || undefined }
                }))}
                className="w-full px-3 py-2.5 bg-white dark:bg-white/10 border border-gray-300 dark:border-white/20 rounded-lg text-gray-800 dark:text-white text-sm placeholder-gray-400 dark:placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                placeholder="-58.3816"
              />
              <p className="text-[10px] text-gray-500 dark:text-white/40 mt-1">Oeste: negativo, Este: positivo</p>
            </div>
          </div>

          {/* Timezone */}
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-white/90 mb-1.5">
              Timezone (IANA) *
            </label>
            <input
              type="text"
              value={formData.location.tzId || ''}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                location: { ...prev.location, tzId: e.target.value || undefined }
              }))}
              className="w-full px-3 py-2.5 bg-white dark:bg-white/10 border border-gray-300 dark:border-white/20 rounded-lg text-gray-800 dark:text-white text-sm placeholder-gray-400 dark:placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
              placeholder="Europe/Bratislava"
            />
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-2 mt-1.5 border border-blue-200 dark:border-blue-600/30">
              <p className="text-[10px] text-blue-800 dark:text-blue-200 font-medium mb-1">
                🌍 Formato IANA: Continente/Ciudad
              </p>
              <p className="text-[10px] text-blue-700 dark:text-blue-300 space-y-0.5">
                <span className="block">• Europa: Europe/Bratislava, Europe/Madrid, Europe/London</span>
                <span className="block">• América: America/New_York, America/Argentina/Buenos_Aires</span>
                <span className="block">• Asia: Asia/Tokyo, Asia/Shanghai</span>
                <span className="block">• Oceanía: Pacific/Auckland, Australia/Sydney</span>
              </p>
              <a 
                href="https://www.iana.org/time-zones" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[10px] text-blue-600 dark:text-blue-400 hover:underline mt-1 inline-block"
              >
                📋 Ver lista completa de timezones →
              </a>
            </div>
          </div>

          {/* Nombre de ubicación (opcional) */}
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-white/90 mb-1.5">
              Nombre de ubicación (opcional)
            </label>
            <input
              type="text"
              value={formData.location.city || ''}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                location: { ...prev.location, city: e.target.value || undefined }
              }))}
              className="w-full px-3 py-2.5 bg-white dark:bg-white/10 border border-gray-300 dark:border-white/20 rounded-lg text-gray-800 dark:text-white text-sm placeholder-gray-400 dark:placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
              placeholder="Buenos Aires, Argentina"
            />
          </div>

          {/* Validación visual */}
          {formData.location.lat && formData.location.lon && formData.location.tzId && (
            <div className="bg-green-100 dark:bg-green-900/20 rounded-lg p-3 border border-green-300 dark:border-green-600/30">
              <div className="flex items-center gap-2 text-green-800 dark:text-green-200 text-sm">
                <MapPin className="w-3.5 h-3.5" />
                <span className="font-medium">Coordenadas válidas ✓</span>
              </div>
              <div className="text-xs text-green-700 dark:text-green-300 mt-1 font-mono">
                {formData.location.lat.toFixed(4)}°, {formData.location.lon.toFixed(4)}°
                {formData.location.city && ` • ${formData.location.city}`}
              </div>
            </div>
          )}
        </div>
        </>
        )}
        
        {/* Toggle de Coordenadas Manuales - SIEMPRE VISIBLE */}
        <div className="flex items-center justify-between p-2.5 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-white/5 dark:to-white/5 rounded-lg border border-purple-200 dark:border-white/10">
          <label className="flex items-center gap-2 text-xs font-medium text-gray-700 dark:text-white/90 cursor-pointer">
            <MapPin className="w-3.5 h-3.5" />
            <span>🗺️ Usar coordenadas manuales</span>
          </label>
          <button
            type="button"
            onClick={() => setUseManualCoordinates(!useManualCoordinates)}
            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
              useManualCoordinates ? 'bg-purple-600' : 'bg-gray-300 dark:bg-gray-600'
            }`}
          >
            <span
              className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                useManualCoordinates ? 'translate-x-5' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
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

                {/* Lilith Mean */}
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={formData.settings.display.lilithMean}
                    onChange={(e) => setFormData({
                      ...formData,
                      settings: {
                        ...formData.settings,
                        display: { ...formData.settings.display, lilithMean: e.target.checked }
                      }
                    })}
                    className="w-4 h-4 rounded border-white/20 bg-white/10 text-purple-600 focus:ring-2 focus:ring-purple-500 cursor-pointer"
                  />
                  <span className="text-sm text-white group-hover:text-purple-300 transition-colors">
                    ⚸ Lilith (Mean)
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

                {/* Lunar Nodes Mean */}
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={formData.settings.display.nodesMean}
                    onChange={(e) => setFormData({
                      ...formData,
                      settings: {
                        ...formData.settings,
                        display: { ...formData.settings.display, nodesMean: e.target.checked }
                      }
                    })}
                    className="w-4 h-4 rounded border-white/20 bg-white/10 text-purple-600 focus:ring-2 focus:ring-purple-500 cursor-pointer"
                  />
                  <span className="text-sm text-white group-hover:text-purple-300 transition-colors">
                    ☊☋ Nodos Lunares
                  </span>
                </label>
              </div>

              {/* Sistema de Casas */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-white/80 uppercase tracking-wider">
                  🏠 Sistema de Casas
                </h4>

                <select
                  value={houseSystem}
                  onChange={(e) => setHouseSystem(e.target.value as 'placidus' | 'koch' | 'whole-sign' | 'equal-house' | 'porphyry' | 'campanus')}
                  className="w-full px-3 py-2 rounded-lg border border-white/20 bg-white/10 text-white
                             focus:border-purple-400 focus:ring-2 focus:ring-purple-500/50 
                             transition-all text-sm backdrop-blur-sm"
                >
                  {Object.entries(HOUSE_SYSTEMS).map(([id, system]) => (
                    <option key={id} value={id} className="bg-purple-900 text-white">
                      {system.name}
                    </option>
                  ))}
                </select>

                <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                  <p className="text-xs text-white/70 leading-relaxed">
                    {HOUSE_SYSTEMS[houseSystem].description}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-white/50">Precisión:</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                      HOUSE_SYSTEMS[houseSystem].accuracy === 'alta'
                        ? 'bg-green-500/20 text-green-300'
                        : 'bg-yellow-500/20 text-yellow-300'
                    }`}>
                      {HOUSE_SYSTEMS[houseSystem].accuracy === 'alta' ? '⭐ Alta' : '📊 Media'}
                    </span>
                  </div>
                </div>
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
            className="flex-1 px-6 py-3 bg-gray-200 dark:bg-white/10 hover:bg-gray-300 dark:hover:bg-white/20 text-gray-800 dark:text-white rounded-xl font-medium transition-all"
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          className="group flex-1 px-6 py-4 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:via-indigo-500 hover:to-purple-500 text-white rounded-xl font-bold transition-all hover:scale-105 active:scale-95 animate-golden-shimmer overflow-hidden isolate"
        >
          <span className="flex items-center justify-center gap-2">
            ✨ Calcular Carta Natal
          </span>
        </button>
      </div>
    </form>
    </div>
  );
}
