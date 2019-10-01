'use strict';

const configs = require(`${__dirname}/../../../configs/config.json`);
const productRating = require(`${__dirname}/../../../middleware/product_rating.js`);
const dataPagination = require(`${__dirname}/../../../middleware/data_pagination.js`);
const mongoose = require('mongoose');
const productModel = mongoose.model('Product');
const customerModel = mongoose.model('Customer');
const productQueries = require(`${__dirname}/../queries/product.js`);

const isArrayEmpty = array => array === undefined || array.length == 0 ? true : false;
const isObjectEmpty = object => object === null || !Object.keys(object).length ? true : false;



module.exports.selectProductPageCount = async (req, res) => {
  const size = req.query.size;

  try {
    const productsCount = await productModel.countDocuments();
    const pages = dataPagination.getTotalPages(productsCount, size);

    res.status(200).send({ pages: pages });
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
};

module.exports.selectAllProducts = async (req, res) => {
  const size = req.query.size;
  const pageNumber = req.query.page_number;

  const { skip, limit } = dataPagination.getDataPagination(size, pageNumber);

  try {
    let products = await productModel.aggregate(productQueries.selectAllProducts(skip, limit));
    isArrayEmpty(products) ? res.status(404).send({ status: 'products_not_found' }) : res.status(200).send(products);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
};

module.exports.selectProductById = async (req, res) => {
  const productId = req.params.product_id;

  if (mongoose.Types.ObjectId.isValid(productId)) {
    try {
      let product = await productModel.aggregate(productQueries.selectProductById(productId));
      if (isArrayEmpty(product)) {
        res.status(404).send({ status: 'product_not_found' });
      } else {
        res.status(200).send(product[0]);
      }
    } catch (err) {
      res.status(400).send({ error: err.message });
    }
  } else {
    res.status(400).send({ error: 'invalid_id' });
  }
};

module.exports.selectProductsBySkuOrTitle = async (req, res) => {
  const productSkuOrTitle = req.params.sku_title;

  try {
    let products = await productModel.aggregate(productQueries.selectProductsBySkuOrTitle(productSkuOrTitle));

    if (isArrayEmpty(products)) {
      res.status(404).send({ status: 'product_not_found' });
    } else {
      res.status(200).send(products);
    }
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
};

module.exports.createProduct = async (req, res) => {
  if (isObjectEmpty(req.body)) {
    res.status(204).send({ status: 'payload_is_empty' });
  } else {
    const productData = req.body;
    productData.created_at = new Date().toISOString();

    try {
      let createdProduct = await productModel.create(productData);

      res.status(200).send({
        status: 'product_was_created',
        product_id: createdProduct._id
      });

    } catch (err) {
      if (err.name === 'MongoError' && err.code === 11000) {
        const pathRegex = err.message.match(/(?<=\bindex:\s)(\w+)/)
        const path = pathRegex ? pathRegex[1] : '';
        res.status(422).send({ status: 'key_already_exists', fields: path });
      } else if (err.name === 'ValidationError') {
        res.status(400).send({ status: 'fields_are_required', fields: Object.keys(err.errors)});
      } else {
        res.status(400).send({ error: err.message });
      }
    }
  }
};



module.exports.updateProductById = async (req, res) => {
  if (isObjectEmpty(req.body)) {
    res.status(204).send({ status: 'payload_is_empty' });
  } else {
    const productId = req.params.product_id;

    if (mongoose.Types.ObjectId.isValid(productId)) {
      const productData = req.body;
      productData.updated_at = new Date().toISOString();

      const options = {
        upsert: false,
        new: false,
        runValidators: true
      };

      const data = {
        $set: productData,
      };

      try {
        let updatedProduct = await productModel.findByIdAndUpdate(productId, data, options);

        if (isObjectEmpty(updatedProduct)) {
          res.status(404).send({ status: 'product_not_found' });
        } else {
          res.status(200).send({
            status: 'product_was_updated',
            product_id: updatedProduct._id
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



module.exports.deleteProductById = async (req, res) => {
  const productId = req.params.product_id;

  if (mongoose.Types.ObjectId.isValid(productId)) {
    try {
      let deletedProduct = await productModel.findByIdAndDelete(productId);

      if (isObjectEmpty(deletedProduct)) {
        res.status(404).send({ status: 'product_not_found' });
      } else {
        res.status(200).send({
          status: 'product_was_deleted',
          product_id: deletedProduct._id
        });
      }
    } catch (err) {
      res.status(400).send({ error: err.message });
    }
  } else {
    res.status(400).send({ error: 'invalid_id' });
  }
};



module.exports.getProductRatingById = async (req, res) => {
  const productId = req.params.product_id;

  if (mongoose.Types.ObjectId.isValid(productId)) {
    try {
      let product = await productModel.findById(productId, 'ratings');

      if (isObjectEmpty(product)) {
        res.status(404).send({ status: 'product_not_found' });
      } else {
        const ratings = product.ratings.toJSON();

        res.status(200).send({ product_rating: productRating.calculateProductRating(ratings) });
      }
    } catch (err) {
      res.status(400).send({ error: err.message });
    }
  } else {
    res.status(400).send({ error: 'invalid_id' });
  }
};



module.exports.setProductRatingById = async (req, res) => {
  if (isObjectEmpty(req.body)) {
    res.status(204).send({ status: 'payload_is_empty' });
  } else {
    const productId = req.params.product_id;
    const ratingField = req.body.rating;

    if (mongoose.Types.ObjectId.isValid(productId)) {
      let data = {
        '$inc': {}
      };

      data['$inc'][`ratings.${ratingField}`] = 1;

      try {
        let updatedProduct = await productModel.findByIdAndUpdate(productId, data);

        if (isObjectEmpty(updatedProduct)) {
          res.status(404).send({ status: 'product_not_found' });
        } else {
          res.status(200).send({
            status: 'product_rating_was_updated',
            product_id: updatedProduct._id
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

module.exports.selectRecommendedProducts = async (req, res) => {
  const customerId = req.params.customer_id;

  if (mongoose.Types.ObjectId.isValid(customerId)) {
    try {
      let productsData = await customerModel.aggregate(productQueries.selectRecommendedProducts(customerId));
      let products = await productModel.aggregate(productQueries.selectProductsByTypeCategoriesManufacture(productsData[0]));

      if (isArrayEmpty(products)) {
        res.status(404).send({ status: 'product_not_found' });
      } else {
        res.status(200).send(products);
      }
    } catch (err) {
      res.status(400).send({ error: err.message });
    }
  } else {
    res.status(400).send({ error: 'invalid_id' });
  }
};

module.exports.selectProductsCustomFilter = async (req, res) => {
  const queryParameters = req.body.match;
  const sortParameters = req.body.sort;

  try {
    let products = await productModel.aggregate(productQueries.selectProductsCustomFilter(queryParameters, sortParameters));
    isArrayEmpty(products) ? res.status(404).send({ status: 'products_not_found' }) : res.status(200).send(products);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
};
