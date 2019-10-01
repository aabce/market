'use strict';

const express = require('express');
const router = express.Router();

const productController = require(`${__dirname}/../controllers/product.js`);

router.get('/shop/product/get_products', productController.selectAllProducts);
router.get('/shop/product/get_product/:product_id', productController.selectProductById);
router.post('/shop/product/create_product', productController.createProduct);
router.put('/shop/product/update_product/:product_id', productController.updateProductById);
router.delete('/shop/product/delete_product/:product_id', productController.deleteProductById);

module.exports = router;
