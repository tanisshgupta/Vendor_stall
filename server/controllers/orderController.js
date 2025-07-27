const Order = require('../models/Order');
const Product = require('../models/Product');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Create new order
// @route   POST /api/v1/orders
// @access  Private (Vendor)
exports.createOrder = asyncHandler(async (req, res, next) => {
  const { products, shippingAddress } = req.body;

  if (!products || products.length === 0) {
    return next(new ErrorResponse('Please add products to the order', 400));
  }

  // Calculate total amount and verify products
  let totalAmount = 0;
  const orderProducts = [];

  for (const item of products) {
    const product = await Product.findById(item.product);
    
    if (!product) {
      return next(new ErrorResponse(`Product not found with id of ${item.product}`, 404));
    }

    if (product.stock < item.quantity) {
      return next(new ErrorResponse(`Not enough stock for product ${product.name}`, 400));
    }

    totalAmount += product.price * item.quantity;
    orderProducts.push({
      product: item.product,
      quantity: item.quantity,
      price: product.price
    });

    // Reduce product stock
    product.stock -= item.quantity;
    await product.save();
  }

  // Get supplier from first product
  const firstProduct = await Product.findById(products[0].product);
  const supplierId = firstProduct.supplier;

  const order = await Order.create({
    products: orderProducts,
    totalAmount,
    shippingAddress,
    vendor: req.user.id,
    supplier: supplierId
  });

  res.status(201).json({
    success: true,
    data: order
  });
});

// @desc    Get all orders
// @route   GET /api/v1/orders
// @access  Private (Admin)
exports.getOrders = asyncHandler(async (req, res, next) => {
  const orders = await Order.find()
    .populate('vendor', 'name email location')
    .populate('supplier', 'name email location')
    .populate('products.product', 'name price category')
    .sort('-createdAt');
  res.status(200).json({
    success: true,
    count: orders.length,
    data: orders
  });
});

// @desc    Get single order
// @route   GET /api/v1/orders/:id
// @access  Private
exports.getOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id)
    .populate({
      path: 'vendor',
      select: 'name email location'
    })
    .populate({
      path: 'supplier',
      select: 'name email location'
    })
    .populate({
      path: 'products.product',
      select: 'name price category'
    });

  if (!order) {
    return next(new ErrorResponse(`Order not found with id of ${req.params.id}`, 404));
  }

  // Make sure user is order vendor, supplier or admin
  if (
    order.vendor._id.toString() !== req.user.id &&
    order.supplier._id.toString() !== req.user.id &&
    req.user.role !== 'admin'
  ) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to access this order`,
        401
      )
    );
  }

  res.status(200).json({
    success: true,
    data: order
  });
});

// @desc    Update order status
// @route   PUT /api/v1/orders/:id
// @access  Private (Supplier)
exports.updateOrderStatus = asyncHandler(async (req, res, next) => {
  const { status } = req.body;
  const allowedStatus = ['processing', 'shipped', 'delivered', 'cancelled'];

  if (!status || !allowedStatus.includes(status)) {
    return next(new ErrorResponse('Please provide a valid status', 400));
  }

  let order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorResponse(`Order not found with id of ${req.params.id}`, 404));
  }

  // Make sure user is order supplier
  if (order.supplier.toString() !== req.user.id) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this order`,
        401
      )
    );
  }

  // Special handling for cancelled orders
  if (status === 'cancelled') {
    // Restore product stock
    for (const item of order.products) {
      const product = await Product.findById(item.product);
      product.stock += item.quantity;
      await product.save();
    }
  }

  order.status = status;
  await order.save();

  res.status(200).json({
    success: true,
    data: order
  });
});

// @desc    Delete order
// @route   DELETE /api/v1/orders/:id
// @access  Private (Admin)
exports.deleteOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorResponse(`Order not found with id of ${req.params.id}`, 404));
  }

  // Restore product stock if order wasn't cancelled
  if (order.status !== 'cancelled') {
    for (const item of order.products) {
      const product = await Product.findById(item.product);
      product.stock += item.quantity;
      await product.save();
    }
  }

  await order.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Get orders for logged in vendor
// @route   GET /api/v1/orders/vendor
// @access  Private (Vendor)
exports.getVendorOrders = asyncHandler(async (req, res, next) => {
  const orders = await Order.find({ vendor: req.user.id })
    .populate({
      path: 'supplier',
      select: 'name location'
    })
    .populate({
      path: 'products.product',
      select: 'name price'
    })
    .sort('-createdAt');

  res.status(200).json({
    success: true,
    count: orders.length,
    data: orders
  });
});

// @desc    Get orders for logged in supplier
// @route   GET /api/v1/orders/supplier
// @access  Private (Supplier)
exports.getSupplierOrders = asyncHandler(async (req, res, next) => {
  const orders = await Order.find({ supplier: req.user.id })
    .populate({
      path: 'vendor',
      select: 'name location'
    })
    .populate({
      path: 'products.product',
      select: 'name price'
    })
    .sort('-createdAt');

  res.status(200).json({
    success: true,
    count: orders.length,
    data: orders
  });
});