import React from 'react';
import { X, TrendingUp, Package, DollarSign, BarChart3 } from 'lucide-react';

interface Order {
  _id: string;
  user?: { name?: string; email?: string };
  totalPrice: number;
  orderStatus: 'placed' | 'pending' | 'processing' | 'shipped' | 'in_transit' | 'delivered' | 'cancelled';
  createdAt: string;
  orderItems?: Array<{ product: any; quantity: number; price: number }>;
}

interface OrderStatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
}

const OrderStatsModal: React.FC<OrderStatsModalProps> = ({ isOpen, onClose, orders }) => {
  if (!isOpen) return null;

  // Calculate statistics
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0);
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  // Status distribution
  const statusCounts = {
    placed: orders.filter(o => o.orderStatus === 'placed').length,
    pending: orders.filter(o => o.orderStatus === 'pending').length,
    processing: orders.filter(o => o.orderStatus === 'processing').length,
    shipped: orders.filter(o => o.orderStatus === 'shipped').length,
    in_transit: orders.filter(o => o.orderStatus === 'in_transit').length,
    delivered: orders.filter(o => o.orderStatus === 'delivered').length,
    cancelled: orders.filter(o => o.orderStatus === 'cancelled').length,
  };

  // Monthly revenue (last 6 months)
  const monthlyData = [];
  for (let i = 5; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
    const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    
    const monthOrders = orders.filter(order => {
      const orderDate = new Date(order.createdAt);
      return orderDate >= monthStart && orderDate <= monthEnd;
    });
    
    monthlyData.push({
      month: date.toLocaleDateString('en-US', { month: 'short' }),
      revenue: monthOrders.reduce((sum, order) => sum + order.totalPrice, 0),
      orders: monthOrders.length
    });
  }

  const maxRevenue = Math.max(...monthlyData.map(d => d.revenue));
  const maxOrders = Math.max(...monthlyData.map(d => d.orders));

  // Status colors
  const statusColors = {
    placed: '#8B5CF6',
    pending: '#F59E0B',
    processing: '#F97316',
    shipped: '#3B82F6',
    in_transit: '#06B6D4',
    delivered: '#10B981',
    cancelled: '#EF4444'
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-linear-to-r from-blue-50 to-indigo-50">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Order Statistics</h2>
            <p className="text-gray-600 mt-1">Comprehensive analytics and insights</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/50 rounded-xl transition-colors"
          >
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-100px)] p-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-linear-to-br from-blue-50 to-blue-100 rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Total Orders</p>
                  <p className="text-3xl font-bold text-blue-900">{totalOrders.toLocaleString()}</p>
                </div>
                <div className="p-3 bg-blue-200 rounded-xl">
                  <Package className="h-8 w-8 text-blue-700" />
                </div>
              </div>
            </div>

            <div className="bg-linear-to-br from-green-50 to-green-100 rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">Total Revenue</p>
                  <p className="text-3xl font-bold text-green-900">₦{totalRevenue.toLocaleString()}</p>
                </div>
                <div className="p-3 bg-green-200 rounded-xl">
                  <DollarSign className="h-8 w-8 text-green-700" />
                </div>
              </div>
            </div>

            <div className="bg-linear-to-br from-purple-50 to-purple-100 rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600">Avg Order Value</p>
                  <p className="text-3xl font-bold text-purple-900">₦{avgOrderValue.toLocaleString()}</p>
                </div>
                <div className="p-3 bg-purple-200 rounded-xl">
                  <TrendingUp className="h-8 w-8 text-purple-700" />
                </div>
              </div>
            </div>

            <div className="bg-linear-to-br from-orange-50 to-orange-100 rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-600">Delivered</p>
                  <p className="text-3xl font-bold text-orange-900">{statusCounts.delivered}</p>
                </div>
                <div className="p-3 bg-orange-200 rounded-xl">
                  <BarChart3 className="h-8 w-8 text-orange-700" />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Order Status Distribution */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Order Status Distribution</h3>
              <div className="space-y-4">
                {Object.entries(statusCounts).map(([status, count]) => {
                  const percentage = totalOrders > 0 ? (count / totalOrders) * 100 : 0;
                  return (
                    <div key={status} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: statusColors[status as keyof typeof statusColors] }}
                        ></div>
                        <span className="text-sm font-medium text-gray-700 capitalize">
                          {status.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div 
                            className="h-2 rounded-full transition-all duration-300"
                            style={{ 
                              width: `${percentage}%`,
                              backgroundColor: statusColors[status as keyof typeof statusColors]
                            }}
                          ></div>
                        </div>
                        <span className="text-sm font-semibold text-gray-900 w-12 text-right">
                          {count}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Monthly Revenue Trend */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Monthly Revenue Trend</h3>
              <div className="space-y-4">
                {monthlyData.map((data, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-gray-700 w-8">{data.month}</span>
                      <div className="flex-1">
                        <div className="w-48 bg-gray-200 rounded-full h-3">
                          <div 
                            className="h-3 bg-linear-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-300"
                            style={{ width: `${maxRevenue > 0 ? (data.revenue / maxRevenue) * 100 : 0}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-gray-900">
                        ₦{data.revenue.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500">
                        {data.orders} orders
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Monthly Orders Trend */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Monthly Orders Trend</h3>
              <div className="space-y-4">
                {monthlyData.map((data, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-gray-700 w-8">{data.month}</span>
                      <div className="flex-1">
                        <div className="w-48 bg-gray-200 rounded-full h-3">
                          <div 
                            className="h-3 bg-linear-to-r from-green-500 to-green-600 rounded-full transition-all duration-300"
                            style={{ width: `${maxOrders > 0 ? (data.orders / maxOrders) * 100 : 0}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-gray-900">
                        {data.orders} orders
                      </div>
                      <div className="text-xs text-gray-500">
                        ₦{data.revenue.toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Performance Metrics</h3>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Completion Rate</span>
                    <span className="text-sm font-semibold text-green-600">
                      {totalOrders > 0 ? ((statusCounts.delivered / totalOrders) * 100).toFixed(1) : 0}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 bg-linear-to-r from-green-500 to-green-600 rounded-full"
                      style={{ width: `${totalOrders > 0 ? (statusCounts.delivered / totalOrders) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Cancellation Rate</span>
                    <span className="text-sm font-semibold text-red-600">
                      {totalOrders > 0 ? ((statusCounts.cancelled / totalOrders) * 100).toFixed(1) : 0}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 bg-linear-to-r from-red-500 to-red-600 rounded-full"
                      style={{ width: `${totalOrders > 0 ? (statusCounts.cancelled / totalOrders) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Processing Rate</span>
                    <span className="text-sm font-semibold text-orange-600">
                      {totalOrders > 0 ? (((statusCounts.processing + statusCounts.shipped + statusCounts.in_transit) / totalOrders) * 100).toFixed(1) : 0}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 bg-linear-to-r from-orange-500 to-orange-600 rounded-full"
                      style={{ width: `${totalOrders > 0 ? ((statusCounts.processing + statusCounts.shipped + statusCounts.in_transit) / totalOrders) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderStatsModal;