'use strict';

const configs = require(`${__dirname}/../../../configs/config.json`);
const mongoose = require('mongoose');
const categoryModel = mongoose.model('Category');

const isArrayEmpty = array => array === undefined || array.length == 0 ? true : false;
const isObjectEmpty = object => object === null || !Object.keys(object).length ? true : false;



module.exports.selectAllCategories = async (req, res) => {
  try {
    let categories = await categoryModel.find({}, '-__v');
    isArrayEmpty(categories) ? res.status(404).send({ status: 'categories_not_found' }) : res.status(200).send(categories);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
};

module.exports.selectCategory = async (req, res) => {
  const categoryName = req.params.category;

  try {
    let category = await categoryModel.findOne({ name: categoryName }, '-__v');

    if (isObjectEmpty(category)) {
      res.status(404).send({ status: 'category_not_found' });
    } else {
      res.status(200).send(category);
    }
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
};

module.exports.createCategory = async (req, res) => {
  if (isObjectEmpty(req.body)) {
    res.status(204).send({ status: 'payload_is_empty' });
  } else {
    const categoryData = req.body;

    try {
      let createdCategory = await categoryModel.create(categoryData);

      res.status(200).send({
        status: 'category_was_created',
        id: createdCategory._id
      });

    } catch (err) {
      res.status(400).send({ error: err.message });
    }
  }
};

module.exports.updateCategory = async (req, res) => {
  if (isObjectEmpty(req.body)) {
    res.status(204).send({ status: 'payload_is_empty' });
  } else {
    const categoryName = req.params.category;
    const categoryData = req.body;

    const options = {
      upsert: false,
      new: true
    };

    const data = {
      $set: categoryData,
    };

    try {
      let updatedCategory = await categoryModel.findOneAndUpdate({ name: categoryName }, data, options);

      if (isObjectEmpty(updatedCategory)) {
        res.status(404).send({ status: 'category_not_found' });
      } else {
        res.status(200).send({
          status: 'category_was_updated',
          id: updatedCategory._id
        });
      }
    } catch (err) {
      res.status(400).send({ error: err.message });
    }
  }
};

module.exports.deleteCategory = async (req, res) => {
  const categoryName = req.params.category;

  try {
    let deletedCategory = await categoryModel.findOneAndDelete({ name: categoryName });

    if (isObjectEmpty(deletedCategory)) {
      res.status(404).send({ status: 'category_not_found' });
    } else {

      res.status(200).send({
        status: 'category_was_deleted',
        id: deletedCategory._id
      });
    }
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
};
