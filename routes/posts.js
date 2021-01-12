const express = require('express');
const router = express.Router();
const postController = require('../controllers/post');
const authorization = require('../middleware/check-auth');
const extractFile = require('../middleware/file');

router.get('', postController.getPosts);

router.put('/:id', authorization, extractFile, postController.updatePost);

router.post("", authorization, extractFile, postController.createPost);

router.delete("/:id", authorization, postController.deletePost);

router.get("/:id", postController.getPostById);

module.exports = router;
