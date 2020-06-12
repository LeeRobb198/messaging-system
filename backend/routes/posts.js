const express = require('express');
const multer = require('multer'); // Image upload

const Post = require('../models/posts');
const checkAuth = require('../middleware/check-auth');

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
router.post("", checkAuth, multer({storage: storage}).single("image"), (request, response, next) => {
  const url = request.protocol + '://' + request.get("host");
  const post = new Post({
    title: request.body.title,
    content: request.body.content,
    imagePath: url + "/images/" + request.file.filename,
    creator: request.userData.userId
  });
  post.save().then(createdPost => {
    response.status(201).json({
      message: "Post added successfully",
      post: {
        ...createdPost,
        id: createdPost._id,
      }
    });
  })
  .catch(error => {
    response.status(500).json({
      message: "Creating a post failed!"
    })
  });
});

// Update request
router.put("/:id", checkAuth, multer({ storage: storage }).single("image"), (request, response, next) => {
  let imagePath = request.body.imagePath;
  if (request.file) {
    const url = request.protocol + '://' + request.get("host");
    imagePath = url + "/images/" + request.file.filename
  }
  const post = new Post({
    _id: request.body.id,
    title: request.body.title,
    content: request.body.content,
    imagePath: imagePath,
    creator: request.userData.userId
  });
  Post.updateOne({ _id: request.params.id, creator: request.userData.userId }, post)
  .then(result => {
    if (result.nModified > 0) {
      response.status(200).json({ message: "Update successful!" });
    } else {
      response.status(401).json({ message: "Not authorized!" });
    }
  })
  .catch(error => {
    response.status(500).json({
      message: "Couldn't update post!"
    });
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
  })
  .catch(error => {
    response.status(500).json({
      message: "Fetching posts failed!"
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
  })
  .catch(error => {
    response.status(500).json({
      message: "Fetching post failed!"
    });
  });;
});

// DELETE request
router.delete("/:id", checkAuth, (request, response, next) => {
  Post.deleteOne({ _id: request.params.id, creator: request.userData.userId }).then(result => {
    if (result.n > 0) {
      response.status(200).json({ message: "Deletion successful!" });
    } else {
      response.status(401).json({ message: "Not authorized!" });
    }
  })
  .catch(error => {
    response.status(500).json({
      message: "Fetching posts failed!"
    });
  });;
});

module.exports = router;
