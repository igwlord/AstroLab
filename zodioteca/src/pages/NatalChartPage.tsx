import { useState, useRef } from 'react';
import NatalChartForm from '../components/NatalChartForm';
import type { FormValue } from '../types/natalForm';
import { calculateNatalChart, type NatalChart } from '../services/realAstroCalculator';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function NatalChartPage() {
  const [result, setResult] = useState<NatalChart | null>(null);
  const [showForm, setShowForm] = useState(true);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const chartRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (formData: FormValue) => {
    console.log('📋 Form data received:', formData);

    // Adaptar datos del nuevo formulario al formato esperado por calculateNatalChart
    const { birth, location } = formData;
    
    // Validar que tengamos coordenadas
    if (!location.lat || !location.lon) {
      alert(`❌ Error: No se pudieron obtener las coordenadas de la ubicación.

Por favor:
1. Selecciona un país y una provincia/región (se usarán las coordenadas de la capital)
2. O selecciona una ciudad específica de la lista
3. O usa el toggle "🗺️ Coordenadas manuales" para ingresar lat/lon

Ubicación actual: ${location.countryCode || 'Sin país'} - ${location.region || 'Sin región'}`);
      console.error('Location sin coordenadas:', location);
      return;
    }
    
    // Crear fecha UTC
    const hour = birth.time?.hour ?? 12;
    const minute = birth.time?.minute ?? 0;
    
    // Convertir timezone a offset (simplificado)
    const timezoneOffsets: Record<string, number> = {
      'America/Argentina/Buenos_Aires': -3,
      'America/Mexico_City': -6,
      'America/Bogota': -5,
      'America/Santiago': -4,
      'America/Lima': -5,
      'Europe/Madrid': 1,
      'America/New_York': -5,
      'America/Los_Angeles': -8,
      'UTC': 0,
    };
    
    const offset = timezoneOffsets[location.tzId || 'UTC'] || 0;
    const birthDateUTC = new Date(
      Date.UTC(birth.year, birth.month - 1, birth.day, hour - offset, minute, 0)
    );

    // Determinar el nombre de la ubicación
    const locationName = location.city || location.region || location.countryCode || 'Ubicación desconocida';
    
    console.log('✅ Enviando a calcular:', {
      fecha: birthDateUTC,
      lat: location.lat,
      lon: location.lon,
      ubicacion: locationName,
      pais: location.countryCode,
      region: location.region
    });

    try {
      const chart = await calculateNatalChart(
        birthDateUTC,
        location.lat,
        location.lon,
        locationName,
        formData.settings.houseSystem
      );

      setResult(chart);
      setShowForm(false);
    } catch (error) {
      console.error('Error calculating chart:', error);
      alert('Error al calcular la carta natal. Por favor verifica los datos.');
    }
  };

  const handleNewChart = () => {
    setResult(null);
    setShowForm(true);
  };

  const handleDownloadPDF = async () => {
    if (!chartRef.current || !result) return;

    setIsGeneratingPDF(true);

    try {
      // Capturar el elemento HTML como imagen
      const canvas = await html2canvas(chartRef.current, {
        scale: 2, // Mayor calidad
        useCORS: true,
        backgroundColor: '#f9fafb',
        logging: false,
      });

      // Crear PDF en orientación vertical (portrait)
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210; // Ancho A4 en mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // Si la imagen es muy alta, dividirla en páginas
      let heightLeft = imgHeight;
      let position = 0;

      // Agregar primera página
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= 297; // Altura A4 en mm

      // Agregar páginas adicionales si es necesario
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= 297;
      }

      // Generar nombre del archivo
      const date = new Date(result.date);
      const fileName = `Carta_Natal_${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}.pdf`;

      // Descargar
      pdf.save(fileName);
    } catch (error) {
      console.error('Error generando PDF:', error);
      alert('Error al generar el PDF. Por favor intenta de nuevo.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 py-8">
      {showForm ? (
        <NatalChartForm 
          onSubmit={handleSubmit}
        />
      ) : result && (
        <div ref={chartRef} className="max-w-6xl mx-auto px-6 space-y-6">
          {/* Header */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-purple-100">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-3xl font-bold text-purple-900 mb-2">
                  Carta Natal Calculada
                </h2>
                <p className="text-gray-600">
                  📅 {new Date(result.date).toLocaleDateString('es-ES', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
                <p className="text-gray-600">
                  📍 {result.location} ({result.latitude.toFixed(4)}°, {result.longitude.toFixed(4)}°)
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleDownloadPDF}
                  disabled={isGeneratingPDF}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isGeneratingPDF ? (
                    <>
                      <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Generando...
                    </>
                  ) : (
                    <>
                      📄 Descargar PDF
                    </>
                  )}
                </button>
                <button
                  onClick={handleNewChart}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  ✨ Nueva Carta
                </button>
              </div>
            </div>
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

          {/* Planetas */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-purple-100">
            <h3 className="text-2xl font-bold text-purple-900 mb-4">🪐 Planetas</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Planeta</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Signo</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Grado</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Casa</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {result.planets.map((planet, idx) => (
                    <tr key={idx} className="border-b border-gray-100 hover:bg-purple-50">
                      <td className="py-3 px-4 font-medium">{planet.name}</td>
                      <td className="py-3 px-4">{planet.sign}</td>
                      <td className="py-3 px-4">{planet.degree.toFixed(2)}°</td>
                      <td className="py-3 px-4">{planet.house}</td>
                      <td className="py-3 px-4">
                        {planet.retrograde && (
                          <span className="text-red-600 font-bold">℞ Retrógrado</span>
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
            <h3 className="text-2xl font-bold text-purple-900 mb-4">🏠 Casas</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {result.houses.map((house, idx) => (
                <div key={idx} className="p-4 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg border border-purple-200">
                  <div className="font-bold text-purple-900">Casa {house.number}</div>
                  <div className="text-lg font-semibold text-purple-700">
                    {house.sign} {house.degree.toFixed(2)}°
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Aspectos */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-purple-100">
            <h3 className="text-2xl font-bold text-purple-900 mb-4">✨ Aspectos</h3>
            {result.aspects && result.aspects.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Planeta 1</th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-700">Aspecto</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Planeta 2</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-700">Orbe</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.aspects.map((aspect, idx) => (
                      <tr key={idx} className="border-b border-gray-100 hover:bg-purple-50">
                        <td className="py-3 px-4 font-medium">{aspect.planet1}</td>
                        <td className="py-3 px-4 text-center">
                          <span className={`font-bold ${
                            aspect.type === 'Conjunción' ? 'text-purple-600' :
                            aspect.type === 'Oposición' ? 'text-red-600' :
                            aspect.type === 'Trígono' ? 'text-green-600' :
                            aspect.type === 'Cuadratura' ? 'text-orange-600' :
                            aspect.type === 'Sextil' ? 'text-blue-600' :
                            'text-gray-600'
                          }`}>
                            {aspect.type}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-medium">{aspect.planet2}</td>
                        <td className="py-3 px-4 text-right text-sm text-gray-600">
                          {aspect.orb.toFixed(2)}°
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
    </div>
  );
}
