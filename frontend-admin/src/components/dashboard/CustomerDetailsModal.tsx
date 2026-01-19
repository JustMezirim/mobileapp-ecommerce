import React from 'react';
import { User, X } from 'lucide-react';

interface Address {
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  [key: string]: unknown;
}

interface Customer {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
  imageURL?: string;
  addresses?: Address[];
  wishList?: unknown[];
}

interface CustomerDetailsModalProps {
  customer: Customer | null;
  isOpen: boolean;
  onClose: () => void;
}

const CustomerDetailsModal: React.FC<CustomerDetailsModalProps> = ({ customer, isOpen, onClose }) => {
  if (!isOpen || !customer) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Customer Details</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              {customer.imageURL ? (
                <img
                  className="h-16 w-16 rounded-full object-cover"
                  src={customer.imageURL}
                  alt={customer.name}
                />
              ) : (
                <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center">
                  <User className="h-8 w-8 text-gray-400" />
                </div>
              )}
              <div>
                <h4 className="text-xl font-semibold text-gray-900">{customer.name}</h4>
                <p className="text-gray-600">{customer.email}</p>
                <p className="text-sm text-gray-500">Customer since {new Date(customer.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
            
            <div>
              <h5 className="font-medium text-gray-900 mb-2">Addresses ({customer.addresses?.length || 0})</h5>
              {customer.addresses && customer.addresses.length > 0 ? (
                <div className="space-y-2">
                  {customer.addresses.map((address, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-900">
                        {address.street && `${address.street}, `}
                        {address.city && `${address.city}, `}
                        {address.state && `${address.state} `}
                        {address.zipCode && address.zipCode}
                      </p>
                      {address.country && <p className="text-xs text-gray-500">{address.country}</p>}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No addresses added</p>
              )}
            </div>
            
            <div>
              <h5 className="font-medium text-gray-900 mb-2">Wishlist ({customer.wishList?.length || 0} items)</h5>
              <p className="text-sm text-gray-500">
                {customer.wishList?.length ? 
                  `Customer has ${customer.wishList.length} items in wishlist` : 
                  'No items in wishlist'
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetailsModal;