'use strict';

const mongoose = require('mongoose');
const ObjectId = mongoose.ObjectId;

const cartSchema = new mongoose.Schema({
  customer_id: {
    type: ObjectId,
  },
  products: [
    {
      _id: false,
      product_id: {
        type: ObjectId,
        // unique: true,
      },
      quantity: {
        type: Number,
      }
    }
  ],
  status: {
    type: String,
    enum: ['active', 'pending', 'complete', 'expiring', 'expired'],
    default: 'active',
  },
  date: {
    type: Date,
    default: null,
    index: {
      expires: '14d'
    }
  }
});

mongoose.model('Cart', cartSchema, 'carts');
