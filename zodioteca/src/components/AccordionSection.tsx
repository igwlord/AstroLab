import { useState, useRef } from 'react';
import type { ReactNode } from 'react';

interface AccordionSectionProps {
  title: string;
  icon: string;
  count?: number;
  children: ReactNode;
  defaultOpen?: boolean;
  'data-chart-section'?: string; // Para filtrado de secciones
  sectionId?: string; // ID único para tracking de progreso
  onRead?: (sectionId: string) => void; // Callback cuando se lee
  isRead?: boolean; // Si ya fue leída
}

export default function AccordionSection({ 
  title, 
  icon, 
  count, 
  children, 
  defaultOpen = false, 
  'data-chart-section': dataChartSection,
  sectionId,
  onRead,
  isRead = false
}: AccordionSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleToggle = () => {
    if (!isOpen && buttonRef.current) {
      // ANTES de abrir, verificar si está muy arriba
      const rect = buttonRef.current.getBoundingClientRect();
      const navbarHeight = 100;
      
      // Marcar como leída cuando se abre
      if (sectionId && onRead) {
        onRead(sectionId);
      }
      
      // Si está muy cerca del navbar, hacer scroll PRIMERO
      if (rect.top < navbarHeight + 50) {
        buttonRef.current.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start',
          inline: 'nearest'
        });
        
        // Usar requestAnimationFrame para mejor performance en móviles
        requestAnimationFrame(() => {
          setTimeout(() => {
            setIsOpen(true);
          }, 350);
        });
      } else {
        // Si hay espacio suficiente, abrir directamente
        requestAnimationFrame(() => {
          setIsOpen(true);
        });
      }
    } else {
      // Si está cerrando, cerrar directamente
      setIsOpen(false);
    }
  };

  // ⚠️ ELIMINADO: Scroll lock que causaba problemas
  // El acordeón ahora se expande inline sin bloquear el scroll de la página
  // Esto permite una mejor experiencia de usuario y navegación fluida

  return (
    <div 
      className="bg-white dark:bg-gray-900 rounded-lg sm:rounded-xl md:rounded-2xl shadow-lg border border-purple-100 dark:border-purple-700 overflow-hidden"
      data-chart-section={dataChartSection}
    >
      <button
        ref={buttonRef}
        onClick={handleToggle}
        className={`w-full flex items-center justify-between p-3 sm:p-4 md:p-6 transition-colors duration-200 ${
          isOpen 
            ? 'bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-900/40 dark:to-cyan-900/40' 
            : 'bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 hover:from-purple-100 hover:to-indigo-100 dark:hover:bg-purple-900/20'
        }`}
        style={{
          touchAction: 'manipulation', // Elimina delay de 300ms en móviles
          WebkitTapHighlightColor: 'transparent', // Elimina highlight azul en móviles
          transform: 'translate3d(0, 0, 0)' // GPU acceleration
        }}
      >
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="text-xl sm:text-2xl md:text-3xl">{icon}</span>
          <h3 className="text-base sm:text-lg md:text-2xl font-bold text-gray-800 dark:text-purple-100">
            {title}
          </h3>
          {count !== undefined && (
            <span className="text-xs sm:text-sm px-2 py-0.5 sm:px-2.5 sm:py-1 bg-purple-200 dark:bg-purple-800 text-purple-800 dark:text-purple-200 rounded-full font-semibold">
              {count}
            </span>
          )}
          {/* Indicador de lectura */}
          {isRead && (
            <span className="ml-auto flex items-center gap-1 text-xs sm:text-sm text-green-600 dark:text-green-400 font-medium">
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="hidden sm:inline">Leída</span>
            </span>
          )}
        </div>
        <svg
          className={`w-5 h-5 sm:w-6 sm:h-6 text-purple-600 dark:text-purple-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div 
          className="p-3 sm:p-4 md:p-6 border-t border-purple-100 dark:border-purple-700 bg-white dark:bg-gray-900"
        >
          {children}
        </div>
      )}
    </div>
  );
}
