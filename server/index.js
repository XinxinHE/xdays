require('dotenv').config();
const chalk = require('chalk');
const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
const { ExpressOIDC } = require('@okta/oidc-middleware');
const Sequelize = require('sequelize');
const finale = require('finale-rest'), ForbiddenError = finale.Errors.ForbiddenError;
const app = express();
const multer  = require('multer');
const fs = require('fs');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const port = process.env.PORT || 8080;

exports.test = function(req,res) {
  res.render('test');
};
// session support is required to use ExpressOIDC(Express OpenID Connect).
// This code block creates session middleware with the options we passed it. 
// OIDC is an authentication layer on top of OAuth 2.0
app.use(session({
  secret: process.env.RANDOM_SECRET_WORD,
  resave: true,
  saveUninitialized: false
}));

// Creates an instance of ExpressOIDC with the option we passed in.
const oidc = new ExpressOIDC({
  issuer: `${process.env.OKTA_ORG_URL}/oauth2/default`,
  client_id: process.env.OKTA_CLIENT_ID,
  client_secret: process.env.OKTA_CLIENT_SECRET,
  appBaseUrl: process.env.BASE_URL,
  loginRedirectUri: process.env.REDIRECT_URL,
  scope: 'openid profile',
  routes: {
    loginCallback: {
      path: '/authorization-code/callback',
      afterCallback: '/admin'
    }
  }
});

// ExpressOIDC will attach handlers for the /login and /authorization-code/callback routes
app.use(oidc.router);
app.use(cors());
app.use(bodyParser.json());
//__dirname gives you the path of the currently running file.
app.use(express.static(path.join(__dirname, 'public')));

app.get('/protected', oidc.ensureAuthenticated(), (req, res) => {
  res.send('Top Secret');
});

app.get('/home', (req, res) => {
  console.log(`${process.env.BASE_URL}:${port}${process.env.REDIRECT_PATH}`);
  res.sendFile(path.join(__dirname, './public/home.html'));
});

app.get('/admin', oidc.ensureAuthenticated(), (req, res) => {
  res.sendFile(path.join(__dirname, './public/admin.html'));
});

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/home');
});

app.get('/', (req, res) => {
  res.redirect('/home');
});

var multerStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads/')
  },
  filename: function (req, file, cb) {
    const ext = file.mimetype.split('/')[1];
    cb(null, `xdays-${Date.now()}.${ext}`);
  }
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else if (file.mimetype.startsWith('application')) {
    cb(null, false);
  } else {
    cb(new Error('Not an image! Please upload an image.'), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});

mongoose.connect('mongodb+srv://xinxhe:hxhx11180103@cluster0.djtwo.mongodb.net/xinxhe?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true});
var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function() {
  console.log("Connection Successful!");
});
var schema = new Schema({
  imagePath: String,
  title: String,
  content: String
});

var Model = mongoose.model("model", schema, "myPosts");

app.post('/posts', upload.single('image'), function (req, res) {
  if (!req.file) {
    return;
  }
  const newPost = new Model({ 
    title: req.body.title, 
    content: req.body.content, 
    imagePath: req.file.path
  });
  newPost.save(function(err, doc) {
    if (err) return console.error(err);
    res.status(200).json(doc);
    console.log("Document inserted succussfully!");
  });
});

app.get('/posts', function(req, res) {
  Model.find({}, function(err, result) {
    if (err) {
      console.log(err);
    } else {
      const response = [];
      result.forEach(post => {
        const item = {};
        item.image = "http://localhost:8080/" + post.imagePath;
        item.title = post.title;
        item.content = post.content;
        item.id = post._id;
        response.push(item);
      });
      res.status(200).json(response);
      console.log("Get posts succussfully!");
    }
  });
});

app.put('/posts/:id', upload.single('image'), function (req, res) {
  let updateQuery = {};
  if (req.body.title) {
    updateQuery.title = req.body.title;
  }
  if (req.body.content) {
    updateQuery.content = req.body.content;
  }
  if (req.file && req.file.path) {
    updateQuery.imagePath = req.file.path;
  }
  Model.updateOne({_id: req.params.id}, {
    $set: updateQuery
  }).then(result => {
    res.status(200).json({ message: req.params.id + " updated succussfully!"});
    console.log("Put post succussfully!");
  });
});

app.delete('/posts/:id', function (req, res) {
  Model.findOneAndDelete({_id: req.params.id}, function (err, post) { 
    if (err) { 
        console.log(err) 
    } 
    else{ 
        console.log("Deleted post : ", post); 
        // Remove the image from file
        if (post.imagePath) {
          fs.unlink(path.join(__dirname, post.imagePath), function(err) {
            console.log(err);
          });
        }
    } 
  }).then(result => {
    res.status(200).json({ message: req.params.id + " deleted succussfully!"});
    console.log("Deleted post succussfully!");
  });;
});


app.get('/public/uploads/:id', function(req, res) {
  // Display image
  res.sendFile(path.join(__dirname, req.url));
});

oidc.on('error', err => {
  // An error occurred while setting up OIDC
  console.log("oidc error: ", err);
});

oidc.on('ready', () => {
  app.listen(port, () => console.log(`My Blog App listening on port ${port}!`))
});
