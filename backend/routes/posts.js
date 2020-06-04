const express = require('express');
const multer = require('multer'); // Image upload

const Post = require('../models/posts');

const router = express.Router();

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg'
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");
    if (isValid) {
      error = null;
    }
    cb(error, "backend/images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + '-' + Date.now() + '.' + ext);
  }
});

// POST request
router.post("", multer({storage: storage}).single("image"), (request, response, next) => {
  const url = request.protocol + '://' + request.get("host");
  const post = new Post({
    title: request.body.title,
    content: request.body.content,
    imagePath: url + "/images/" + request.file.filename
  });
  post.save().then(createdPost => {
    response.status(201).json({
      message: 'Post added successfully',
      post: {
        ...createdPost,
        id: createdPost._id,
      }
    });
  });
});

// Update request
router.put("/:id", multer({storage: storage}).single("image"), (request, response, next) => {
  let imagePath = request.body.imagePath;
  if (request.file) {
    const url = request.protocol + '://' + request.get("host");
    imagePath = url + "/images/" + request.file.filename
  }
  const post = new Post({
    _id: request.body.id,
    title: request.body.title,
    content: request.body.content,
    imagePath: imagePath
  });
  console.log(post);
  Post.updateOne({ _id: request.params.id }, post)
  .then(result => {
    console.log(result);
    response.status(200).json({ message: "Update successful!" });
  });
});

// GET request
router.get("", (request, response, next) => {
  const pageSize = +request.query.pageSize;
  const currentPage = +request.query.page;
  const postQuery = Post.find();
  let fetchedPosts;

  if (pageSize && currentPage) {
    postQuery
    .skip(pageSize * (currentPage - 1))
    .limit(pageSize);
  }
  postQuery.then(documents => {
    fetchedPosts = documents;
    return Post.count();
  })
  .then(count => {
    response.status(200).json({
      message: "Posts fetched successfully!",
      posts: fetchedPosts,
      maxPosts: count
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
