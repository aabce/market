'use strict';

const mongoose = require('mongoose');
const ObjectId = mongoose.ObjectId;

const wishlistSchema = new mongoose.Schema({
  customer_id: {
    type: ObjectId,
  },
  products: [
    {
      _id: false,
      product_id: {
        type: ObjectId,
      }
    }
  ]
});

mongoose.model('Wishlist', wishlistSchema, 'wishlists');
