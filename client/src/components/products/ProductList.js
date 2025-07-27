import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { productsAPI } from '../../api/products';
import { toast } from 'react-toastify';
import { 
  Package, 
  Plus, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  ShoppingCart,
  Eye,
  DollarSign,
  Tag
} from 'lucide-react';
import ProductForm from './ProductForm';
import ProductDetails from './ProductDetails';
import OrderForm from '../orders/OrderForm';

const ProductList = () => {
  const { user, isSupplier, isVendor } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showProductForm, setShowProductForm] = useState(false);
  const [showProductDetails, setShowProductDetails] = useState(false);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const categories = ['vegetables', 'spices', 'grains', 'dairy', 'others'];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (selectedCategory) params.category = selectedCategory;
      
      const response = await productsAPI.getProducts(params);
      setProducts(response.data || []);
    } catch (error) {
      toast.error('Failed to fetch products');
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      fetchProducts();
    }, 500);

    return () => clearTimeout(delayedSearch);
  }, [searchTerm, selectedCategory]);

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      await productsAPI.deleteProduct(productId);
      toast.success('Product deleted successfully');
      fetchProducts();
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setIsEditing(true);
    setShowProductForm(true);
  };

  const handleViewProduct = (product) => {
    setSelectedProduct(product);
    setShowProductDetails(true);
  };

  const handleProductFormClose = () => {
    setShowProductForm(false);
    setSelectedProduct(null);
    setIsEditing(false);
    fetchProducts();
  };

  const handleProductDetailsClose = () => {
    setShowProductDetails(false);
    setSelectedProduct(null);
  };

  const handleOrderFormClose = () => {
    setShowOrderForm(false);
    fetchProducts(); // Refresh products to update stock
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="container">
        <div className="flex items-center justify-center min-h-screen">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="main-content">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Products</h1>
            <p className="text-gray-600">
              {isSupplier() ? 'Manage your product inventory' : 'Browse available products'}
            </p>
          </div>
          {isSupplier() && (
            <button
              onClick={() => setShowProductForm(true)}
              className="btn btn-primary"
            >
              <Plus size={20} className="mr-2" />
              Add Product
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="card mb-6">
          <div className="card-body">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="form-control pl-10"
                />
              </div>
              <div className="relative">
                <Filter size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="form-select pl-10"
                >
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="empty-state">
            <Package className="empty-state-icon" />
            <h3 className="empty-state-title">No Products Found</h3>
            <p className="empty-state-description">
              {searchTerm || selectedCategory 
                ? 'Try adjusting your search or filter criteria'
                : isSupplier() 
                  ? 'Start by adding your first product'
                  : 'No products are currently available'
              }
            </p>
            {isSupplier() && !searchTerm && !selectedCategory && (
              <button
                onClick={() => setShowProductForm(true)}
                className="btn btn-primary"
              >
                <Plus size={20} className="mr-2" />
                Add Your First Product
              </button>
            )}
          </div>
        ) : (
          <div className="product-grid">
            {filteredProducts.map((product) => (
              <div key={product._id} className="product-card">
                <div className="product-info">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="product-name">{product.name}</h3>
                    <span className="product-category">
                      {product.category}
                    </span>
                  </div>
                  
                  <p className="product-description">
                    {product.description}
                  </p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <DollarSign size={16} className="text-green-600" />
                      <span className="product-price">₹{product.price}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Package size={16} className="text-gray-500" />
                      <span className="product-stock">
                        {product.stock} in stock
                      </span>
                    </div>
                  </div>

                  {product.supplier && (
                    <div className="text-sm text-gray-500 mb-4">
                      Supplier: {product.supplier.name}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleViewProduct(product)}
                      className="btn btn-outline btn-sm flex-1"
                    >
                      <Eye size={16} className="mr-2" />
                      View
                    </button>
                    
                    {isVendor() && product.stock > 0 && (
                      <button
                        onClick={() => setShowOrderForm(true)}
                        className="btn btn-success btn-sm flex-1"
                      >
                        <ShoppingCart size={16} className="mr-2" />
                        Order
                      </button>
                    )}
                    
                    {isSupplier() && product.supplier?._id === user._id && (
                      <>
                        <button
                          onClick={() => handleEditProduct(product)}
                          className="btn btn-secondary btn-sm"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product._id)}
                          className="btn btn-danger btn-sm"
                        >
                          <Trash2 size={16} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Product Form Modal */}
        {showProductForm && (
          <ProductForm
            product={selectedProduct}
            isEditing={isEditing}
            onClose={handleProductFormClose}
          />
        )}

        {/* Product Details Modal */}
        {showProductDetails && selectedProduct && (
          <ProductDetails
            product={selectedProduct}
            onClose={handleProductDetailsClose}
          />
        )}

        {/* Order Form Modal */}
        {showOrderForm && (
          <OrderForm
            onClose={handleOrderFormClose}
          />
        )}
      </div>
    </div>
  );
};

export default ProductList;