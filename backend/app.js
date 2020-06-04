const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const postsRoutes = require('./routes/posts');

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

// Allow images to be fetched
app.use("/images", express.static(path.join("backend/images")));

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

app.use("/api/posts", postsRoutes);

module.exports = app;
