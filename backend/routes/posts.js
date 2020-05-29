const express = require('express');

const Post = require('../models/posts');

const router = express.Router();

// POST request
router.post("", (request, response, next) => {
  const post = new Post({
    title: request.body.title,
    content: request.body.content
  });
  post.save().then(createdPost => {
    response.status(201).json({
      message: 'Post added successfully',
      postId: createdPost._id
    });
  });
});

// Update request
router.put("/:id", (request, response, next) => {
  const post = new Post({
    _id: request.body.id,
    title: request.body.title,
    content: request.body.content
  });
  Post.updateOne({ _id: request.params.id }, post)
  .then(result => {
    console.log(result);
    response.status(200).json({ message: "Update successful!" });
  });
});

// GET request
router.get("", (request, response, next) => {
  Post.find().then(documents => {
    response.status(200).json({
      message: "Posts fetched successfully!",
      posts: documents
    });
  });
});

router.get("/:id", (request, response, next) => {
  Post.findById(request.params.id).then(post => {
    if (post) {
      response.status(200).json(post);
    } else {
      response.status(404).json({ message: "Post not found!" });
    }
  });
});

// DELETE request
router.delete("/:id", (request, response, next) => {
  Post.deleteOne({ _id: request.params.id }).then(result => {
    console.log(result);
    response.status(200).json({
      message: "Post deleted successfully!"
    });
  });
});

module.exports = router;
