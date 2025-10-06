import Navbar from './Navbar';
import StarryBackground from './StarryBackground';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen relative overflow-x-hidden">
      {/* Fondo de estrellas sutil en toda la aplicación */}
      <StarryBackground />
      
      {/* Navbar sobre el fondo */}
      <Navbar />
      
      {/* Contenido principal */}
      <main className="relative z-10 w-full px-2 sm:px-4 md:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;