import React from 'react';
import { useState } from 'react';
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from '@clerk/clerk-react';
import { Bell, Search, Menu, X, Store } from 'lucide-react';
import Sidebar from '@/components/dashboard/Sidebar';
import Dashboard from '@/components/dashboard/Dashboard';
import Products from '@/components/dashboard/Products';
import Orders from '@/components/dashboard/Orders';
import Customers from '@/components/dashboard/Customers';

const Layout: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const { user } = useUser();

  const getPageTitle = (tab: string): string => {
    const titles: Record<string, string> = {
      dashboard: 'Dashboard Overview',
      products: 'Product Management',
      orders: 'Order Management',
      customers: 'Customer Management'
    };
    return titles[tab] || 'Dashboard';
  };

  const getPageSubtitle = (tab: string): string => {
    const subtitles: Record<string, string> = {
      dashboard: 'Monitor your business performance',
      products: 'Manage your product catalog',
      orders: 'Track and process orders',
      customers: 'Manage customer relationships'
    };
    return subtitles[tab] || '';
  };

  // Check if user is admin
  const isAdmin = user?.emailAddresses?.[0]?.emailAddress === 'coiregbu@gmail.com';

  const renderContent = (): React.ReactElement => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'products':
        return <Products />;
      case 'orders':
        return <Orders />;
      case 'customers':
        return <Customers />;
      default:
        return <Dashboard />;
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100">
        <div className="text-center bg-white p-8 rounded-2xl shadow-xl border border-gray-200 max-w-md w-full mx-4">
          <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <X className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold mb-4 text-red-600">Access Denied</h1>
          <p className="text-gray-600 mb-6">You don't have permission to access the admin dashboard.</p>
          <UserButton 
            appearance={{
              elements: {
                avatarBox: "w-12 h-12 mx-auto"
              }
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <SignedIn>
      <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <Sidebar 
            activeTab={activeTab} 
            setActiveTab={setActiveTab}
            isCollapsed={isCollapsed}
            onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
          />
        </div>

        {/* Mobile Sidebar Overlay */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            <div className="fixed inset-0 bg-black/50" onClick={() => setIsMobileMenuOpen(false)} />
            <div className="relative">
              <Sidebar 
                activeTab={activeTab} 
                setActiveTab={(tab) => {
                  setActiveTab(tab);
                  setIsMobileMenuOpen(false);
                }}
              />
            </div>
          </div>
        )}
        
        <div className="flex-1 flex flex-col min-w-0">
          {/* Enhanced Header */}
          <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200/50 px-4 lg:px-6 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setIsMobileMenuOpen(true)}
                  className="lg:hidden p-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <Menu className="h-5 w-5 text-gray-600" />
                </button>
                
                <div>
                  <h1 className="text-xl font-bold text-gray-900">{getPageTitle(activeTab)}</h1>
                  <p className="text-sm text-gray-600 hidden sm:block">{getPageSubtitle(activeTab)}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                {/* Search */}
                <div className="hidden md:flex relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm w-64"
                  />
                </div>
                
                {/* Notifications */}
                <button className="relative p-2 hover:bg-gray-100 rounded-xl transition-colors">
                  <Bell className="h-5 w-5 text-gray-600" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
                </button>
                
                {/* User Menu */}
                <div className="flex items-center gap-3">
                  <div className="hidden sm:block text-right">
                    <p className="text-sm font-medium text-gray-900">{user?.firstName} {user?.lastName}</p>
                    <p className="text-xs text-gray-500">Administrator</p>
                  </div>
                  <UserButton 
                    appearance={{
                      elements: {
                        avatarBox: "w-10 h-10",
                        userButtonPopoverCard: "shadow-xl border border-gray-200",
                        userButtonPopoverActionButton: "hover:bg-gray-50"
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          </header>
          
          <main className="flex-1 overflow-auto">
            {renderContent()}
          </main>
        </div>
      </div>
    </SignedIn>
  );
};

const AdminApp: React.FC = () => {
  return (
    <div>
      <SignedOut>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
          <div className="text-center bg-white p-8 rounded-2xl shadow-xl border border-gray-200 max-w-md w-full mx-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Store className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
            <p className="text-gray-600 mb-8">Sign in to access your admin panel</p>
            <SignInButton mode='modal'>
              <button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium shadow-lg">
                Sign In
              </button>
            </SignInButton>
          </div>
        </div>
      </SignedOut>
      
      <SignedIn>
        <Layout />
      </SignedIn>
    </div>
  );
};

export default AdminApp;