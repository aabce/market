'use strict';

const configs = require(`${__dirname}/../../../configs/config.json`);
const mongoose = require('mongoose');
const commentModel = mongoose.model('Comment');
const productModel = mongoose.model('Product');

const isArrayEmpty = array => array === undefined || array.length == 0 ? true : false;
const isObjectEmpty = object => object === null || !Object.keys(object).length ? true : false;



module.exports.selectAllComments = async (req, res) => {
  try {
    let comments = await commentModel.find({}, '-__v');
    isArrayEmpty(comments) ? res.status(404).send({ status: 'comments_not_found' }) : res.status(200).send(comments);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
};



module.exports.selectCommentById = async (req, res) => {
  const commentId = req.params.comment_id;

  if (mongoose.Types.ObjectId.isValid(commentId)) {
    try {
      let comment = await commentModel.findById(commentId, '-__v');
      if (isObjectEmpty(comment)) {
        res.status(404).send({ status: 'comment_not_found' });
      } else {
        res.status(200).send(comment);
      }
    } catch (err) {
      res.status(400).send({ error: err.message });
    }
  } else {
    res.status(400).send({ error: 'invalid_id' });
  }
};



module.exports.createComment = async (req, res) => {
  if (isObjectEmpty(req.body)) {
    res.status(204).send({ status: 'payload_is_empty' });
  } else {
    const commentData = req.body;
    commentData.created_at = new Date().toISOString();

    try {
      let createdComment = await commentModel.create(commentData);

      if (commentData.product_rating !== undefined) {
        let productData = { '$inc': {} };
        productData['$inc'][`ratings.${commentData.product_rating}`] = 1;
        await productModel.findByIdAndUpdate(commentData.product_id, productData);
      }

      res.status(200).send({
        status: 'comment_was_created',
        comment_id: createdComment._id
      });

    } catch (err) {
      res.status(400).send({ error: err.message });
    }
  }
};



module.exports.updateCommentById = async (req, res) => {
  if (isObjectEmpty(req.body)) {
    res.status(204).send({ status: 'payload_is_empty' });
  } else {
    const commentId = req.params.comment_id;

    if (mongoose.Types.ObjectId.isValid(commentId)) {
      const commentData = req.body;
      commentData.updated_at = new Date().toISOString();

      const options = {
        upsert: false,
        new: false,
        runValidators: true
      };

      const data = {
        $set: commentData,
      };

      try {
        let updatedComment = await commentModel.findByIdAndUpdate(commentId, data, options);

        if (isObjectEmpty(updatedComment)) {
          res.status(404).send({ status: 'comment_not_found' });
        } else {
          if (commentData.product_rating !== undefined && updatedComment.product_rating !== undefined) {
            let productDataPost = { '$inc': {} };
            productDataPost['$inc'][`ratings.${commentData.product_rating}`] = 1;
            await productModel.findByIdAndUpdate(updatedComment.product_id, productDataPost);

            let productDataPre = { '$inc': {} };
            productDataPre['$inc'][`ratings.${updatedComment.product_rating}`] = -1;
            await productModel.findByIdAndUpdate(updatedComment.product_id, productDataPre);
          }
          res.status(200).send({
            status: 'comment_was_updated',
            comment_id: updatedComment._id
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



module.exports.deleteCommentById = async (req, res) => {
  const commentId = req.params.comment_id;

  if (mongoose.Types.ObjectId.isValid(commentId)) {
    try {
      let deletedComment = await commentModel.findByIdAndDelete(commentId);

      if (isObjectEmpty(deletedComment)) {
        res.status(404).send({ status: 'comment_not_found' });
      } else {
        if (deletedComment.product_rating !== undefined) {
          let productData = { '$inc': {} };
          productData['$inc'][`ratings.${deletedComment.product_rating}`] = -1;
          await productModel.findByIdAndUpdate(deletedComment.product_id, productData);
        }

        res.status(200).send({
          status: 'customer_was_deleted',
          comment_id: deletedComment._id
        });
      }
    } catch (err) {
      res.status(400).send({ error: err.message });
    }
  } else {
    res.status(400).send({ error: 'invalid_id' });
  }
};
