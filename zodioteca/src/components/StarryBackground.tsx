import React from 'react';
import { useThemeStore } from '../store/useTheme';

/**
 * Componente de fondo con estrellas sutiles y gradiente suave
 * Diseñado para ser usado en toda la aplicación sin llamar demasiado la atención
 * Soporta modo claro con paleta pastel (durazno, verde agua, magenta)
 */
const StarryBackground: React.FC = () => {
  const { isDark } = useThemeStore();
  
  return (
    <>
      {/* Fondo sutil con gradiente - modo oscuro (violeta a azul) / modo claro (pastel durazno a magenta) */}
      <div className={`fixed inset-0 -z-10 bg-gradient-to-br ${
        isDark 
          ? 'from-violet-950/95 via-indigo-900/90 to-blue-950/95' 
          : 'from-[#FFE5D9] via-[#D4F1F4] to-[#F8E6F1]'
      }`}></div>
      
      {/* Capa de estrellas sutiles - adaptadas a modo claro/oscuro */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        {/* Estrellas doradas muy sutiles - Fila superior */}
        <div className={`absolute top-[8%] left-[12%] w-0.5 h-0.5 rounded-full ${isDark ? 'bg-amber-300/30' : 'bg-amber-500/40'}`}></div>
        <div className={`absolute top-[15%] left-[25%] w-1 h-1 rounded-full animate-pulse ${isDark ? 'bg-amber-200/20' : 'bg-amber-400/50'}`} style={{ animationDuration: '3s' }}></div>
        <div className={`absolute top-[22%] left-[45%] w-0.5 h-0.5 rounded-full ${isDark ? 'bg-yellow-200/25' : 'bg-yellow-500/45'}`}></div>
        <div className={`absolute top-[18%] left-[78%] w-1 h-1 rounded-full animate-pulse ${isDark ? 'bg-amber-300/20' : 'bg-amber-500/50'}`} style={{ animationDuration: '4s' }}></div>
        <div className={`absolute top-[32%] left-[88%] w-0.5 h-0.5 rounded-full ${isDark ? 'bg-yellow-100/30' : 'bg-yellow-400/40'}`}></div>
        
        {/* Estrellas doradas - Fila media */}
        <div className={`absolute top-[42%] left-[8%] w-1 h-1 rounded-full animate-pulse ${isDark ? 'bg-amber-200/25' : 'bg-amber-400/50'}`} style={{ animationDuration: '5s' }}></div>
        <div className={`absolute top-[55%] left-[18%] w-0.5 h-0.5 rounded-full ${isDark ? 'bg-yellow-300/20' : 'bg-yellow-500/45'}`}></div>
        <div className={`absolute top-[48%] left-[65%] w-1 h-1 rounded-full animate-pulse ${isDark ? 'bg-amber-300/30' : 'bg-amber-500/55'}`} style={{ animationDuration: '3.5s' }}></div>
        <div className={`absolute top-[62%] left-[82%] w-0.5 h-0.5 rounded-full ${isDark ? 'bg-yellow-200/25' : 'bg-yellow-400/40'}`}></div>
        
        {/* Estrellas doradas - Fila inferior */}
        <div className={`absolute top-[72%] left-[15%] w-0.5 h-0.5 rounded-full ${isDark ? 'bg-amber-200/20' : 'bg-amber-400/45'}`}></div>
        <div className={`absolute top-[78%] left-[32%] w-1 h-1 rounded-full animate-pulse ${isDark ? 'bg-yellow-300/25' : 'bg-yellow-500/50'}`} style={{ animationDuration: '4.5s' }}></div>
        <div className={`absolute top-[85%] left-[55%] w-0.5 h-0.5 rounded-full ${isDark ? 'bg-amber-300/30' : 'bg-amber-500/50'}`}></div>
        <div className={`absolute top-[88%] left-[72%] w-1 h-1 rounded-full animate-pulse ${isDark ? 'bg-yellow-100/20' : 'bg-yellow-400/45'}`} style={{ animationDuration: '3s' }}></div>
        <div className={`absolute top-[82%] left-[90%] w-0.5 h-0.5 rounded-full ${isDark ? 'bg-amber-200/25' : 'bg-amber-400/50'}`}></div>
        
        {/* Estrellas sutiles dispersas - En modo claro son más visibles */}
        <div className={`absolute top-[12%] left-[35%] w-0.5 h-0.5 rounded-full ${isDark ? 'bg-white/15' : 'bg-purple-400/30'}`}></div>
        <div className={`absolute top-[28%] left-[58%] w-1 h-1 rounded-full animate-pulse ${isDark ? 'bg-white/10' : 'bg-purple-300/35'}`} style={{ animationDuration: '6s' }}></div>
        <div className={`absolute top-[38%] left-[28%] w-0.5 h-0.5 rounded-full ${isDark ? 'bg-white/12' : 'bg-pink-400/30'}`}></div>
        <div className={`absolute top-[45%] left-[92%] w-1 h-1 rounded-full animate-pulse ${isDark ? 'bg-white/15' : 'bg-purple-400/35'}`} style={{ animationDuration: '5s' }}></div>
        
        <div className={`absolute top-[58%] left-[42%] w-0.5 h-0.5 rounded-full ${isDark ? 'bg-white/10' : 'bg-pink-300/30'}`}></div>
        <div className={`absolute top-[68%] left-[68%] w-1 h-1 rounded-full animate-pulse ${isDark ? 'bg-white/15' : 'bg-purple-300/35'}`} style={{ animationDuration: '4s' }}></div>
        <div className={`absolute top-[75%] left-[48%] w-0.5 h-0.5 rounded-full ${isDark ? 'bg-white/12' : 'bg-pink-400/30'}`}></div>
        <div className={`absolute top-[92%] left-[22%] w-1 h-1 rounded-full animate-pulse ${isDark ? 'bg-white/10' : 'bg-purple-400/35'}`} style={{ animationDuration: '5.5s' }}></div>
      </div>
    </>
  );
};

export default StarryBackground;
