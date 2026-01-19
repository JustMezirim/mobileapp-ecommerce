import React, { useState } from 'react';
import { useDashboardStats } from '@/hooks/useAdmin';
import { getErrorMessage } from '@/utils/errorHandler';
import { DollarSign, ShoppingCart, Users, Package, Plus, Eye, AlertTriangle, Clock, CheckCircle, BarChart3, ArrowUpRight, ArrowDownRight, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  trend?: string;
  trendUp?: boolean;
  bgColor?: string;
  iconColor?: string;
  subtitle?: string;
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  trendUp, 
  bgColor = "bg-blue-50", 
  iconColor = "text-blue-600",
  subtitle 
}) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-lg transition-all duration-200">
      <div className="flex items-center justify-between mb-4">
        <div className={cn("p-3 rounded-xl", bgColor)}>
          <Icon className={cn("h-6 w-6", iconColor)} />
        </div>
        {trend && (
          <div className={cn(
            "flex items-center px-2 py-1 rounded-full text-xs font-medium",
            trendUp ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          )}>
            {trendUp ? (
              <ArrowUpRight className="h-3 w-3 mr-1" />
            ) : (
              <ArrowDownRight className="h-3 w-3 mr-1" />
            )}
            {trend}
          </div>
        )}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
        {subtitle && (
          <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
        )}
      </div>
    </div>
  );
};

const Dashboard: React.FC = () => {
  const { data: stats, isLoading, error, refetch } = useDashboardStats();
  const [timeRange, setTimeRange] = useState<'today' | 'week' | 'month' | 'year'>('month');

  // Calculate realtime trends
  const calculateTrend = (current: number, previous: number) => {
    if (!previous) return { value: '0%', isUp: false };
    const change = ((current - previous) / previous) * 100;
    return {
      value: `${change >= 0 ? '+' : ''}${change.toFixed(1)}%`,
      isUp: change >= 0
    };
  };

  if (isLoading) {
    return (
      <div className="p-6 bg-linear-to-br from-gray-50 to-gray-100 min-h-full">
        <div className="animate-pulse">
          <div className="h-10 bg-gray-200 rounded w-64 mb-2"></div>
          <div className="h-6 bg-gray-200 rounded w-96 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-40 bg-gray-200 rounded-2xl"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-80 bg-gray-200 rounded-2xl"></div>
            <div className="h-80 bg-gray-200 rounded-2xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Error: {getErrorMessage(error)}</p>
        </div>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="p-6 bg-linear-to-br from-gray-50 to-gray-100 min-h-full">
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 mb-6">
          <div>
            <h1 className="text-4xl font-bold bg-linear-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">Dashboard</h1>
            <p className="text-gray-600 mt-2 text-lg">Welcome back! Here's your business overview</p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as 'today' | 'week' | 'month' | 'year')}
              className="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
            <button 
              onClick={() => refetch()}
              className="p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors group"
            >
              <RefreshCw className="h-5 w-5 text-gray-600 group-hover:rotate-180 transition-transform duration-300" />
            </button>
          </div>
        </div>
      </div>
      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Revenue"
          value={formatCurrency(stats?.totalRevenue || 0)}
          icon={DollarSign}
          bgColor="bg-green-50"
          iconColor="text-green-600"
          trend={calculateTrend(stats?.totalRevenue || 0, stats?.previousRevenue || 0).value}
          trendUp={calculateTrend(stats?.totalRevenue || 0, stats?.previousRevenue || 0).isUp}
          subtitle="vs last month"
        />
        
        <StatCard
          title="Total Orders"
          value={stats?.totalOrders || 0}
          icon={ShoppingCart}
          bgColor="bg-blue-50"
          iconColor="text-blue-600"
          trend={calculateTrend(stats?.totalOrders || 0, stats?.previousOrders || 0).value}
          trendUp={calculateTrend(stats?.totalOrders || 0, stats?.previousOrders || 0).isUp}
          subtitle="vs last month"
        />
        
        <StatCard
          title="Total Customers"
          value={stats?.totalCustomers || 0}
          icon={Users}
          bgColor="bg-purple-50"
          iconColor="text-purple-600"
          trend={calculateTrend(stats?.totalCustomers || 0, stats?.previousCustomers || 0).value}
          trendUp={calculateTrend(stats?.totalCustomers || 0, stats?.previousCustomers || 0).isUp}
          subtitle="vs last month"
        />
        
        <StatCard
          title="Total Products"
          value={stats?.totalProducts || 0}
          icon={Package}
          bgColor="bg-orange-50"
          iconColor="text-orange-600"
          trend={calculateTrend(stats?.totalProducts || 0, stats?.previousProducts || 0).value}
          trendUp={calculateTrend(stats?.totalProducts || 0, stats?.previousProducts || 0).isUp}
          subtitle="vs last month"
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-yellow-50 rounded-xl">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <span className="text-xs font-medium text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full">Pending</span>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">Pending Orders</h3>
          <p className="text-3xl font-bold text-gray-900">{stats?.orderStats?.pending || 0}</p>
          <p className="text-sm text-gray-500 mt-1">Requires attention</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-red-50 rounded-xl">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <span className="text-xs font-medium text-red-600 bg-red-100 px-2 py-1 rounded-full">Low Stock</span>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">Low Stock Items</h3>
          <p className="text-3xl font-bold text-gray-900">{stats?.stockAlerts?.lowStock || 0}</p>
          <p className="text-sm text-gray-500 mt-1">Need restocking</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-50 rounded-xl">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">Completed</span>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">Orders Today</h3>
          <p className="text-3xl font-bold text-gray-900">{stats?.todayStats?.orders || 0}</p>
          <p className="text-sm text-gray-500 mt-1">₦{(stats?.todayStats?.revenue || 0).toLocaleString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Revenue Chart */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Revenue Overview</h3>
            <BarChart3 className="h-5 w-5 text-gray-400" />
          </div>
          <div className="h-64 flex items-end justify-between gap-2 px-2">
            {(() => {
              const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
              const currentDate = new Date();
              const last12Months = [];
              
              for (let i = 0; i < 12; i++) {
                const date = new Date(currentDate.getFullYear(), i, 1);
                last12Months.push({ month: date.getMonth() + 1, year: date.getFullYear() });
              }
              
              const revenueData = stats?.monthlyRevenue || [];
              const maxRevenue = Math.max(...revenueData.map((d: any) => d.revenue), 1);
              
              return last12Months.map((monthData, index) => {
                const dataPoint = revenueData.find((d: any) => 
                  d._id.month === monthData.month && d._id.year === monthData.year
                );
                const revenue = dataPoint?.revenue || 0;
                const height = (revenue / maxRevenue) * 200;
                const monthName = monthNames[monthData.month - 1];
                
                return (
                  <div key={index} className="flex flex-col items-center group cursor-pointer">
                    <div className="relative mb-2">
                      <div 
                        className="w-6 bg-linear-to-t from-blue-600 to-blue-400 rounded-t-md transition-all duration-300 group-hover:from-blue-700 group-hover:to-blue-500"
                        style={{ height: `${height}px`, minHeight: '4px' }}
                      ></div>
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {formatCurrency(revenue)}
                      </div>
                    </div>
                    <span className="text-xs font-medium text-gray-600">{monthName}</span>
                  </div>
                );
              });
            })()}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Activity</h3>
          <div className="h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            <div className="space-y-4 pr-2">
              {(stats?.recentActivity?.orders || []).map((activity: any, index: number) => {
                const getActivityType = (orderStatus: any) => {
                  switch (orderStatus) {
                    case 'placed': return { type: 'order', color: 'blue', icon: ShoppingCart };
                    case 'shipped': return { type: 'shipping', color: 'orange', icon: CheckCircle };
                    case 'delivered': return { type: 'shipping', color: 'green', icon: CheckCircle };
                    case 'cancelled': return { type: 'alert', color: 'red', icon: AlertTriangle };
                    default: return { type: 'order', color: 'blue', icon: ShoppingCart };
                  }
                };
                
                const activityInfo = getActivityType(activity.orderStatus);
                const Icon = activityInfo.icon;
                
                return (
                  <div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className={cn(
                      "p-2 rounded-lg",
                      `bg-${activityInfo.color}-100`
                    )}>
                      <Icon className={cn("h-4 w-4", `text-${activityInfo.color}-600`)} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        Order #{activity._id.slice(-8)} {activity.orderStatus}
                      </p>
                      <p className="text-sm text-gray-500">
                        {activity.user?.name || 'Unknown'} - {formatCurrency(activity.totalPrice)}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(activity.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                );
              })}
              
              {(stats?.recentActivity?.products || []).map((product: any, index: number) => (
                <div key={`product-${index}`} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="p-2 rounded-lg bg-green-100">
                    <Package className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Product added</p>
                    <p className="text-sm text-gray-500">{product.name}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(product.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Enhanced Quick Actions */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <button className="p-4 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 text-left group">
              <div className="p-3 bg-blue-100 rounded-lg w-fit mb-3 group-hover:bg-blue-200 transition-colors">
                <Plus className="h-5 w-5 text-blue-600" />
              </div>
              <div className="font-medium text-gray-900">Add Product</div>
              <div className="text-sm text-gray-600">Create new listing</div>
            </button>
            
            <button className="p-4 rounded-xl border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-all duration-200 text-left group">
              <div className="p-3 bg-green-100 rounded-lg w-fit mb-3 group-hover:bg-green-200 transition-colors">
                <Eye className="h-5 w-5 text-green-600" />
              </div>
              <div className="font-medium text-gray-900">View Orders</div>
              <div className="text-sm text-gray-600">Manage pending</div>
            </button>
            
            <button className="p-4 rounded-xl border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all duration-200 text-left group">
              <div className="p-3 bg-purple-100 rounded-lg w-fit mb-3 group-hover:bg-purple-200 transition-colors">
                <Users className="h-5 w-5 text-purple-600" />
              </div>
              <div className="font-medium text-gray-900">Customers</div>
              <div className="text-sm text-gray-600">View all customers</div>
            </button>
            
            <button className="p-4 rounded-xl border border-gray-200 hover:border-orange-300 hover:bg-orange-50 transition-all duration-200 text-left group">
              <div className="p-3 bg-orange-100 rounded-lg w-fit mb-3 group-hover:bg-orange-200 transition-colors">
                <BarChart3 className="h-5 w-5 text-orange-600" />
              </div>
              <div className="font-medium text-gray-900">Analytics</div>
              <div className="text-sm text-gray-600">View reports</div>
            </button>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Top Products</h3>
          <div className="h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            <div className="space-y-4 pr-2">
              {(stats?.topProducts || []).map((product: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-linear-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                      <Package className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-500">{product.totalSales} sales</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{formatCurrency(product.totalRevenue)}</p>
                    <p className="text-sm text-green-600">Top seller</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;