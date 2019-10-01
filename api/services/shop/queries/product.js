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

module.exports.selectAllProducts = (skip = 0, limit = 10) => {
  return [
    {
      '$unwind': {
        'path': '$prices'
      }
    },
    productProject,
    productGroup,
    {
      '$skip': skip
    },
    {
      '$limit': limit
    }
  ];
};

module.exports.selectProductById = (product_id) => {
  return [
    {
      '$match': {
        '_id': mongoose.Types.ObjectId(product_id)
      }
    },
    {
      '$unwind': {
        'path': '$prices'
      }
    },
    productProject,
    productGroup
  ];
}

module.exports.selectProductsBySkuOrTitle = (productSkuOrTitle) => {
  return [
    {
      '$match': {
        '$or': [
          { 'sku': productSkuOrTitle },
          { 'title': { $regex: `.*${productSkuOrTitle}.*` } }
        ]
      }
    },
    {
      '$unwind': {
        'path': '$prices'
      }
    },
    productProject,
    productGroup
  ];
}

module.exports.selectProductsByTitle = (title) => {
  return [
    {
      '$match': {
        'title': title
      }
    },
    {
      '$unwind': {
        'path': '$prices'
      }
    },
    productProject,
    productGroup
  ];
};

module.exports.selectProductsByAttributes = (attributes) => {
  return [
    {
      '$match': {
        'attributes': {
          '$elemMatch': attributes
        }
      }
    },
    {
      '$unwind': {
        'path': '$prices'
      }
    },
    productProject,
    productGroup
  ];
};



module.exports.selectProductsCustomFilter = (queryParameters, sortParameters) => {
  let match = {
    '$and': []
  };

  let sort = {};

  if (queryParameters.prices) {
    match['$and'].push({ 'prices.currency': { '$eq': queryParameters.prices.currency } });
    match['$and'].push({ 'prices.amount': { '$gte': queryParameters.prices.from } });
    match['$and'].push({ 'prices.amount': { '$lte': queryParameters.prices.to } });
  }

  if (queryParameters.manufacture) {
    match['$and'].push({ 'manufacture': { '$in': queryParameters.manufacture } });
  }

  if (queryParameters.type) {
    match['$and'].push({ 'type': { '$in': queryParameters.type } });
  }

  if (queryParameters.category) {
    match['$and'].push({ 'category': { '$in': queryParameters.category } });
  }

  if (queryParameters.is_available) {
    match['$and'].push({ 'is_available': { '$eq': queryParameters.is_available } });
  }

  if (queryParameters.is_new) {
    match['$and'].push({ 'is_new': { '$eq': queryParameters.is_new } });
  }

  if (sortParameters.rating) {
    sort['rating'] = sortParameters.rating;
  }

  if (sortParameters.amount) {
    sort['prices.amount'] = sortParameters.amount;
  }

  if (sortParameters.created_at) {
    sort['created_at'] = sortParameters.created_at;
  }

  if (sortParameters.title) {
    sort['title'] = sortParameters.title;
  }

  return [
    {
      '$unwind': {
        'path': '$prices'
      }
    },
    productProject,
    {
      '$match': match
    },
    productGroup,
    {
      '$sort': sort
    }
  ];
};

module.exports.selectRecommendedProducts = (customerId) => {
  return [
    {
      '$match': { '_id': mongoose.Types.ObjectId(customerId) }
    },
    {
      '$lookup': {
        'from': 'orders',
        'localField': '_id',
        'foreignField': 'customer_id',
        'as': 'orders'
      }
    },
    {
      '$project': {
        '_id': 1,
        'orders': 1
      }
    },
    {
      '$limit': 10
    },
    {
      '$unwind': { 'path': '$orders' }
    },
    {
      '$unwind': { 'path': '$orders.products' }
    },
    {
      '$lookup': {
        'from': 'products',
        'localField': 'orders.products.product_id',
        'foreignField': '_id',
        'as': 'product'
      }
    },
    {
      '$project': {
        'manufacture': { '$arrayElemAt': [ '$product.manufacture', 0 ] },
        'type': { '$arrayElemAt': [ '$product.type', 0 ] },
        'category': { '$arrayElemAt': [ '$product.category', 0 ] }
      }
    },
    {
      '$unwind': { 'path': '$category' }
    },
    {
      '$group': {
        '_id': '$_id',
        'manufacture': { '$addToSet': '$manufacture' },
        'type': { '$addToSet': '$type' },
        'category': { '$addToSet': '$category' }
      }
    }
  ]
};

module.exports.selectProductsByTypeCategoriesManufacture = (queryParameters) => {
  return [
    {
      '$match': {
        '$and': [
          { 'manufacture': { '$in': queryParameters.manufacture } },
          { 'type': { '$in': queryParameters.type } },
          { 'category': { '$in': queryParameters.category } },
          { 'is_available': { '$eq': true } },
        ]
      }
    },
    {
      '$unwind': {
        'path': '$prices'
      }
    },
    productProject,
    productGroup,
    {
      '$sort': {
        'rating': -1
      }
    },
    {
      '$limit': 10
    }
  ];
};
