import React, { useState, useEffect } from 'react';
import type { FormValue, NatalChartFormProps } from '../types/natalForm';
import { DEFAULT_SETTINGS } from '../types/natalForm';
import type { LocationService } from '../services/locationService';
import { defaultLocationService } from '../services/locationService';

const STORAGE_KEY = 'natal_form_draft';
const LAST_SUBMITTED_KEY = 'natal_form_last_submitted';

const MONTHS_ES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

export default function NatalChartForm({ defaultValues, onSubmit, onCancel }: NatalChartFormProps) {
  // Estado del formulario
  const [formData, setFormData] = useState<FormValue>(() => {
    // Prioridad 1: Cargar draft en progreso
    const draft = localStorage.getItem(STORAGE_KEY);
    if (draft) {
      try {
        const parsed = JSON.parse(draft);
        console.log('📝 Cargando borrador en progreso...');
        return parsed;
      } catch {
        // Ignorar errores de parseo
      }
    }
    
    // Prioridad 2: Cargar último formulario enviado
    const lastSubmitted = localStorage.getItem(LAST_SUBMITTED_KEY);
    if (lastSubmitted) {
      try {
        const parsed = JSON.parse(lastSubmitted);
        console.log('♻️ Cargando últimos datos enviados...');
        return parsed;
      } catch {
        // Ignorar errores de parseo
      }
    }
    
    // Prioridad 3: Usar valores por defecto
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

  // UI State
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [useManualCoords, setUseManualCoords] = useState(false);
  const [manualTz, setManualTz] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [showLoadedNotification, setShowLoadedNotification] = useState(false);

  // Mostrar notificación si se cargaron datos
  useEffect(() => {
    const hasSavedData = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LAST_SUBMITTED_KEY);
    if (hasSavedData) {
      setShowLoadedNotification(true);
      const timer = setTimeout(() => setShowLoadedNotification(false), 5000);
      return () => clearTimeout(timer);
    }
  }, []);
  
  // Location data
  const [countries, setCountries] = useState<Array<{ code: string; name: string }>>([]);
  const [regions, setRegions] = useState<string[]>([]);
  const [cities, setCities] = useState<Array<{ name: string; lat: number; lon: number; tzId?: string }>>([]);
  const [cityQuery, setCityQuery] = useState('');
  
  const locationService: LocationService = defaultLocationService;

  // Guardar draft en localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
  }, [formData]);

  // Cargar países al montar
  useEffect(() => {
    locationService.getCountries().then(setCountries);
  }, [locationService]);

  // Actualizar regiones cuando cambia el país
  useEffect(() => {
    if (formData.location.countryCode) {
      locationService.getRegions(formData.location.countryCode).then(setRegions);
    }
  }, [formData.location.countryCode, locationService]);

  // Actualizar ciudades cuando cambia la región
  useEffect(() => {
    if (formData.location.countryCode && formData.location.region) {
      locationService
        .getCities(formData.location.countryCode, formData.location.region, cityQuery)
        .then(setCities);
    }
  }, [formData.location.countryCode, formData.location.region, cityQuery, locationService]);

  // Si hay región pero NO hay ciudad, usar coordenadas de la región por defecto
  useEffect(() => {
    if (formData.location.countryCode && formData.location.region && !formData.location.city && !useManualCoords) {
      locationService.getRegionCoordinates(formData.location.countryCode, formData.location.region)
        .then(coords => {
          if (coords) {
            setFormData(prev => ({
              ...prev,
              location: {
                ...prev.location,
                lat: coords.lat,
                lon: coords.lon,
                tzId: coords.tzId
              }
            }));
          }
        });
    }
  }, [formData.location.countryCode, formData.location.region, formData.location.city, useManualCoords, locationService]);

  // Resolver timezone automáticamente cuando cambian las coordenadas
  useEffect(() => {
    const { lat, lon, tzId } = formData.location;
    
    // Solo resolver si: hay coordenadas, NO es manual, y NO hay tzId ya
    if (lat !== undefined && lon !== undefined && !manualTz && !tzId) {
      const { day, month, year, time } = formData.birth;
      const hour = time?.hour ?? 12;
      const minute = time?.minute ?? 0;
      const dateTimeIso = new Date(year, month - 1, day, hour, minute).toISOString();
      
      locationService.resolveTimeZone(lat, lon, dateTimeIso)
        .then(resolvedTzId => {
          setFormData(prev => ({
            ...prev,
            location: { ...prev.location, tzId: resolvedTzId }
          }));
        })
        .catch(error => {
          console.error('Error resolving timezone:', error);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.location.lat, formData.location.lon, formData.location.tzId, manualTz]);

  // Handlers
  const updateField = (field: string, value: unknown) => {
    setFormData(prev => {
      const keys = field.split('.');
      if (keys.length === 1) {
        return { ...prev, [field]: value };
      }
      
      // Nested update
      const [parent, child] = keys;
      return {
        ...prev,
        [parent]: { ...(prev[parent as keyof FormValue] as Record<string, unknown>), [child]: value }
      };
    });
    
    // Clear error for this field
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  };

  const selectCity = (city: { name: string; lat: number; lon: number; tzId?: string }) => {
    console.log('🏙️ Ciudad seleccionada:', city);
    setFormData(prev => {
      const newLocation = {
        ...prev.location,
        city: city.name,
        lat: city.lat,
        lon: city.lon,
        tzId: city.tzId,
      };
      console.log('📍 Nuevo location:', newLocation);
      return {
        ...prev,
        location: newLocation
      };
    });
    // Limpiar el query para cerrar el dropdown
    setCityQuery('');
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }

    if (formData.birth.day < 1 || formData.birth.day > 31) {
      newErrors['birth.day'] = 'Día inválido (1-31)';
    }

    if (formData.birth.month < 1 || formData.birth.month > 12) {
      newErrors['birth.month'] = 'Mes inválido (1-12)';
    }

    if (formData.birth.year < 1200 || formData.birth.year > 2100) {
      newErrors['birth.year'] = 'Año inválido (1200-2100)';
    }

    if (formData.birth.timeAccuracy !== 'unknown' && formData.birth.time) {
      if (formData.birth.time.hour < 0 || formData.birth.time.hour > 23) {
        newErrors['birth.time.hour'] = 'Hora inválida (0-23)';
      }
      if (formData.birth.time.minute < 0 || formData.birth.time.minute > 59) {
        newErrors['birth.time.minute'] = 'Minuto inválido (0-59)';
      }
    }

    if (!formData.location.countryCode) {
      newErrors['location.countryCode'] = 'Selecciona un país';
    }

    if (formData.location.lat !== undefined) {
      if (formData.location.lat < -90 || formData.location.lat > 90) {
        newErrors['location.lat'] = 'Latitud inválida (-90 a 90)';
      }
    }

    if (formData.location.lon !== undefined) {
      if (formData.location.lon < -180 || formData.location.lon > 180) {
        newErrors['location.lon'] = 'Longitud inválida (-180 a 180)';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    setLoading(true);

    // Procesar datos finales
    const finalData: FormValue = {
      ...formData,
      birth: {
        ...formData.birth,
        time: formData.birth.timeAccuracy === 'unknown' ? undefined : formData.birth.time,
      }
    };

    // Redondear tiempo aproximado a 15 minutos
    if (finalData.birth.timeAccuracy === 'approx' && finalData.birth.time) {
      const minutes = finalData.birth.time.minute;
      finalData.birth.time.minute = Math.round(minutes / 15) * 15;
      if (finalData.birth.time.minute === 60) {
        finalData.birth.time.minute = 0;
        finalData.birth.time.hour += 1;
      }
    }

    setTimeout(() => {
      setLoading(false);
      console.log('🚀 Enviando formulario:', finalData);
      console.log('📍 Coordenadas finales:', {
        lat: finalData.location.lat,
        lon: finalData.location.lon,
        ciudad: finalData.location.city,
        tzId: finalData.location.tzId
      });
      
      // Guardar datos enviados para recordar en próximos usos
      localStorage.setItem(LAST_SUBMITTED_KEY, JSON.stringify(finalData));
      console.log('💾 Datos guardados para próxima vez');
      
      // Limpiar draft (ya que fue enviado exitosamente)
      localStorage.removeItem(STORAGE_KEY);
      
      onSubmit(finalData);
    }, 300);
  };

  // Función para limpiar datos guardados
  const handleClearSavedData = () => {
    if (confirm('¿Estás seguro de que deseas limpiar todos los datos guardados?')) {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(LAST_SUBMITTED_KEY);
      console.log('🗑️ Datos guardados eliminados');
      window.location.reload(); // Recargar para aplicar cambios
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6 p-6">
      {/* Notificación de datos cargados */}
      {showLoadedNotification && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3 animate-fade-in">
          <div className="text-2xl">✅</div>
          <div className="flex-1">
            <p className="text-green-800 font-medium">Datos cargados</p>
            <p className="text-green-600 text-sm">Se han cargado los últimos datos guardados</p>
          </div>
          <button
            type="button"
            onClick={() => setShowLoadedNotification(false)}
            className="text-green-600 hover:text-green-800 text-xl"
          >
            ×
          </button>
        </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">✨ Nueva Carta Natal</h1>
            <p className="text-purple-100">Ingresa los datos de nacimiento para calcular tu carta astral</p>
          </div>
          {(localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LAST_SUBMITTED_KEY)) && (
            <button
              type="button"
              onClick={handleClearSavedData}
              className="ml-4 px-4 py-2 bg-purple-700 hover:bg-purple-800 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
              title="Limpiar datos guardados"
            >
              🗑️ Limpiar datos
            </button>
          )}
        </div>
      </div>

      {/* Datos Básicos */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-purple-100">
        <h2 className="text-2xl font-bold text-purple-900 mb-4">👤 Datos Personales</h2>
        
        <div className="grid md:grid-cols-2 gap-4">
          {/* Nombre */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Nombre *
            </label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => updateField('name', e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Tu nombre"
              required
            />
            {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
          </div>

          {/* Apellido */}
          <div>
            <label htmlFor="surname" className="block text-sm font-medium text-gray-700 mb-2">
              Apellido (opcional)
            </label>
            <input
              id="surname"
              type="text"
              value={formData.surname || ''}
              onChange={(e) => updateField('surname', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Tu apellido"
            />
          </div>
        </div>

        {/* Género */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Género</label>
          <div className="flex gap-4 flex-wrap">
            {[
              { value: 'female', label: '♀️ Mujer' },
              { value: 'male', label: '♂️ Hombre' },
              { value: 'other', label: '⚧ Otro' },
              { value: 'event', label: '📅 Suceso' },
            ].map((option) => (
              <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="gender"
                  value={option.value}
                  checked={formData.gender === option.value}
                  onChange={(e) => updateField('gender', e.target.value)}
                  className="w-4 h-4 text-purple-600"
                />
                <span className="text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Es para mí */}
        <div className="mt-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isSelf}
              onChange={(e) => updateField('isSelf', e.target.checked)}
              className="w-4 h-4 text-purple-600 rounded"
            />
            <span className="text-gray-700">Esta carta es para mí</span>
          </label>
        </div>
      </div>

      {/* Fecha y Hora de Nacimiento */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-purple-100">
        <h2 className="text-2xl font-bold text-purple-900 mb-4">📅 Fecha y Hora de Nacimiento</h2>
        
        {/* Fecha */}
        <div className="grid md:grid-cols-3 gap-4 mb-4">
          <div>
            <label htmlFor="day" className="block text-sm font-medium text-gray-700 mb-2">
              Día *
            </label>
            <input
              id="day"
              type="number"
              min="1"
              max="31"
              value={formData.birth.day}
              onChange={(e) => updateField('birth', { ...formData.birth, day: parseInt(e.target.value) || 1 })}
              onFocus={(e) => e.target.select()}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 ${
                errors['birth.day'] ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors['birth.day'] && <p className="text-red-600 text-sm mt-1">{errors['birth.day']}</p>}
          </div>

          <div>
            <label htmlFor="month" className="block text-sm font-medium text-gray-700 mb-2">
              Mes *
            </label>
            <select
              id="month"
              value={formData.birth.month}
              onChange={(e) => updateField('birth', { ...formData.birth, month: parseInt(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            >
              {MONTHS_ES.map((month, idx) => (
                <option key={idx} value={idx + 1}>{month}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-2">
              Año *
            </label>
            <input
              id="year"
              type="number"
              min="1200"
              max="2100"
              value={formData.birth.year}
              onChange={(e) => updateField('birth', { ...formData.birth, year: parseInt(e.target.value) || 2000 })}
              onFocus={(e) => e.target.select()}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 ${
                errors['birth.year'] ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors['birth.year'] && <p className="text-red-600 text-sm mt-1">{errors['birth.year']}</p>}
          </div>
        </div>

        {/* Precisión de hora */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Precisión de la hora
            <span className="ml-2 text-xs text-gray-500">
              ℹ️ {formData.birth.timeAccuracy === 'approx' && '(Se redondeará a 15 minutos)'}
            </span>
          </label>
          <select
            value={formData.birth.timeAccuracy}
            onChange={(e) => updateField('birth', {
              ...formData.birth,
              timeAccuracy: e.target.value as 'exact' | 'approx' | 'unknown',
              time: e.target.value === 'unknown' ? undefined : (formData.birth.time || { hour: 12, minute: 0 })
            })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          >
            <option value="exact">⏰ Exacta</option>
            <option value="approx">⏱️ Aproximada</option>
            <option value="unknown">❓ Desconocida</option>
          </select>
        </div>

        {/* Hora */}
        {formData.birth.timeAccuracy !== 'unknown' && (
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="hour" className="block text-sm font-medium text-gray-700 mb-2">
                Hora
              </label>
              <select
                id="hour"
                value={formData.birth.time?.hour ?? 12}
                onChange={(e) => updateField('birth', {
                  ...formData.birth,
                  time: { ...formData.birth.time, hour: parseInt(e.target.value), minute: formData.birth.time?.minute ?? 0 }
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              >
                {Array.from({ length: 24 }, (_, i) => (
                  <option key={i} value={i}>{i.toString().padStart(2, '0')}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="minute" className="block text-sm font-medium text-gray-700 mb-2">
                Minutos
              </label>
              <select
                id="minute"
                value={formData.birth.time?.minute ?? 0}
                onChange={(e) => updateField('birth', {
                  ...formData.birth,
                  time: { hour: formData.birth.time?.hour ?? 12, minute: parseInt(e.target.value) }
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              >
                {Array.from({ length: 60 }, (_, i) => (
                  <option key={i} value={i}>{i.toString().padStart(2, '0')}</option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Ubicación */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-purple-100">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-purple-900">📍 Ubicación</h2>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setUseManualCoords(!useManualCoords);
            }}
            className="text-sm text-purple-600 hover:text-purple-700 font-medium px-3 py-1 rounded-lg hover:bg-purple-50 transition-colors"
          >
            {useManualCoords ? '📍 Usar selector' : '🗺️ Coordenadas manuales'}
          </button>
        </div>

        {!useManualCoords ? (
          <div className="space-y-4">
            {/* País */}
            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                País *
              </label>
              <select
                id="country"
                value={formData.location.countryCode}
                onChange={(e) => {
                  // Al cambiar país, resetear región y ciudad pero mantener coordenadas si existen
                  updateField('location', { 
                    ...formData.location, 
                    countryCode: e.target.value,
                    region: '',
                    city: ''
                  });
                }}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 ${
                  errors['location.countryCode'] ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Selecciona un país</option>
                {countries.map((country) => (
                  <option key={country.code} value={country.code}>{country.name}</option>
                ))}
              </select>
              {errors['location.countryCode'] && (
                <p className="text-red-600 text-sm mt-1">{errors['location.countryCode']}</p>
              )}
            </div>

            {/* Región */}
            {formData.location.countryCode && (
              <div>
                <label htmlFor="region" className="block text-sm font-medium text-gray-700 mb-2">
                  Provincia / Estado
                </label>
                <select
                  id="region"
                  value={formData.location.region || ''}
                  onChange={(e) => {
                    // Al cambiar región, resetear ciudad pero mantener coordenadas
                    updateField('location', { 
                      ...formData.location, 
                      region: e.target.value,
                      city: ''
                    });
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Selecciona una región</option>
                  {regions.map((region) => (
                    <option key={region} value={region}>{region}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Ciudad con autocomplete */}
            {formData.location.region && (
              <div>
                <label htmlFor="cityQuery" className="block text-sm font-medium text-gray-700 mb-2">
                  Ciudad
                </label>
                <div className="relative">
                  <input
                    id="cityQuery"
                    type="text"
                    value={cityQuery !== '' ? cityQuery : (formData.location.city || '')}
                    onChange={(e) => {
                      const val = e.target.value;
                      setCityQuery(val);
                      // Si borra el texto Y hay ciudad seleccionada, limpiar selección
                      if (val === '' && formData.location.city) {
                        updateField('location', { 
                          ...formData.location, 
                          city: '',
                          lat: undefined,
                          lon: undefined,
                          tzId: undefined
                        });
                      }
                    }}
                    onFocus={() => {
                      // Al hacer focus, si hay ciudad seleccionada, mostrarla en el input para editar
                      if (formData.location.city && cityQuery === '') {
                        setCityQuery(formData.location.city);
                      }
                    }}
                    placeholder="Escribe para buscar o deja vacío para usar coordenadas de la provincia..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                  {!formData.location.city && (
                    <p className="text-xs text-gray-500 mt-1">
                      💡 Opcional: Si no seleccionas ciudad, se usarán las coordenadas de <strong>{formData.location.region}</strong>
                    </p>
                  )}
                </div>
                
                {cityQuery && cities.length > 0 && (
                  <div className="mt-2 border border-gray-200 rounded-lg max-h-48 overflow-y-auto">
                    {cities.map((city, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          selectCity(city);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-purple-50 border-b border-gray-100 last:border-0 transition-colors"
                      >
                        <div className="font-medium">{city.name}</div>
                        <div className="text-xs text-gray-500">
                          {city.lat.toFixed(4)}°, {city.lon.toFixed(4)}°
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {formData.location.city && (
                  <div className="mt-2 text-sm text-green-600">
                    ✓ {formData.location.city} seleccionada
                  </div>
                )}
              </div>
            )}

            {/* Barrio */}
            {formData.location.city && (
              <div>
                <label htmlFor="neighborhood" className="block text-sm font-medium text-gray-700 mb-2">
                  Barrio (opcional)
                </label>
                <input
                  id="neighborhood"
                  type="text"
                  value={formData.location.neighborhood || ''}
                  onChange={(e) => updateField('location', { ...formData.location, neighborhood: e.target.value })}
                  placeholder="Ej: Palermo, Recoleta..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              💡 Si completas coordenadas, se priorizan sobre ciudad/barrio
            </p>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="lat" className="block text-sm font-medium text-gray-700 mb-2">
                  Latitud *
                </label>
                <input
                  id="lat"
                  type="number"
                  step="0.0001"
                  min="-90"
                  max="90"
                  value={formData.location.lat ?? ''}
                  onChange={(e) => updateField('location', {
                    ...formData.location,
                    lat: e.target.value ? parseFloat(e.target.value) : undefined
                  })}
                  onFocus={(e) => e.target.select()}
                  placeholder="-34.6037"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 ${
                    errors['location.lat'] ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors['location.lat'] && (
                  <p className="text-red-600 text-sm mt-1">{errors['location.lat']}</p>
                )}
              </div>

              <div>
                <label htmlFor="lon" className="block text-sm font-medium text-gray-700 mb-2">
                  Longitud *
                </label>
                <input
                  id="lon"
                  type="number"
                  step="0.0001"
                  min="-180"
                  max="180"
                  value={formData.location.lon ?? ''}
                  onChange={(e) => updateField('location', {
                    ...formData.location,
                    lon: e.target.value ? parseFloat(e.target.value) : undefined
                  })}
                  onFocus={(e) => e.target.select()}
                  placeholder="-58.3816"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 ${
                    errors['location.lon'] ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors['location.lon'] && (
                  <p className="text-red-600 text-sm mt-1">{errors['location.lon']}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Timezone */}
        {formData.location.tzId && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-blue-900">Zona horaria detectada:</p>
                <p className="text-lg font-bold text-blue-700">{formData.location.tzId}</p>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setManualTz(!manualTz);
                }}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium px-3 py-1 rounded-lg hover:bg-blue-50 transition-colors"
              >
                {manualTz ? 'Automático' : 'Manual'}
              </button>
            </div>
            
            {manualTz && (
              <div className="mt-3">
                <select
                  value={formData.location.tzId}
                  onChange={(e) => updateField('location', { ...formData.location, tzId: e.target.value })}
                  className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="America/Argentina/Buenos_Aires">Argentina (Buenos Aires)</option>
                  <option value="America/Mexico_City">México (Ciudad de México)</option>
                  <option value="America/Bogota">Colombia (Bogotá)</option>
                  <option value="America/Santiago">Chile (Santiago)</option>
                  <option value="America/Lima">Perú (Lima)</option>
                  <option value="Europe/Madrid">España (Madrid)</option>
                  <option value="America/New_York">USA (New York)</option>
                  <option value="America/Los_Angeles">USA (Los Angeles)</option>
                  <option value="UTC">UTC</option>
                </select>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Configuración Avanzada (Acordeón) */}
      <div className="bg-white rounded-2xl shadow-lg border border-purple-100 overflow-hidden">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full px-6 py-4 flex justify-between items-center bg-gradient-to-r from-purple-50 to-indigo-50 hover:from-purple-100 hover:to-indigo-100 transition-colors"
        >
          <h2 className="text-2xl font-bold text-purple-900">⚙️ Configuración Avanzada</h2>
          <span className="text-2xl">{showAdvanced ? '▼' : '▶'}</span>
        </button>

        {showAdvanced && (
          <div className="p-6 space-y-6">
            {/* Sistema de Casas */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sistema de Casas
              </label>
              <select
                value={formData.settings.houseSystem}
                onChange={(e) => updateField('settings', {
                  ...formData.settings,
                  houseSystem: e.target.value as 'Placidus' | 'WholeSign' | 'Koch' | 'Equal'
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              >
                <option value="Placidus">Placidus (más usado)</option>
                <option value="WholeSign">Signos Enteros (tradicional)</option>
                <option value="Koch">Koch</option>
                <option value="Equal">Igual</option>
              </select>
            </div>

            {/* Asteroides */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Asteroides
              </label>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                {Object.entries(formData.settings.asteroids).map(([key, value]) => (
                  <label key={key} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={(e) => updateField('settings', {
                        ...formData.settings,
                        asteroids: { ...formData.settings.asteroids, [key]: e.target.checked }
                      })}
                      className="w-4 h-4 text-purple-600 rounded"
                    />
                    <span className="text-gray-700 capitalize">{key}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Aspectos */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Aspectos
              </label>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                {Object.entries(formData.settings.aspects).map(([key, value]) => (
                  <label key={key} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={(e) => updateField('settings', {
                        ...formData.settings,
                        aspects: { ...formData.settings.aspects, [key]: e.target.checked }
                      })}
                      className="w-4 h-4 text-purple-600 rounded"
                    />
                    <span className="text-gray-700 capitalize">{key}</span>
                  </label>
                ))}
              </div>

              <div>
                <label htmlFor="aspectOrbs" className="block text-sm font-medium text-gray-700 mb-2">
                  Orbe de aspectos: {formData.settings.aspectOrbs}°
                </label>
                <input
                  id="aspectOrbs"
                  type="range"
                  min="1"
                  max="10"
                  value={formData.settings.aspectOrbs}
                  onChange={(e) => updateField('settings', {
                    ...formData.settings,
                    aspectOrbs: parseInt(e.target.value)
                  })}
                  className="w-full"
                />
              </div>
            </div>

            {/* Lilith & Nodos */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Lilith
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.settings.lilith.mean}
                      onChange={(e) => updateField('settings', {
                        ...formData.settings,
                        lilith: { ...formData.settings.lilith, mean: e.target.checked }
                      })}
                      className="w-4 h-4 text-purple-600 rounded"
                    />
                    <span className="text-gray-700">Mean (Promedio)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.settings.lilith.true}
                      onChange={(e) => updateField('settings', {
                        ...formData.settings,
                        lilith: { ...formData.settings.lilith, true: e.target.checked }
                      })}
                      className="w-4 h-4 text-purple-600 rounded"
                    />
                    <span className="text-gray-700">True (Verdadera)</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Nodos Lunares
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.settings.nodes.mean}
                      onChange={(e) => updateField('settings', {
                        ...formData.settings,
                        nodes: { ...formData.settings.nodes, mean: e.target.checked }
                      })}
                      className="w-4 h-4 text-purple-600 rounded"
                    />
                    <span className="text-gray-700">Mean (Promedio)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.settings.nodes.true}
                      onChange={(e) => updateField('settings', {
                        ...formData.settings,
                        nodes: { ...formData.settings.nodes, true: e.target.checked }
                      })}
                      className="w-4 h-4 text-purple-600 rounded"
                    />
                    <span className="text-gray-700">True (Verdaderos)</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Opciones adicionales */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.settings.polarizations}
                  onChange={(e) => updateField('settings', {
                    ...formData.settings,
                    polarizations: e.target.checked
                  })}
                  className="w-4 h-4 text-purple-600 rounded"
                />
                <span className="text-gray-700">Polarizaciones</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.settings.arabicParts}
                  onChange={(e) => updateField('settings', {
                    ...formData.settings,
                    arabicParts: e.target.checked
                  })}
                  className="w-4 h-4 text-purple-600 rounded"
                />
                <span className="text-gray-700">Partes Árabes</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.settings.parallelDeclinations}
                  onChange={(e) => updateField('settings', {
                    ...formData.settings,
                    parallelDeclinations: e.target.checked
                  })}
                  className="w-4 h-4 text-purple-600 rounded"
                />
                <span className="text-gray-700">Declinaciones Paralelas</span>
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Acciones */}
      <div className="flex gap-4">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          disabled={loading}
          className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
        >
          {loading ? '⏳ Calculando...' : '✨ Calcular Carta Natal'}
        </button>
      </div>
    </form>
  );
}
