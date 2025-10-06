import { useState, useRef } from 'react';
import NatalChartForm from '../components/NatalChartForm';
import ChartSectionFilter from '../components/ChartSectionFilter';
import AccordionSection from '../components/AccordionSection';
import StatCard from '../components/StatCard';
import type { FormValue } from '../types/natalForm';
import { calculateNatalChart, type NatalChart } from '../services/realAstroCalculator';
import { calculateChartStatistics } from '../utils/chartStatistics';
import type { ChartStatistics } from '../types/chartStatistics';
import { verifyChart, printVerificationReport, exportChartToText } from '../utils/verifyCalculations';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function NatalChartPage() {
  const [result, setResult] = useState<NatalChart | null>(null);
  const [statistics, setStatistics] = useState<ChartStatistics | null>(null);
  const [personName, setPersonName] = useState<string>('');
  const [showForm, setShowForm] = useState(true);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const chartRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (formData: FormValue) => {
    console.log('📋 Form data received:', formData);
    
    // Guardar nombre completo de la persona
    const fullName = [formData.name, formData.surname].filter(Boolean).join(' ').trim();
    setPersonName(fullName || 'Persona sin nombre');

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
        locationName
      );

      // 🔍 VERIFICACIÓN AUTOMÁTICA DE CÁLCULOS
      console.log('\n' + '='.repeat(60));
      console.log('🔍 VERIFICACIÓN AUTOMÁTICA DE CÁLCULOS');
      console.log('='.repeat(60));
      
      const verificationReport = verifyChart(chart);
      printVerificationReport(verificationReport);
      
      // Exportar a texto para comparación fácil
      console.log('\n📄 EXPORTACIÓN PARA COMPARACIÓN:');
      console.log(exportChartToText(chart));
      
      console.log('\n💡 CÓMO VERIFICAR:');
      console.log('1. Ve a https://www.astro.com/cgi/chart.cgi?rs=3');
      console.log('2. Introduce estos datos:');
      console.log(`   - Fecha: ${birth.day}/${birth.month}/${birth.year}`);
      console.log(`   - Hora: ${birth.time ? `${birth.time.hour}:${birth.time.minute}` : '12:00 (mediodía por defecto)'}`);
      console.log(`   - Lugar: ${locationName}`);
      console.log('3. Compara las posiciones planetarias con la tabla anterior');
      console.log('4. Diferencias menores a 0.5° son aceptables');
      console.log('='.repeat(60) + '\n');

      // Calcular estadísticas de la carta
      const stats = calculateChartStatistics(chart.planets);
      
      setResult(chart);
      setStatistics(stats);
      setShowForm(false);
      
      console.log('📊 Estadísticas calculadas:', stats);
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
      // 1. Expandir todos los acordeones automáticamente
      const accordionButtons = chartRef.current.querySelectorAll('button[class*="w-full flex items-center justify-between"]');
      const closedAccordions: HTMLElement[] = [];
      
      accordionButtons.forEach((button) => {
        const svg = button.querySelector('svg');
        // Si el SVG NO tiene rotate-180, significa que está cerrado
        if (svg && !svg.classList.contains('rotate-180')) {
          closedAccordions.push(button as HTMLElement);
          (button as HTMLElement).click(); // Abrir acordeón
        }
      });

      // 2. Esperar a que se rendericen todos los acordeones
      await new Promise(resolve => setTimeout(resolve, 500));

      // 3. Capturar el elemento HTML como imagen
      const canvas = await html2canvas(chartRef.current, {
        scale: 2, // Mayor calidad
        useCORS: true,
        backgroundColor: '#f9fafb',
        logging: false,
        windowWidth: chartRef.current.scrollWidth,
        windowHeight: chartRef.current.scrollHeight,
      });

      // 4. Crear PDF en orientación vertical (portrait)
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

      // 5. Cerrar los acordeones que estaban cerrados antes
      await new Promise(resolve => setTimeout(resolve, 100));
      closedAccordions.forEach(button => {
        button.click(); // Volver a cerrar
      });

      // 6. Generar nombre del archivo
      const date = new Date(result.date);
      const personNameForFile = personName.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '');
      const fileName = `Carta_Natal_${personNameForFile}_${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}.pdf`;

      // 7. Descargar
      pdf.save(fileName);
      
      console.log('✅ PDF generado con éxito:', fileName);
    } catch (error) {
      console.error('❌ Error generando PDF:', error);
      alert('Error al generar el PDF. Por favor intenta de nuevo.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <div className="py-4 sm:py-8">
      {showForm ? (
        <NatalChartForm 
          onSubmit={handleSubmit}
        />
      ) : result && (
        <div ref={chartRef} className="max-w-6xl mx-auto px-3 sm:px-6 space-y-3 sm:space-y-6">
          {/* Banner de generación de PDF */}
          {isGeneratingPDF && (
            <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-bounce">
              <div className="bg-green-600 text-white px-6 py-3 rounded-lg shadow-2xl flex items-center gap-3">
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="font-bold">📄 Generando PDF completo...</span>
              </div>
            </div>
          )}
          
          {/* Header */}
          <div className="bg-white dark:bg-gray-900 rounded-xl sm:rounded-2xl p-3 sm:p-6 shadow-lg border border-purple-100 dark:border-purple-700">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
              <div className="flex-1 min-w-0">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-purple-900 dark:text-purple-100 mb-1 sm:mb-2 truncate">
                  {personName}
                </h2>
                <h3 className="text-base sm:text-lg md:text-xl font-semibold text-purple-700 dark:text-purple-300 mb-2 sm:mb-3">
                  Carta Natal
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">
                  📅 {new Date(result.date).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">
                  📍 {result.location}
                </p>
              </div>
              <div className="flex gap-2 sm:gap-3 justify-end shrink-0">
                <button
                  onClick={handleDownloadPDF}
                  disabled={isGeneratingPDF}
                  className="px-3 py-2 sm:px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 sm:gap-2 text-sm sm:text-base"
                  title="Descargar PDF"
                >
                  {isGeneratingPDF ? (
                    <>
                      <svg className="animate-spin h-4 w-4 sm:h-5 sm:w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span className="hidden sm:inline">Generando...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span className="hidden sm:inline">PDF</span>
                    </>
                  )}
                </button>
                <button
                  onClick={handleNewChart}
                  className="px-3 py-2 sm:px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-1 sm:gap-2 text-sm sm:text-base"
                  title="Nueva Carta"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  <span className="hidden sm:inline">Nueva</span>
                </button>
              </div>
            </div>
          </div>

          {/* Trio Principal: SOL, LUNA, ASCENDENTE */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 md:gap-6">
            {/* SOL */}
            {(() => {
              const sol = result.planets.find(p => p.name === 'Sol');
              if (!sol) return null;
              return (
                <div className="bg-gradient-to-br from-yellow-50 via-orange-50 to-yellow-100 dark:from-yellow-900/20 dark:via-orange-900/20 dark:to-yellow-800/20 rounded-lg sm:rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-6 shadow-lg sm:shadow-xl md:shadow-2xl border border-yellow-300 dark:border-yellow-600 relative overflow-hidden">
                  <div className="absolute top-0 right-0 text-4xl sm:text-6xl md:text-8xl opacity-10">☀️</div>
                  <div className="relative z-10">
                    <h3 className="text-sm sm:text-lg md:text-2xl font-bold text-yellow-900 dark:text-yellow-100 mb-1 sm:mb-2 md:mb-3 flex items-center gap-1 sm:gap-2">
                      <span className="text-xl sm:text-2xl md:text-3xl">☀️</span> SOL
                    </h3>
                    <p className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-black text-yellow-700 dark:text-yellow-300 mb-1">
                      {sol.sign}
                    </p>
                    <p className="text-xs sm:text-sm text-yellow-800 dark:text-yellow-400 font-semibold">
                      {sol.degree.toFixed(0)}° • Casa {sol.house}
                    </p>
                    <p className="text-xs sm:text-sm text-yellow-700 dark:text-yellow-500 italic hidden sm:block mt-1">
                      Tu esencia vital
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
                <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-purple-900/20 rounded-lg sm:rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-6 shadow-lg sm:shadow-xl md:shadow-2xl border border-indigo-300 dark:border-indigo-600 relative overflow-hidden">
                  <div className="absolute top-0 right-0 text-4xl sm:text-6xl md:text-8xl opacity-10">🌙</div>
                  <div className="relative z-10">
                    <h3 className="text-sm sm:text-lg md:text-2xl font-bold text-indigo-900 dark:text-indigo-100 mb-1 sm:mb-2 md:mb-3 flex items-center gap-1 sm:gap-2">
                      <span className="text-xl sm:text-2xl md:text-3xl">🌙</span> LUNA
                    </h3>
                    <p className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-black text-indigo-700 dark:text-indigo-300 mb-1">
                      {luna.sign}
                    </p>
                    <p className="text-xs sm:text-sm text-indigo-800 dark:text-indigo-400 font-semibold">
                      {luna.degree.toFixed(0)}° • Casa {luna.house}
                    </p>
                    <p className="text-xs sm:text-sm text-indigo-700 dark:text-indigo-500 italic hidden sm:block mt-1">
                      Tus emociones
                    </p>
                  </div>
                </div>
              );
            })()}

            {/* ASCENDENTE */}
            <div className="bg-gradient-to-br from-pink-50 via-rose-50 to-red-100 dark:from-pink-900/20 dark:via-rose-900/20 dark:to-red-900/20 rounded-lg sm:rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-6 shadow-lg sm:shadow-xl md:shadow-2xl border border-rose-300 dark:border-rose-600 relative overflow-hidden">
              <div className="absolute top-0 right-0 text-4xl sm:text-6xl md:text-8xl opacity-10">⬆️</div>
              <div className="relative z-10">
                <h3 className="text-sm sm:text-lg md:text-2xl font-bold text-rose-900 dark:text-rose-100 mb-1 sm:mb-2 md:mb-3 flex items-center gap-1 sm:gap-2">
                  <span className="text-xl sm:text-2xl md:text-3xl">⬆️</span> ASC
                </h3>
                <p className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-black text-rose-700 dark:text-rose-300 mb-1">
                  {result.ascendant.sign}
                </p>
                <p className="text-xs sm:text-sm text-rose-800 dark:text-rose-400 font-semibold">
                  {result.ascendant.degree.toFixed(0)}° • Casa 1
                </p>
                <p className="text-xs sm:text-sm text-rose-700 dark:text-rose-500 italic hidden sm:block mt-1">
                  Tu máscara
                </p>
              </div>
            </div>
          </div>

          {/* ==================== FILTRO DE SECCIONES ==================== */}
          <ChartSectionFilter />

          {/* ==================== SECCIONES DE LA CARTA NATAL ==================== */}
          {/* ORDEN: 1.Casas → 2.Planetas → 3.Aspectos → 4.Nodos → 5.Puntos Sensibles → 6.Asteroides → 7.Partes Árabes → 8.Síntesis */}

          {/* 🏠 1. CASAS (incluye ASC/MC) */}
          {/* TODO: Mover sección de Casas aquí */}

          {/* 🪐 2. PLANETAS */}
          <AccordionSection title="Planetas" icon="🪐" count={result.planets.length} data-chart-section="Planetas">
            {/* Resumen de Planetas por Categoría */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              {/* Personales */}
              <div className="p-4 bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 rounded-xl border-2 border-yellow-300 dark:border-yellow-700">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-2xl">⚡</span>
                  <h4 className="font-bold text-yellow-900 dark:text-yellow-100 text-sm">Personales</h4>
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">☉☽☿♀♂</div>
              </div>

              {/* Sociales */}
              <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl border-2 border-blue-300 dark:border-blue-700">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-2xl">🌟</span>
                  <h4 className="font-bold text-blue-900 dark:text-blue-100 text-sm">Sociales</h4>
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">♃♄</div>
              </div>

              {/* Generacionales */}
              <div className="p-4 bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 rounded-xl border-2 border-purple-300 dark:border-purple-700">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-2xl">🌌</span>
                  <h4 className="font-bold text-purple-900 dark:text-purple-100 text-sm">Generacionales</h4>
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">♅♆♇</div>
              </div>

              {/* Retrógrados */}
              <div className="p-4 bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-xl border-2 border-red-300 dark:border-red-700">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-2xl">℞</span>
                  <h4 className="font-bold text-red-900 dark:text-red-100 text-sm">Retrógrados</h4>
                </div>
                <div className="text-2xl font-bold text-red-700 dark:text-red-300">
                  {result.planets.filter(p => p.retrograde).length}
                </div>
              </div>
            </div>

            {/* Grid de Planetas Mejorado */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {result.planets.map((planet, idx) => {
                // Mapeo de símbolos y estilos de planetas
                const planetData: Record<string, { 
                  symbol: string; 
                  category: string;
                  gradient: string;
                  border: string;
                  textColor: string;
                  description: string;
                  categoryIcon: string;
                }> = {
                  'Sol': {
                    symbol: '☉',
                    category: 'Personal',
                    gradient: 'from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30',
                    border: 'border-yellow-400 dark:border-yellow-600',
                    textColor: 'text-yellow-700 dark:text-yellow-300',
                    description: 'Identidad y vitalidad',
                    categoryIcon: '⚡'
                  },
                  'Luna': {
                    symbol: '☽',
                    category: 'Personal',
                    gradient: 'from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30',
                    border: 'border-blue-400 dark:border-blue-600',
                    textColor: 'text-blue-700 dark:text-blue-300',
                    description: 'Emociones e instintos',
                    categoryIcon: '⚡'
                  },
                  'Mercurio': {
                    symbol: '☿',
                    category: 'Personal',
                    gradient: 'from-gray-100 to-slate-100 dark:from-gray-900/30 dark:to-slate-900/30',
                    border: 'border-gray-400 dark:border-gray-600',
                    textColor: 'text-gray-700 dark:text-gray-300',
                    description: 'Mente y comunicación',
                    categoryIcon: '⚡'
                  },
                  'Venus': {
                    symbol: '♀',
                    category: 'Personal',
                    gradient: 'from-pink-100 to-rose-100 dark:from-pink-900/30 dark:to-rose-900/30',
                    border: 'border-pink-400 dark:border-pink-600',
                    textColor: 'text-pink-700 dark:text-pink-300',
                    description: 'Amor y valores',
                    categoryIcon: '⚡'
                  },
                  'Marte': {
                    symbol: '♂',
                    category: 'Personal',
                    gradient: 'from-red-100 to-orange-100 dark:from-red-900/30 dark:to-orange-900/30',
                    border: 'border-red-400 dark:border-red-600',
                    textColor: 'text-red-700 dark:text-red-300',
                    description: 'Acción y energía',
                    categoryIcon: '⚡'
                  },
                  'Júpiter': {
                    symbol: '♃',
                    category: 'Social',
                    gradient: 'from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30',
                    border: 'border-indigo-400 dark:border-indigo-600',
                    textColor: 'text-indigo-700 dark:text-indigo-300',
                    description: 'Expansión y suerte',
                    categoryIcon: '🌟'
                  },
                  'Saturno': {
                    symbol: '♄',
                    category: 'Social',
                    gradient: 'from-stone-100 to-neutral-100 dark:from-stone-900/30 dark:to-neutral-900/30',
                    border: 'border-stone-400 dark:border-stone-600',
                    textColor: 'text-stone-700 dark:text-stone-300',
                    description: 'Límites y estructura',
                    categoryIcon: '🌟'
                  },
                  'Urano': {
                    symbol: '♅',
                    category: 'Generacional',
                    gradient: 'from-sky-100 to-blue-100 dark:from-sky-900/30 dark:to-blue-900/30',
                    border: 'border-sky-400 dark:border-sky-600',
                    textColor: 'text-sky-700 dark:text-sky-300',
                    description: 'Innovación y cambio',
                    categoryIcon: '🌌'
                  },
                  'Neptuno': {
                    symbol: '♆',
                    category: 'Generacional',
                    gradient: 'from-teal-100 to-cyan-100 dark:from-teal-900/30 dark:to-cyan-900/30',
                    border: 'border-teal-400 dark:border-teal-600',
                    textColor: 'text-teal-700 dark:text-teal-300',
                    description: 'Espiritualidad y sueños',
                    categoryIcon: '🌌'
                  },
                  'Plutón': {
                    symbol: '♇',
                    category: 'Generacional',
                    gradient: 'from-violet-100 to-purple-100 dark:from-violet-900/30 dark:to-purple-900/30',
                    border: 'border-violet-400 dark:border-violet-600',
                    textColor: 'text-violet-700 dark:text-violet-300',
                    description: 'Transformación y poder',
                    categoryIcon: '🌌'
                  }
                };

                const data = planetData[planet.name] || {
                  symbol: planet.name.charAt(0),
                  category: 'Otro',
                  gradient: 'from-gray-100 to-gray-200 dark:from-gray-900/30 dark:to-gray-800/30',
                  border: 'border-gray-400 dark:border-gray-600',
                  textColor: 'text-gray-700 dark:text-gray-300',
                  description: planet.name,
                  categoryIcon: '🪐'
                };

                return (
                  <div 
                    key={idx} 
                    className={`p-4 bg-gradient-to-br ${data.gradient} rounded-xl border-2 ${data.border} hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-105 relative`}
                  >
                    {/* Badge retrógrado */}
                    {planet.retrograde && (
                      <div className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center text-lg font-bold shadow-lg animate-pulse">
                        ℞
                      </div>
                    )}

                    {/* Encabezado con símbolo y categoría */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-4xl">{data.symbol}</span>
                        <div>
                          <h4 className={`text-lg font-bold ${data.textColor}`}>
                            {planet.name}
                          </h4>
                          <div className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1">
                            <span>{data.categoryIcon}</span>
                            <span>{data.category}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Descripción */}
                    <div className="mb-3 text-xs text-gray-600 dark:text-gray-400 italic">
                      {data.description}
                    </div>

                    {/* Información detallada */}
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between items-center p-2 bg-white/50 dark:bg-black/20 rounded">
                        <span className="text-gray-600 dark:text-gray-400">Signo:</span>
                        <span className={`font-bold ${data.textColor}`}>{planet.sign}</span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div className="p-2 bg-white/50 dark:bg-black/20 rounded">
                          <div className="text-xs text-gray-600 dark:text-gray-400">Grado</div>
                          <div className="font-semibold text-gray-700 dark:text-gray-300">
                            {planet.degree.toFixed(2)}°
                          </div>
                        </div>
                        
                        <div className="p-2 bg-white/50 dark:bg-black/20 rounded">
                          <div className="text-xs text-gray-600 dark:text-gray-400">Casa</div>
                          <div className="font-semibold text-gray-700 dark:text-gray-300">
                            {planet.house}
                          </div>
                        </div>
                      </div>

                      {/* Longitud exacta */}
                      <div className="flex justify-between items-center p-2 bg-white/50 dark:bg-black/20 rounded text-xs">
                        <span className="text-gray-600 dark:text-gray-400">Longitud:</span>
                        <span className="font-mono text-gray-700 dark:text-gray-300">
                          {planet.longitude.toFixed(4)}°
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </AccordionSection>

          {/* Asteroides */}
          {result.asteroids && result.asteroids.length > 0 && (
            <AccordionSection title="Asteroides" icon="☄️" count={result.asteroids.length} defaultOpen={false} data-chart-section="Asteroides">
              {/* Introducción a los Asteroides */}
              <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border-2 border-purple-300 dark:border-purple-700">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">☄️</span>
                  <h4 className="font-bold text-purple-900 dark:text-purple-100">Los Cuatro Asteroides Principales</h4>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Descubiertos entre 1801-1807, representan aspectos del arquetipo femenino que complementan Venus y la Luna.
                </p>
              </div>

              {/* Grid de Asteroides Mejorado */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                {result.asteroids.map((asteroid, idx) => {
                  // Mapeo completo de datos para cada asteroide
                  const asteroidData: Record<string, {
                    gradient: string;
                    border: string;
                    textColor: string;
                    icon: string;
                    symbol: string;
                    description: string;
                    keywords: string[];
                    mythology: string;
                    orbitalPeriod: string;
                  }> = {
                    'Ceres': {
                      gradient: 'from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30',
                      border: 'border-green-400 dark:border-green-600',
                      textColor: 'text-green-700 dark:text-green-300',
                      icon: '🌾',
                      symbol: '⚳',
                      description: 'La Gran Madre cósmica',
                      keywords: ['Nutrición', 'Maternidad', 'Pérdida', 'Regeneración', 'Fertilidad'],
                      mythology: 'Diosa romana de la agricultura y las cosechas',
                      orbitalPeriod: '4.6 años'
                    },
                    'Pallas': {
                      gradient: 'from-indigo-100 to-blue-100 dark:from-indigo-900/30 dark:to-blue-900/30',
                      border: 'border-indigo-400 dark:border-indigo-600',
                      textColor: 'text-indigo-700 dark:text-indigo-300',
                      icon: '🦉',
                      symbol: '⚴',
                      description: 'La guerrera sabia',
                      keywords: ['Sabiduría', 'Estrategia', 'Creatividad', 'Justicia', 'Diplomacia'],
                      mythology: 'Diosa griega de la sabiduría y la guerra estratégica',
                      orbitalPeriod: '4.6 años'
                    },
                    'Juno': {
                      gradient: 'from-pink-100 to-rose-100 dark:from-pink-900/30 dark:to-rose-900/30',
                      border: 'border-pink-400 dark:border-pink-600',
                      textColor: 'text-pink-700 dark:text-pink-300',
                      icon: '💍',
                      symbol: '⚵',
                      description: 'La compañera divina',
                      keywords: ['Matrimonio', 'Compromiso', 'Igualdad', 'Celos', 'Lealtad'],
                      mythology: 'Diosa romana del matrimonio y reina de los dioses',
                      orbitalPeriod: '4.4 años'
                    },
                    'Vesta': {
                      gradient: 'from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30',
                      border: 'border-orange-400 dark:border-orange-600',
                      textColor: 'text-orange-700 dark:text-orange-300',
                      icon: '🔥',
                      symbol: '⚶',
                      description: 'La guardiana del fuego sagrado',
                      keywords: ['Devoción', 'Enfoque', 'Pureza', 'Servicio', 'Sexualidad sagrada'],
                      mythology: 'Diosa romana del hogar y el fuego sagrado',
                      orbitalPeriod: '3.6 años'
                    }
                  };

                  const data = asteroidData[asteroid.name] || {
                    gradient: 'from-gray-100 to-slate-100 dark:from-gray-900/30 dark:to-slate-900/30',
                    border: 'border-gray-400 dark:border-gray-600',
                    textColor: 'text-gray-700 dark:text-gray-300',
                    icon: '☄️',
                    symbol: '⁂',
                    description: asteroid.name,
                    keywords: ['Asteroide'],
                    mythology: 'Asteroide del cinturón principal',
                    orbitalPeriod: 'Variable'
                  };

                  return (
                    <div 
                      key={idx} 
                      className={`p-5 bg-gradient-to-br ${data.gradient} rounded-xl border-2 ${data.border} hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-[1.02] relative`}
                    >
                      {/* Badge retrógrado */}
                      {asteroid.retrograde && (
                        <div className="absolute top-3 right-3 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg animate-pulse">
                          ℞
                        </div>
                      )}

                      {/* Encabezado */}
                      <div className="flex items-start gap-3 mb-4">
                        <div className="flex flex-col items-center">
                          <span className="text-5xl mb-1">{data.icon}</span>
                          <span className="text-2xl opacity-60">{data.symbol}</span>
                        </div>
                        <div className="flex-1">
                          <h4 className={`text-xl font-bold ${data.textColor} mb-1`}>
                            {asteroid.name}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                            {data.description}
                          </p>
                        </div>
                      </div>

                      {/* Información astrológica */}
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between items-center p-2 bg-white/50 dark:bg-black/20 rounded">
                          <span className="text-xs text-gray-600 dark:text-gray-400">Signo:</span>
                          <span className={`font-bold ${data.textColor}`}>{asteroid.sign}</span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2">
                          <div className="p-2 bg-white/50 dark:bg-black/20 rounded">
                            <div className="text-xs text-gray-600 dark:text-gray-400">Grado</div>
                            <div className="font-semibold text-gray-700 dark:text-gray-300">
                              {asteroid.degree.toFixed(2)}°
                            </div>
                          </div>
                          
                          <div className="p-2 bg-white/50 dark:bg-black/20 rounded">
                            <div className="text-xs text-gray-600 dark:text-gray-400">Casa</div>
                            <div className="font-semibold text-gray-700 dark:text-gray-300">
                              {asteroid.house}
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-between items-center p-2 bg-white/50 dark:bg-black/20 rounded text-xs">
                          <span className="text-gray-600 dark:text-gray-400">Longitud:</span>
                          <span className="font-mono text-gray-700 dark:text-gray-300">
                            {asteroid.longitude.toFixed(4)}°
                          </span>
                        </div>
                      </div>

                      {/* Keywords */}
                      <div className="mb-3">
                        <div className="text-xs text-gray-600 dark:text-gray-400 mb-2 font-semibold">Palabras Clave:</div>
                        <div className="flex flex-wrap gap-1">
                          {data.keywords.map((keyword, i) => (
                            <span 
                              key={i}
                              className={`px-2 py-1 text-xs rounded-full bg-white/60 dark:bg-black/30 ${data.textColor} font-medium`}
                            >
                              {keyword}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Mitología y período orbital */}
                      <div className="pt-3 border-t border-gray-300 dark:border-gray-600 space-y-1">
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          <strong>Mitología:</strong> {data.mythology}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          <strong>Período orbital:</strong> {data.orbitalPeriod}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </AccordionSection>
          )}

          {/* Puntos Sensibles (Chiron & Lilith) */}
          {result.sensitivePoints && result.sensitivePoints.length > 0 && (
            <AccordionSection 
              title="Puntos Sensibles" 
              icon="🔮" 
              count={result.sensitivePoints.length}
              defaultOpen={false}
              data-chart-section="Puntos Sensibles"
            >
              {/* Introducción */}
              <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 via-violet-50 to-fuchsia-50 dark:from-purple-900/20 dark:via-violet-900/20 dark:to-fuchsia-900/20 rounded-xl border-2 border-purple-300 dark:border-purple-700">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">🔮</span>
                  <h4 className="font-bold text-purple-900 dark:text-purple-100">Puntos de Transformación Profunda</h4>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Revelan nuestras heridas más profundas, aspectos reprimidos y el camino hacia la sanación y el empoderamiento personal.
                </p>
              </div>

              {/* Grid de Puntos Sensibles Mejorado */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {result.sensitivePoints.map((point) => {
                  // Datos completos para cada punto
                  const pointData: Record<string, {
                    gradient: string;
                    border: string;
                    textColor: string;
                    icon: string;
                    symbol: string;
                    title: string;
                    description: string;
                    keywords: string[];
                    archetype: string;
                    interpretation: string;
                  }> = {
                    'chiron': {
                      gradient: 'from-purple-100 via-violet-100 to-fuchsia-100 dark:from-purple-900/30 dark:via-violet-900/30 dark:to-fuchsia-900/30',
                      border: 'border-purple-400 dark:border-purple-600',
                      textColor: 'text-purple-700 dark:text-purple-300',
                      icon: '⚕️',
                      symbol: '⚷',
                      title: 'Chiron - El Sanador Herido',
                      description: 'El centauro sabio que enseña a través del dolor',
                      keywords: ['Herida primordial', 'Sanación', 'Maestría', 'Compasión', 'Iniciación'],
                      archetype: 'El chamán que sana a otros mientras porta su propia herida',
                      interpretation: 'Revela dónde fuimos heridos profundamente y cómo esa herida se convierte en nuestra medicina para sanar a otros. Orbital ~50 años.'
                    },
                    'lilith-mean': {
                      gradient: 'from-slate-100 via-gray-100 to-purple-100 dark:from-slate-900/30 dark:via-gray-900/30 dark:to-purple-900/30',
                      border: 'border-gray-500 dark:border-gray-600',
                      textColor: 'text-gray-800 dark:text-gray-300',
                      icon: '🌑',
                      symbol: '⚸',
                      title: 'Lilith Media - Luna Negra',
                      description: 'El apogeo lunar calculado matemáticamente',
                      keywords: ['Sombra', 'Rebeldía', 'Sexualidad', 'Autonomía', 'Lo prohibido'],
                      archetype: 'La mujer salvaje que rechaza ser domesticada',
                      interpretation: 'Representa aspectos reprimidos, la sexualidad primordial, y el rechazo a la sumisión. Es el punto donde la Luna está más lejos de la Tierra.'
                    },
                    'lilith-true': {
                      gradient: 'from-indigo-100 via-purple-100 to-black/20 dark:from-indigo-900/30 dark:via-purple-900/30 dark:to-black/40',
                      border: 'border-indigo-500 dark:border-indigo-600',
                      textColor: 'text-indigo-800 dark:text-indigo-300',
                      icon: '🖤',
                      symbol: '⚸',
                      title: 'Lilith Verdadera - Luna Negra Real',
                      description: 'El apogeo lunar oscilante real',
                      keywords: ['Sombra auténtica', 'Instinto', 'Poder femenino', 'Tabú', 'Liberación'],
                      archetype: 'La diosa oscura en su manifestación más pura',
                      interpretation: 'La posición real y oscilante del apogeo lunar. Representa la sombra sin filtros y el poder instintivo primordial.'
                    }
                  };

                  const data = pointData[point.type] || {
                    gradient: 'from-gray-100 to-gray-200 dark:from-gray-900/30 dark:to-gray-800/30',
                    border: 'border-gray-400 dark:border-gray-600',
                    textColor: 'text-gray-700 dark:text-gray-300',
                    icon: '🔮',
                    symbol: '◎',
                    title: point.name,
                    description: 'Punto sensible',
                    keywords: ['Sensible'],
                    archetype: point.name,
                    interpretation: 'Punto sensible en la carta natal'
                  };

                  return (
                    <div
                      key={point.name}
                      className={`
                        p-6 rounded-2xl
                        bg-gradient-to-br ${data.gradient}
                        border-2 ${data.border}
                        hover:scale-[1.02] hover:shadow-2xl
                        transition-all duration-300
                        cursor-pointer
                        relative overflow-hidden
                      `}
                    >
                      {/* Símbolo decorativo de fondo */}
                      <div className="absolute top-2 right-2 text-8xl opacity-10">
                        {data.symbol}
                      </div>

                      {/* Badge retrógrado */}
                      {point.retrograde && point.type === 'chiron' && (
                        <div className="absolute top-4 right-4 px-3 py-1 bg-orange-500 text-white rounded-full text-xs font-bold shadow-lg animate-pulse z-10">
                          ℞ Retrógrado
                        </div>
                      )}

                      {/* Encabezado */}
                      <div className="relative flex items-start gap-4 mb-4">
                        <div className="flex flex-col items-center">
                          <span className="text-6xl mb-1">{data.icon}</span>
                          <span className="text-3xl opacity-60">{data.symbol}</span>
                        </div>
                        <div className="flex-1">
                          <h4 className={`text-xl font-bold ${data.textColor} mb-1`}>
                            {data.title}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                            {data.description}
                          </p>
                        </div>
                      </div>

                      {/* Información astrológica */}
                      <div className="relative space-y-2 mb-4">
                        <div className="flex justify-between items-center p-2 bg-white/50 dark:bg-black/20 rounded">
                          <span className="text-xs text-gray-600 dark:text-gray-400">Signo:</span>
                          <span className={`font-bold ${data.textColor}`}>{point.sign}</span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2">
                          <div className="p-2 bg-white/50 dark:bg-black/20 rounded">
                            <div className="text-xs text-gray-600 dark:text-gray-400">Grado</div>
                            <div className="font-semibold text-gray-700 dark:text-gray-300">
                              {point.degree.toFixed(2)}°
                            </div>
                          </div>
                          
                          <div className="p-2 bg-white/50 dark:bg-black/20 rounded">
                            <div className="text-xs text-gray-600 dark:text-gray-400">Casa</div>
                            <div className="font-semibold text-gray-700 dark:text-gray-300">
                              {point.house}
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-between items-center p-2 bg-white/50 dark:bg-black/20 rounded text-xs">
                          <span className="text-gray-600 dark:text-gray-400">Longitud:</span>
                          <span className="font-mono text-gray-700 dark:text-gray-300">
                            {point.longitude.toFixed(4)}°
                          </span>
                        </div>
                      </div>

                      {/* Keywords */}
                      <div className="relative mb-3">
                        <div className="text-xs text-gray-600 dark:text-gray-400 mb-2 font-semibold">Palabras Clave:</div>
                        <div className="flex flex-wrap gap-1">
                          {data.keywords.map((keyword, i) => (
                            <span 
                              key={i}
                              className={`px-2 py-1 text-xs rounded-full bg-white/60 dark:bg-black/30 ${data.textColor} font-medium`}
                            >
                              {keyword}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Arquetipo e interpretación */}
                      <div className="relative pt-3 border-t border-gray-300 dark:border-gray-600 space-y-2">
                        <div className="text-xs text-gray-700 dark:text-gray-300">
                          <strong className={data.textColor}>Arquetipo:</strong> {data.archetype}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                          {data.interpretation}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Nota educativa */}
              <div className="mt-6 p-4 bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 rounded-xl border border-violet-300 dark:border-violet-700">
                <h5 className="font-bold text-violet-900 dark:text-violet-100 mb-2 flex items-center gap-2">
                  <span>📚</span>
                  <span>Diferencia entre Lilith Media y Verdadera</span>
                </h5>
                <div className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                  <p><strong>Luna Negra Media:</strong> Calculada matemáticamente como promedio. Más utilizada en astrología occidental moderna.</p>
                  <p><strong>Luna Negra Verdadera:</strong> Posición real y oscilante. Puede diferir hasta 30° de la media. Preferida por astrólogos que buscan precisión astronómica.</p>
                </div>
              </div>
            </AccordionSection>
          )}

          {/* Nodos Lunares */}
          {result.lunarNodes && result.lunarNodes.length > 0 && (
            <AccordionSection 
              title="Nodos Lunares" 
              icon="☯️" 
              count={result.lunarNodes.length}
              defaultOpen={false}
              data-chart-section="Nodos Lunares"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {result.lunarNodes.map((node) => {
                  const isNorth = node.type === 'north';
                  
                  return (
                    <div
                      key={node.name}
                      className={`
                        relative overflow-hidden
                        p-6 rounded-2xl
                        ${isNorth 
                          ? 'bg-gradient-to-br from-blue-500/20 via-cyan-500/20 to-teal-500/20 border-2 border-cyan-500/30'
                          : 'bg-gradient-to-br from-orange-500/20 via-amber-500/20 to-yellow-500/20 border-2 border-amber-500/30'
                        }
                        hover:scale-[1.02] hover:shadow-2xl
                        transition-all duration-300
                      `}
                    >
                      {/* Símbolo decorativo en el fondo */}
                      <div className="absolute top-2 right-2 text-8xl opacity-10">
                        {isNorth ? '☊' : '☋'}
                      </div>
                      
                      {/* Header */}
                      <div className="relative flex items-center gap-4 mb-4">
                        <div className={`
                          text-6xl flex items-center justify-center
                          w-20 h-20 rounded-full
                          ${isNorth 
                            ? 'bg-gradient-to-br from-cyan-400 to-blue-500 shadow-lg shadow-cyan-500/50'
                            : 'bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-amber-500/50'
                          }
                        `}>
                          {isNorth ? '☊' : '☋'}
                        </div>
                        
                        <div>
                          <h3 className="text-2xl font-bold mb-1">
                            {node.name}
                          </h3>
                          <p className={`text-sm font-medium ${
                            isNorth 
                              ? 'text-cyan-700 dark:text-cyan-300' 
                              : 'text-amber-700 dark:text-amber-300'
                          }`}>
                            {isNorth ? 'Rahu - Destino Evolutivo' : 'Ketu - Karma Pasado'}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Variante: {node.variant === 'mean' ? 'Media' : 'Verdadera'}
                          </p>
                        </div>
                      </div>
                      
                      {/* Información astrológica */}
                      <div className="relative space-y-3">
                        <div className="flex justify-between items-center p-3 bg-white/50 dark:bg-black/20 rounded-lg">
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            Signo:
                          </span>
                          <span className={`text-lg font-bold ${
                            isNorth 
                              ? 'text-cyan-700 dark:text-cyan-300'
                              : 'text-amber-700 dark:text-amber-300'
                          }`}>
                            {node.sign}
                          </span>
                        </div>
                        
                        <div className="flex justify-between items-center p-3 bg-white/50 dark:bg-black/20 rounded-lg">
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            Grado:
                          </span>
                          <span className="text-lg font-mono font-bold">
                            {node.degree.toFixed(2)}°
                          </span>
                        </div>
                        
                        <div className="flex justify-between items-center p-3 bg-white/50 dark:bg-black/20 rounded-lg">
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            Casa:
                          </span>
                          <span className={`text-lg font-bold ${
                            isNorth 
                              ? 'text-cyan-700 dark:text-cyan-300'
                              : 'text-amber-700 dark:text-amber-300'
                          }`}>
                            {node.house}
                          </span>
                        </div>
                        
                        {/* Indicador de retrógrado (siempre presente en nodos) */}
                        <div className="text-center pt-2">
                          <span className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-full text-purple-600 dark:text-purple-400 text-sm font-bold">
                            <span className="text-xl">℞</span>
                            Movimiento Retrógrado
                          </span>
                        </div>
                      </div>
                      
                      {/* Descripción */}
                      <div className="relative mt-4 p-3 bg-white/30 dark:bg-black/10 rounded-lg text-xs leading-relaxed">
                        {isNorth ? (
                          <p className="text-gray-700 dark:text-gray-300">
                            <strong>Destino:</strong> Indica la dirección de crecimiento espiritual, 
                            las lecciones que vinimos a aprender en esta vida. Representa el camino 
                            hacia adelante, nuestro propósito evolutivo.
                          </p>
                        ) : (
                          <p className="text-gray-700 dark:text-gray-300">
                            <strong>Pasado:</strong> Muestra talentos innatos, patrones kármicos 
                            y habilidades desarrolladas en vidas anteriores. Aquí nos sentimos 
                            cómodos pero no debemos quedarnos estancados.
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Información del eje nodal */}
              <div className="mt-6 p-5 bg-gradient-to-r from-cyan-50 via-purple-50 to-amber-50 dark:from-cyan-900/10 dark:via-purple-900/10 dark:to-amber-900/10 rounded-xl border-2 border-purple-200 dark:border-purple-700">
                <h4 className="text-lg font-bold mb-3 text-center">
                  ☯️ El Eje Kármico
                </h4>
                <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  <p>
                    <strong>Los Nodos Lunares</strong> forman un eje que revela nuestro viaje kármico. 
                    Son puntos matemáticos donde la órbita de la Luna cruza la eclíptica solar.
                  </p>
                  <p>
                    <strong>☊ Nodo Norte (Rahu):</strong> La dirección hacia donde debemos evolucionar, 
                    aunque al principio nos resulte incómodo o desafiante.
                  </p>
                  <p>
                    <strong>☋ Nodo Sur (Ketu):</strong> Representa habilidades y patrones del pasado. 
                    Es nuestra zona de confort que debemos trascender.
                  </p>
                  <p className="text-xs italic text-gray-600 dark:text-gray-400 pt-2">
                    💡 Los nodos siempre están en signos opuestos (180° de separación) y se mueven 
                    en sentido retrógrado, completando un ciclo cada 18.6 años aproximadamente.
                  </p>
                </div>
              </div>
            </AccordionSection>
          )}

          {/* Partes Árabes - FASE 5 */}
          {result.arabicParts && result.arabicParts.length > 0 && (
            <AccordionSection 
              title="Partes Árabes (Lotes)" 
              icon="🌟" 
              count={result.arabicParts.length}
              defaultOpen={false}
              data-chart-section="Partes Árabes"
            >
              {/* Introducción */}
              <div className="mb-6 p-4 bg-gradient-to-r from-amber-50 via-yellow-50 to-orange-50 dark:from-amber-900/20 dark:via-yellow-900/20 dark:to-orange-900/20 rounded-xl border-2 border-amber-300 dark:border-amber-700">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">📜</span>
                  <h4 className="font-bold text-amber-900 dark:text-amber-100">Los Lotes de la Astrología Helenística</h4>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  Puntos matemáticos que sintetizan tres factores astrológicos. Originados en la astrología greco-romana 
                  y perfeccionados por astrólogos árabes medievales (s. VIII-XII).
                </p>
              </div>

              {/* Grid de Partes Árabes Mejorado */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
                {result.arabicParts.map((part, idx) => {
                  // Datos completos para cada Parte Árabe
                  const partData: Record<string, {
                    gradient: string;
                    border: string;
                    textColor: string;
                    icon: string;
                    symbol: string;
                    alternativeNames: string[];
                    formula: string;
                    keywords: string[];
                    tradition: string;
                    interpretation: string;
                  }> = {
                    'fortune': {
                      gradient: 'from-amber-100 via-yellow-100 to-orange-100 dark:from-amber-900/30 dark:via-yellow-900/30 dark:to-orange-900/30',
                      border: 'border-amber-400 dark:border-amber-600',
                      textColor: 'text-amber-700 dark:text-amber-300',
                      icon: '🎯',
                      symbol: '⊕',
                      alternativeNames: ['Pars Fortunae', 'Lote de Fortuna'],
                      formula: 'ASC + Luna - Sol (diurno) | ASC + Sol - Luna (nocturno)',
                      keywords: ['Abundancia material', 'Bienestar', 'Suerte', 'Cuerpo físico', 'Prosperidad'],
                      tradition: 'El más importante de todos los lotes',
                      interpretation: 'Indica dónde encontramos éxito natural, abundancia y flujo favorable. Representa el cuerpo, la salud y los recursos materiales.'
                    },
                    'spirit': {
                      gradient: 'from-blue-100 via-indigo-100 to-violet-100 dark:from-blue-900/30 dark:via-indigo-900/30 dark:to-violet-900/30',
                      border: 'border-blue-400 dark:border-blue-600',
                      textColor: 'text-blue-700 dark:text-blue-300',
                      icon: '✨',
                      symbol: '☉',
                      alternativeNames: ['Pars Spiritus', 'Lote del Espíritu'],
                      formula: 'ASC + Sol - Luna (diurno) | ASC + Luna - Sol (nocturno)',
                      keywords: ['Propósito', 'Vocación', 'Alma', 'Identidad espiritual', 'Ambición'],
                      tradition: 'Complemento solar de la Parte de Fortuna',
                      interpretation: 'Revela nuestro propósito vital, vocación y ambiciones. Representa la mente, el espíritu y las aspiraciones del alma.'
                    },
                    'love': {
                      gradient: 'from-pink-100 via-rose-100 to-red-100 dark:from-pink-900/30 dark:via-rose-900/30 dark:to-red-900/30',
                      border: 'border-pink-400 dark:border-pink-600',
                      textColor: 'text-pink-700 dark:text-pink-300',
                      icon: '💕',
                      symbol: '♡',
                      alternativeNames: ['Pars Veneris', 'Lote de Eros'],
                      formula: 'ASC + Regente 7 - Venus',
                      keywords: ['Romance', 'Pasión', 'Atracción', 'Deseo', 'Relaciones íntimas'],
                      tradition: 'Usado para timing de relaciones',
                      interpretation: 'Señala dónde y cómo experimentamos el amor romántico, la pasión y la atracción magnética hacia otros.'
                    },
                    'destiny': {
                      gradient: 'from-purple-100 via-violet-100 to-fuchsia-100 dark:from-purple-900/30 dark:via-violet-900/30 dark:to-fuchsia-900/30',
                      border: 'border-purple-400 dark:border-purple-600',
                      textColor: 'text-purple-700 dark:text-purple-300',
                      icon: '🎭',
                      symbol: '⟁',
                      alternativeNames: ['Lote del Destino', 'Pars Necessitatis'],
                      formula: 'ASC + Fortuna - Mercurio',
                      keywords: ['Karma', 'Necesidad', 'Destino inevitable', 'Propósito de vida'],
                      tradition: 'Relacionado con el dharma védico',
                      interpretation: 'Muestra el camino que el alma debe recorrer, las lecciones kármicas y el propósito ineludible de esta encarnación.'
                    },
                    'courage': {
                      gradient: 'from-red-100 via-orange-100 to-amber-100 dark:from-red-900/30 dark:via-orange-900/30 dark:to-amber-900/30',
                      border: 'border-red-400 dark:border-red-600',
                      textColor: 'text-red-700 dark:text-red-300',
                      icon: '⚔️',
                      symbol: '♂',
                      alternativeNames: ['Pars Audaciae', 'Lote de Marte'],
                      formula: 'ASC + Fortuna - Marte',
                      keywords: ['Valentía', 'Acción', 'Conflicto', 'Energía guerrera', 'Iniciativa'],
                      tradition: 'Evaluación de la fuerza marcial',
                      interpretation: 'Indica dónde mostramos coraje, cómo enfrentamos conflictos y batallas, y nuestra capacidad de acción decidida.'
                    },
                    'children': {
                      gradient: 'from-green-100 via-emerald-100 to-teal-100 dark:from-green-900/30 dark:via-emerald-900/30 dark:to-teal-900/30',
                      border: 'border-green-400 dark:border-green-600',
                      textColor: 'text-green-700 dark:text-green-300',
                      icon: '👶',
                      symbol: '♃',
                      alternativeNames: ['Pars Filiorum', 'Lote de los Hijos'],
                      formula: 'ASC + Júpiter - Saturno (diurno)',
                      keywords: ['Fertilidad', 'Descendencia', 'Creatividad', 'Legado', 'Hijos'],
                      tradition: 'Usado en astrología predictiva para hijos',
                      interpretation: 'Revela temas relacionados con hijos, fertilidad, creatividad generativa y el legado que dejamos al mundo.'
                    },
                    'commerce': {
                      gradient: 'from-cyan-100 via-teal-100 to-blue-100 dark:from-cyan-900/30 dark:via-teal-900/30 dark:to-blue-900/30',
                      border: 'border-cyan-400 dark:border-cyan-600',
                      textColor: 'text-cyan-700 dark:text-cyan-300',
                      icon: '💰',
                      symbol: '☿',
                      alternativeNames: ['Pars Mercaturae', 'Lote del Comercio'],
                      formula: 'ASC + Fortuna - Mercurio',
                      keywords: ['Negocios', 'Comercio', 'Ganancias', 'Intercambio', 'Habilidad mercantil'],
                      tradition: 'Usado por mercaderes medievales',
                      interpretation: 'Muestra dónde y cómo obtenemos ganancias materiales a través del comercio, negociación y actividades mercuriales.'
                    }
                  };

                  const data = partData[part.type] || {
                    gradient: 'from-gray-100 to-slate-100 dark:from-gray-900/30 dark:to-slate-900/30',
                    border: 'border-gray-400 dark:border-gray-600',
                    textColor: 'text-gray-700 dark:text-gray-300',
                    icon: '🌟',
                    symbol: '⊛',
                    alternativeNames: [part.name],
                    formula: 'Variable',
                    keywords: ['Parte árabe'],
                    tradition: 'Astrología helenística',
                    interpretation: part.description || 'Parte árabe calculada'
                  };

                  return (
                    <div 
                      key={idx} 
                      className={`p-5 bg-gradient-to-br ${data.gradient} rounded-xl border-2 ${data.border} hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-[1.02] relative overflow-hidden`}
                    >
                      {/* Símbolo decorativo de fondo */}
                      <div className="absolute top-2 right-2 text-8xl opacity-10">
                        {data.symbol}
                      </div>

                      {/* Encabezado */}
                      <div className="relative flex items-start gap-3 mb-4">
                        <span className="text-5xl">{data.icon}</span>
                        <div className="flex-1">
                          <h4 className={`text-xl font-bold ${data.textColor} mb-1`}>
                            {part.name}
                          </h4>
                          <div className="text-xs text-gray-600 dark:text-gray-400 space-y-0.5">
                            {data.alternativeNames.map((name, i) => (
                              <div key={i} className="italic">• {name}</div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Información astrológica */}
                      <div className="relative space-y-2 mb-4">
                        <div className="flex justify-between items-center p-2 bg-white/50 dark:bg-black/20 rounded">
                          <span className="text-xs text-gray-600 dark:text-gray-400">Signo:</span>
                          <span className={`font-bold ${data.textColor}`}>{part.sign}</span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2">
                          <div className="p-2 bg-white/50 dark:bg-black/20 rounded">
                            <div className="text-xs text-gray-600 dark:text-gray-400">Grado</div>
                            <div className="font-semibold text-gray-700 dark:text-gray-300">
                              {part.degree.toFixed(2)}°
                            </div>
                          </div>
                          
                          <div className="p-2 bg-white/50 dark:bg-black/20 rounded">
                            <div className="text-xs text-gray-600 dark:text-gray-400">Casa</div>
                            <div className="font-semibold text-gray-700 dark:text-gray-300">
                              {part.house}
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-between items-center p-2 bg-white/50 dark:bg-black/20 rounded text-xs">
                          <span className="text-gray-600 dark:text-gray-400">Longitud:</span>
                          <span className="font-mono text-gray-700 dark:text-gray-300">
                            {part.longitude?.toFixed(4) || 'N/A'}°
                          </span>
                        </div>
                      </div>

                      {/* Keywords */}
                      <div className="relative mb-3">
                        <div className="text-xs text-gray-600 dark:text-gray-400 mb-2 font-semibold">Palabras Clave:</div>
                        <div className="flex flex-wrap gap-1">
                          {data.keywords.map((keyword, i) => (
                            <span 
                              key={i}
                              className={`px-2 py-1 text-xs rounded-full bg-white/60 dark:bg-black/30 ${data.textColor} font-medium`}
                            >
                              {keyword}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Fórmula */}
                      <div className="relative mb-3 p-2 bg-white/40 dark:bg-black/20 rounded border border-gray-300 dark:border-gray-600">
                        <div className="text-xs text-gray-600 dark:text-gray-400 mb-1 font-semibold">Fórmula:</div>
                        <div className="text-xs font-mono text-gray-700 dark:text-gray-300">
                          {data.formula}
                        </div>
                      </div>

                      {/* Tradición e interpretación */}
                      <div className="relative pt-3 border-t border-gray-300 dark:border-gray-600 space-y-2">
                        <div className="text-xs text-gray-700 dark:text-gray-300">
                          <strong className={data.textColor}>Tradición:</strong> {data.tradition}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                          {data.interpretation}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Nota educativa */}
              <div className="mt-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl border border-amber-300 dark:border-amber-700">
                <h5 className="font-bold text-amber-900 dark:text-amber-100 mb-2 flex items-center gap-2">
                  <span>�</span>
                  <span>Sobre las Partes Árabes (Lotes Helenísticos)</span>
                </h5>
                <div className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
                  <p>
                    <strong>Origen:</strong> Aunque llamadas "árabes", estas técnicas provienen de la astrología helenística 
                    (s. I-III d.C.). Los astrólogos árabes medievales (Al-Biruni, Masha'allah) las preservaron y expandieron.
                  </p>
                  <p>
                    <strong>Método:</strong> Se calculan sumando y restando longitudes eclípticas. La fórmula básica es 
                    <em> Lote = ASC + Punto Activo - Punto Pasivo</em>. Algunas fórmulas se invierten en cartas nocturnas.
                  </p>
                  <p>
                    <strong>Uso:</strong> Se analizan por signo, casa y aspectos que reciben. El regente del signo donde 
                    cae el lote es especialmente importante para delinear el tema.
                  </p>
                </div>
              </div>
            </AccordionSection>
          )}

          {/* Análisis de Hemisferios - FASE 6 */}
          {result.hemispheres && (
            <AccordionSection 
              title="Análisis de Hemisferios" 
              icon="🧭" 
              count={4}
              defaultOpen={false}
              data-chart-section="Hemisferios"
            >
              {/* Resumen ejecutivo */}
              <div className="mb-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg border-2 border-indigo-200 dark:border-indigo-700">
                <h4 className="font-bold text-indigo-900 dark:text-indigo-100 mb-2 flex items-center gap-2">
                  <span>🎯</span>
                  Análisis General
                </h4>
                <p className="text-sm text-indigo-800 dark:text-indigo-200 leading-relaxed whitespace-pre-line">
                  {result.hemispheres.summary}
                </p>
              </div>

              {/* Hemisferios Horizontales (Este-Oeste) */}
              <div className="mb-6">
                <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                  <span>⟷</span>
                  Eje Horizontal: Auto-determinación vs Relación
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {/* Oriental */}
                  <div className="p-4 bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-900/30 dark:to-amber-900/30 rounded-lg border-2 border-orange-300 dark:border-orange-700">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-bold text-orange-900 dark:text-orange-100 flex items-center gap-2">
                        <span>🌅</span>
                        {result.hemispheres.horizontalAxis.oriental.name}
                      </h5>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                          {result.hemispheres.horizontalAxis.oriental.planetCount}
                        </div>
                        <div className="text-xs text-orange-700 dark:text-orange-300">
                          {result.hemispheres.horizontalAxis.oriental.percentage.toFixed(0)}%
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-orange-800 dark:text-orange-200 mb-2">
                      {result.hemispheres.horizontalAxis.oriental.description}
                    </p>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {result.hemispheres.horizontalAxis.oriental.planets.map((planet, idx) => (
                        <span key={idx} className="px-2 py-1 bg-orange-200 dark:bg-orange-800 text-orange-900 dark:text-orange-100 text-xs rounded">
                          {planet}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-orange-900 dark:text-orange-100 font-medium">
                      {result.hemispheres.horizontalAxis.oriental.interpretation}
                    </p>
                  </div>

                  {/* Occidental */}
                  <div className="p-4 bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-lg border-2 border-blue-300 dark:border-blue-700">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-bold text-blue-900 dark:text-blue-100 flex items-center gap-2">
                        <span>🌇</span>
                        {result.hemispheres.horizontalAxis.occidental.name}
                      </h5>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                          {result.hemispheres.horizontalAxis.occidental.planetCount}
                        </div>
                        <div className="text-xs text-blue-700 dark:text-blue-300">
                          {result.hemispheres.horizontalAxis.occidental.percentage.toFixed(0)}%
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-blue-800 dark:text-blue-200 mb-2">
                      {result.hemispheres.horizontalAxis.occidental.description}
                    </p>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {result.hemispheres.horizontalAxis.occidental.planets.map((planet, idx) => (
                        <span key={idx} className="px-2 py-1 bg-blue-200 dark:bg-blue-800 text-blue-900 dark:text-blue-100 text-xs rounded">
                          {planet}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-blue-900 dark:text-blue-100 font-medium">
                      {result.hemispheres.horizontalAxis.occidental.interpretation}
                    </p>
                  </div>
                </div>

                {/* Énfasis horizontal */}
                <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg text-center">
                  <span className="font-bold text-gray-900 dark:text-gray-100">
                    Énfasis: {result.hemispheres.horizontalAxis.emphasis === 'oriental' ? '🌅 Oriental (Auto-determinación)' : 
                              result.hemispheres.horizontalAxis.emphasis === 'occidental' ? '🌇 Occidental (Relacional)' : 
                              '⚖️ Equilibrado'}
                  </span>
                </div>
              </div>

              {/* Hemisferios Verticales (Norte-Sur) */}
              <div className="mb-6">
                <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                  <span>⟦</span>
                  Eje Vertical: Vida Privada vs Vida Pública
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {/* Septentrional */}
                  <div className="p-4 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-lg border-2 border-indigo-300 dark:border-indigo-700">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-bold text-indigo-900 dark:text-indigo-100 flex items-center gap-2">
                        <span>🌙</span>
                        {result.hemispheres.verticalAxis.septentrional.name}
                      </h5>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">
                          {result.hemispheres.verticalAxis.septentrional.planetCount}
                        </div>
                        <div className="text-xs text-indigo-700 dark:text-indigo-300">
                          {result.hemispheres.verticalAxis.septentrional.percentage.toFixed(0)}%
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-indigo-800 dark:text-indigo-200 mb-2">
                      {result.hemispheres.verticalAxis.septentrional.description}
                    </p>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {result.hemispheres.verticalAxis.septentrional.planets.map((planet, idx) => (
                        <span key={idx} className="px-2 py-1 bg-indigo-200 dark:bg-indigo-800 text-indigo-900 dark:text-indigo-100 text-xs rounded">
                          {planet}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-indigo-900 dark:text-indigo-100 font-medium">
                      {result.hemispheres.verticalAxis.septentrional.interpretation}
                    </p>
                  </div>

                  {/* Meridional */}
                  <div className="p-4 bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 rounded-lg border-2 border-yellow-300 dark:border-yellow-700">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-bold text-yellow-900 dark:text-yellow-100 flex items-center gap-2">
                        <span>☀️</span>
                        {result.hemispheres.verticalAxis.meridional.name}
                      </h5>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">
                          {result.hemispheres.verticalAxis.meridional.planetCount}
                        </div>
                        <div className="text-xs text-yellow-700 dark:text-yellow-300">
                          {result.hemispheres.verticalAxis.meridional.percentage.toFixed(0)}%
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-yellow-800 dark:text-yellow-200 mb-2">
                      {result.hemispheres.verticalAxis.meridional.description}
                    </p>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {result.hemispheres.verticalAxis.meridional.planets.map((planet, idx) => (
                        <span key={idx} className="px-2 py-1 bg-yellow-200 dark:bg-yellow-800 text-yellow-900 dark:text-yellow-100 text-xs rounded">
                          {planet}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-yellow-900 dark:text-yellow-100 font-medium">
                      {result.hemispheres.verticalAxis.meridional.interpretation}
                    </p>
                  </div>
                </div>

                {/* Énfasis vertical */}
                <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg text-center">
                  <span className="font-bold text-gray-900 dark:text-gray-100">
                    Énfasis: {result.hemispheres.verticalAxis.emphasis === 'septentrional' ? '🌙 Septentrional (Vida Privada)' : 
                              result.hemispheres.verticalAxis.emphasis === 'meridional' ? '☀️ Meridional (Vida Pública)' : 
                              '⚖️ Equilibrado'}
                  </span>
                </div>
              </div>

              {/* Cuadrantes */}
              <div className="mb-4">
                <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                  <span>⊞</span>
                  Distribución por Cuadrantes
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {result.hemispheres.quadrants.map((quadrant, idx) => {
                    const isDOM = result.hemispheres && quadrant.quadrant === result.hemispheres.dominantQuadrant.quadrant;
                    const colors = [
                      'from-red-100 to-orange-100 dark:from-red-900/30 dark:to-orange-900/30 border-red-300 dark:border-red-700',
                      'from-yellow-100 to-amber-100 dark:from-yellow-900/30 dark:to-amber-900/30 border-yellow-300 dark:border-yellow-700',
                      'from-cyan-100 to-blue-100 dark:from-cyan-900/30 dark:to-blue-900/30 border-cyan-300 dark:border-cyan-700',
                      'from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 border-purple-300 dark:border-purple-700'
                    ];
                    return (
                      <div 
                        key={idx} 
                        className={`p-3 bg-gradient-to-br ${colors[idx]} rounded-lg border-2 ${isDOM ? 'ring-4 ring-green-500 dark:ring-green-400' : ''}`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-bold text-gray-900 dark:text-gray-100">
                            {quadrant.name} {isDOM && '👑'}
                          </h5>
                          <div className="text-right">
                            <div className="text-xl font-bold text-gray-900 dark:text-gray-100">
                              {quadrant.planetCount}
                            </div>
                            <div className="text-xs text-gray-700 dark:text-gray-300">
                              {quadrant.percentage.toFixed(0)}%
                            </div>
                          </div>
                        </div>
                        <p className="text-xs text-gray-700 dark:text-gray-300 mb-1">
                          {quadrant.description} • Casas {quadrant.houses.join(', ')}
                        </p>
                        <div className="flex flex-wrap gap-1 mb-2">
                          {quadrant.planets.map((planet, pidx) => (
                            <span key={pidx} className="px-2 py-0.5 bg-white/50 dark:bg-black/30 text-gray-900 dark:text-gray-100 text-xs rounded">
                              {planet}
                            </span>
                          ))}
                        </div>
                        <p className="text-xs text-gray-900 dark:text-gray-100 font-medium">
                          {quadrant.interpretation}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Información adicional */}
              <div className="mt-4 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg border border-indigo-200 dark:border-indigo-700">
                <h4 className="font-bold text-indigo-900 dark:text-indigo-100 mb-2 flex items-center gap-2">
                  <span>📚</span>
                  Sobre el Análisis de Hemisferios
                </h4>
                <p className="text-sm text-indigo-800 dark:text-indigo-200 leading-relaxed">
                  El <strong>Análisis de Hemisferios</strong> examina cómo se distribuyen los planetas en los 4 hemisferios 
                  de la carta natal, revelando orientaciones fundamentales de la personalidad:
                </p>
                <ul className="text-sm text-indigo-800 dark:text-indigo-200 leading-relaxed mt-2 space-y-1 list-disc list-inside">
                  <li><strong>Oriental (Este):</strong> Auto-determinación, independencia, crear tu destino</li>
                  <li><strong>Occidental (Oeste):</strong> Relación con otros, cooperación, destino compartido</li>
                  <li><strong>Septentrional (Norte):</strong> Vida privada, introspección, desarrollo interno</li>
                  <li><strong>Meridional (Sur):</strong> Vida pública, reconocimiento social, proyección externa</li>
                </ul>
              </div>
            </AccordionSection>
          )}

          {/* Casas */}
          <AccordionSection title="Casas" icon="🏠" count={result.houses.length} data-chart-section="Casas">
            {/* Resumen de Casas por Categoría */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
              {/* Casas Angulares */}
              <div className="p-4 bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-xl border-2 border-red-300 dark:border-red-700">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">🔷</span>
                  <h4 className="font-bold text-red-900 dark:text-red-100">Angulares</h4>
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Casas 1, 4, 7, 10</div>
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  Las más poderosas. Acción directa e iniciativas.
                </div>
              </div>

              {/* Casas Sucedentes */}
              <div className="p-4 bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 rounded-xl border-2 border-green-300 dark:border-green-700">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">🔶</span>
                  <h4 className="font-bold text-green-900 dark:text-green-100">Sucedentes</h4>
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Casas 2, 5, 8, 11</div>
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  Consolidan y estabilizan. Recursos y valores.
                </div>
              </div>

              {/* Casas Cadentes */}
              <div className="p-4 bg-gradient-to-br from-blue-50 to-sky-50 dark:from-blue-900/20 dark:to-sky-900/20 rounded-xl border-2 border-blue-300 dark:border-blue-700">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">🔹</span>
                  <h4 className="font-bold text-blue-900 dark:text-blue-100">Cadentes</h4>
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Casas 3, 6, 9, 12</div>
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  Procesan y aprenden. Mental y espiritual.
                </div>
              </div>
            </div>

            {/* Grid de Casas Mejorado */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {result.houses.map((house, idx) => {
                // Determinar categoría de la casa
                const category = [1, 4, 7, 10].includes(house.number) ? 'angular' :
                                [2, 5, 8, 11].includes(house.number) ? 'succedent' : 'cadent';
                
                // Estilos según categoría
                const categoryStyles = {
                  angular: {
                    gradient: 'from-red-100 to-pink-100 dark:from-red-900/30 dark:to-pink-900/30',
                    border: 'border-red-300 dark:border-red-600',
                    icon: '🔷',
                    textColor: 'text-red-700 dark:text-red-300',
                    label: 'Angular',
                    labelBg: 'bg-red-500/20 text-red-700 dark:text-red-300'
                  },
                  succedent: {
                    gradient: 'from-green-100 to-teal-100 dark:from-green-900/30 dark:to-teal-900/30',
                    border: 'border-green-300 dark:border-green-600',
                    icon: '🔶',
                    textColor: 'text-green-700 dark:text-green-300',
                    label: 'Sucedente',
                    labelBg: 'bg-green-500/20 text-green-700 dark:text-green-300'
                  },
                  cadent: {
                    gradient: 'from-blue-100 to-sky-100 dark:from-blue-900/30 dark:to-sky-900/30',
                    border: 'border-blue-300 dark:border-blue-600',
                    icon: '🔹',
                    textColor: 'text-blue-700 dark:text-blue-300',
                    label: 'Cadente',
                    labelBg: 'bg-blue-500/20 text-blue-700 dark:text-blue-300'
                  }
                };

                const style = categoryStyles[category];

                // Nombres de las casas
                const houseNames: Record<number, string> = {
                  1: 'Yo/Identidad',
                  2: 'Recursos',
                  3: 'Comunicación',
                  4: 'Hogar/Raíces',
                  5: 'Creatividad',
                  6: 'Salud/Servicio',
                  7: 'Relaciones',
                  8: 'Transformación',
                  9: 'Filosofía',
                  10: 'Carrera/Estatus',
                  11: 'Comunidad',
                  12: 'Inconsciente'
                };

                return (
                  <div 
                    key={idx} 
                    className={`p-4 bg-gradient-to-br ${style.gradient} rounded-xl border-2 ${style.border} hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-105`}
                  >
                    {/* Encabezado con número y categoría */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-3xl font-black text-gray-800 dark:text-gray-100">
                          {house.number}
                        </span>
                        <span className="text-2xl">{style.icon}</span>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${style.labelBg}`}>
                        {style.label}
                      </span>
                    </div>

                    {/* Nombre de la casa */}
                    <div className="mb-2">
                      <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                        {houseNames[house.number]}
                      </div>
                      <div className={`text-lg font-bold ${style.textColor}`}>
                        {house.sign}
                      </div>
                    </div>

                    {/* Información detallada */}
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400">Cúspide:</span>
                        <span className="font-semibold text-gray-700 dark:text-gray-300">
                          {house.degree.toFixed(2)}°
                        </span>
                      </div>
                      
                      {/* Planetas en esta casa */}
                      {(() => {
                        const planetsInHouse = result.planets.filter(p => p.house === house.number);
                        if (planetsInHouse.length > 0) {
                          // Mapeo de símbolos de planetas
                          const planetSymbols: Record<string, string> = {
                            'Sol': '☉',
                            'Luna': '☽',
                            'Mercurio': '☿',
                            'Venus': '♀',
                            'Marte': '♂',
                            'Júpiter': '♃',
                            'Saturno': '♄',
                            'Urano': '♅',
                            'Neptuno': '♆',
                            'Plutón': '♇'
                          };
                          
                          return (
                            <div className="mt-2 pt-2 border-t border-gray-300 dark:border-gray-600">
                              <div className="text-gray-600 dark:text-gray-400 mb-1">
                                Planetas ({planetsInHouse.length}):
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {planetsInHouse.map((p, i) => (
                                  <span 
                                    key={i}
                                    className="px-1.5 py-0.5 bg-white/50 dark:bg-gray-800/50 rounded text-xs font-medium"
                                    title={`${p.name} en ${p.sign}`}
                                  >
                                    {planetSymbols[p.name] || p.name.charAt(0)}
                                  </span>
                                ))}
                              </div>
                            </div>
                          );
                        }
                        return null;
                      })()}
                    </div>
                  </div>
                );
              })}
            </div>
          </AccordionSection>

          {/* Aspectos */}
          <AccordionSection title="Aspectos" icon="⚡" count={result.aspects?.length || 0} data-chart-section="Aspectos">
            {result.aspects && result.aspects.length > 0 ? (
              <>
                {/* Resumen de aspectos */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                  {/* Aspectos Mayores */}
                  <div className="p-3 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg border-2 border-purple-200 dark:border-purple-700">
                    <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Aspectos Mayores</div>
                    <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                      {result.aspects.filter(a => a.category === 'mayor').length}
                    </div>
                  </div>
                  
                  {/* Aspectos Menores */}
                  <div className="p-3 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-lg border-2 border-amber-200 dark:border-amber-700">
                    <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Aspectos Menores</div>
                    <div className="text-2xl font-bold text-amber-700 dark:text-amber-300">
                      {result.aspects.filter(a => a.category === 'menor').length}
                    </div>
                  </div>
                  
                  {/* Exactitud Promedio */}
                  <div className="p-3 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border-2 border-green-200 dark:border-green-700 col-span-2 md:col-span-1">
                    <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Exactitud Promedio</div>
                    <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                      {result.aspects.length > 0 
                        ? ((result.aspects.reduce((sum, a) => sum + (a.exactness || 0), 0) / result.aspects.length).toFixed(1))
                        : '0'
                      }%
                    </div>
                  </div>
                </div>

                {/* Lista de aspectos */}
                <div className="space-y-2">
                  {result.aspects.map((aspect, idx) => {
                    // Determinar colores según naturaleza
                    let aspectStyles;
                    if (aspect.nature === 'armonico') {
                      aspectStyles = {
                        bg: 'bg-green-50 dark:bg-green-900/20',
                        border: 'border-green-200 dark:border-green-700',
                        text: 'text-green-600 dark:text-green-400',
                        badge: 'bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-300'
                      };
                    } else if (aspect.nature === 'tenso') {
                      aspectStyles = {
                        bg: 'bg-red-50 dark:bg-red-900/20',
                        border: 'border-red-200 dark:border-red-700',
                        text: 'text-red-600 dark:text-red-400',
                        badge: 'bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-300'
                      };
                    } else {
                      aspectStyles = {
                        bg: 'bg-purple-50 dark:bg-purple-900/20',
                        border: 'border-purple-200 dark:border-purple-700',
                        text: 'text-purple-600 dark:text-purple-400',
                        badge: 'bg-purple-100 dark:bg-purple-800 text-purple-700 dark:text-purple-300'
                      };
                    }
                    
                    return (
                      <div 
                        key={idx} 
                        className={`${aspectStyles.bg} rounded-lg p-3 border-2 ${aspectStyles.border} hover:shadow-lg transition-all hover:scale-[1.01]`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                          {/* Planetas y símbolo */}
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <span className="text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 truncate">
                              {aspect.planet1}
                            </span>
                            <span className={`text-lg sm:text-xl font-black ${aspectStyles.text} shrink-0`}>
                              {aspect.symbol || '•'}
                            </span>
                            <span className="text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 truncate">
                              {aspect.planet2}
                            </span>
                          </div>
                          
                          {/* Info del aspecto */}
                          <div className="flex items-center gap-2 text-xs flex-wrap">
                            <span className={`px-2 py-1 ${aspectStyles.badge} rounded-full font-bold whitespace-nowrap`}>
                              {aspect.type}
                            </span>
                            
                            {/* Categoría */}
                            {aspect.category && (
                              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full font-semibold">
                                {aspect.category === 'mayor' ? 'Mayor' : 'Menor'}
                              </span>
                            )}
                            
                            {/* Orbe */}
                            <span className="text-gray-600 dark:text-gray-400 font-mono font-bold">
                              {aspect.orb.toFixed(1)}°
                            </span>
                            
                            {/* Exactitud */}
                            {aspect.exactness !== undefined && (
                              <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full font-bold">
                                {aspect.exactness.toFixed(0)}%
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Leyenda */}
                <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900/30 rounded-lg border border-gray-200 dark:border-gray-700">
                  <h4 className="text-sm font-bold mb-2">🔑 Leyenda de Aspectos</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                    <div className="flex items-center gap-1">
                      <span className="text-green-600 dark:text-green-400">●</span>
                      <span>Armónico: Facilita</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-red-600 dark:text-red-400">●</span>
                      <span>Tenso: Desafío</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-purple-600 dark:text-purple-400">●</span>
                      <span>Neutral: Fusión</span>
                    </div>
                    <div className="text-gray-600 dark:text-gray-400">
                      <strong>Quincunx (⚻):</strong> Ajuste 150°
                    </div>
                    <div className="text-gray-600 dark:text-gray-400 col-span-2">
                      <strong>Exactitud:</strong> Qué tan preciso es el aspecto (100% = exacto)
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center py-4">
                No se encontraron aspectos en esta carta.
              </p>
            )}
          </AccordionSection>

          {/* SECCIONES ESTADÍSTICAS */}
          {statistics && (
            <>
              {/* 1. MODALIDADES (Cualidades) */}
              <AccordionSection title="Modalidades" icon="⚡" count={3} defaultOpen={false} data-chart-section="Modalidades">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  <StatCard
                    label="Cardinal"
                    count={statistics.modalities.cardinal.count}
                    percentage={statistics.modalities.cardinal.percentage}
                    color="orange"
                    icon="🔥"
                    items={statistics.modalities.cardinal.signs}
                  />
                  <StatCard
                    label="Fijo"
                    count={statistics.modalities.fixed.count}
                    percentage={statistics.modalities.fixed.percentage}
                    color="yellow"
                    icon="🌿"
                    items={statistics.modalities.fixed.signs}
                  />
                  <StatCard
                    label="Mutable"
                    count={statistics.modalities.mutable.count}
                    percentage={statistics.modalities.mutable.percentage}
                    color="cyan"
                    icon="💨"
                    items={statistics.modalities.mutable.signs}
                  />
                </div>
                <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  <p><strong>Cardinal:</strong> Iniciativa, liderazgo, acción directa (Aries, Cáncer, Libra, Capricornio)</p>
                  <p><strong>Fijo:</strong> Estabilidad, determinación, resistencia al cambio (Tauro, Leo, Escorpio, Acuario)</p>
                  <p><strong>Mutable:</strong> Adaptabilidad, flexibilidad, versatilidad (Géminis, Virgo, Sagitario, Piscis)</p>
                </div>
              </AccordionSection>

              {/* 2. ELEMENTOS */}
              <AccordionSection title="Elementos" icon="🌍" count={4} defaultOpen={false} data-chart-section="Elementos">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  <StatCard
                    label="Fuego"
                    count={statistics.elements.fire.count}
                    percentage={statistics.elements.fire.percentage}
                    color="red"
                    icon="🔥"
                    items={statistics.elements.fire.signs}
                  />
                  <StatCard
                    label="Tierra"
                    count={statistics.elements.earth.count}
                    percentage={statistics.elements.earth.percentage}
                    color="yellow"
                    icon="🌿"
                    items={statistics.elements.earth.signs}
                  />
                  <StatCard
                    label="Aire"
                    count={statistics.elements.air.count}
                    percentage={statistics.elements.air.percentage}
                    color="cyan"
                    icon="💨"
                    items={statistics.elements.air.signs}
                  />
                  <StatCard
                    label="Agua"
                    count={statistics.elements.water.count}
                    percentage={statistics.elements.water.percentage}
                    color="indigo"
                    icon="💧"
                    items={statistics.elements.water.signs}
                  />
                </div>
                <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  <p><strong>Fuego:</strong> Energía, pasión, creatividad (Aries, Leo, Sagitario)</p>
                  <p><strong>Tierra:</strong> Practicidad, materialismo, estabilidad (Tauro, Virgo, Capricornio)</p>
                  <p><strong>Aire:</strong> Comunicación, pensamiento, socialización (Géminis, Libra, Acuario)</p>
                  <p><strong>Agua:</strong> Emociones, intuición, sensibilidad (Cáncer, Escorpio, Piscis)</p>
                </div>
              </AccordionSection>

              {/* 3. POLARIDADES */}
              <AccordionSection title="Polaridades" icon="☯️" count={2} defaultOpen={false} data-chart-section="Polaridades">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <StatCard
                    label="Masculino"
                    count={statistics.polarities.masculine.count}
                    percentage={statistics.polarities.masculine.percentage}
                    color="yellow"
                    icon="♂️"
                    items={statistics.polarities.masculine.signs}
                  />
                  <StatCard
                    label="Femenino"
                    count={statistics.polarities.feminine.count}
                    percentage={statistics.polarities.feminine.percentage}
                    color="purple"
                    icon="♀️"
                    items={statistics.polarities.feminine.signs}
                  />
                </div>
                <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  <p><strong>Masculino (Yang):</strong> Energía extrovertida, activa, expresiva (Fuego + Aire)</p>
                  <p><strong>Femenino (Yin):</strong> Energía introvertida, receptiva, reflexiva (Tierra + Agua)</p>
                </div>
              </AccordionSection>

              {/* 4. CUADRANTES */}
              <AccordionSection title="Cuadrantes" icon="🧭" count={4} defaultOpen={false} data-chart-section="Cuadrantes">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  <StatCard
                    label="Cuadrante I"
                    count={statistics.quadrants.first.count}
                    percentage={statistics.quadrants.first.percentage}
                    color="orange"
                    icon="↗️"
                    items={statistics.quadrants.first.houses.map(h => `Casa ${h}`)}
                    compact
                  />
                  <StatCard
                    label="Cuadrante II"
                    count={statistics.quadrants.second.count}
                    percentage={statistics.quadrants.second.percentage}
                    color="yellow"
                    icon="↖️"
                    items={statistics.quadrants.second.houses.map(h => `Casa ${h}`)}
                    compact
                  />
                  <StatCard
                    label="Cuadrante III"
                    count={statistics.quadrants.third.count}
                    percentage={statistics.quadrants.third.percentage}
                    color="cyan"
                    icon="↙️"
                    items={statistics.quadrants.third.houses.map(h => `Casa ${h}`)}
                    compact
                  />
                  <StatCard
                    label="Cuadrante IV"
                    count={statistics.quadrants.fourth.count}
                    percentage={statistics.quadrants.fourth.percentage}
                    color="pink"
                    icon="↘️"
                    items={statistics.quadrants.fourth.houses.map(h => `Casa ${h}`)}
                    compact
                  />
                </div>
                <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  <p><strong>Cuadrante I (Casas 1-3):</strong> Yo personal, identidad, comunicación inmediata</p>
                  <p><strong>Cuadrante II (Casas 4-6):</strong> Seguridad personal, hogar, trabajo, servicio</p>
                  <p><strong>Cuadrante III (Casas 7-9):</strong> Relaciones, sociedad, expansión mental</p>
                  <p><strong>Cuadrante IV (Casas 10-12):</strong> Propósito social, carrera, transcendencia</p>
                </div>
              </AccordionSection>
            </>
          )}
        </div>
      )}
    </div>
  );
}
