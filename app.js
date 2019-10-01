'use strict';

const configs = require(`${__dirname}/api/configs/config.json`);
const log = require(`${__dirname}/api/middleware/log.js`);
const express = require('express');
const cors = require('cors');
require(`${__dirname}/api/database/mongo_db.js`);
const bodyParser = require('body-parser');

const productRoutes = require(`${__dirname}/api/services/shop/routes/product.js`);
const categoryRoutes = require(`${__dirname}/api/services/shop/routes/category.js`);
const orderRoutes = require(`${__dirname}/api/services/shop/routes/order.js`);
const customerRoutes = require(`${__dirname}/api/services/shop/routes/customer.js`);
const cartRoutes = require(`${__dirname}/api/services/shop/routes/cart.js`);
const wishlistRoutes = require(`${__dirname}/api/services/shop/routes/wishlist.js`);
const promoCodeRoutes = require(`${__dirname}/api/services/shop/routes/promo_code.js`);
const commentRoutes = require(`${__dirname}/api/services/shop/routes/comment.js`);

const app = express();
const serverPort = process.env.PORT || configs.server_port;

app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(log.log);

app.get('/', (req, res, next) => res.status(200).send({url: req.url, message: `server_is_running`})); //200.

app.use('/api', productRoutes);
app.use('/api', categoryRoutes);
app.use('/api', orderRoutes);
app.use('/api', customerRoutes);
app.use('/api', cartRoutes);
app.use('/api', wishlistRoutes);
app.use('/api', promoCodeRoutes);
app.use('/api', commentRoutes);

app.use((req, res, next) => res.status(404).send({url: req.url, message: `route_not_found`})); // 404.
app.use((err, req, res, next) => res.status(500).send({error: err.message})); // 500.

app.listen(serverPort, (err) => err ? log.customLog('INFO', `Error: ${err.message}`) : log.customLog('INFO', `Server listening on port: ${serverPort}`));
