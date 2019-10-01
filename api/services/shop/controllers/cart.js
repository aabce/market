'use strict';

const configs = require(`${__dirname}/../../../configs/config.json`);
const mongoose = require('mongoose');
const cartModel = mongoose.model('Cart');
const cartQueries = require(`${__dirname}/../queries/cart.js`);

const isArrayEmpty = array => array === undefined || array.length == 0 ? true : false;
const isObjectEmpty = object => object === null || !Object.keys(object).length ? true : false;



module.exports.selectAllCarts = async (req, res) => {
  try {
    let carts = await cartModel.find({}, '-__v');
    isArrayEmpty(carts) ? res.status(404).send({ status: 'carts_not_found' }) : res.status(200).send(carts);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
};



module.exports.selectCartById = async (req, res) => {
  const cartId = req.params.cart_id;

  if (mongoose.Types.ObjectId.isValid(cartId)) {
    try {
      let cart = await cartModel.aggregate(cartQueries.selectCartById(cartId));

      if (isObjectEmpty(cart)) {
        res.status(404).send({ status: 'cart_not_found' });
      } else {
        let totalPrices = {};

        for (let product of cart[0].products) {
          for (let price of product.product_data.prices) {
            if (!totalPrices.hasOwnProperty(price.currency)) {
              totalPrices[price.currency] = 0;
            }

            if (price.amount > price.discount_amount) {
              totalPrices[price.currency] += product.quantity * price.discount_amount;
            } else {
              totalPrices[price.currency] += product.quantity * price.amount;
            }
          }
        }

        const cartData = cart[0];
        cartData.total_prices = totalPrices;

        res.status(200).send(cartData);
      }
    } catch (err) {
      res.status(400).send({ error: err.message });
    }
  } else {
    res.status(400).send({ error: 'invalid_id' });
  }
};



// module.exports.createCart = async (req, res) => {
//   if (isObjectEmpty(req.body)) {
//     res.status(204).send({ status: 'payload_is_empty' });
//   } else {
//     const cartData = req.body;
//     cartData.created_at = new Date().toISOString();
//
//     try {
//       let createdCart = await cartModel.create(cartData);
//
//       res.status(200).send({
//         status: 'cart_was_created',
//         cart_id: createdCart._id
//       });
//     } catch (err) {
//       res.status(400).send({ error: err.message });
//     }
//   }
// };
//
//
//
// module.exports.updateCartById = async (req, res) => {
//   if (isObjectEmpty(req.body)) {
//     res.status(204).send({ status: 'payload_is_empty' });
//   } else {
//     const cartId = req.params.cart_id;
//
//     if (mongoose.Types.ObjectId.isValid(cartId)) {
//       const cartData = req.body;
//       cartData.updated_at = new Date().toISOString();
//
//       const options = {
//         upsert: false,
//         new: false
//       };
//
//       const data = {
//         $set: cartData,
//       };
//
//       try {
//         let updatedCart = await cartModel.findByIdAndUpdate(cartId, data, options);
//
//         if (isObjectEmpty(updatedCart)) {
//           res.status(404).send({ status: 'cart_not_found' });
//         } else {
//           res.status(200).send({
//             status: 'cart_was_updated',
//             cart_id: updatedCart._id
//           });
//         }
//       } catch (err) {
//         res.status(400).send({ error: err.message });
//       }
//     } else {
//       res.status(400).send({ error: 'invalid_id' });
//     }
//   }
// };

module.exports.upsertCart = async (req, res) => {
  if (isObjectEmpty(req.body)) {
    res.status(204).send({ status: 'payload_is_empty' });
  } else {
    const cartData = req.body;
    let cartId;

    if (req.body.cart_id === null || req.body.cart_id === undefined) {
      cartId = mongoose.Types.ObjectId();
      cartData.created_at = new Date().toISOString();
    } else {
      cartId = req.body.cart_id;
      cartData.updated_at = new Date().toISOString();
    }

    const options = {
      upsert: true,
      new: true
    };

    try {
      let upsertedCart = await cartModel.findByIdAndUpdate(cartId, cartData, options);

      res.status(200).send({
        status: 'cart_was_upserted',
        cart_id: upsertedCart._id
      });
    } catch (err) {
      res.status(400).send({ error: err.message });
    }
  }
};

module.exports.addProductToCart = async (req, res) => {
  const cartData = req.body;
  let cartId;

  (cartData.cart_id === null || cartData.cart_id === undefined) ? cartId = mongoose.Types.ObjectId() : cartId = req.body.cart_id;

  try {
    const cart = await cartModel.findByIdAndUpdate(cartId, { $addToSet: { products: cartData.product } }, { safe: true, upsert: true, new: true });

    res.status(200).send({
      status: 'added',
      cart_id: cart._id
    });
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
};

module.exports.updateProductInCart = async (req, res) => {
  const cartData = req.body;

  try {
    const cart = await cartModel.findOneAndUpdate({ _id: cartData.cart_id, 'products.product_id': cartData.product.product_id }, { $set: { 'products.$.quantity': cartData.product.quantity } }, { new: true });

    res.status(200).send({
      status: 'updated',
      cart_id: cart._id
    });
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
};

module.exports.removeProductFromCart = async (req, res) => {
  const cartData = req.body;

  const cart = await cartModel.findByIdAndUpdate(cartData.cart_id, { $pull: { products: { product_id: mongoose.Types.ObjectId(cartData.product_id) } } }, { multi: true });

  try {
    res.status(200).send({
      status: 'removed',
      cart_id: cart._id
    });
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
};

module.exports.deleteCartById = async (req, res) => {
  const cartId = req.params.cart_id;

  if (mongoose.Types.ObjectId.isValid(cartId)) {
    try {
      let deletedCart = await cartModel.findByIdAndDelete(cartId);

      if (isObjectEmpty(deletedCart)) {
        res.status(404).send({ status: 'cart_not_found' });
      } else {
        res.status(200).send({
          status: 'cart_was_deleted',
          cart_id: deletedCart._id
        });
      }
    } catch (err) {
      res.status(400).send({ error: err.message });
    }
  } else {
    res.status(400).send({ error: 'invalid_id' });
  }
};
