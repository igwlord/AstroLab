import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import type { ChartWithStatus } from './chartStorage';

/**
 * Servicio para exportar cartas natales a PDF
 */

interface ExportOptions {
  filename?: string;
  quality?: number; // 0-1, calidad de las imágenes
  includeAllTabs?: boolean;
}

/**
 * Captura un elemento HTML como imagen
 */
async function captureElement(element: HTMLElement, quality: number = 0.95): Promise<string> {
  const canvas = await html2canvas(element, {
    scale: 2, // Mayor resolución
    useCORS: true,
    logging: false,
    backgroundColor: '#ffffff',
  });
  
  return canvas.toDataURL('image/png', quality);
}

/**
 * Exporta una carta natal a PDF con todas las tabs
 */
export async function exportChartToPDF(
  chart: ChartWithStatus,
  options: ExportOptions = {}
): Promise<void> {
  const {
    filename = `carta-natal-${chart.data.personName.replace(/\s+/g, '-').toLowerCase()}.pdf`,
    includeAllTabs = true,
  } = options;

  try {
    // Crear PDF en orientación portrait, tamaño A4
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 15;

    let currentY = margin;

    // === PÁGINA 1: PORTADA ===
    
    // Título principal
    pdf.setFontSize(24);
    pdf.setTextColor(103, 58, 183); // Purple
    pdf.text('CARTA NATAL', pageWidth / 2, currentY, { align: 'center' });
    currentY += 12;

    // Nombre de la persona
    pdf.setFontSize(20);
    pdf.setTextColor(0, 0, 0);
    pdf.text(chart.data.personName, pageWidth / 2, currentY, { align: 'center' });
    currentY += 15;

    // Datos de nacimiento
    pdf.setFontSize(11);
    pdf.setTextColor(80, 80, 80);
    
    const [year, month, day] = chart.data.birthData.date.split('-').map(Number);
    const localDate = new Date(year, month - 1, day);
    const formattedDate = localDate.toLocaleDateString('es-ES', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    
    pdf.text(`📅 Fecha: ${formattedDate}`, pageWidth / 2, currentY, { align: 'center' });
    currentY += 6;
    pdf.text(`🕐 Hora: ${chart.data.birthData.time}`, pageWidth / 2, currentY, { align: 'center' });
    currentY += 6;
    pdf.text(`📍 Lugar: ${chart.data.birthData.location || 'Sin ubicación'}`, pageWidth / 2, currentY, { align: 'center' });
    currentY += 10;

    // Línea separadora
    pdf.setDrawColor(200, 200, 200);
    pdf.line(margin, currentY, pageWidth - margin, currentY);
    currentY += 15;

    // === RESUMEN RÁPIDO ===
    pdf.setFontSize(14);
    pdf.setTextColor(103, 58, 183);
    pdf.text('✨ Resumen de tu Carta', margin, currentY);
    currentY += 8;

    // Trio Principal
    pdf.setFontSize(10);
    pdf.setTextColor(0, 0, 0);
    
    const sol = chart.data.planets.find((p: {name?: string}) => p.name === 'Sol');
    const luna = chart.data.planets.find((p: {name?: string}) => p.name === 'Luna');
    const ascendente = chart.data.houses?.[0];

    if (sol) {
      pdf.text(`☀️ Sol en ${sol.sign} - Casa ${sol.house}`, margin + 5, currentY);
      currentY += 6;
    }
    if (luna) {
      pdf.text(`🌙 Luna en ${luna.sign} - Casa ${luna.house}`, margin + 5, currentY);
      currentY += 6;
    }
    if (ascendente) {
      pdf.text(`⬆️ Ascendente en ${ascendente.sign || 'N/A'}`, margin + 5, currentY);
      currentY += 6;
    }

    currentY += 8;

    // Estadísticas
    pdf.setFontSize(10);
    pdf.text(`🪐 Planetas: ${chart.data.planets.length}`, margin + 5, currentY);
    currentY += 6;
    pdf.text(`⚡ Aspectos: ${chart.data.aspects?.length || 0}`, margin + 5, currentY);
    currentY += 6;
    pdf.text(`🏠 Sistema de Casas: Placidus`, margin + 5, currentY);
    currentY += 15;

    // Footer de portada
    pdf.setFontSize(8);
    pdf.setTextColor(150, 150, 150);
    const generatedText = `Generado el ${new Date().toLocaleDateString('es-ES')} • AstroLab`;
    pdf.text(generatedText, pageWidth / 2, pageHeight - 15, { align: 'center' });

    // === PÁGINAS SIGUIENTES: CAPTURAS DE TABS ===
    if (includeAllTabs) {
      // Aquí se capturarían las tabs si están disponibles en el DOM
      // Por ahora, agregamos una nota indicando que se pueden agregar más páginas
      
      pdf.addPage();
      currentY = margin;
      
      pdf.setFontSize(16);
      pdf.setTextColor(103, 58, 183);
      pdf.text('📊 Análisis Detallado', margin, currentY);
      currentY += 10;

      pdf.setFontSize(10);
      pdf.setTextColor(0, 0, 0);
      pdf.text('Este PDF contiene un resumen de tu carta natal.', margin, currentY);
      currentY += 6;
      pdf.text('Para ver el análisis completo con gráficos interactivos,', margin, currentY);
      currentY += 6;
      pdf.text('visita la aplicación web de AstroLab.', margin, currentY);
      currentY += 12;

      // Lista de secciones disponibles
      pdf.setFontSize(11);
      pdf.setTextColor(80, 80, 80);
      const sections = [
        '🎯 Carta Natal - Rueda astrológica completa',
        '⚡ Aspectos - Tabla detallada de aspectos planetarios',
        '📊 Forma - Análisis de distribución planetaria',
        '🔭 Posiciones - Posiciones exactas de planetas y puntos',
        '👑 Dominancias - Elementos, modalidades y polaridades',
        '⚖️ Polarizaciones - Energías concentradas y áreas de maestría'
      ];

      sections.forEach(section => {
        pdf.text(section, margin + 5, currentY);
        currentY += 7;
      });
    }

    // Guardar el PDF
    pdf.save(filename);
    
    console.log(`✅ PDF exportado exitosamente: ${filename}`);
  } catch (error) {
    console.error('❌ Error al exportar PDF:', error);
    throw new Error('No se pudo generar el PDF. Por favor, intenta de nuevo.');
  }
}

/**
 * Exporta solo la rueda natal a PDF (versión rápida)
 */
export async function exportWheelToPDF(
  chart: ChartWithStatus,
  wheelElement: HTMLElement
): Promise<void> {
  try {
    const filename = `rueda-natal-${chart.data.personName.replace(/\s+/g, '-').toLowerCase()}.pdf`;
    
    // Capturar la rueda
    const wheelImage = await captureElement(wheelElement, 0.95);
    
    // Crear PDF cuadrado para la rueda
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 10;

    // Título
    pdf.setFontSize(16);
    pdf.setTextColor(103, 58, 183);
    pdf.text(`Carta Natal - ${chart.data.personName}`, pageWidth / 2, margin + 5, { align: 'center' });

    // Agregar imagen de la rueda
    const imgSize = Math.min(pageWidth - (margin * 2), pageHeight - 30);
    const imgX = (pageWidth - imgSize) / 2;
    const imgY = margin + 12;
    
    pdf.addImage(wheelImage, 'PNG', imgX, imgY, imgSize, imgSize);

    // Guardar
    pdf.save(filename);
    
    console.log(`✅ Rueda exportada a PDF: ${filename}`);
  } catch (error) {
    console.error('❌ Error al exportar rueda:', error);
    throw new Error('No se pudo generar el PDF de la rueda.');
  }
}
