import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ordersAPI } from '../../api/orders';
import { toast } from 'react-toastify';
import { 
  ShoppingBag, 
  Eye, 
  Calendar, 
  DollarSign, 
  Package, 
  User,
  MapPin,
  Filter,
  Search,
  RefreshCw
} from 'lucide-react';
import OrderDetails from './OrderDetails';

const OrderList = () => {
  const { user, isVendor, isSupplier } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'processing', label: 'Processing' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      let response;
      
      if (isVendor()) {
        response = await ordersAPI.getVendorOrders();
      } else if (isSupplier()) {
        response = await ordersAPI.getSupplierOrders();
      } else {
        response = await ordersAPI.getOrders();
      }
      
      setOrders(response.data || []);
    } catch (error) {
      toast.error('Failed to fetch orders');
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  const handleOrderDetailsClose = () => {
    setShowOrderDetails(false);
    setSelectedOrder(null);
    fetchOrders(); // Refresh orders in case status was updated
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

  const filteredOrders = orders.filter(order => {
    const matchesStatus = !statusFilter || order.status === statusFilter;
    const matchesSearch = !searchTerm || 
      order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.shippingAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (isVendor() && order.supplier?.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (isSupplier() && order.vendor?.name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesStatus && matchesSearch;
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
            <h1 className="text-3xl font-bold mb-2">
              {isVendor() ? 'My Orders' : 'Orders Received'}
            </h1>
            <p className="text-gray-600">
              {isVendor() 
                ? 'Track your orders and delivery status' 
                : 'Manage incoming orders from vendors'
              }
            </p>
          </div>
          <button
            onClick={fetchOrders}
            className="btn btn-secondary"
            disabled={loading}
          >
            <RefreshCw size={16} className="mr-2" />
            Refresh
          </button>
        </div>

        {/* Filters */}
        <div className="card mb-6">
          <div className="card-body">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="form-control pl-10"
                />
              </div>
              <div className="relative">
                <Filter size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="form-select pl-10"
                >
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="empty-state">
            <ShoppingBag className="empty-state-icon" />
            <h3 className="empty-state-title">No Orders Found</h3>
            <p className="empty-state-description">
              {searchTerm || statusFilter 
                ? 'Try adjusting your search or filter criteria'
                : isVendor()
                  ? 'You haven\'t placed any orders yet'
                  : 'No orders have been received yet'
              }
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div key={order._id} className="card hover:shadow-lg transition-shadow">
                <div className="card-body">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    {/* Order Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-3">
                        <h3 className="font-semibold text-lg">
                          Order #{order._id.slice(-8)}
                        </h3>
                        <span className={`badge ${getStatusBadge(order.status)}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar size={16} className="text-gray-500" />
                          <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <DollarSign size={16} className="text-gray-500" />
                          <span className="font-medium">₹{order.totalAmount}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Package size={16} className="text-gray-500" />
                          <span>{order.products?.length || 0} items</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <User size={16} className="text-gray-500" />
                          <span>
                            {isVendor() 
                              ? order.supplier?.name || 'Unknown Supplier'
                              : order.vendor?.name || 'Unknown Vendor'
                            }
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-2 mt-2">
                        <MapPin size={16} className="text-gray-500 mt-0.5" />
                        <span className="text-sm text-gray-600">
                          {order.shippingAddress}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleViewOrder(order)}
                        className="btn btn-outline btn-sm"
                      >
                        <Eye size={16} className="mr-2" />
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Order Details Modal */}
        {showOrderDetails && selectedOrder && (
          <OrderDetails
            order={selectedOrder}
            onClose={handleOrderDetailsClose}
          />
        )}
      </div>
    </div>
  );
};

export default OrderList;