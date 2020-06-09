//jshint esversion:6
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");
const databaseName = "/blogDB"
mongoose.set('useUnifiedTopology', true);
mongoose.set('useNewUrlParser', true);
mongoose.connect('mongodb://localhost' + databaseName);

const blogSchema = new mongoose.Schema({
  title: String,
  text: String
})
const BlogPostModel = mongoose.model("Blog",blogSchema);

const homeStartingContent = "This is an example  post. Go to /compose to write a new Blog Post";
const aboutContent = "This is an example about page";
const contactContent = "This is an example contact page";

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));



const posts = []

app.get("/", function (req, res) {
  // Render list.ejs template with this variable(marker)
  BlogPostModel.find({}, function (err, allBlogPosts) {
    res.render("home", {homeSampleContent: homeStartingContent, postsInHome:allBlogPosts});
  })

})

app.get("/about", function (req, res) {
  res.render("about", {aboutSampleContent: aboutContent});
})

app.get("/contact", function (req, res) {
  res.render("contact", {contactSampleContent: contactContent});
})

app.get("/compose", function (req, res) {
  res.render("compose.ejs");
})


app.post("/compose", function (req, res) {
  const post = {
    postTitle: req.body.postTitle,
    postBody: req.body.postBody
  }
  const blogPost = new BlogPostModel({
    title: req.body.postTitle,
    text: req.body.postBody
  })
  blogPost.save(function(err) {
    if(err) { console.log("Error saving the document") }
    else {
      res.redirect("/");
    }
  });
  posts.push(post);
})

app.get("/posts/:postName", function (req, res) {
  const requestedTitle = _.lowerCase(req.params.postName);

  BlogPostModel.findOne({title: requestedTitle}, function (err, foundBlogPost) {
    if(err) {res.send("error 404, post not found");}
    else {
        res.render("post.ejs", {postToShow: foundBlogPost});
    }
  })
})

// app.get("/posts/:postName", function (req, res) {
//   res.send("ok");
// })

app.listen(3000, function (req, res) {
  console.log("Server started running on port 3000...");
})
