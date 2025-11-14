import { ReactNode, useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Landmark, Users, BarChart3, Home as HomeIcon, Shield } from "lucide-react";

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-civic-50/30 to-gray-50 text-gray-800">
      {/* Navbar */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex-shrink-0 flex items-center group">
                <div className="p-2 bg-civic-100 rounded-lg group-hover:bg-civic-200 transition-colors">
                  <Landmark className="h-5 w-5 text-civic-600" />
                </div>
                <div className="ml-3">
                  <span className="text-xl font-bold text-gray-900 group-hover:text-civic-700 transition-colors">CivicPro</span>
                  <span className="hidden sm:block text-xs text-gray-500 font-medium">Political Accountability</span>
                </div>
              </Link>
              <div className="hidden md:ml-8 md:flex md:space-x-1">
                <Link href="/" className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${isActive('/') ? 'text-civic-700 bg-civic-100' : 'text-gray-600 hover:text-civic-700 hover:bg-civic-50'}`}>
                  <HomeIcon className="h-4 w-4" />
                  <span>Home</span>
                </Link>
                <Link href="/directory" className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${isActive('/directory') ? 'text-civic-700 bg-civic-100' : 'text-gray-600 hover:text-civic-700 hover:bg-civic-50'}`}>
                  <Users className="h-4 w-4" />
                  <span>Directory</span>
                </Link>
                <Link href="/compare" className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${isActive('/compare') ? 'text-civic-700 bg-civic-100' : 'text-gray-600 hover:text-civic-700 hover:bg-civic-50'}`}>
                  <BarChart3 className="h-4 w-4" />
                  <span>Compare</span>
                </Link>
              </div>
            </div>
            <div className="flex items-center">
              <div className="hidden md:ml-4 md:flex-shrink-0 md:flex md:items-center">
                <Link href="/admin/login" className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-civic-600 rounded-lg hover:bg-civic-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-civic-500 transition-colors shadow-sm">
                  <span>Admin</span>
                </Link>
              </div>
              <div className="flex items-center md:hidden">
                <button
                  type="button"
                  className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-civic-500 transition-colors"
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
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-4 pt-2 pb-3 space-y-1">
              <Link href="/" className={`flex items-center gap-3 px-3 py-3 rounded-lg text-base font-medium ${isActive('/') ? 'text-civic-700 bg-civic-100' : 'text-gray-700 hover:bg-civic-50 hover:text-civic-700'}`}>
                <HomeIcon className="h-5 w-5" />
                <span>Home</span>
              </Link>
              <Link href="/directory" className={`flex items-center gap-3 px-3 py-3 rounded-lg text-base font-medium ${isActive('/directory') ? 'text-civic-700 bg-civic-100' : 'text-gray-700 hover:bg-civic-50 hover:text-civic-700'}`}>
                <Users className="h-5 w-5" />
                <span>Directory</span>
              </Link>
              <Link href="/compare" className={`flex items-center gap-3 px-3 py-3 rounded-lg text-base font-medium ${isActive('/compare') ? 'text-civic-700 bg-civic-100' : 'text-gray-700 hover:bg-civic-50 hover:text-civic-700'}`}>
                <BarChart3 className="h-5 w-5" />
                <span>Compare</span>
              </Link>
              <Link href="/admin/login" className="flex items-center gap-3 px-3 py-3 rounded-lg text-base font-medium text-white bg-civic-600 hover:bg-civic-700 mt-2">
                <span>Admin Portal</span>
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Main content */}
      <main>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="p-2 bg-civic-100 rounded-lg mr-3">
                <Landmark className="h-5 w-5 text-civic-600" />
              </div>
              <div>
                <span className="text-lg font-bold text-gray-900">CivicPro</span>
                <p className="text-xs text-gray-500">Political Accountability Platform</p>
              </div>
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
