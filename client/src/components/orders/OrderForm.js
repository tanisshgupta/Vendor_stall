import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ordersAPI } from '../../api/orders';
import { productsAPI } from '../../api/products';
import { toast } from 'react-toastify';
import { 
  X, 
  Plus, 
  Minus, 
  ShoppingCart, 
  MapPin, 
  Package,
  DollarSign,
  Trash2
} from 'lucide-react';

const OrderForm = ({ onClose }) => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [shippingAddress, setShippingAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [productsLoading, setProductsLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setProductsLoading(true);
      const response = await productsAPI.getProducts();
      setProducts(response.data || []);
    } catch (error) {
      toast.error('Failed to fetch products');
    } finally {
      setProductsLoading(false);
    }
  };

  const addProduct = (product) => {
    const existingProduct = selectedProducts.find(p => p.product._id === product._id);
    
    if (existingProduct) {
      if (existingProduct.quantity < product.stock) {
        setSelectedProducts(prev =>
          prev.map(p =>
            p.product._id === product._id
              ? { ...p, quantity: p.quantity + 1 }
              : p
          )
        );
      } else {
        toast.warning('Cannot add more than available stock');
      }
    } else {
      setSelectedProducts(prev => [
        ...prev,
        {
          product: product,
          quantity: 1,
          price: product.price
        }
      ]);
    }
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeProduct(productId);
      return;
    }

    const product = products.find(p => p._id === productId);
    if (newQuantity > product.stock) {
      toast.warning('Cannot exceed available stock');
      return;
    }

    setSelectedProducts(prev =>
      prev.map(p =>
        p.product._id === productId
          ? { ...p, quantity: newQuantity }
          : p
      )
    );
  };

  const removeProduct = (productId) => {
    setSelectedProducts(prev =>
      prev.filter(p => p.product._id !== productId)
    );
  };

  const calculateTotal = () => {
    return selectedProducts.reduce((total, item) => {
      return total + (item.quantity * item.price);
    }, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (selectedProducts.length === 0) {
      toast.error('Please select at least one product');
      return;
    }

    if (!shippingAddress.trim()) {
      toast.error('Please enter shipping address');
      return;
    }

    setLoading(true);

    try {
      const orderData = {
        products: selectedProducts.map(item => ({
          product: item.product._id,
          quantity: item.quantity,
          price: item.price
        })),
        totalAmount: calculateTotal(),
        shippingAddress: shippingAddress.trim(),
        supplier: selectedProducts[0].product.supplier._id || selectedProducts[0].product.supplier
      };

      await ordersAPI.createOrder(orderData);
      toast.success('Order placed successfully!');
      onClose();
    } catch (error) {
      toast.error(error.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '800px' }}>
        <div className="modal-header">
          <h3 className="modal-title">Place New Order</h3>
          <button onClick={onClose} className="modal-close" disabled={loading}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Available Products */}
            <div className="mb-6">
              <h4 className="font-semibold mb-3">Available Products</h4>
              {productsLoading ? (
                <div className="flex justify-center py-4">
                  <div className="spinner"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto">
                  {products.filter(p => p.stock > 0).map(product => (
                    <div key={product._id} className="border rounded-lg p-3">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h5 className="font-medium">{product.name}</h5>
                          <p className="text-sm text-gray-600">{product.description}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => addProduct(product)}
                          className="btn btn-primary btn-sm"
                          disabled={loading}
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="font-medium text-green-600">₹{product.price}</span>
                        <span className="text-gray-500">{product.stock} available</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Selected Products */}
            <div className="mb-6">
              <h4 className="font-semibold mb-3">Selected Products</h4>
              {selectedProducts.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No products selected</p>
              ) : (
                <div className="space-y-3">
                  {selectedProducts.map(item => (
                    <div key={item.product._id} className="border rounded-lg p-3">
                      <div className="flex justify-between items-center">
                        <div className="flex-1">
                          <h5 className="font-medium">{item.product.name}</h5>
                          <p className="text-sm text-gray-600">₹{item.price} each</p>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                              className="btn btn-outline btn-sm"
                              disabled={loading}
                            >
                              <Minus size={14} />
                            </button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                              className="btn btn-outline btn-sm"
                              disabled={loading}
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                          
                          <div className="text-right min-w-20">
                            <div className="font-medium">₹{(item.quantity * item.price).toFixed(2)}</div>
                          </div>
                          
                          <button
                            type="button"
                            onClick={() => removeProduct(item.product._id)}
                            className="btn btn-danger btn-sm"
                            disabled={loading}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Shipping Address */}
            <div className="mb-6">
              <label htmlFor="shippingAddress" className="form-label">
                <MapPin size={16} className="inline mr-2" />
                Shipping Address
              </label>
              <textarea
                id="shippingAddress"
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                className="form-control"
                rows="3"
                placeholder="Enter complete shipping address"
                required
                disabled={loading}
              />
            </div>

            {/* Order Summary */}
            {selectedProducts.length > 0 && (
              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3">Order Summary</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span>Total Items:</span>
                    <span>{selectedProducts.reduce((sum, item) => sum + item.quantity, 0)}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span>Subtotal:</span>
                    <span>₹{calculateTotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center font-semibold text-lg border-t pt-2">
                    <span>Total Amount:</span>
                    <span className="text-green-600">₹{calculateTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="modal-footer">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || selectedProducts.length === 0}
            >
              {loading ? (
                <>
                  <div className="spinner mr-2"></div>
                  Placing Order...
                </>
              ) : (
                <>
                  <ShoppingCart size={16} className="mr-2" />
                  Place Order (₹{calculateTotal().toFixed(2)})
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrderForm;