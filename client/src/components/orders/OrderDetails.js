import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ordersAPI } from '../../api/orders';
import { toast } from 'react-toastify';
import { 
  X, 
  Package, 
  DollarSign, 
  MapPin, 
  Calendar,
  User,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle
} from 'lucide-react';

const OrderDetails = ({ order, onClose }) => {
  const { isSupplier } = useAuth();
  const [updating, setUpdating] = useState(false);

  const statusOptions = [
    { value: 'pending', label: 'Pending', icon: Clock, color: 'text-yellow-600' },
    { value: 'processing', label: 'Processing', icon: AlertCircle, color: 'text-blue-600' },
    { value: 'shipped', label: 'Shipped', icon: Truck, color: 'text-purple-600' },
    { value: 'delivered', label: 'Delivered', icon: CheckCircle, color: 'text-green-600' },
    { value: 'cancelled', label: 'Cancelled', icon: XCircle, color: 'text-red-600' },
  ];

  const getStatusInfo = (status) => {
    return statusOptions.find(option => option.value === status) || statusOptions[0];
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

  const handleStatusUpdate = async (newStatus) => {
    if (!window.confirm(`Are you sure you want to update the status to "${newStatus}"?`)) {
      return;
    }

    setUpdating(true);
    try {
      await ordersAPI.updateOrderStatus(order._id, newStatus);
      toast.success('Order status updated successfully');
      onClose(); // This will trigger a refresh in the parent component
    } catch (error) {
      toast.error('Failed to update order status');
    } finally {
      setUpdating(false);
    }
  };

  const currentStatusInfo = getStatusInfo(order.status);
  const StatusIcon = currentStatusInfo.icon;

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '700px' }}>
        <div className="modal-header">
          <h3 className="modal-title">Order Details</h3>
          <button onClick={onClose} className="modal-close" disabled={updating}>
            <X size={24} />
          </button>
        </div>

        <div className="modal-body">
          <div className="space-y-6">
            {/* Order Header */}
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold mb-2">
                  Order #{order._id.slice(-8)}
                </h2>
                <div className="flex items-center gap-2">
                  <StatusIcon size={20} className={currentStatusInfo.color} />
                  <span className={`badge ${getStatusBadge(order.status)}`}>
                    {currentStatusInfo.label}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-green-600">
                  ₹{order.totalAmount}
                </div>
                <div className="text-sm text-gray-500">Total Amount</div>
              </div>
            </div>

            {/* Order Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Calendar size={20} className="text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Order Date</p>
                    <p className="font-medium">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin size={20} className="text-gray-500 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Shipping Address</p>
                    <p className="font-medium">{order.shippingAddress}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {order.vendor && (
                  <div className="flex items-center gap-3">
                    <User size={20} className="text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Vendor</p>
                      <p className="font-medium">{order.vendor.name}</p>
                      <p className="text-sm text-gray-600">{order.vendor.location}</p>
                    </div>
                  </div>
                )}

                {order.supplier && (
                  <div className="flex items-center gap-3">
                    <User size={20} className="text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Supplier</p>
                      <p className="font-medium">{order.supplier.name}</p>
                      <p className="text-sm text-gray-600">{order.supplier.location}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Products List */}
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Package size={20} />
                Ordered Products
              </h4>
              <div className="space-y-3">
                {order.products?.map((item, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h5 className="font-medium mb-1">
                          {item.product?.name || 'Product Name'}
                        </h5>
                        <p className="text-sm text-gray-600 mb-2">
                          {item.product?.description || 'Product description'}
                        </p>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-gray-500">
                            Category: {item.product?.category || 'N/A'}
                          </span>
                          <span className="text-gray-500">
                            Quantity: {item.quantity}
                          </span>
                          <span className="text-gray-500">
                            Unit Price: ₹{item.price}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-lg">
                          ₹{(item.quantity * item.price).toFixed(2)}
                        </div>
                        <div className="text-sm text-gray-500">Subtotal</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="border-t pt-4">
              <h4 className="font-semibold mb-3">Order Summary</h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span>Total Items:</span>
                  <span>
                    {order.products?.reduce((sum, item) => sum + item.quantity, 0) || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span>Subtotal:</span>
                  <span>₹{order.totalAmount}</span>
                </div>
                <div className="flex justify-between items-center font-semibold text-lg border-t pt-2">
                  <span>Total Amount:</span>
                  <span className="text-green-600">₹{order.totalAmount}</span>
                </div>
              </div>
            </div>

            {/* Status Update (Suppliers only) */}
            {isSupplier() && order.status !== 'delivered' && order.status !== 'cancelled' && (
              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3">Update Order Status</h4>
                <div className="flex flex-wrap gap-2">
                  {statusOptions
                    .filter(option => option.value !== order.status)
                    .filter(option => {
                      // Only show logical next steps
                      if (order.status === 'pending') return ['processing', 'cancelled'].includes(option.value);
                      if (order.status === 'processing') return ['shipped', 'cancelled'].includes(option.value);
                      if (order.status === 'shipped') return ['delivered'].includes(option.value);
                      return false;
                    })
                    .map(option => {
                      const Icon = option.icon;
                      return (
                        <button
                          key={option.value}
                          onClick={() => handleStatusUpdate(option.value)}
                          disabled={updating}
                          className={`btn btn-outline btn-sm flex items-center gap-2 ${
                            option.value === 'cancelled' ? 'btn-danger' : 'btn-primary'
                          }`}
                        >
                          <Icon size={16} />
                          Mark as {option.label}
                        </button>
                      );
                    })}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="modal-footer">
          <button onClick={onClose} className="btn btn-secondary" disabled={updating}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;