'use strict';

const emailConfigs = require(`${__dirname}/../../configs/email.json`);
const fs = require('fs');
const nodemailer = require('nodemailer');
const moment = require('moment');
const pug = require('pug');
const mongoose = require('mongoose');
const orderModel = mongoose.model('Order');
const orderQueries = require(`${__dirname}/../../services/shop/queries/order.js`);
const htmlToText = require('nodemailer-html-to-text').htmlToText;

const orderTemplateEn = pug.compileFile(`${__dirname}/views/order_en.pug`);

const padDate = (value) => value < 10 ? `0${value}`: `${value}`;

module.exports.sendOrderMail = async (orderId) => {
  const transporter = await nodemailer.createTransport(emailConfigs.email_settings);
  transporter.use('compile', htmlToText());

  const order = await orderModel.aggregate(orderQueries.selectOrderById(orderId));

  const created_at = order[0].created_at;
  const utcOffset = moment.parseZone(created_at).utcOffset() / 60;
  const createdDate = moment(created_at).utc().utcOffset(utcOffset).format('MM/DD/YYYY HH:mm:ss');
  const amount = order[0].price.amount;
  const currency = order[0].price.currency;
  const discount_amount = order[0].price.discount_amount;
  const discount_rate = order[0].price.discount_rate;
  const products = order[0].products;
  const product_count = order[0].product_count;
  const first_name = order[0].customer_data.first_name;
  const last_name = order[0].customer_data.last_name;
  const email = order[0].customer_data.email;
  const address = order[0].customer_data.address;

  let orderTemplate = orderTemplateEn({
    created_at: createdDate,
    amount: amount,
    currency: currency,
    discount_amount: discount_amount,
    discount_rate: discount_rate,
    products: products,
    product_count: product_count,
    first_name: first_name,
    last_name: last_name,
    email: email,
    address: address
  })

  const emailMessage = {
    from: emailConfigs.email_settings.auth.user,
    to: email,
    // cc: email.receivers.cc,
    // bcc: email.receivers.bcc,
    subject: 'Order Receipt',
    html: orderTemplate,
  };

  try {
    await transporter.sendMail(emailMessage);
    return true;
  } catch (err) {
    return false;
  }
};
