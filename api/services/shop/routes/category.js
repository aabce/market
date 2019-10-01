'use strict';

const express = require('express');
const router = express.Router();

const categoryController = require(`${__dirname}/../controllers/category.js`);

router.get('/shop/category/get_categories', categoryController.selectAllCategories);
router.get('/shop/category/get_category/:category', categoryController.selectCategory);
router.post('/shop/category/create_category', categoryController.createCategory);
router.put('/shop/category/update_category/:category', categoryController.updateCategory);
router.delete('/shop/category/delete_category/:category', categoryController.deleteCategory);

module.exports = router;
