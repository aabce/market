'use strict';

const express = require('express');
const router = express.Router();

const commentController = require(`${__dirname}/../controllers/comment.js`);

router.get('/shop/comment/get_comments', commentController.selectAllComments);
router.get('/shop/comment/get_comment/:comment_id', commentController.selectCommentById);
router.post('/shop/comment/create_comment', commentController.createComment);
router.put('/shop/comment/update_comment/:comment_id', commentController.updateCommentById);
router.delete('/shop/comment/delete_comment/:comment_id', commentController.deleteCommentById);

module.exports = router;
