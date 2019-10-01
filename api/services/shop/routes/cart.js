'use strict';

const express = require('express');
const router = express.Router();

const cartController = require(`${__dirname}/../controllers/cart.js`);

router.get('/shop/cart/get_carts', cartController.selectAllCarts);
router.get('/shop/cart/get_cart/:cart_id', cartController.selectCartById);
// router.post('/shop/cart/create_cart', cartController.createCart);
router.put('/shop/cart/upsert_cart', cartController.upsertCart);
router.put('/shop/cart/add_to_cart', cartController.addProductToCart);
router.put('/shop/cart/update_in_cart', cartController.updateProductInCart);
router.delete('/shop/cart/remove_from_cart', cartController.removeProductFromCart);
// router.put('/shop/cart/update_cart/:cart_id', cartController.updateCartById);
router.delete('/shop/cart/delete_cart/:cart_id', cartController.deleteCartById);

module.exports = router;
