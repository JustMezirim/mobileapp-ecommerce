import React, { useState } from 'react';
import { useOrders, useUpdateOrderStatus, useBulkUpdateOrderStatus } from '@/hooks/useAdmin';
import { getErrorMessage } from '@/utils/errorHandler';
import { Search, Filter, Package, User, Eye, ChevronDown, Download, SortAsc, SortDesc, CheckSquare, Square, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';
import OrderStatsModal from './OrderStatsModal';
import ConfirmationModal from '../ui/ConfirmationModal';

interface User {
  name?: string;
  email?: string;
}

interface Order {
  _id: string;
  user?: User;
  totalPrice: number;
  orderStatus: 'placed' | 'pending' | 'processing' | 'shipped' | 'in_transit' | 'delivered' | 'cancelled';
  createdAt: string;
  orderItems?: Array<{ product: any; quantity: number; price: number }>;
}

interface OrdersData {
  orders: Order[];
}

const Orders: React.FC = () => {
  const { data: ordersData, isLoading, error } = useOrders();
  const updateOrderStatus = useUpdateOrderStatus();
  const bulkUpdateOrderStatus = useBulkUpdateOrderStatus();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [sortBy, setSortBy] = useState<'createdAt' | 'totalPrice' | 'orderStatus'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<'today' | 'week' | 'month' | 'all'>('all');
  const [showStatsModal, setShowStatsModal] = useState<boolean>(false);
  const [showBulkUpdateModal, setShowBulkUpdateModal] = useState<boolean>(false);
  const [bulkUpdateStatus, setBulkUpdateStatus] = useState<Order['orderStatus']>('processing');

  const handleStatusUpdate = async (orderId: string, status: Order['orderStatus']): Promise<void> => {
    try {
      await updateOrderStatus.mutateAsync({ orderId, status });
    } catch (error) {
      // Error is already handled in the hook
    }
  };

  const handleSelectOrder = (orderId: string) => {
    setSelectedOrders(prev => 
      prev.includes(orderId) 
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  const handleSelectAll = () => {
    setSelectedOrders(
      selectedOrders.length === filteredOrders.length 
        ? [] 
        : filteredOrders.map(o => o._id)
    );
  };

  const handleBulkStatusUpdate = (status: Order['orderStatus']) => {
    setBulkUpdateStatus(status);
    setShowBulkUpdateModal(true);
  };

  const confirmBulkUpdate = async () => {
    await bulkUpdateOrderStatus.mutateAsync({ orderIds: selectedOrders, status: bulkUpdateStatus });
    setSelectedOrders([]);
    setShowBulkUpdateModal(false);
  };

  const handleExport = () => {
    const csvContent = filteredOrders.map(o => 
      `${o._id},${o.user?.name || 'N/A'},${o.user?.email || ''},${o.totalPrice},${o.orderStatus},${new Date(o.createdAt).toLocaleDateString()}`
    ).join('\n');
    const blob = new Blob([`Order ID,Customer Name,Email,Total,Status,Date\n${csvContent}`], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'orders.csv';
    a.click();
  };

  if (isLoading) {
    return (
      <div className="p-6 bg-gray-50 min-h-full">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
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

  const orders = (ordersData as unknown as OrdersData)?.orders || [];

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.user?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || order.orderStatus === statusFilter;
    
    // Enhanced date filtering
    let matchesDate = true;
    if (dateRange !== 'all') {
      const orderDate = new Date(order.createdAt);
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      switch (dateRange) {
        case 'today':
          matchesDate = orderDate >= today;
          break;
        case 'week':
          const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
          matchesDate = orderDate >= weekAgo;
          break;
        case 'month':
          const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
          matchesDate = orderDate >= monthAgo;
          break;
      }
    }
    
    return matchesSearch && matchesStatus && matchesDate;
  }).sort((a, b) => {
    let aVal, bVal;
    switch (sortBy) {
      case 'totalPrice':
        aVal = a.totalPrice;
        bVal = b.totalPrice;
        break;
      case 'orderStatus':
        aVal = a.orderStatus;
        bVal = b.orderStatus;
        break;
      default:
        aVal = new Date(a.createdAt).getTime();
        bVal = new Date(b.createdAt).getTime();
    }
    
    if (sortOrder === 'asc') {
      return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
    } else {
      return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'placed': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'processing': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'shipped': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'in_transit': return 'bg-teal-100 text-teal-800 border-teal-200';
      case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.totalPrice, 0);
  const pendingOrders = filteredOrders.filter(order => order.orderStatus === 'pending').length;
  const processingOrders = filteredOrders.filter(order => order.orderStatus === 'processing').length;
  const shippedOrders = filteredOrders.filter(order => order.orderStatus === 'shipped' || order.orderStatus === 'in_transit').length;
  const deliveredOrders = filteredOrders.filter(order => order.orderStatus === 'delivered').length;
  const cancelledOrders = filteredOrders.filter(order => order.orderStatus === 'cancelled').length;
  
  // Calculate today's stats
  const today = new Date();
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const todayOrders = orders.filter(order => new Date(order.createdAt) >= todayStart);
  const todayRevenue = todayOrders.reduce((sum, order) => sum + order.totalPrice, 0);

  return (
    <div className="p-6 bg-linear-to-br from-gray-50 to-gray-100 min-h-full">
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 mb-6">
          <div>
            <h1 className="text-4xl font-bold bg-linear-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">Orders</h1>
            <p className="text-gray-600 mt-2 text-lg">Manage and track customer orders efficiently</p>
            <div className="flex items-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-600">{filteredOrders.length} Total Orders</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-sm text-gray-600">{pendingOrders} Pending</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span className="text-sm text-gray-600">{processingOrders} Processing</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-teal-500 rounded-full"></div>
                <span className="text-sm text-gray-600">{shippedOrders} Shipped</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">{deliveredOrders} Delivered</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-sm text-gray-600">{cancelledOrders} Cancelled</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-white rounded-xl border border-gray-200 p-3">
              <div className="text-xs text-gray-500 mb-1">Total Revenue</div>
              <div className="text-lg font-bold text-blue-600">₦{totalRevenue.toLocaleString()}</div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-3">
              <div className="text-xs text-gray-500 mb-1">Today's Revenue</div>
              <div className="text-lg font-bold text-green-600">₦{todayRevenue.toLocaleString()}</div>
            </div>
            <button
              onClick={() => setShowStatsModal(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              View Statistics
            </button>
            <button
              onClick={handleExport}
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </button>
          </div>
        </div>

        {/* Enhanced Search and Filters */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search orders, customers, emails..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 focus:bg-white transition-colors"
              />
            </div>
            <div className="relative min-w-45">
              <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-12 pr-8 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-gray-50 focus:bg-white transition-colors"
              >
                <option value="">All Status</option>
                <option value="placed">Placed</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="in_transit">In Transit</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value as 'today' | 'week' | 'month' | 'all')}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 focus:bg-white transition-colors"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">Sort by:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'createdAt' | 'totalPrice' | 'orderStatus')}
                  className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
                >
                  <option value="createdAt">Date</option>
                  <option value="totalPrice">Amount</option>
                  <option value="orderStatus">Status</option>
                </select>
                <button
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                </button>
              </div>
            </div>
            
            {selectedOrders.length > 0 && (
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">{selectedOrders.length} selected</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleBulkStatusUpdate('processing')}
                    className="px-3 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors text-sm font-medium"
                  >
                    Mark Processing
                  </button>
                  <button
                    onClick={() => handleBulkStatusUpdate('shipped')}
                    className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
                  >
                    Mark Shipped
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">All Orders</h3>
            <span className="text-sm text-gray-500">{filteredOrders.length} orders</span>
          </div>
        </div>
        
        {filteredOrders.length === 0 ? (
          <div className="p-16 text-center">
            <div className="w-24 h-24 bg-linear-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="h-12 w-12 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">No orders found</h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">No orders match your current filters. Try adjusting your search criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-linear-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left w-12">
                    <button
                      onClick={handleSelectAll}
                      className="p-1 hover:bg-gray-200 rounded transition-colors"
                    >
                      {selectedOrders.length === filteredOrders.length && filteredOrders.length > 0 ? (
                        <CheckSquare className="h-4 w-4 text-blue-600" />
                      ) : (
                        <Square className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 min-w-50">Order Details</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 min-w-45">Customer</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 w-32">Amount</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 w-36">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 w-40">Date & Time</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 w-48">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 w-12">
                      <button
                        onClick={() => handleSelectOrder(order._id)}
                        className="p-1 hover:bg-gray-200 rounded transition-colors"
                      >
                        {selectedOrders.includes(order._id) ? (
                          <CheckSquare className="h-4 w-4 text-blue-600" />
                        ) : (
                          <Square className="h-4 w-4 text-gray-400" />
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 min-w-50">
                      <div className="flex items-center space-x-3">
                        <div className="shrink-0">
                          <div className="h-12 w-12 rounded-xl bg-linear-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                              <Package className="h-6 w-6 text-blue-600" />
                            </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold text-gray-900 truncate">Order #{order._id.slice(-8)}</div>
                          <div className="text-sm text-gray-500">{order.orderItems?.length || 0} items</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 min-w-45">
                      <div className="flex items-center space-x-3">
                        <div className="shrink-0">
                          <div className="h-10 w-10 rounded-full bg-linear-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                            <User className="h-5 w-5 text-gray-600" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-900 truncate">{order.user?.name || 'Guest User'}</div>
                          <div className="text-sm text-gray-500 truncate">{order.user?.email || 'No email'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 w-32">
                      <div className="text-lg font-bold text-gray-900">₦{order.totalPrice.toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4 w-36">
                      <span className={cn(
                        'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border',
                        getStatusColor(order.orderStatus || '')
                      )}>
                        {order.orderStatus ? order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1).replace('_', ' ') : 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 w-40">
                      <div className="text-sm font-medium text-gray-900">{new Date(order.createdAt).toLocaleDateString()}</div>
                      <div className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                    </td>
                    <td className="px-6 py-4 w-48">
                      <div className="flex items-center gap-2">
                        <div className="relative">
                          <select
                            value={order.orderStatus}
                            onChange={(e) => handleStatusUpdate(order._id, e.target.value as Order['orderStatus'])}
                            disabled={updateOrderStatus.isPending}
                            className="text-xs border border-gray-200 rounded-lg px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white pr-6 min-w-25"
                          >
                            <option value="placed">Placed</option>
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="in_transit">In Transit</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                          <ChevronDown className="absolute right-1 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400 pointer-events-none" />
                        </div>
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Statistics Modal */}
      <OrderStatsModal 
        isOpen={showStatsModal}
        onClose={() => setShowStatsModal(false)}
        orders={orders}
      />

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Order Details</h3>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900">Order #{selectedOrder._id.slice(-8)}</h4>
                  <p className="text-sm text-gray-500">Placed on {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Customer</h4>
                  <p className="text-sm text-gray-600">{selectedOrder.user?.name || 'N/A'}</p>
                  <p className="text-sm text-gray-500">{selectedOrder.user?.email || ''}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Status</h4>
                  <span className={cn(
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
                    getStatusColor(selectedOrder.orderStatus || '')
                  )}>
                    {selectedOrder.orderStatus ? selectedOrder.orderStatus.charAt(0).toUpperCase() + selectedOrder.orderStatus.slice(1) : 'Pending'}
                  </span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Total Amount</h4>
                  <p className="text-lg font-semibold text-gray-900">₦{selectedOrder.totalPrice.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Bulk Update Confirmation Modal */}
      <ConfirmationModal
        isOpen={showBulkUpdateModal}
        onClose={() => setShowBulkUpdateModal(false)}
        onConfirm={confirmBulkUpdate}
        title="Update Order Status"
        message={`Are you sure you want to update ${selectedOrders.length} orders to "${bulkUpdateStatus}" status?`}
        confirmText="Update Orders"
        isLoading={bulkUpdateOrderStatus.isPending}
        variant="info"
      />
    </div>
  );
};

export default Orders;