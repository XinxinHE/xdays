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
const port = process.env.PORT || 8080;

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

const database = new Sequelize({
  dialect: 'sqlite',
  storage: './db.sqlite'
});

database.authenticate().then(() => {
  console.log('Connection has been established successfully.');
}).catch(err => {
  console.error('Unable to connect to the database:', err);
});

// Define models
const Post = database.define('Post', {
  title: Sequelize.STRING,
  content: Sequelize.TEXT
});

finale.initialize({ 
  app: app, 
  sequelize: database 
});

// Create REST resources
const PostResource = finale.resource({
  model: Post,
  endpoints: ['/posts', '/posts/:id'],
});

database
  .sync()
  .then(() => {oidc.on('ready', () => {
    app.listen(port, () => console.log(`My Blog App listening on port ${port}!`))
  });
});

oidc.on('error', err => {
  // An error occurred while setting up OIDC
  console.log("oidc error: ", err);
});

//app.listen(port, () => console.log(`My Blog App listening on port ${port}!`))

