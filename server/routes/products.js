const express = require('express');
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router
  .route('/')
  .get(getProducts)
  .post(protect, authorize('supplier'), createProduct);

router
  .route('/:id')
  .get(getProduct)
  .put(protect, authorize('supplier'), updateProduct)
  .delete(protect, authorize('supplier'), deleteProduct);

module.exports = router;