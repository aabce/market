'use strict';

const mongoose = require('mongoose');
const ObjectId = mongoose.ObjectId;

const orderSchema = new mongoose.Schema({
  customer_id: {
    type: ObjectId,
  },
  products: [
    {
      _id: false,
      product_id: {
        type: ObjectId,
      },
      quantity: {
        type: Number,
      }
    }
  ],
  status: {
    type: String,
    enum: ['open', 'fulfilled', 'rejected', 'archived'],
    default: 'open',
  },
  promo_code: {
    type: String,
    default: null,
  },
  created_at: {
    type: Date,
    default: null,
  },
  updated_at: {
    type: Date,
    default: null,
  },
  price: {
    amount: {
      type: Number,
    },
    currency: {
      type: String,
    },
    discount_amount: {
      type: Number,
    },
    // discount_rate: {
    //   type: Number,
    // },
  },
  shipping: {
    method: {
      type: String,
    },
    amount: {
      type: Number,
    },
    currency: {
      type: String,
    },
    is_ems: {
      type: Boolean,
    },
    tracking_number: {
      type: String,
    },
  }
});

mongoose.model('Order', orderSchema, 'orders');
