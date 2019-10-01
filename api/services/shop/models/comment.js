'use strict';

const mongoose = require('mongoose');
const ObjectId = mongoose.ObjectId;

const commentSchema = new mongoose.Schema({
  customer_id: {
    type: ObjectId,
  },
  product_id: {
    type: ObjectId,
  },
  text: {
    type: String,
  },
  product_rating: {
    type: Number,
    min: 0,
    max: 5
  },
  likes: {
    type: Number,
    default: 0,
  },
  dislikes: {
    type: Number,
    default: 0,
  },
  created_at: {
    type: Date,
    default: null,
  },
  updated_at: {
    type: Date,
    default: null,
  }
});

mongoose.model('Comment', commentSchema, 'comments');
