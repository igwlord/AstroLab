import { useEffect, useState } from 'react';
import { calculateNatalChart } from '../services/realAstroCalculator';

interface ComparisonResult {
  name: string;
  symbol: string;
  calculated: any;
  expected: {
    sign: string;
    degree: number;
    house: number;
    retro?: boolean;
  };
}

export default function TestUserChart() {
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<ComparisonResult[]>([]);
  const [chart, setChart] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    runTest();
  }, []);

  async function runTest() {
    try {
      setLoading(true);
      
      // Fecha UTC: 16 Oct 1988, 17:50 CABA (-03:00) = 20:50 UTC
      const birthDate = new Date(Date.UTC(1988, 9, 16, 20, 50, 0));
      
      // Calcular carta
      const calculatedChart = await calculateNatalChart(
        birthDate,
        -34.6,
        -58.45,
        'Buenos Aires, Argentina'
      );
      
      setChart(calculatedChart);
      
      // Datos esperados de tu carta natal
      const expected = {
        'Nodo Norte': { sign: 'Piscis', degree: 11.817, house: 12, retro: true },
        'Quirón': { sign: 'Cáncer', degree: 7.167, house: 3, retro: true },
        'Parte de la Fortuna': { sign: 'Géminis', degree: 17.167, house: 3, retro: false },
        'Vértex': { sign: 'Libra', degree: 27.033, house: 7, retro: false },
      };
      
      // Obtener valores calculados
      const chiron = calculatedChart.sensitivePoints?.find(p => p.name === 'Quirón');
      const northNode = calculatedChart.lunarNodes?.find(n => n.name === 'Nodo Norte');
      const fortune = calculatedChart.arabicParts?.find(p => p.name.includes('Fortuna'));
      const vertex = calculatedChart.advancedPoints?.find(p => p.name === 'Vértex');
      
      const comparisonResults: ComparisonResult[] = [
        { name: 'Nodo Norte', symbol: '☊', calculated: northNode, expected: expected['Nodo Norte'] },
        { name: 'Quirón', symbol: '⚷', calculated: chiron, expected: expected['Quirón'] },
        { name: 'Parte de la Fortuna', symbol: '⊕', calculated: fortune, expected: expected['Parte de la Fortuna'] },
        { name: 'Vértex', symbol: 'Vx', calculated: vertex, expected: expected['Vértex'] },
      ];
      
      setResults(comparisonResults);
      setLoading(false);
      
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  }

  const getDiffClass = (diff: number) => {
    if (diff < 1) return 'text-green-600 font-bold';
    if (diff < 3) return 'text-yellow-600 font-bold';
    return 'text-red-600 font-bold';
  };

  const allPresent = results.every(r => r.calculated);
  const allAccurate = results.every(r => {
    if (!r.calculated) return false;
    const diff = Math.abs(r.calculated.degree - r.expected.degree);
    return diff < 3;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 to-indigo-800 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-4"></div>
            <p className="text-xl text-gray-700">Ejecutando cálculos...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 to-indigo-800 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <h2 className="text-2xl font-bold text-red-600 mb-4">❌ Error</h2>
            <p className="text-gray-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-indigo-800 p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 text-white text-center">
          <h1 className="text-4xl font-bold mb-2">🧪 Test de Validación</h1>
          <h2 className="text-2xl mb-2">Tu Carta Natal - 16 Octubre 1988</h2>
          <p className="text-lg">Buenos Aires, Argentina</p>
        </div>

        {/* Birth Data */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold mb-6 text-purple-800">📋 Datos de Nacimiento</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-sm text-purple-600 font-semibold">Fecha</p>
              <p className="text-lg">16 de octubre de 1988</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-sm text-purple-600 font-semibold">Hora Local</p>
              <p className="text-lg">17:50 (-03:00)</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-sm text-purple-600 font-semibold">Lugar</p>
              <p className="text-lg">Buenos Aires, Argentina</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-sm text-purple-600 font-semibold">Coordenadas</p>
              <p className="text-lg">34°36'S, 58°27'W</p>
            </div>
          </div>
        </div>

        {/* Comparison Results */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold mb-6 text-purple-800">📊 Resultados de Comparación</h2>
          
          <div className="space-y-6">
            {results.map((result) => {
              const diff = result.calculated 
                ? Math.abs(result.calculated.degree - result.expected.degree) 
                : 999;
              const status = result.calculated ? (diff < 3 ? '✅' : '⚠️') : '❌';
              
              return (
                <div key={result.name} className="border-l-4 border-purple-500 bg-purple-50 p-6 rounded-lg">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <span className="text-3xl">{result.symbol}</span>
                    <span>{result.name}</span>
                    <span className="text-2xl">{status}</span>
                  </h3>
                  
                  {result.calculated ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-purple-200">
                            <th className="p-2 text-left">Aspecto</th>
                            <th className="p-2 text-left">Esperado</th>
                            <th className="p-2 text-left">Calculado</th>
                            <th className="p-2 text-left">Diferencia</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b">
                            <td className="p-2 font-semibold">Signo</td>
                            <td className="p-2">{result.expected.sign}</td>
                            <td className="p-2">{result.calculated.sign || '-'}</td>
                            <td className="p-2">
                              {result.calculated.sign === result.expected.sign ? '✅ Igual' : '❌ Diferente'}
                            </td>
                          </tr>
                          <tr className="border-b">
                            <td className="p-2 font-semibold">Grados</td>
                            <td className="p-2">{result.expected.degree.toFixed(2)}°</td>
                            <td className="p-2">{result.calculated.degree?.toFixed(2) || '-'}°</td>
                            <td className={`p-2 ${getDiffClass(diff)}`}>{diff.toFixed(2)}°</td>
                          </tr>
                          <tr className="border-b">
                            <td className="p-2 font-semibold">Casa</td>
                            <td className="p-2">{result.expected.house}</td>
                            <td className="p-2">{result.calculated.house || '-'}</td>
                            <td className="p-2">
                              {result.calculated.house === result.expected.house ? '✅ Igual' : '⚠️ Diferente'}
                            </td>
                          </tr>
                          {result.expected.retro !== undefined && (
                            <tr>
                              <td className="p-2 font-semibold">Retrógrado</td>
                              <td className="p-2">{result.expected.retro ? 'Sí (R)' : 'No'}</td>
                              <td className="p-2">{result.calculated.retrograde ? 'Sí (R)' : 'No'}</td>
                              <td className="p-2">
                                {result.calculated.retrograde === result.expected.retro ? '✅' : '⚠️'}
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-red-600 font-semibold">❌ No calculado</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Summary */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold mb-6 text-purple-800">🎯 Resumen Final</h2>
          
          <div className="space-y-4 text-xl">
            <p className="flex items-center gap-3">
              <span className={`text-3xl ${allPresent ? 'text-green-600' : 'text-red-600'}`}>
                {allPresent ? '✅' : '❌'}
              </span>
              <span>Todos los puntos {allPresent ? 'calculados' : 'faltantes'}</span>
            </p>
            <p className="flex items-center gap-3">
              <span className={`text-3xl ${allAccurate ? 'text-green-600' : 'text-yellow-600'}`}>
                {allAccurate ? '✅' : '⚠️'}
              </span>
              <span>Precisión {allAccurate ? 'excelente (< 3°)' : 'revisar (> 3°)'}</span>
            </p>
          </div>

          {allPresent && allAccurate ? (
            <div className="mt-6 bg-green-50 border-l-4 border-green-500 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-green-700 mb-3">🎉 ¡Test Exitoso!</h3>
              <p className="text-gray-700 mb-4">
                Todos los puntos avanzados están calculándose correctamente y aparecerán en la rueda con sus símbolos:
              </p>
              <div className="text-2xl space-y-2 text-gray-800">
                <p>☊ Nodo Norte | ☋ Nodo Sur</p>
                <p>⚷ Quirón | ⊕ Parte de la Fortuna</p>
                <p>Vx Vértex | AVx Anti-Vértex</p>
              </div>
            </div>
          ) : (
            <div className="mt-6 bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-yellow-700 mb-3">⚠️ Revisar Configuración</h3>
              <p className="text-gray-700">
                Verifica que los settings estén activados en la configuración de la app.
              </p>
            </div>
          )}
        </div>

        {/* Full Data */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold mb-6 text-purple-800">💾 Datos Completos (JSON)</h2>
          <details className="cursor-pointer">
            <summary className="bg-purple-50 p-4 rounded-lg hover:bg-purple-100 transition">
              Ver datos calculados (expandir)
            </summary>
            <pre className="mt-4 bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-xs">
              {JSON.stringify({
                planetas: chart?.planets?.length || 0,
                asteroides: chart?.asteroids?.length || 0,
                puntosSensibles: chart?.sensitivePoints?.length || 0,
                nodosLunares: chart?.lunarNodes?.length || 0,
                partesArabes: chart?.arabicParts?.length || 0,
                puntosAvanzados: chart?.advancedPoints?.length || 0,
                detalles: {
                  quiron: results.find(r => r.name === 'Quirón')?.calculated,
                  nodoNorte: results.find(r => r.name === 'Nodo Norte')?.calculated,
                  fortuna: results.find(r => r.name === 'Parte de la Fortuna')?.calculated,
                  vertex: results.find(r => r.name === 'Vértex')?.calculated
                }
              }, null, 2)}
            </pre>
          </details>
        </div>
      </div>
    </div>
  );
}
