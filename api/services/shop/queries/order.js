'use strict';

const mongoose = require('mongoose');

module.exports.selectOrderById = (orderId) => {
  return [
    { $match: { _id: mongoose.Types.ObjectId(orderId) } },
    { $unwind: "$products" },
    {
      $lookup: {
        from: "products",
        localField: "products.product_id",
        foreignField: "_id",
        as: "products.data"
      }
    },

    { $unwind: "$products.data" },

    {
      $lookup: {
        from: "customers",
        localField: "customer_id",
        foreignField: "_id",
        as: "customer_data"
      }
    },
    {
      $project: {
        _id: 1,
        promo_code: 1,
        created_at: 1,
        updated_at: 1,
        products: 1,
        status: 1,
        price: {
          amount: '$price.amount',
          currency: '$price.currency',
          discount_amount: '$price.discount_amount',
          discount_rate: {
            $divide: [{
              $trunc: {
                $multiply: [{
                  $subtract: [100, {'$multiply': [{'$divide': ['$price.discount_amount', '$price.amount']}, 100]}]
                }, 100 ]
              }
            }, 100 ]
          }
        },
        customer_data: { $arrayElemAt: [ '$customer_data', 0 ] }
      }
    },
    {
      $group: {
        _id: '$_id',
        promo_code: { $first: '$promo_code' },
        created_at: { $first: '$created_at' },
        updated_at: { $first: '$updated_at' },
        status: { $first: '$status' },
        price: { $first: '$price' },
        customer_data: { $first: '$customer_data' },
        products: { $push: '$products' },
        product_count: { $sum: '$products.quantity' }
      }
    }
  ];
};
