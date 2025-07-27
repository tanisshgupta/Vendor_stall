const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter product name'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please enter product description']
  },
  price: {
    type: Number,
    required: [true, 'Please enter product price'],
    maxlength: [8, 'Price cannot exceed 8 characters']
  },
  category: {
    type: String,
    required: [true, 'Please select category'],
    enum: ['vegetables', 'spices', 'grains', 'dairy', 'others']
  },
  stock: {
    type: Number,
    required: [true, 'Please enter product stock'],
    maxlength: [4, 'Stock cannot exceed 4 characters'],
    default: 1
  },
  supplier: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Product', productSchema);