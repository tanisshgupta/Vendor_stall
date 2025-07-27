import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { 
  X, 
  Package, 
  DollarSign, 
  Tag, 
  Hash, 
  User, 
  MapPin, 
  Calendar,
  ShoppingCart,
  AlertCircle
} from 'lucide-react';

const ProductDetails = ({ product, onClose }) => {
  const { isVendor } = useAuth();

  const handleOrder = () => {
    // This would integrate with order creation
    toast.info('Order functionality will be implemented soon!');
  };

  const getStockStatus = (stock) => {
    if (stock === 0) return { text: 'Out of Stock', class: 'badge-danger' };
    if (stock < 10) return { text: 'Low Stock', class: 'badge-warning' };
    return { text: 'In Stock', class: 'badge-success' };
  };

  const stockStatus = getStockStatus(product.stock);

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3 className="modal-title">Product Details</h3>
          <button onClick={onClose} className="modal-close">
            <X size={24} />
          </button>
        </div>

        <div className="modal-body">
          <div className="space-y-6">
            {/* Product Header */}
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
                <span className={`badge ${stockStatus.class}`}>
                  {stockStatus.text}
                </span>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-green-600">
                  ₹{product.price}
                </div>
                <div className="text-sm text-gray-500">per unit</div>
              </div>
            </div>

            {/* Product Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Package size={20} className="text-gray-500 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Description</p>
                    <p className="font-medium">{product.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Tag size={20} className="text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Category</p>
                    <p className="font-medium capitalize">{product.category}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Hash size={20} className="text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Available Stock</p>
                    <p className="font-medium">{product.stock} units</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {product.supplier && (
                  <>
                    <div className="flex items-center gap-3">
                      <User size={20} className="text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">Supplier</p>
                        <p className="font-medium">{product.supplier.name}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <MapPin size={20} className="text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">Location</p>
                        <p className="font-medium">{product.supplier.location}</p>
                      </div>
                    </div>
                  </>
                )}

                <div className="flex items-center gap-3">
                  <Calendar size={20} className="text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Listed On</p>
                    <p className="font-medium">
                      {new Date(product.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Stock Warning */}
            {product.stock < 10 && product.stock > 0 && (
              <div className="flex items-center gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <AlertCircle size={20} className="text-yellow-600" />
                <div>
                  <p className="font-medium text-yellow-800">Low Stock Alert</p>
                  <p className="text-sm text-yellow-700">
                    Only {product.stock} units remaining. Order soon!
                  </p>
                </div>
              </div>
            )}

            {/* Out of Stock Warning */}
            {product.stock === 0 && (
              <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle size={20} className="text-red-600" />
                <div>
                  <p className="font-medium text-red-800">Out of Stock</p>
                  <p className="text-sm text-red-700">
                    This product is currently unavailable.
                  </p>
                </div>
              </div>
            )}

            {/* Pricing Breakdown */}
            <div className="border-t pt-4">
              <h4 className="font-semibold mb-3">Pricing Information</h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span>Unit Price:</span>
                  <span className="font-medium">₹{product.price}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span>Bulk Order (10+ units):</span>
                  <span className="font-medium text-green-600">
                    ₹{(product.price * 0.95).toFixed(2)} (5% off)
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Wholesale (50+ units):</span>
                  <span className="font-medium text-green-600">
                    ₹{(product.price * 0.9).toFixed(2)} (10% off)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button onClick={onClose} className="btn btn-secondary">
            Close
          </button>
          {isVendor() && product.stock > 0 && (
            <button onClick={handleOrder} className="btn btn-primary">
              <ShoppingCart size={16} className="mr-2" />
              Place Order
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;