import React from 'react';
import { X, Upload, Image as ImageIcon } from 'lucide-react';

interface ProductType {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  images?: string[];
}

interface ProductFormData {
  name: string;
  description: string;
  price: string;
  stock: string;
  category: string;
  images: FileList | [];
}

interface ProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  formData: ProductFormData;
  setFormData: React.Dispatch<React.SetStateAction<ProductFormData>>;
  editingProduct: ProductType | null;
  isLoading: boolean;
}

const ProductForm: React.FC<ProductFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  formData,
  setFormData,
  editingProduct,
  isLoading
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h2>
            <p className="text-gray-600 mt-1">
              {editingProduct ? 'Update product information' : 'Fill in the details to create a new product'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/50 rounded-xl transition-colors"
          >
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>
        <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
          <form onSubmit={onSubmit} className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Product Name *</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-colors"
                        placeholder="Enter product name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                      <input
                        type="text"
                        value={formData.category}
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                        className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-colors"
                        placeholder="e.g., Electronics, Clothing, Books"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        rows={4}
                        className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-colors resize-none"
                        placeholder="Describe your product in detail..."
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Pricing & Inventory</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Price (₦) *</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">₦</span>
                        <input
                          type="number"
                          step="0.01"
                          value={formData.price}
                          onChange={(e) => setFormData({...formData, price: e.target.value})}
                          className="w-full pl-8 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-colors"
                          placeholder="0.00"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Stock Quantity *</label>
                      <input
                        type="number"
                        value={formData.stock}
                        onChange={(e) => setFormData({...formData, stock: e.target.value})}
                        className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-colors"
                        placeholder="0"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Images</h3>
                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Upload className="h-8 w-8 text-blue-600" />
                      </div>
                      <div className="mb-4">
                        <label className="cursor-pointer">
                          <span className="text-blue-600 font-medium hover:text-blue-700">Click to upload</span>
                          <span className="text-gray-500"> or drag and drop</span>
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={(e) => setFormData({...formData, images: e.target.files || []})}
                            className="hidden"
                          />
                        </label>
                      </div>
                      <p className="text-sm text-gray-500">PNG, JPG, GIF up to 10MB each (Max 3 images)</p>
                    </div>
                    
                    {formData.images && formData.images.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-700">Selected Files:</p>
                        <div className="space-y-2">
                          {Array.from(formData.images).map((file, index) => (
                            <div key={index} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200">
                              <ImageIcon className="h-5 w-5 text-gray-400" />
                              <span className="text-sm text-gray-700 flex-1 truncate">{file.name}</span>
                              <span className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {editingProduct && editingProduct.images && editingProduct.images.length > 0 && (
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Images</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {editingProduct.images.map((image, index) => (
                        <div key={index} className="relative group">
                          <img 
                            src={image} 
                            alt={`Product ${index + 1}`} 
                            className="w-full h-24 object-cover rounded-lg border border-gray-200"
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                            <button 
                              type="button"
                              className="p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-4 pt-8 border-t border-gray-100 mt-8">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-100 text-gray-700 py-4 px-6 rounded-xl hover:bg-gray-200 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-6 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Saving...
                  </div>
                ) : (
                  editingProduct ? 'Update Product' : 'Create Product'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductForm;