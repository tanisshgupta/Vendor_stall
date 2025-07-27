import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ordersAPI } from '../api/orders';
import { productsAPI } from '../api/products';
import { toast } from 'react-toastify';
import { 
  ShoppingBag, 
  Package, 
  TrendingUp, 
  Users,
  Plus,
  Eye,
  BarChart3,
  Calendar,
  DollarSign,
  AlertCircle
} from 'lucide-react';
import OrderForm from '../components/orders/OrderForm';

const Dashboard = () => {
  const { user, isVendor, isSupplier } = useAuth();
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalProducts: 0,
    totalRevenue: 0,
    pendingOrders: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [recentProducts, setRecentProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showOrderForm, setShowOrderForm] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch orders
      let ordersResponse;
      if (isVendor()) {
        ordersResponse = await ordersAPI.getVendorOrders();
      } else if (isSupplier()) {
        ordersResponse = await ordersAPI.getSupplierOrders();
      }
      
      const orders = ordersResponse?.data || [];
      setRecentOrders(orders.slice(0, 5)); // Get recent 5 orders
      
      // Calculate stats from orders
      const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
      const pendingOrders = orders.filter(order => order.status === 'pending').length;
      
      setStats(prev => ({
        ...prev,
        totalOrders: orders.length,
        totalRevenue,
        pendingOrders
      }));

      // Fetch products for suppliers
      if (isSupplier()) {
        const productsResponse = await productsAPI.getProducts();
        const products = productsResponse?.data || [];
        const userProducts = products.filter(product => 
          product.supplier?._id === user._id || product.supplier === user._id
        );
        setRecentProducts(userProducts.slice(0, 5));
        setStats(prev => ({
          ...prev,
          totalProducts: userProducts.length
        }));
      } else if (isVendor()) {
        // For vendors, show available products
        const productsResponse = await productsAPI.getProducts();
        const products = productsResponse?.data || [];
        setRecentProducts(products.slice(0, 5));
        setStats(prev => ({
          ...prev,
          totalProducts: products.length
        }));
      }
      
    } catch (error) {
      toast.error('Failed to fetch dashboard data');
      console.error('Dashboard error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      pending: 'badge-warning',
      processing: 'badge-info',
      shipped: 'badge-secondary',
      delivered: 'badge-success',
      cancelled: 'badge-danger',
    };
    return statusClasses[status] || 'badge-secondary';
  };

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
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600">
            {isVendor() 
              ? 'Manage your orders and discover new suppliers' 
              : 'Track your sales and manage your inventory'
            }
          </p>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid mb-8">
          <div className="stat-card">
            <div className="flex items-center justify-between">
              <div>
                <div className="stat-value">{stats.totalOrders}</div>
                <div className="stat-label">
                  {isVendor() ? 'Orders Placed' : 'Orders Received'}
                </div>
              </div>
              <ShoppingBag size={32} className="text-blue-500" />
            </div>
          </div>

          <div className="stat-card">
            <div className="flex items-center justify-between">
              <div>
                <div className="stat-value">{stats.totalProducts}</div>
                <div className="stat-label">
                  {isVendor() ? 'Available Products' : 'Products Listed'}
                </div>
              </div>
              <Package size={32} className="text-green-500" />
            </div>
          </div>

          <div className="stat-card">
            <div className="flex items-center justify-between">
              <div>
                <div className="stat-value">₹{stats.totalRevenue.toLocaleString()}</div>
                <div className="stat-label">
                  {isVendor() ? 'Total Spent' : 'Total Revenue'}
                </div>
              </div>
              <TrendingUp size={32} className="text-purple-500" />
            </div>
          </div>

          <div className="stat-card">
            <div className="flex items-center justify-between">
              <div>
                <div className="stat-value">{stats.pendingOrders}</div>
                <div className="stat-label">Pending Orders</div>
              </div>
              <AlertCircle size={32} className="text-orange-500" />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card mb-8">
          <div className="card-header">
            <h3 className="card-title">Quick Actions</h3>
          </div>
          <div className="card-body">
            <div className="flex flex-wrap gap-4">
              {isVendor() && (
                <>
                  <button
                    onClick={() => setShowOrderForm(true)}
                    className="btn btn-primary"
                  >
                    <Plus size={20} className="mr-2" />
                    Place New Order
                  </button>
                  <Link to="/products" className="btn btn-secondary">
                    <Package size={20} className="mr-2" />
                    Browse Products
                  </Link>
                  <Link to="/vendor-orders" className="btn btn-outline">
                    <BarChart3 size={20} className="mr-2" />
                    View All Orders
                  </Link>
                </>
              )}
              
              {isSupplier() && (
                <>
                  <Link to="/products" className="btn btn-primary">
                    <Plus size={20} className="mr-2" />
                    Add Product
                  </Link>
                  <Link to="/supplier-orders" className="btn btn-secondary">
                    <BarChart3 size={20} className="mr-2" />
                    Manage Orders
                  </Link>
                  <Link to="/products" className="btn btn-outline">
                    <Package size={20} className="mr-2" />
                    View Inventory
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Orders */}
          <div className="card">
            <div className="card-header">
              <div className="flex justify-between items-center">
                <h3 className="card-title">Recent Orders</h3>
                <Link 
                  to={isVendor() ? "/vendor-orders" : "/supplier-orders"} 
                  className="btn btn-outline btn-sm"
                >
                  <Eye size={16} className="mr-2" />
                  View All
                </Link>
              </div>
            </div>
            <div className="card-body">
              {recentOrders.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <ShoppingBag size={48} className="mx-auto mb-4 opacity-50" />
                  <p>No orders yet</p>
                  {isVendor() && (
                    <button
                      onClick={() => setShowOrderForm(true)}
                      className="btn btn-primary btn-sm mt-4"
                    >
                      Place Your First Order
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div key={order._id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">
                          Order #{order._id.slice(-8)}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <Calendar size={14} />
                            {new Date(order.createdAt).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <DollarSign size={14} />
                            ₹{order.totalAmount}
                          </span>
                        </div>
                      </div>
                      <span className={`badge ${getStatusBadge(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Recent Products */}
          <div className="card">
            <div className="card-header">
              <div className="flex justify-between items-center">
                <h3 className="card-title">
                  {isVendor() ? 'Available Products' : 'Your Products'}
                </h3>
                <Link to="/products" className="btn btn-outline btn-sm">
                  <Eye size={16} className="mr-2" />
                  View All
                </Link>
              </div>
            </div>
            <div className="card-body">
              {recentProducts.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Package size={48} className="mx-auto mb-4 opacity-50" />
                  <p>
                    {isVendor() ? 'No products available' : 'No products listed yet'}
                  </p>
                  {isSupplier() && (
                    <Link to="/products" className="btn btn-primary btn-sm mt-4">
                      Add Your First Product
                    </Link>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {recentProducts.map((product) => (
                    <div key={product._id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{product.name}</div>
                        <div className="text-sm text-gray-500">
                          {product.category} • Stock: {product.stock}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-green-600">₹{product.price}</div>
                        <div className="text-sm text-gray-500">per unit</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Order Form Modal */}
        {showOrderForm && (
          <OrderForm onClose={() => setShowOrderForm(false)} />
        )}
      </div>
    </div>
  );
};

export default Dashboard;