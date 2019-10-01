'use strict';

const configs = require(`${__dirname}/../configs/config.json`);
const log = require(`${__dirname}/../middleware/log.js`);
const mongoose = require('mongoose');

const onTerminate = () => {
  mongoose.connection.close(() => {
    log.customLog('INFO', `Close MongoDB Connection`);
    process.exit(0);
  });
}

mongoose.connect(configs.mongodb.url, configs.mongodb.options);

mongoose.connection.on('connected', () => {
  log.customLog('INFO', `Mongoose connected to: ${mongoose.connection.host}:${mongoose.connection.port}/${mongoose.connection.db.databaseName}`);
});

mongoose.connection.on('reconnect', () => {
  log.customLog('INFO', `MongoDB reconnected`);
});

mongoose.connection.on('timeout', () => {
  log.customLog('INFO', `MongoDB timeout`);
});

mongoose.connection.on('error', (err) => {
  log.customLog('INFO', `Failed to Connect MongoDB: ${err}`);
  // process.exit(0);
});

mongoose.connection.on('disconnected', () => {
  log.customLog('INFO', `MongoDB Disconnected`);
});

require(`${__dirname}/../services/shop/models/product.js`);
require(`${__dirname}/../services/shop/models/category.js`);
require(`${__dirname}/../services/shop/models/order.js`);
require(`${__dirname}/../services/shop/models/customer.js`);
require(`${__dirname}/../services/shop/models/cart.js`);
require(`${__dirname}/../services/shop/models/wishlist.js`);
require(`${__dirname}/../services/shop/models/promo_code.js`);
require(`${__dirname}/../services/shop/models/comment.js`);

process.on('SIGINT', onTerminate).on('SIGTERM', onTerminate);
