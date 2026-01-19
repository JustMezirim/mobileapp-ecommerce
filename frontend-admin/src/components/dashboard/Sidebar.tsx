import React from 'react';
import { cn } from '@/lib/utils';
import { BarChart3, Package, ShoppingCart, Users, Store, Settings, ChevronLeft, ChevronRight } from 'lucide-react';

interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, isCollapsed = false, onToggleCollapse }) => {
  const menuItems: MenuItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'customers', label: 'Customers', icon: Users },
  ];

  return (
    <div className={cn(
      "bg-white border-r border-gray-200 shadow-lg h-screen transition-all duration-300 flex flex-col",
      isCollapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className={cn(
        "border-b border-gray-100 transition-all duration-300",
        isCollapsed ? "p-3" : "p-6"
      )}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-linear-to-br from-blue-500 to-blue-600 rounded-xl">
              <Store className="h-6 w-6 text-white" />
            </div>
            {!isCollapsed && (
              <div>
                <h2 className="text-xl font-bold bg-linear-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">Admin</h2>
                <p className="text-xs text-gray-500">Dashboard</p>
              </div>
            )}
          </div>
          {onToggleCollapse && !isCollapsed && (
            <button
              onClick={onToggleCollapse}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
              title="Collapse sidebar"
            >
              <ChevronLeft className="h-4 w-4 text-gray-500" />
            </button>
          )}
        </div>
        {/* Expand button when collapsed */}
        {isCollapsed && onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            className="w-full mt-3 p-2 hover:bg-gray-100 rounded-lg transition-colors flex items-center justify-center"
            title="Expand sidebar"
          >
            <ChevronRight className="h-4 w-4 text-gray-500" />
          </button>
        )}
      </div>
      
      {/* Navigation */}
      <nav className={cn(
        "flex-1 transition-all duration-300",
        isCollapsed ? "px-2 py-4" : "px-3 py-6"
      )}>
        <div className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "w-full flex items-center text-sm font-medium rounded-xl transition-all duration-200 group relative",
                  isCollapsed ? "px-2 py-3 justify-center" : "px-3 py-3",
                  activeTab === item.id
                    ? "bg-linear-to-r from-blue-50 to-blue-100 text-blue-700 shadow-sm"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon className={cn(
                  "h-5 w-5 transition-colors",
                  isCollapsed ? "" : "mr-3",
                  activeTab === item.id ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600"
                )} />
                {!isCollapsed && (
                  <span className="truncate">{item.label}</span>
                )}
                {!isCollapsed && activeTab === item.id && (
                  <div className="absolute right-2 w-2 h-2 bg-blue-600 rounded-full"></div>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className={cn(
        "border-t border-gray-100 transition-all duration-300",
        isCollapsed ? "p-2" : "p-3"
      )}>
        <button className={cn(
          "w-full flex items-center text-sm font-medium rounded-xl transition-colors text-gray-600 hover:bg-gray-50 hover:text-gray-900",
          isCollapsed ? "px-2 py-3 justify-center" : "px-3 py-3"
        )}
        title={isCollapsed ? "Settings" : undefined}
        >
          <Settings className={cn(
            "h-5 w-5 text-gray-400",
            isCollapsed ? "" : "mr-3"
          )} />
          {!isCollapsed && <span>Settings</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
