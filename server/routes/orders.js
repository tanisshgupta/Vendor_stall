const express = require('express');
const {
  createOrder,
  getOrders,
  getOrder,
  updateOrderStatus,
  deleteOrder,
  getVendorOrders,
  getSupplierOrders
} = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.route('/')
  .get(protect, getOrders)
  .post(protect, authorize('vendor'), createOrder);

router.route('/vendor')
  .get(protect, authorize('vendor'), getVendorOrders);

router.route('/supplier')
  .get(protect, authorize('supplier'), getSupplierOrders);

router.route('/:id')
  .get(protect, getOrder)
  .put(protect, updateOrderStatus)
  .delete(protect, deleteOrder);

module.exports = router;