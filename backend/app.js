const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Post = require('./models/posts');

const app = express();

mongoose.connect("mongodb+srv://LeeRobb198:muizD6QhKSn5uYKn@cluster0-fagn0.mongodb.net/node-angular?retryWrites=true&w=majority")
.then(() => {
  console.log("Connected to database!");
}).catch(() => {
  console.log("Connection failed!");
});

// Middleware to parse json data and parse urlencoded data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Middleware CORS
app.use((request, response, next) => {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  response.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

// POST request
app.post("/api/posts", (request, response, next) => {
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
app.put("/api/posts/:id", (request, response, next) => {
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
app.get('/api/posts', (request, response, next) => {
  Post.find().then(documents => {
    response.status(200).json({
      message: "Posts fetched successfully!",
      posts: documents
    });
  });
});

app.get("/api/posts/:id", (request, response, next) => {
  Post.findById(request.params.id).then(post => {
    if (post) {
      response.status(200).json(post);
    } else {
      response.status(404).json({ message: "Post not found!" });
    }
  });
});

// DELETE request
app.delete("/api/posts/:id", (request, response, next) => {
  Post.deleteOne({ _id: request.params.id }).then(result => {
    console.log(result);
    response.status(200).json({
      message: "Post deleted successfully!"
    });
  });
});

module.exports = app;
