'use strict';

const express = require('express');
const router = express.Router();

const orderController = require(`${__dirname}/../controllers/order.js`);

router.get('/shop/order/get_orders', orderController.selectAllOrders);
router.get('/shop/order/get_order/:order_id', orderController.selectOrderById);
router.post('/shop/order/create_order', orderController.createOrder);
router.put('/shop/order/update_order/:order_id', orderController.updateOrderById);
router.delete('/shop/order/delete_order/:order_id', orderController.deleteOrderById);

router.get('/shop/order/send_order_email/:order_id', orderController.sendOrderMail);

module.exports = router;
