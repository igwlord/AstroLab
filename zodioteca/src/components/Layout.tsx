import Navbar from './Navbar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 dark:from-gray-900 dark:to-purple-950 overflow-x-hidden">
      <Navbar />
      <main className="w-full px-2 sm:px-4 md:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;