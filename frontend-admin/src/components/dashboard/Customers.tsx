import React, { useState } from 'react';
import { useCustomers, useDeleteCustomer, useBulkDeleteCustomers } from '@/hooks/useAdmin';
import { getErrorMessage } from '@/utils/errorHandler';
import { Search, Filter, Users, MapPin, Heart, Mail, Eye, User, Download, SortAsc, SortDesc, CheckSquare, Square, Trash2, Phone } from 'lucide-react';
import { cn } from '@/lib/utils';
import CustomerDetailsModal from './CustomerDetailsModal';
import ConfirmationModal from '../ui/ConfirmationModal';

interface Address {
  fullName?: string;
  phoneNumber?: string;
  label?: string;
  streetAddress?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  isDefault?: boolean;
  [key: string]: unknown;
}

interface WishlistItem {
  _id: string;
  name: string;
  price: number;
  images?: string[];
}

interface Customer {
  _id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  createdAt: string;
  imageURL?: string;
  clerkId?: string;
  addresses?: Address[];
  wishList?: WishlistItem[];
}

interface CustomersData {
  customers: Customer[];
}

const Customers: React.FC = () => {
  const { data: customersData, isLoading, error } = useCustomers();
  const deleteCustomer = useDeleteCustomer();
  const bulkDeleteCustomers = useBulkDeleteCustomers();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortBy, setSortBy] = useState<'createdAt' | 'name' | 'email'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<'all' | 'today' | 'week' | 'month'>('all');
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [customerToDelete, setCustomerToDelete] = useState<string | null>(null);
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState<boolean>(false);

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

  const customers = (customersData as unknown as CustomersData)?.customers || [];

  const handleSelectCustomer = (customerId: string) => {
    setSelectedCustomers(prev => 
      prev.includes(customerId) 
        ? prev.filter(id => id !== customerId)
        : [...prev, customerId]
    );
  };

  const handleSelectAll = () => {
    setSelectedCustomers(
      selectedCustomers.length === filteredCustomers.length 
        ? [] 
        : filteredCustomers.map(c => c._id)
    );
  };

  const handleDelete = (customerId: string) => {
    setCustomerToDelete(customerId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (customerToDelete) {
      await deleteCustomer.mutateAsync(customerToDelete);
      setShowDeleteModal(false);
      setCustomerToDelete(null);
    }
  };

  const handleBulkDelete = () => {
    setShowBulkDeleteModal(true);
  };

  const confirmBulkDelete = async () => {
    await bulkDeleteCustomers.mutateAsync(selectedCustomers);
    setSelectedCustomers([]);
    setShowBulkDeleteModal(false);
  };

  const handleExport = () => {
    const csvContent = filteredCustomers.map(c => 
      `${c.name},${c.email},${c.phoneNumber || ''},${new Date(c.createdAt).toLocaleDateString()},${c.addresses?.length || 0},${c.wishList?.length || 0}`
    ).join('\n');
    const blob = new Blob([`Name,Email,Phone,Joined Date,Addresses,Wishlist Items\n${csvContent}`], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'customers.csv';
    a.click();
  };

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (customer.phoneNumber && customer.phoneNumber.toLowerCase().includes(searchTerm.toLowerCase()));
    
    let matchesDate = true;
    if (dateRange !== 'all') {
      const customerDate = new Date(customer.createdAt);
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      switch (dateRange) {
        case 'today':
          matchesDate = customerDate >= today;
          break;
        case 'week':
          const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
          matchesDate = customerDate >= weekAgo;
          break;
        case 'month':
          const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
          matchesDate = customerDate >= monthAgo;
          break;
      }
    }
    
    return matchesSearch && matchesDate;
  }).sort((a, b) => {
    let aVal, bVal;
    switch (sortBy) {
      case 'name':
        aVal = a.name.toLowerCase();
        bVal = b.name.toLowerCase();
        break;
      case 'email':
        aVal = a.email.toLowerCase();
        bVal = b.email.toLowerCase();
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

  // Calculate statistics
  const totalCustomers = customers.length;
  const newCustomersToday = customers.filter(c => {
    const today = new Date();
    const customerDate = new Date(c.createdAt);
    return customerDate.toDateString() === today.toDateString();
  }).length;
  const newCustomersThisWeek = customers.filter(c => {
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    return new Date(c.createdAt) >= weekAgo;
  }).length;
  const customersWithAddresses = customers.filter(c => c.addresses && c.addresses.length > 0).length;
  const customersWithWishlist = customers.filter(c => c.wishList && c.wishList.length > 0).length;

  return (
    <div className="p-6 bg-linear-to-br from-gray-50 to-gray-100 min-h-full">
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 mb-6">
          <div>
            <h1 className="text-4xl font-bold bg-linear-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">Customers</h1>
            <p className="text-gray-600 mt-2 text-lg">Manage your customer relationships and insights</p>
            <div className="flex items-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-600">{totalCustomers} Total Customers</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">{newCustomersThisWeek} New This Week</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span className="text-sm text-gray-600">{customersWithAddresses} With Addresses</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className="text-sm text-gray-600">{customersWithWishlist} Active Wishlist</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-white rounded-xl border border-gray-200 p-3">
              <div className="text-xs text-gray-500 mb-1">Today's New</div>
              <div className="text-lg font-bold text-blue-600">{newCustomersToday}</div>
            </div>
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
        <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search customers by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 focus:bg-white transition-all duration-200 text-sm"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value as 'all' | 'today' | 'week' | 'month')}
                className="pl-11 pr-8 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 focus:bg-white transition-all duration-200 text-sm appearance-none min-w-35"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <label className="text-sm font-medium text-gray-700">Sort by:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'createdAt' | 'name' | 'email')}
                  className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="createdAt">Date Joined</option>
                  <option value="name">Name</option>
                  <option value="email">Email</option>
                </select>
                <button
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="p-2 hover:bg-blue-50 rounded-lg transition-colors border border-gray-200"
                  title={`Sort ${sortOrder === 'asc' ? 'descending' : 'ascending'}`}
                >
                  {sortOrder === 'asc' ? <SortAsc className="h-4 w-4 text-blue-600" /> : <SortDesc className="h-4 w-4 text-blue-600" />}
                </button>
              </div>
            </div>
            
            {selectedCustomers.length > 0 && (
              <div className="flex items-center gap-3 bg-red-50 px-4 py-2 rounded-lg border border-red-200">
                <span className="text-sm font-medium text-red-700">{selectedCustomers.length} selected</span>
                <button
                  onClick={handleBulkDelete}
                  className="px-3 py-1.5 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm font-medium"
                >
                  Delete Selected
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-linear-to-r from-gray-50 to-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Customer Directory</h3>
                <p className="text-sm text-gray-500">Manage and view customer information</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                {filteredCustomers.length} customers
              </span>
            </div>
          </div>
        </div>
        
        {filteredCustomers.length === 0 ? (
          <div className="p-20 text-center">
            <div className="w-32 h-32 bg-linear-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
              <Users className="h-16 w-16 text-slate-400" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">No customers found</h3>
            <p className="text-slate-500 mb-8 max-w-md mx-auto leading-relaxed">No customers match your search criteria. Try adjusting your filters or search terms.</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setDateRange('all');
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-linear-to-r from-slate-50 to-slate-100 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left w-12">
                    <button
                      onClick={handleSelectAll}
                      className="p-1.5 hover:bg-blue-100 rounded-md transition-colors"
                    >
                      {selectedCustomers.length === filteredCustomers.length && filteredCustomers.length > 0 ? (
                        <CheckSquare className="h-4 w-4 text-blue-600" />
                      ) : (
                        <Square className="h-4 w-4 text-slate-400" />
                      )}
                    </button>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider min-w-50">Customer Details</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider min-w-45">Contact Information</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider w-40">Join Date</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider w-32">Addresses</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider w-32">Wishlist</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider w-32">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCustomers.map((customer) => (
                  <tr key={customer._id} className="hover:bg-slate-50/50 transition-all duration-200 group">
                    <td className="px-6 py-5 w-12">
                      <button
                        onClick={() => handleSelectCustomer(customer._id)}
                        className="p-1.5 hover:bg-blue-100 rounded-md transition-colors"
                      >
                        {selectedCustomers.includes(customer._id) ? (
                          <CheckSquare className="h-4 w-4 text-blue-600" />
                        ) : (
                          <Square className="h-4 w-4 text-slate-400 group-hover:text-slate-500" />
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-5 min-w-50">
                      <div className="flex items-center space-x-4">
                        <div className="shrink-0 relative">
                          {customer.imageURL ? (
                            <img
                              className="h-12 w-12 rounded-full object-cover ring-2 ring-white shadow-sm"
                              src={customer.imageURL}
                              alt={customer.name}
                            />
                          ) : (
                            <div className="h-12 w-12 rounded-full bg-linear-to-br from-blue-500 to-blue-600 flex items-center justify-center ring-2 ring-white shadow-sm">
                              <User className="h-6 w-6 text-white" />
                            </div>
                          )}
                          <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-400 rounded-full border-2 border-white"></div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold text-slate-900 truncate">{customer.name}</div>
                          <div className="text-xs text-slate-500 truncate font-mono bg-slate-100 px-2 py-0.5 rounded mt-1 inline-block">
                            #{customer._id.slice(-8).toUpperCase()}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 min-w-45">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <div className="p-1 bg-blue-100 rounded">
                            <Mail className="h-3 w-3 text-blue-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm text-slate-900 truncate font-medium">{customer.email}</div>
                          </div>
                        </div>
                        {customer.phoneNumber && (
                          <div className="flex items-center space-x-2">
                            <div className="p-1 bg-green-100 rounded">
                              <Phone className="h-3 w-3 text-green-600" />
                            </div>
                            <div className="text-sm text-slate-600 truncate">{customer.phoneNumber}</div>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-5 w-40">
                      <div className="text-sm font-medium text-slate-900">{new Date(customer.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                      <div className="text-xs text-slate-500 mt-1">
                        {Math.floor((Date.now() - new Date(customer.createdAt).getTime()) / (1000 * 60 * 60 * 24))} days ago
                      </div>
                    </td>
                    <td className="px-6 py-5 w-32">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-slate-400" />
                        <span className={cn(
                          'inline-flex items-center px-2.5 py-1.5 rounded-full text-xs font-semibold',
                          customer.addresses && customer.addresses.length > 0
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                        )}>
                          {customer.addresses?.length || 0}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5 w-32">
                      <div className="flex items-center space-x-2">
                        <Heart className="h-4 w-4 text-slate-400" />
                        <span className={cn(
                          'inline-flex items-center px-2.5 py-1.5 rounded-full text-xs font-semibold',
                          customer.wishList && customer.wishList.length > 0
                            ? 'bg-rose-100 text-rose-800 border border-rose-200'
                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                        )}>
                          {customer.wishList?.length || 0}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5 w-32">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setSelectedCustomer(customer)}
                          className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 border border-transparent hover:border-blue-200"
                          title="View details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(customer._id)}
                          className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 border border-transparent hover:border-red-200"
                          title="Delete customer"
                        >
                          <Trash2 className="h-4 w-4" />
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

      {/* Customer Details Modal */}
      <CustomerDetailsModal
        customer={selectedCustomer}
        isOpen={!!selectedCustomer}
        onClose={() => setSelectedCustomer(null)}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Delete Customer"
        message="Are you sure you want to delete this customer? This action cannot be undone."
        confirmText="Delete"
        isLoading={deleteCustomer.isPending}
        variant="danger"
      />

      {/* Bulk Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showBulkDeleteModal}
        onClose={() => setShowBulkDeleteModal(false)}
        onConfirm={confirmBulkDelete}
        title="Delete Customers"
        message={`Are you sure you want to delete ${selectedCustomers.length} customers? This action cannot be undone.`}
        confirmText="Delete All"
        isLoading={bulkDeleteCustomers.isPending}
        variant="danger"
      />
    </div>
  );
};

export default Customers;