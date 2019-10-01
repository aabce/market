'use strict';

const configs = require(`${__dirname}/../../../configs/config.json`);
const mongoose = require('mongoose');
const productModel = mongoose.model('Product');
const orderModel = mongoose.model('Order');
const promocodeController = require(`${__dirname}/promo_code.js`);
const sendEmail = require(`${__dirname}/../../../middleware/notification/email.js`);

const isArrayEmpty = array => array === undefined || array.length == 0 ? true : false;
const isObjectEmpty = object => object === null || !Object.keys(object).length ? true : false;



module.exports.selectAllOrders = async (req, res) => {
  try {
    // let orders = await orderModel.aggregate(orderQueries.selectAllOrders());
    let orders = await orderModel.find({}, '-__v');

    isArrayEmpty(orders) ? res.status(404).send({ status: 'orders_not_found' }) : res.status(200).send(orders);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
};



module.exports.selectOrderById = async (req, res) => {
  const orderId = req.params.order_id;

  if (mongoose.Types.ObjectId.isValid(orderId)) {
    try {
      let order = await orderModel.findById(orderId, '-__v');

      if (isObjectEmpty(order)) {
        res.status(404).send({ status: 'order_not_found' });
      } else {
        res.status(200).send(order);
      }
    } catch (err) {
      res.status(400).send({ error: err.message });
    }
  } else {
    res.status(400).send({ error: 'invalid_id' });
  }
};



module.exports.createOrder = async (req, res) => {
  if (isObjectEmpty(req.body)) {
    res.status(204).send({ status: 'payload_is_empty' });
  } else {
    const orderData = req.body;
    const orderId = mongoose.Types.ObjectId();

    const options = {
      lean: true,
      upsert: true,
      new: true,
      setDefaultsOnInsert: true
    };

    try {
      let totalPrice = 0;
      let totalDiscountPrice = 0;
      let discount;

      for (var i = 0; i < orderData.products.length; i++) {
        const productDoc = await productModel.findById(orderData.products[i].product_id, 'prices');

        for (var j = 0; j < productDoc.prices.length; j++) {
          let tempPrice = 0;
          let tempDiscountPrice = 0;

          if (productDoc.prices[j].currency === orderData.currency) {
            tempPrice = orderData.products[i].quantity * productDoc.prices[j].amount;
            tempDiscountPrice = orderData.products[i].quantity * productDoc.prices[j].discount_amount;
          }

          totalPrice += tempPrice;
          totalDiscountPrice += tempDiscountPrice;
        }
      }

      if (totalPrice === totalDiscountPrice) {
        discount = await promocodeController.getPriceWithDiscountLocal(totalPrice, orderData.promo_code);
      } else {
        discount = await promocodeController.getPriceWithDiscountLocal(totalDiscountPrice, orderData.promo_code);
      }

      orderData._id = orderId;
      orderData.created_at = new Date().toISOString();
      orderData.price = {
        amount: totalPrice,
        currency: orderData.currency,
        discount_amount: discount.amount,
        // discount_rate: discount.rate
      }
      delete orderData.currency;

      let createdOrder = await orderModel.create(orderData);

      res.status(200).send({
        status: 'order_was_created',
        order_id: createdOrder._id,
        total_price: createdOrder.price.discount_amount,
        currency: createdOrder.price.currency
      });

    } catch (err) {
      res.status(400).send({ error: err.message });
    }
  }
};



module.exports.updateOrderById = async (req, res) => {
  if (isObjectEmpty(req.body)) {
    res.status(204).send({ status: 'payload_is_empty' });
  } else {
    const orderId = req.params.order_id;

    if (mongoose.Types.ObjectId.isValid(orderId)) {
      const orderData = req.body;
      orderData.updated_at = new Date().toISOString();

      const options = {
        upsert: false,
        new: false,
        runValidators: true
      };

      const data = {
        $set: orderData,
      };

      try {
        let updatedOrder = await orderModel.findByIdAndUpdate(orderId, data, options);

        if (isObjectEmpty(updatedOrder)) {
          res.status(404).send({ status: 'order_not_found' });
        } else {
          res.status(200).send({
            status: 'order_was_updated',
            order_id: updatedOrder._id
          });
        }
      } catch (err) {
        res.status(400).send({ error: err.message });
      }
    } else {
      res.status(400).send({ error: 'invalid_id' });
    }
  }
};



module.exports.deleteOrderById = async (req, res) => {
  const orderId = req.params.order_id;

  if (mongoose.Types.ObjectId.isValid(orderId)) {
    try {
      let deletedOrder = await orderModel.findByIdAndDelete(orderId);

      if (isObjectEmpty(deletedOrder)) {
        res.status(404).send({ status: 'order_not_found' });
      } else {
        res.status(200).send({
          status: 'order_was_deleted',
          order_id: deletedOrder._id
        });
      }
    } catch (err) {
      res.status(400).send({ error: err.message });
    }
  } else {
    res.status(400).send({ error: 'invalid_id' });
  }
};

module.exports.sendOrderMail = async (req, res) => {
  const emailSendResult = sendEmail.sendOrderMail(req.params.order_id);

  if (emailSendResult) {
    res.status(200).send({
      status: 'email_was_sended'
    });
  } else {
    res.status(400).send({
      status: 'while_email_sending_was_error'
    });
  }
};
