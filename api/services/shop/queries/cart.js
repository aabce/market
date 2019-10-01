'use strict';

const mongoose = require("mongoose");

module.exports.selectCartById = (cart_id) => {
  return [
    {
      '$match': {
        '_id': mongoose.Types.ObjectId(cart_id)
      }
    }, {
      '$unwind': {
        'path': '$products'
      }
    }, {
      '$lookup': {
        'from': 'products',
        'localField': 'products.product_id',
        'foreignField': '_id',
        'as': 'products.product_data'
      }
    }, {
      '$unwind': {
        'path': '$products.product_data'
      }
    }, {
      '$project': {
        '_id': 1,
        'products': {
          'product_id': 1,
          'quantity': 1,
          'product_data': {
            'sku': 1,
            'title': 1,
            'prices': 1,
            'photos': 1
          }
        }
      }
    }, {
      '$group': {
        '_id': '$_id',
        'products': {
          '$push': '$products'
        }
      }
    }
  ];
};
