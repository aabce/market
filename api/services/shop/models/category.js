'use strict';

const mongoose = require('mongoose');
const ObjectId = mongoose.ObjectId;

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
  }
});

mongoose.model('Category', categorySchema, 'categories');
