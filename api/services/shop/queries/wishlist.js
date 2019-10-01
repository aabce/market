'use strict';

const mongoose = require("mongoose");

const productProject = {
  '$project': {
    '_id': 1,
    'shipping': 1,
    'category': 1,
    'photos': 1,
    'colors': 1,
    'created_at': 1,
    'updated_at': 1,
    'upc': 1,
    'sku': 1,
    'title': 1,
    'subtitle': 1,
    'manufacture': 1,
    'description': 1,
    'type': 1,
    'quantity': 1,
    'is_available': 1,
    'is_new': 1,
    'prices': {
      'amount': '$prices.amount',
      'currency': '$prices.currency',
      'discount_amount': '$prices.discount_amount',
      'discount_rate': {
        '$divide': [{
          '$trunc': {
            '$multiply': [{
              '$subtract': [100, {'$multiply': [{'$divide': ['$prices.discount_amount', '$prices.amount']}, 100]}]
            }, 100 ]
          }
        }, 100 ]
      }
    },
    'attributes': 1,
    'rating': {
      '$cond': [{
        '$and': [
          { '$eq': ['$ratings.1', 0] },
          { '$eq': ['$ratings.2', 0] },
          { '$eq': ['$ratings.3', 0] },
          { '$eq': ['$ratings.4', 0] },
          { '$eq': ['$ratings.5', 0] }
        ]
      }, null, {
      '$divide': [{
        '$trunc': {
          '$multiply': [{
            '$divide': [{
              '$add': [
                { '$multiply': [ 1, '$ratings.1' ] },
                { '$multiply': [ 2, '$ratings.2' ] },
                { '$multiply': [ 3, '$ratings.3' ] },
                { '$multiply': [ 4, '$ratings.4' ] },
                { '$multiply': [ 5, '$ratings.5' ] }
              ]
            }, {
              '$add': [
                '$ratings.1',
                '$ratings.2',
                '$ratings.3',
                '$ratings.4',
                '$ratings.5'
              ]
            }]
          }, 100 ]}}, 100 ]
        }
      ]
    }
  }
};

const productGroup = {
  '$group': {
    '_id': '$_id',
    'shipping': { $first: "$shipping" },
    'category': { $first: "$category" },
    'photos': { $first: "$photos" },
    'colors': { $first: "$colors" },
    'created_at': { $first: "$created_at" },
    'updated_at': { $first: "$updated_at" },
    'upc': { $first: "$upc" },
    'sku': { $first: "$sku" },
    'title': { $first: "$title" },
    'subtitle': { $first: "$subtitle" },
    'manufacture': { $first: "$manufacture" },
    'description': { $first: "$description" },
    'type': { $first: "$type" },
    'quantity': { $first: "$quantity" },
    'is_available': { $first: "$is_available" },
    'is_new': { $first: "$is_new" },
    'prices': { $push: "$prices"},
    'attributes': { $first: "$attributes" },
    'rating': { $first: "$rating" }
  }
};

module.exports.selectWishlistById = (wishlistId, sortParameters) => {
  let sort = {};

};
