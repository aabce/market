'use strict';

const mongoose = require('mongoose');
const ObjectId = mongoose.ObjectId;

const productSetSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  description: {
    en: {
      type: String,
      _id: false,
    },
    ru: {
      type: String,
      _id: false,
    },
    kz: {
      type: String,
      _id: false,
    }
  },
  products: [{
    type: String,
  }],
  prices: [{
    _id: false,
    amount: {
      type: Number,
    },
    currency: {
      type: String,
    },
    discount_amount: {
      type: Number,
    }
  }],
});

mongoose.model('Product_Sets', productSetSchema, 'product_sets');
