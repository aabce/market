'use strict';

const mongoose = require('mongoose');
const ObjectId = mongoose.ObjectId;

const customerSchema = new mongoose.Schema({
  login: {
    type: String,
    lowercase: true,
    required: true,
    unique: true,
  },
  password: {
    type: String,
  },
  salt: {
    type: String,
  },
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: (email) => {
       return /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/.test(email);
    },
  },
  phone: {
    type: String,
    validate: (phone) => {
       return /^\s*(?:\+?(\d{1,3}))?([-. (]*(\d{3})[-. )]*)?((\d{3})[-. ]*(\d{2,4})(?:[-.x ]*(\d+))?)\s*$/.test(phone);
    },
  },
  created_at: {
    type: Date,
    default: null,
  },
  updated_at: {
    type: Date,
    default: null,
  },
  is_subscribe_to_email: {
    type: Boolean,
    default: true,
  },
  address: {
    _id: false,
    country: {
      type: String,
    },
    region: {
      type: String,
    },
    city: {
      type: String,
    },
    zip: {
      type: String,
    },
    street: {
      type: String,
    },
    house: {
      type: String,
    },
    flat: {
      type: String,
    },
  },
  personal_discount_rate: {
    type: Number,
    default: 0,
  },
  token: {
    type: String,
  },
  reset_password_code: {
    type: String,
  },
  reset_password_expires: {
    type: Date,
  }
});

mongoose.model('Customer', customerSchema, 'customers');
