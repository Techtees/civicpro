import { ReactNode, useState, useEffect } from "react";
import { Link, useLocation, useRoute } from "wouter";
import { 
  Landmark, 
  LayoutDashboard, 
  Users, 
  MessageSquare, 
  Settings, 
  LogOut,
  Menu,
  X 
} from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { UserSession } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

interface AdminLayoutProps {
  children: ReactNode;
  title: string;
}

const AdminLayout = ({ children, title }: AdminLayoutProps) => {
  const [location, navigate] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { toast } = useToast();

  // Check if user is authenticated
  const { data: session, isLoading, error } = useQuery<{ user: UserSession }>({
    queryKey: ['/api/auth/session'],
    retry: false
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: () => apiRequest('POST', '/api/auth/logout', {}),
    onSuccess: () => {
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account",
      });
      navigate("/admin/login");
    },
    onError: (error) => {
      toast({
        title: "Logout failed",
        description: "There was an error logging out",
        variant: "destructive",
      });
    },
  });

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && (error || !session?.user?.isAdmin)) {
      navigate("/admin/login");
    }
  }, [session, isLoading, error, navigate]);

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const isActive = (path: string) => {
    if (path === '/admin' && location === '/admin') return true;
    if (path === '/admin/dashboard' && location === '/admin') return true;
    return location.startsWith(path);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="flex">
        {/* Desktop Sidebar */}
        <div className="hidden md:block w-64 bg-white shadow-sm h-screen sticky top-0">
          <div className="px-6 py-4 border-b">
            <div className="flex items-center">
              <Landmark className="h-6 w-6 text-primary-600 mr-2" />
              <span className="text-xl font-semibold text-gray-900">CivicPro</span>
              <span className="ml-2 text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded">Admin</span>
            </div>
          </div>
          <nav className="p-4">
            <ul className="space-y-1">
              <li>
                <Link href="/admin/dashboard" className={`flex items-center px-4 py-2 rounded-md font-medium ${isActive('/admin/dashboard') ? 'text-primary-600 bg-primary-50' : 'text-gray-700 hover:bg-gray-50'}`}>
                  <LayoutDashboard className="w-5 h-5 mr-3" />
                  <span>Dashboard</span>
                </Link>
              </li>
              <li>
                <Link href="/admin/politicians" className={`flex items-center px-4 py-2 rounded-md font-medium ${isActive('/admin/politicians') ? 'text-primary-600 bg-primary-50' : 'text-gray-700 hover:bg-gray-50'}`}>
                  <Users className="w-5 h-5 mr-3" />
                  <span>Politicians</span>
                </Link>
              </li>
              <li>
                <Link href="/admin/comments" className={`flex items-center px-4 py-2 rounded-md font-medium ${isActive('/admin/comments') ? 'text-primary-600 bg-primary-50' : 'text-gray-700 hover:bg-gray-50'}`}>
                  <MessageSquare className="w-5 h-5 mr-3" />
                  <span>Comments</span>
                </Link>
              </li>
              <li>
                <Link href="/admin/settings" className={`flex items-center px-4 py-2 rounded-md font-medium ${isActive('/admin/settings') ? 'text-primary-600 bg-primary-50' : 'text-gray-700 hover:bg-gray-50'}`}>
                  <Settings className="w-5 h-5 mr-3" />
                  <span>Settings</span>
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        <div className="flex-1">
          <header className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
              {/* Mobile menu button */}
              <div className="flex md:hidden">
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="text-gray-600 hover:text-gray-900 focus:outline-none"
                >
                  {isMobileMenuOpen ? (
                    <X className="h-6 w-6" />
                  ) : (
                    <Menu className="h-6 w-6" />
                  )}
                </button>
              </div>
              <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
              <div className="flex items-center">
                <span className="mr-4 text-sm text-gray-600">
                  {session?.user?.username}
                </span>
                <button 
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-gray-900"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            </div>
          </header>

          {/* Mobile Sidebar */}
          {isMobileMenuOpen && (
            <div className="md:hidden bg-white shadow-md p-4">
              <nav>
                <ul className="space-y-2">
                  <li>
                    <Link 
                      href="/admin/dashboard" 
                      className={`flex items-center px-3 py-2 rounded-md ${isActive('/admin/dashboard') ? 'text-primary-600 bg-primary-50' : 'text-gray-700 hover:bg-gray-50'}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <LayoutDashboard className="w-5 h-5 mr-2" />
                      <span>Dashboard</span>
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/admin/politicians" 
                      className={`flex items-center px-3 py-2 rounded-md ${isActive('/admin/politicians') ? 'text-primary-600 bg-primary-50' : 'text-gray-700 hover:bg-gray-50'}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Users className="w-5 h-5 mr-2" />
                      <span>Politicians</span>
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/admin/comments" 
                      className={`flex items-center px-3 py-2 rounded-md ${isActive('/admin/comments') ? 'text-primary-600 bg-primary-50' : 'text-gray-700 hover:bg-gray-50'}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <MessageSquare className="w-5 h-5 mr-2" />
                      <span>Comments</span>
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/admin/settings" 
                      className={`flex items-center px-3 py-2 rounded-md ${isActive('/admin/settings') ? 'text-primary-600 bg-primary-50' : 'text-gray-700 hover:bg-gray-50'}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Settings className="w-5 h-5 mr-2" />
                      <span>Settings</span>
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>
          )}

          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
