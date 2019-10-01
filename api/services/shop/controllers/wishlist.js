'use strict';

const configs = require(`${__dirname}/../../../configs/config.json`);
const mongoose = require('mongoose');
const wishlistModel = mongoose.model('Wishlist');

const isArrayEmpty = array => array === undefined || array.length == 0 ? true : false;
const isObjectEmpty = object => object === null || !Object.keys(object).length ? true : false;



module.exports.selectAllWishlists = async (req, res) => {
  try {
    let wishlists = await wishlistModel.find({}, '-__v');
    isArrayEmpty(wishlists) ? res.status(404).send({ status: 'wishlists_not_found' }) : res.status(200).send(wishlists);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
};



module.exports.selectWishlistById = async (req, res) => {
  const wishlistId = req.params.wishlist_id;

  if (mongoose.Types.ObjectId.isValid(wishlistId)) {
    try {
      let wishlist = await wishlistModel.findById(wishlistId);
      if (isObjectEmpty(wishlist)) {
        res.status(404).send({ status: 'wishlist_not_found' });
      } else {
        res.status(200).send(wishlist);
      }
    } catch (err) {
      res.status(400).send({ error: err.message });
    }
  } else {
    res.status(400).send({ error: 'invalid_id' });
  }
};



module.exports.createWishlist = async (req, res) => {
  if (isObjectEmpty(req.body)) {
    res.status(204).send({ status: 'payload_is_empty' });
  } else {
    const wishlistData = req.body;
    wishlistData.created_at = new Date().toISOString();

    try {
      let createdWishlist = await wishlistModel.create(wishlistData);

      res.status(200).send({
        status: 'wishlist_was_created',
        wishlist_id: createdWishlist._id
      });
    } catch (err) {
      res.status(400).send({ error: err.message });
    }
  }
};



module.exports.updateWishlistById = async (req, res) => {
  if (isObjectEmpty(req.body)) {
    res.status(204).send({ status: 'payload_is_empty' });
  } else {
    const wishlistId = req.params.wishlist_id;

    if (mongoose.Types.ObjectId.isValid(wishlistId)) {
      const wishlistData = req.body;
      wishlistData.updated_at = new Date().toISOString();

      const options = {
        upsert: false,
        new: false
      };

      const data = {
        $set: wishlistData,
      };

      try {
        let updatedWishlist = await wishlistModel.findByIdAndUpdate(wishlistId, data, options);

        if (isObjectEmpty(updatedWishlist)) {
          res.status(404).send({ status: 'wishlist_not_found' });
        } else {
          res.status(200).send({
            status: 'wishlist_was_updated',
            wishlist_id: updatedWishlist._id
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



module.exports.deleteWishlistById = async (req, res) => {
  const wishlistId = req.params.wishlist_id;

  if (mongoose.Types.ObjectId.isValid(wishlistId)) {
    try {
      let deletedWishlist = await wishlistModel.findByIdAndDelete(wishlistId);

      if (isObjectEmpty(deletedWishlist)) {
        res.status(404).send({ status: 'wishlist_not_found' });
      } else {
        res.status(200).send({
          status: 'wishlist_was_deleted',
          wishlist_id: deletedWishlist._id
        });
      }
    } catch (err) {
      res.status(400).send({ error: err.message });
    }
  } else {
    res.status(400).send({ error: 'invalid_id' });
  }
};
