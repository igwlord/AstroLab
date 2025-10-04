import React, { useState } from 'react';
import { DIGNITIES } from '../types/dignity';
import type { Dignity } from '../types/dignity';
import DignityModal from './DignityModal';

const DignitiesGrid: React.FC = () => {
  const [selectedDignity, setSelectedDignity] = useState<Dignity | null>(null);
  const [filter, setFilter] = useState<'all' | 'essential' | 'accidental'>('all');

  const filteredDignities = DIGNITIES.filter(dig => 
    filter === 'all' || dig.category === filter
  );

  const getDignityGradient = (name: string) => {
    const gradients: { [key: string]: string } = {
      'Domicilio (Regencia)': 'from-yellow-500 to-amber-600',
      'Exaltación': 'from-white to-yellow-200',
      'Exilio (Detrimento)': 'from-gray-500 to-gray-700',
      'Caída': 'from-blue-800 to-indigo-900',
      'Recepción Mutua': 'from-green-500 to-emerald-600',
      'Triplicidad': 'from-red-500 to-orange-600',
      'Decanatos': 'from-purple-500 to-pink-600',
      'Términos / Límites': 'from-amber-700 to-brown-800',
      'Faces (Faz/Decan)': 'from-violet-400 to-purple-500'
    };
    return gradients[name] || 'from-purple-600 to-pink-600';
  };

  const essentialCount = DIGNITIES.filter(d => d.category === 'essential').length;
  const accidentalCount = DIGNITIES.filter(d => d.category === 'accidental').length;

  return (
    <div className="space-y-6">
      {/* Descripción */}
      <div className="bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 p-6 rounded-lg">
        <h3 className="text-xl font-semibold mb-2 text-amber-900 dark:text-amber-200 flex items-center gap-2">
          👑 ¿Qué son las Dignidades Planetarias?
        </h3>
        <p className="text-gray-700 dark:text-gray-300 mb-3">
          Las dignidades planetarias describen <strong>la fuerza o debilidad de un planeta</strong> según 
          su posición en el zodíaco. Un planeta en buena dignidad actúa con naturalidad y poder; en mala 
          dignidad, encuentra <strong>obstáculos o se manifiesta incómodamente</strong>.
        </p>
        <div className="bg-white/50 dark:bg-gray-800/50 p-4 rounded-lg mt-3">
          <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">⚖️ Dos Tipos Principales</h4>
          <ul className="text-sm space-y-1 text-gray-700 dark:text-gray-300">
            <li><strong>Dignidades Esenciales:</strong> Basadas en el signo (domicilio, exaltación, exilio, caída)</li>
            <li><strong>Dignidades Accidentales:</strong> Subdivisiones finas (triplicidad, decanatos, términos, faces)</li>
          </ul>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            filter === 'all'
              ? 'bg-gradient-to-r from-amber-600 to-yellow-600 text-white shadow-lg'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          Todas ({DIGNITIES.length})
        </button>
        <button
          onClick={() => setFilter('essential')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            filter === 'essential'
              ? 'bg-gradient-to-r from-yellow-600 to-amber-600 text-white shadow-lg'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          Esenciales ({essentialCount})
        </button>
        <button
          onClick={() => setFilter('accidental')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            filter === 'accidental'
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          Accidentales ({accidentalCount})
        </button>
      </div>

      {/* Grid de Dignidades */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredDignities.map((dignity) => (
          <button
            key={dignity.name}
            onClick={() => setSelectedDignity(dignity)}
            className={`bg-gradient-to-br ${getDignityGradient(dignity.name)} ${
              dignity.name === 'Exaltación' ? 'text-gray-800' : 'text-white'
            } p-6 rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 flex flex-col items-center gap-3`}
          >
            <span className="text-6xl">{dignity.symbol}</span>
            <div className="text-center">
              <h3 className="font-bold text-sm leading-tight">{dignity.name}</h3>
              <p className="text-xs opacity-90 mt-1">{dignity.chakra}</p>
            </div>
            <span className={`text-xs ${
              dignity.name === 'Exaltación' ? 'bg-gray-800/20' : 'bg-white/20'
            } px-3 py-1 rounded-full mt-auto`}>
              {dignity.category === 'essential' ? 'Esencial' : 'Accidental'}
            </span>
          </button>
        ))}
      </div>

      {/* Tabla Comparativa */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg">
        <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-4 text-lg">
          📊 Tabla de Dignidades Esenciales
        </h4>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-gray-300 dark:border-gray-600">
                <th className="text-left py-2 px-3 text-gray-700 dark:text-gray-300">Dignidad</th>
                <th className="text-left py-2 px-3 text-gray-700 dark:text-gray-300">Fuerza</th>
                <th className="text-left py-2 px-3 text-gray-700 dark:text-gray-300">Manifestación</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 dark:text-gray-400">
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <td className="py-2 px-3">🏠 Domicilio</td>
                <td className="py-2 px-3 text-green-600 dark:text-green-400 font-semibold">+++</td>
                <td className="py-2 px-3">Plena fuerza y naturalidad</td>
              </tr>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <td className="py-2 px-3">🌟 Exaltación</td>
                <td className="py-2 px-3 text-lime-600 dark:text-lime-400 font-semibold">++</td>
                <td className="py-2 px-3">Potenciado, brilla con intensidad</td>
              </tr>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <td className="py-2 px-3">⚖️ Exilio</td>
                <td className="py-2 px-3 text-orange-600 dark:text-orange-400 font-semibold">--</td>
                <td className="py-2 px-3">Debilitado, incómodo</td>
              </tr>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <td className="py-2 px-3">📉 Caída</td>
                <td className="py-2 px-3 text-red-600 dark:text-red-400 font-semibold">---</td>
                <td className="py-2 px-3">Máxima debilidad, sin reconocimiento</td>
              </tr>
              <tr>
                <td className="py-2 px-3">🔄 Recepción Mutua</td>
                <td className="py-2 px-3 text-blue-600 dark:text-blue-400 font-semibold">+</td>
                <td className="py-2 px-3">Apoyo mutuo, compensación</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Leyenda */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
        <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">
          🔑 Conceptos Clave
        </h4>
        <div className="grid md:grid-cols-2 gap-3 text-sm">
          <div className="flex items-start gap-2">
            <span className="text-2xl">🏠</span>
            <div>
              <strong className="text-gray-700 dark:text-gray-300">Domicilio:</strong>
              <span className="text-gray-600 dark:text-gray-400"> El planeta está "en casa"</span>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-2xl">🌟</span>
            <div>
              <strong className="text-gray-700 dark:text-gray-300">Exaltación:</strong>
              <span className="text-gray-600 dark:text-gray-400"> Invitado de honor</span>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-2xl">⚖️</span>
            <div>
              <strong className="text-gray-700 dark:text-gray-300">Exilio:</strong>
              <span className="text-gray-600 dark:text-gray-400"> Fuera de su elemento</span>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-2xl">📉</span>
            <div>
              <strong className="text-gray-700 dark:text-gray-300">Caída:</strong>
              <span className="text-gray-600 dark:text-gray-400"> Máxima debilidad</span>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-2xl">🔄</span>
            <div>
              <strong className="text-gray-700 dark:text-gray-300">Recepción Mutua:</strong>
              <span className="text-gray-600 dark:text-gray-400"> Intercambio de fuerzas</span>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-2xl">🔥</span>
            <div>
              <strong className="text-gray-700 dark:text-gray-300">Triplicidad:</strong>
              <span className="text-gray-600 dark:text-gray-400"> Fuerza por elemento</span>
            </div>
          </div>
        </div>
      </div>

      {/* Nota */}
      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border-l-4 border-blue-500">
        <p className="text-sm text-gray-700 dark:text-gray-300">
          <strong>💡 Nota:</strong> Las dignidades esenciales son fundamentales en astrología tradicional 
          para evaluar la fuerza planetaria. Un planeta en mala dignidad no es "malo", sino que 
          requiere <strong>más consciencia y trabajo</strong> para manifestar sus cualidades positivamente.
        </p>
      </div>

      {/* Modal */}
      {selectedDignity && (
        <DignityModal
          dignity={selectedDignity}
          onClose={() => setSelectedDignity(null)}
        />
      )}
    </div>
  );
};

export default DignitiesGrid;
