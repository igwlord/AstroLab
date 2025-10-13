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

      {/* Navbar original */}
      <Navbar />

      {/* Contenido principal */}
      <main className="relative z-10 w-full">
        {children}
      </main>
    </div>
  );
};

export default Layout;