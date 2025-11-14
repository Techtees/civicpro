import { ReactNode, useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Landmark } from "lucide-react";

interface MainLayoutProps {
  children: ReactNode;
  title?: string;
}

const MainLayout = ({ children, title = "IslandPulse" }: MainLayoutProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [location] = useLocation();

  const isActive = (path: string) => {
    return location === path;
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Navbar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex-shrink-0 flex items-center">
                <Landmark className="h-6 w-6 text-primary-600 mr-2" />
                <span className="text-xl font-semibold text-gray-900">CivicPro</span>
              </Link>
              <div className="hidden md:ml-6 md:flex md:space-x-6">
                <Link href="/" className={`px-3 py-2 text-sm font-medium ${isActive('/') ? 'text-gray-900 border-b-2 border-primary-600' : 'text-gray-500 hover:text-gray-900 hover:border-b-2 hover:border-primary-500 transition'}`}>
                  Home
                </Link>
                <Link href="/directory" className={`px-3 py-2 text-sm font-medium ${isActive('/directory') ? 'text-gray-900 border-b-2 border-primary-600' : 'text-gray-500 hover:text-gray-900 hover:border-b-2 hover:border-primary-500 transition'}`}>
                  Directory
                </Link>
                <Link href="/compare" className={`px-3 py-2 text-sm font-medium ${isActive('/compare') ? 'text-gray-900 border-b-2 border-primary-600' : 'text-gray-500 hover:text-gray-900 hover:border-b-2 hover:border-primary-500 transition'}`}>
                  Compare
                </Link>
              </div>
            </div>
            <div className="flex items-center">
              <div className="hidden md:ml-4 md:flex-shrink-0 md:flex md:items-center">
                <Link href="/admin/login" className="ml-3 px-4 py-2 text-sm font-medium text-primary-600 border border-primary-600 rounded-md hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition">
                  Sign In
                </Link>
              </div>
              <div className="flex items-center md:hidden">
                <button
                  type="button"
                  className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link href="/" className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/') ? 'text-primary-600 bg-primary-50' : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'}`}>
                Home
              </Link>
              <Link href="/directory" className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/directory') ? 'text-primary-600 bg-primary-50' : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'}`}>
                Directory
              </Link>
              <Link href="/compare" className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/compare') ? 'text-primary-600 bg-primary-50' : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'}`}>
                Compare
              </Link>
              <Link href="/admin/login" className="block px-3 py-2 rounded-md text-base font-medium text-primary-600 hover:bg-primary-50 hover:text-primary-700">
                Sign In
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Main content */}
      <main>
        {title && (
          <header className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
              <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            </div>
          </header>
        )}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <Landmark className="h-6 w-6 text-primary-600 mr-2" />
              <span className="text-lg font-semibold text-gray-900">CivicPro</span>
            </div>
            <div className="text-sm text-gray-500">
              © {new Date().getFullYear()} CivicPro. Transparency in politics.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
