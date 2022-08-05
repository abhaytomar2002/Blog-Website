//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const homeStartingContent = "Hello everyone, Welcome to the all in one blogging destination for everyone out there. You all are free to write on your favourite topics and post in this portal so that everyone can see that. What's stopping you next let's post your first blog.";
const aboutContent = "I am Abhay Tomar, a full-stack web developer and a basketball lover, Here is this one of my projects where you can post any blog of your interest. ";
const contactContent = "Fill this form to contact me.";
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://abhaytomar2002:yDXDS15mg58zBTvG@cluster0.rvkou.mongodb.net/blogDB?retryWrites=true&w=majority");

const postSchema = {
  title: String,
  content: String
};

const dataSchema ={
  firstName: String,
  lastName: String,
  country: String,
  subject: String
}

const Post = mongoose.model("Post", postSchema);
const Data = mongoose.model("Data", dataSchema);

app.get("/", function (req, res) {

  Post.find({}, function (err, posts) {
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts
    });
  });
});

app.get("/compose", function (req, res) {
  res.render("compose");
});

app.post("/compose", function (req, res) {
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  }); 


  post.save(function (err) {
    if (!err) {
      res.redirect("/");
    }
  });
});

app.get("/posts/:postId", function (req, res) {

  const requestedPostId = req.params.postId;

  Post.findOne({ _id: requestedPostId }, function (err, post) {
    res.render("post", {
      title: post.title,
      content: post.content
    });
  });

});

app.get("/about", function (req, res) {
  res.render("about", { aboutContent: aboutContent });
});

app.get("/contact", function (req, res) {
  res.render("contact", { contactContent: contactContent });
});

app.post("/contact", function(req, res){
  const data = new Data({
    firstName: req.body.firstname,
    lastName: req.body.lastname,
    country: req.body.country,
    subject: req.body.subject
  }); 
 
  data.save(function (err) {
    if (!err) {
      console.log("Successfully submitted your response.");
      res.redirect("/");
    }
  });

})

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
