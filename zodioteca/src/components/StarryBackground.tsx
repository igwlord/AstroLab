import React from 'react';

/**
 * Componente de fondo con estrellas sutiles y gradiente suave
 * Diseñado para ser usado en toda la aplicación sin llamar demasiado la atención
 */
const StarryBackground: React.FC = () => {
  return (
    <>
      {/* Fondo sutil con gradiente suave de violetas a azules */}
      <div className="fixed inset-0 bg-gradient-to-br from-violet-950/95 via-indigo-900/90 to-blue-950/95 -z-10"></div>
      
      {/* Capa de estrellas sutiles */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        {/* Estrellas doradas muy sutiles - Fila superior */}
        <div className="absolute top-[8%] left-[12%] w-0.5 h-0.5 bg-amber-300/30 rounded-full"></div>
        <div className="absolute top-[15%] left-[25%] w-1 h-1 bg-amber-200/20 rounded-full animate-pulse" style={{ animationDuration: '3s' }}></div>
        <div className="absolute top-[22%] left-[45%] w-0.5 h-0.5 bg-yellow-200/25 rounded-full"></div>
        <div className="absolute top-[18%] left-[78%] w-1 h-1 bg-amber-300/20 rounded-full animate-pulse" style={{ animationDuration: '4s' }}></div>
        <div className="absolute top-[32%] left-[88%] w-0.5 h-0.5 bg-yellow-100/30 rounded-full"></div>
        
        {/* Estrellas doradas - Fila media */}
        <div className="absolute top-[42%] left-[8%] w-1 h-1 bg-amber-200/25 rounded-full animate-pulse" style={{ animationDuration: '5s' }}></div>
        <div className="absolute top-[55%] left-[18%] w-0.5 h-0.5 bg-yellow-300/20 rounded-full"></div>
        <div className="absolute top-[48%] left-[65%] w-1 h-1 bg-amber-300/30 rounded-full animate-pulse" style={{ animationDuration: '3.5s' }}></div>
        <div className="absolute top-[62%] left-[82%] w-0.5 h-0.5 bg-yellow-200/25 rounded-full"></div>
        
        {/* Estrellas doradas - Fila inferior */}
        <div className="absolute top-[72%] left-[15%] w-0.5 h-0.5 bg-amber-200/20 rounded-full"></div>
        <div className="absolute top-[78%] left-[32%] w-1 h-1 bg-yellow-300/25 rounded-full animate-pulse" style={{ animationDuration: '4.5s' }}></div>
        <div className="absolute top-[85%] left-[55%] w-0.5 h-0.5 bg-amber-300/30 rounded-full"></div>
        <div className="absolute top-[88%] left-[72%] w-1 h-1 bg-yellow-100/20 rounded-full animate-pulse" style={{ animationDuration: '3s' }}></div>
        <div className="absolute top-[82%] left-[90%] w-0.5 h-0.5 bg-amber-200/25 rounded-full"></div>
        
        {/* Estrellas blancas muy sutiles - Dispersas */}
        <div className="absolute top-[12%] left-[35%] w-0.5 h-0.5 bg-white/15 rounded-full"></div>
        <div className="absolute top-[28%] left-[58%] w-1 h-1 bg-white/10 rounded-full animate-pulse" style={{ animationDuration: '6s' }}></div>
        <div className="absolute top-[38%] left-[28%] w-0.5 h-0.5 bg-white/12 rounded-full"></div>
        <div className="absolute top-[45%] left-[92%] w-1 h-1 bg-white/15 rounded-full animate-pulse" style={{ animationDuration: '5s' }}></div>
        
        <div className="absolute top-[58%] left-[42%] w-0.5 h-0.5 bg-white/10 rounded-full"></div>
        <div className="absolute top-[68%] left-[68%] w-1 h-1 bg-white/15 rounded-full animate-pulse" style={{ animationDuration: '4s' }}></div>
        <div className="absolute top-[75%] left-[48%] w-0.5 h-0.5 bg-white/12 rounded-full"></div>
        <div className="absolute top-[92%] left-[22%] w-1 h-1 bg-white/10 rounded-full animate-pulse" style={{ animationDuration: '5.5s' }}></div>
      </div>
    </>
  );
};

export default StarryBackground;
