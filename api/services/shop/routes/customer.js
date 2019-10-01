'use strict';

const express = require('express');
const router = express.Router();

const customerController = require(`${__dirname}/../controllers/customer.js`);
// const jwtMiddleware = require(`${__dirname}/../../../middleware/jwt.js`);

router.get('/shop/customer/get_customers', customerController.selectAllCustomers);
router.get('/shop/customer/get_customer/:customer_id', customerController.selectCustomerById);
router.post('/shop/customer/create_customer', customerController.createCustomer);
router.put('/shop/customer/update_customer/:customer_id', customerController.updateCustomerById);
router.delete('/shop/customer/delete_customer/:customer_id', customerController.deleteCustomerById);

router.post('/shop/customer/sign_up', customerController.signUp); // Create a new Customer Account.
router.post('/shop/customer/sign_in', customerController.signIn); // Enter in the System.
router.get('/shop/customer/sign_out', customerController.signOut); // Exit from the System.
router.post('/shop/customer/forgot', customerController.forgotPassword);
router.post('/shop/customer/restore', customerController.restorePasswoed);

module.exports = router;
