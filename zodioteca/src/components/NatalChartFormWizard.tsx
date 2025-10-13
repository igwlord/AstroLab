import React, { useState } from 'react';
import MultiStepForm from './MultiStepForm';
import { useAstrologicalToast } from '../utils/astrologicalToast';

interface NatalChartFormData {
  name: string;
  birthDate: string;
  birthTime: string;
  birthPlace: string;
  latitude: number;
  longitude: number;
  timezone: string;
}

interface NatalChartFormWizardProps {
  onSubmit: (data: NatalChartFormData) => void;
}

/**
 * Formulario wizard para crear cartas natales usando MultiStepForm
 * Divide el proceso complejo en pasos intuitivos
 */
const NatalChartFormWizard: React.FC<NatalChartFormWizardProps> = ({
  onSubmit
}) => {
  const toast = useAstrologicalToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Partial<NatalChartFormData>>({
    name: '',
    birthDate: '',
    birthTime: '',
    birthPlace: '',
    latitude: 0,
    longitude: 0,
    timezone: ''
  });

  const steps = [
    {
      id: 'personal',
      title: 'Información Personal',
      description: 'Datos básicos de la persona',
      icon: '👤',
      planet: 'sun'
    },
    {
      id: 'birth',
      title: 'Fecha de Nacimiento',
      description: 'Momento exacto del nacimiento',
      icon: '📅',
      planet: 'moon'
    },
    {
      id: 'location',
      title: 'Lugar de Nacimiento',
      description: 'Ubicación geográfica precisa',
      icon: '📍',
      planet: 'earth'
    },
    {
      id: 'confirm',
      title: 'Confirmar Datos',
      description: 'Revisar y crear la carta',
      icon: '✅',
      planet: 'jupiter'
    }
  ];

  const updateFormData = (field: keyof NatalChartFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const canProceedToNext = (): boolean => {
    switch (currentStep) {
      case 0: // Personal info
        return Boolean(formData.name && formData.name.trim().length >= 2);
      case 1: // Birth date/time
        return Boolean(formData.birthDate && formData.birthTime);
      case 2: // Location
        return Boolean(formData.birthPlace && formData.latitude !== undefined && formData.longitude !== undefined);
      case 3: // Confirm
        return true;
      default:
        return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.birthDate || !formData.birthTime || !formData.birthPlace) {
      toast.error('Por favor completa todos los campos requeridos');
      return;
    }

    toast.success('¡Carta natal creada exitosamente! ✨');
    onSubmit(formData as NatalChartFormData);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Información Personal
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="text-4xl mb-2">☉</div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Información Personal
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Comenzamos con los datos básicos de la persona cuya carta natal vamos a crear
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Nombre completo *
                </label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => updateFormData('name', e.target.value)}
                  placeholder="Ej: María González"
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:border-purple-500 dark:focus:border-purple-400 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-800 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  El nombre que aparecerá en la carta natal
                </p>
              </div>
            </div>
          </div>
        );

      case 1: // Fecha y hora de nacimiento
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="text-4xl mb-2">☽</div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Momento del Nacimiento
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                La fecha y hora exactas son cruciales para el cálculo astrológico preciso
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Fecha de nacimiento *
                </label>
                <input
                  type="date"
                  value={formData.birthDate || ''}
                  onChange={(e) => updateFormData('birthDate', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:border-purple-500 dark:focus:border-purple-400 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-800 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Hora de nacimiento *
                </label>
                <input
                  type="time"
                  value={formData.birthTime || ''}
                  onChange={(e) => updateFormData('birthTime', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:border-purple-500 dark:focus:border-purple-400 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-800 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Si no sabes la hora exacta, puedes usar 12:00
                </p>
              </div>
            </div>
          </div>
        );

      case 2: // Lugar de nacimiento
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="text-4xl mb-2">🌍</div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Lugar de Nacimiento
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                La ubicación geográfica determina la posición de las casas astrológicas
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Ciudad y País *
                </label>
                <input
                  type="text"
                  value={formData.birthPlace || ''}
                  onChange={(e) => updateFormData('birthPlace', e.target.value)}
                  placeholder="Ej: Madrid, España"
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:border-purple-500 dark:focus:border-purple-400 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-800 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Escribe la ciudad más cercana posible
                </p>
              </div>

              {/* Aquí iría un mapa o selector de ubicación */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Las coordenadas se calcularán automáticamente a partir de la ubicación
                </p>
              </div>
            </div>
          </div>
        );

      case 3: // Confirmación
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="text-4xl mb-2">✅</div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Confirmar Datos
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Revisa la información antes de crear la carta natal
              </p>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <span>👤</span>
                    Información Personal
                  </h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    <strong>Nombre:</strong> {formData.name}
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <span>📅</span>
                    Fecha y Hora
                  </h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    <strong>Fecha:</strong> {formData.birthDate}<br/>
                    <strong>Hora:</strong> {formData.birthTime}
                  </p>
                </div>

                <div className="md:col-span-2">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <span>📍</span>
                    Lugar de Nacimiento
                  </h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    <strong>Ubicación:</strong> {formData.birthPlace}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>💡 Tip:</strong> Una vez creada la carta, podrás guardarla, compartirla y explorar todos sus aspectos astrológicos en detalle.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <MultiStepForm
        steps={steps}
        currentStep={currentStep}
        onStepChange={setCurrentStep}
        canProceed={canProceedToNext()}
      >
        {renderStepContent()}
      </MultiStepForm>
    </form>
  );
};

export default NatalChartFormWizard;