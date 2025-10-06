import Navbar from './Navbar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 overflow-x-hidden">
      <Navbar />
      <main className="w-full">
        {children}
      </main>
    </div>
  );
};

export default Layout;