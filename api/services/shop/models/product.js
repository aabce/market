'use strict';

const mongoose = require('mongoose');
const ObjectId = mongoose.ObjectId;

const productSchema = new mongoose.Schema({
  upc: {
    type: Number,
    unique: true,
  },
  sku: {
    type: String,
    unique: true,
  },
  title: {
    type: String,
  },
  subtitle: {
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
  manufacture: {
    type: String,
  },
  ratings: {
    "5": {
      type: Number,
      default: 0,
      min: 0,
    },
    "4": {
      type: Number,
      default: 0,
      min: 0,
    },
    "3": {
      type: Number,
      default: 0,
      min: 0,
    },
    "2": {
      type: Number,
      default: 0,
      min: 0,
    },
    "1": {
      type: Number,
      default: 0,
      min: 0,
    }
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
  type: {
    type: String,
  },
  category: [{
    type: String,
  }],
  quantity: {
    type: Number,
  },
  is_available: {
    type: Boolean,
  },
  is_new: {
    type: Boolean,
  },
  is_feature: {
    type: Boolean,
  },
  shipping: {
    weight: {
      value: {
        type: Number,
      },
      unit: {
        type: String,
      }
    },
    dimensions: {
      width: {
        _id: false,
        value: {
          type: Number,
           },
        unit: {
          type: String,
        }
        },
      depth: {
        _id: false,
        value: {
          type: Number,
        },
        unit: {
          type: String,
        }
      },
      height: {
        _id: false,
        value: {
          type: Number,
        },
        unit: {
          type: String,
        }
      }
    }
  },
  photos: [{
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
      default: 0,
    }
  }],
  colors: [{ // May in Attributes?
    type: String,
    enum: ['red', 'green', 'blue'],
  }],
  attributes: [{
    _id: false,
    key: {
      type: String,
    },
    value: {
      type: String,
    }
  }],
  created_at: {
    type: Date,
    default: null,
  },
  updated_at: {
    type: Date,
    default: null,
  },
});

mongoose.model('Product', productSchema, 'products');
