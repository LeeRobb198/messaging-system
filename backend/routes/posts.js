const express = require('express');

const PostController = require('../controllers/posts');

const checkAuth = require('../middleware/check-auth');
const extractFile = require('../middleware/file');

const router = express.Router();

// POST request
router.post("", checkAuth, extractFile, PostController.createPost);

// Update request
router.put("/:id", checkAuth, extractFile, PostController.updatePost);

// GET request
router.get("", PostController.getAllPosts);

router.get("/:id", PostController.getPostById);

// DELETE request
router.delete("/:id", checkAuth, PostController.deletePost);

module.exports = router;
