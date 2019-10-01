'use strict';

const express = require('express');
const router = express.Router();

const wishlistController = require(`${__dirname}/../controllers/wishlist.js`);

router.get('/shop/wishlist/get_wishlists', wishlistController.selectAllWishlists);
router.get('/shop/wishlist/get_wishlist/:wishlist_id', wishlistController.selectWishlistById);
router.post('/shop/wishlist/create_wishlist', wishlistController.createWishlist);
router.put('/shop/wishlist/update_wishlist/:wishlist_id', wishlistController.updateWishlistById);
router.delete('/shop/wishlist/delete_wishlist/:wishlist_id', wishlistController.deleteWishlistById);

module.exports = router;
