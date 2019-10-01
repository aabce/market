'use strict';

const express = require('express');
const router = express.Router();

const productController = require(`${__dirname}/../controllers/product.js`);

router.get('/shop/product/get_page_count', productController.selectProductPageCount);

router.get('/shop/product/get_products', productController.selectAllProducts);
router.get('/shop/product/get_product/:product_id', productController.selectProductById);

router.get('/shop/product/get_product_sku/:sku_title', productController.selectProductsBySkuOrTitle);

router.post('/shop/product/create_product', productController.createProduct);

router.put('/shop/product/update_product/:product_id', productController.updateProductById);

router.delete('/shop/product/delete_product/:product_id', productController.deleteProductById);

router.get('/shop/product/get_product_rating/:product_id', productController.getProductRatingById);
router.put('/shop/product/set_product_rating/:product_id', productController.setProductRatingById);

router.post('/shop/product/get_products', productController.selectProductsCustomFilter);

router.get('/shop/product/get_recommended_products/:customer_id', productController.selectRecommendedProducts);

module.exports = router;
